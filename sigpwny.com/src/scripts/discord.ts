import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Events, type GuildScheduledEventCreateOptions, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, GuildScheduledEvent, type GuildScheduledEventEditOptions, GuildScheduledEventStatus } from 'discord.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import advanced from 'dayjs/plugin/advancedFormat';
import { meetingMetadata } from '../../../_global/utils/meetingMetadata';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(advanced);

const zeroPad = (num: any, places: number) => String(num).padStart(places, '0')

// https://stackoverflow.com/a/3809435/5684541
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

async function main() {
    const fetchMeetings = async () => {
        const meetingsPath = path.join(__dirname, '..', '..', 'dist', 'meetings', 'all.json');
        if (fs.existsSync(meetingsPath)) {
            const data = fs.readFileSync(meetingsPath, 'utf8');
            return JSON.parse(data);
        }

        // const response = await fetch('https://sigpwny.com/meetings/all.json');
        // return await response.json();
    }
    
    const fetchEvents = async () => {
        const eventsPath = path.join(__dirname, '..', '..', 'dist', 'events', 'all.json');
        if (fs.existsSync(eventsPath)) {
            const data = fs.readFileSync(eventsPath, 'utf8');
            return JSON.parse(data);
        }

        // const response = await fetch('https://sigpwny.com/events/all.json');
        // return await response.json();
    }

    const meetings = await fetchMeetings();
    const upcomingMeetings = meetings.map((meeting : any) => {
      return {
        ...meeting,
        data: {
            ...meeting.data,
            time_start: dayjs(meeting.data.time_start).tz(meeting.data.timezone),
            time_end: dayjs(meeting.data.time_start).tz(meeting.data.timezone).add(dayjs.duration(meeting.data.duration)),
        }
      }  
    }).filter((meeting: any) => meeting.data.time_start > dayjs())
    .filter((meeting: any) => meeting.data.featured);

    const events = await fetchEvents();

    const upcomingEvents = events.map((event : any) => {
        return {
            ...event,
            data: {
                ...event.data,
                time_start: dayjs(event.data.time_start).tz(event.data.timezone),
                time_end: dayjs(event.data.time_start).tz(event.data.timezone).add(dayjs.duration(event.data.duration)),
            }
        }  
    }).filter((event: any) => event.data.time_start > dayjs())

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    client.once(Events.ClientReady, async (readyClient: Client<true>) => {
        console.log(`Logged in as ${readyClient.user.tag}`);
        const guild = await client.guilds.fetch(process.env.DISCORD_SERVER_ID || '');
        const discordEvents = await guild.scheduledEvents.fetch();
        const snowflakeMeetingLookup = discordEvents.reduce((o, event) => {
            const { description } = event;
            // Find url in description using regex and extract the slug
            const url = (description || '').match(/https:\/\/sigpwny.com([a-zA-Z0-9-\/]+)/);
            
            if (url) {
                const slug = url[1].replace(/\/$/, '');
                // Remove trailing slash
                o[slug] = event; 
            }
            return o;
        }, {} as Record<string, GuildScheduledEvent<GuildScheduledEventStatus>>);

        const snowflakeEventLookup = discordEvents.reduce((o, event) => {
            // Find url in description using regex and extract the slug
            const { description } = event;
            const url = (description || '').match(urlRegex);
            if (url) {
                const slug = url[0].replace(/\/$/, '');
                o[slug] = event; 
            }
            return o;
        }, {} as Record<string, GuildScheduledEvent<GuildScheduledEventStatus>>);

        console.log(snowflakeMeetingLookup);
        console.log(snowflakeEventLookup);

        const meetingsToUpdate = upcomingMeetings.map((meeting: any) : Promise<GuildScheduledEvent> => {
            const { data : { title, type, location, card_image, week_number, time_end, time_start, description }, body, filePath, slug } = meeting;

            // Resolve filepath to image
            // const contentDir = path.join(__dirname, '..', '..', path.dirname(filePath));
            const cardImageURL = (card_image && card_image.background) ? `https://sigpwny.com${card_image.background.src}` : undefined;

            const noTrailingSlashSlug = slug.replace(/\/$/, '');
            const url = `https://sigpwny.com${slug}`;

            const cleanedBody = body ? body.replace('## Summary\n', ''): '';
            const descriptionText = description ? description : cleanedBody;
            const fullDescription = url + '\n' + descriptionText;

            const titleWithCategory = meetingMetadata[type]?.shortName ? `${title} [${meetingMetadata[type]?.shortName}]` : title;

            const existingMetadata = snowflakeMeetingLookup[noTrailingSlashSlug];
            const metadata : GuildScheduledEventCreateOptions = {
                description: fullDescription.length > 1000 ? fullDescription.substring(0, 997) + '...' : fullDescription,
                entityMetadata: {
                    location: location,
                },
                entityType: GuildScheduledEventEntityType.External,
                image: cardImageURL || existingMetadata?.coverImageURL({}) || undefined,
                name: (week_number !== undefined) ? `Week ${zeroPad(week_number, 2)}: ${titleWithCategory}` : titleWithCategory,
                privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                scheduledStartTime: time_start.toDate(),
                scheduledEndTime: time_end ? time_end.toDate() : (existingMetadata?.scheduledEndAt || undefined),
            }
            if (existingMetadata) {
                if (existingMetadata.creator?.bot !== true) {
                    console.log(`Refusing to edit non-bot meeting "${titleWithCategory}"`);
                    return Promise.resolve({} as GuildScheduledEvent);
                }
                console.log(`Editing meeting "${titleWithCategory}"`);
                return guild.scheduledEvents.edit(existingMetadata.id, metadata);
            } else {
                console.log(`Creating meeting "${titleWithCategory}"`);
                return guild.scheduledEvents.create(metadata);
            }
        })

        const eventsToUpdate = upcomingEvents.map((event: any) : Promise<GuildScheduledEvent> => {
            const { data : { title, location, card_image, links, time_end, time_start, description }, body, filePath } = event;

            // Resolve filepath to image
            const url = links.find((link: any) => link.name === 'website')?.url?.replace(/\/$/, '');
            
            // const contentDir = path.join(__dirname, '..', '..', path.dirname(filePath));
            const cardImageURL = (card_image && card_image.background) ? `https://sigpwny.com${card_image.background.src}` : undefined;

            const descriptionText = description ? description : body;
            const fullDescription = url ? url + '/' + '\n' + descriptionText : descriptionText;


            const existingMetadata = snowflakeEventLookup[url];
            const metadata : GuildScheduledEventCreateOptions = {
                description: fullDescription.length > 1000 ? fullDescription.substring(0, 997) + '...' : fullDescription,
                entityMetadata: {
                    location: location,
                },
                entityType: GuildScheduledEventEntityType.External,
                image: cardImageURL || existingMetadata?.coverImageURL({}) || undefined,
                name: title,
                privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                scheduledStartTime: time_start.toDate(),
                scheduledEndTime: time_end ? time_end.toDate() : (existingMetadata?.scheduledEndAt || undefined),
            }
            if (url && existingMetadata) {
                if (existingMetadata.creator?.bot !== true) {
                    console.log(`Refusing to edit non-bot event "${title}"`);
                    return Promise.resolve({} as GuildScheduledEvent);
                }
                console.log(`Editing event "${title}"`);
                // return Promise.resolve({} as GuildScheduledEvent);
                return guild.scheduledEvents.edit(existingMetadata.id, metadata);
            } else if (url) {
                console.log(`Creating event "${title}"`);
                // return Promise.resolve({} as GuildScheduledEvent);
                return guild.scheduledEvents.create(metadata);
            } else {
                console.log(`Refusing to create/edit event "${title}"`);
                return Promise.resolve({} as GuildScheduledEvent);
            }
        })

        await Promise.all(meetingsToUpdate)
        await Promise.all(eventsToUpdate)
        await client.destroy();
        process.exit(0);
    })

    client.login(process.env.DISCORD_TOKEN);
}

main();