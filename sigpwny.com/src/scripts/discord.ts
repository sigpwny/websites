import fs from 'fs';
import path from 'path';
import { Client, GatewayIntentBits, Events, type GuildScheduledEventCreateOptions, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel, GuildScheduledEvent, type GuildScheduledEventEditOptions, GuildScheduledEventStatus } from 'discord.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import advanced from 'dayjs/plugin/advancedFormat';

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
    /*
    z.object({
        title: z.string(),
        ical: z.optional(ICalDataSchema()),
        // discord_event: z.object({}),
        time_start: z.coerce.date(),
        duration: z.string().default("PT1H"),
        timezone: z.string().default("America/Chicago"),
        week_number: z.optional(z.number().gte(0).lte(52)),
        // authors: z.array(reference('profiles')).default(['org/sigpwny']),
        credit: z.array(z.string()).default(["SIGPwny"]),
        featured: z.boolean().default(false),
        location: z.optional(z.string()),
        description: z.optional(z.string()),
        card_image: z.optional(CardImageSchema(image)),
        live_video_url: z.optional(z.string().url()),
        slides: z.optional(z.string()),
        recording: z.optional(z.string().url()),
        // assets: z.optional(z.array(z.string())),
        tags: z.array(z.string()).default([]),
    })

    export const EventSchema = ({ image }) => (
  z.object({
    title: z.string(),
    ical: z.optional(ICalDataSchema()),
    // discord_event: z.object({}),
    time_start: z.coerce.date(),
    duration: z.string().default("PT48H"),
    timezone: z.string().default("Etc/UTC"),
    series: z.string(),
    credit: z.array(z.string()).default(["SIGPwny"]),
    sponsors: z.array(z.string()).default([]),
    location: z.string().default("Online"),
    description: z.optional(z.string()),
    card_image: z.optional(CardImageSchema(image)),
    links: z.array(z.object({
      name: z.string(),
      url: z.string(),
    })).default([]),
    stats: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })).default([]),
  })
)
    */
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
                const slug = url[1];
                o[slug] = event; 
            }
            return o;
        }, {} as Record<string, GuildScheduledEvent<GuildScheduledEventStatus>>);

        const snowflakeEventLookup = discordEvents.reduce((o, event) => {
            // Find url in description using regex and extract the slug
            const { description } = event;
            const url = (description || '').match(urlRegex);
            if (url) {
                o[url[0]] = event; 
            }
            return o;
        }, {} as Record<string, GuildScheduledEvent<GuildScheduledEventStatus>>);

        console.log(snowflakeMeetingLookup);
        console.log(snowflakeEventLookup);

        const meetingsToUpdate = upcomingMeetings.map((meeting: any) : Promise<GuildScheduledEvent> => {
            const { data : { title, location, card_image, week_number, time_end, time_start, description }, body, filePath, slug } = meeting;

            // Resolve filepath to image
            // const contentDir = path.join(__dirname, '..', '..', path.dirname(filePath));
            const cardImageURL = (card_image && card_image.background) ? `https://sigpwny.com${card_image.background.src}` : undefined;

            const url = `https://sigpwny.com${slug}`;

            const cleanedBody = body.replace('## Summary\n', '');
            const descriptionText = description ? description : cleanedBody;
            const fullDescription = url + '\n' + descriptionText;

            const existingMetadata = snowflakeMeetingLookup[slug];
            const metadata : GuildScheduledEventCreateOptions = {
                description: fullDescription.length > 1000 ? fullDescription.substring(0, 997) + '...' : fullDescription,
                entityMetadata: {
                    location: location,
                },
                entityType: GuildScheduledEventEntityType.External,
                image: cardImageURL || existingMetadata?.coverImageURL({}) || undefined,
                name: (week_number !== undefined) ? `Week ${zeroPad(week_number, 2)}: ${title}` : title,
                privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                scheduledStartTime: time_start.toDate(),
                scheduledEndTime: time_end ? time_end.toDate() : (existingMetadata?.scheduledEndAt || undefined),
            }
            if (existingMetadata) {
                if (existingMetadata.creator?.bot !== true) {
                    console.log(`Refusing to edit non-bot meeting "${title}"`);
                    return Promise.resolve({} as GuildScheduledEvent);
                }
                console.log(`Editing meeting "${title}"`);
                return guild.scheduledEvents.edit(existingMetadata.id, metadata);
            } else {
                console.log(`Creating meeting "${title}"`);
                return guild.scheduledEvents.create(metadata);
            }
        })

        const eventsToUpdate = upcomingEvents.map((event: any) : Promise<GuildScheduledEvent> => {
            const { data : { title, location, card_image, links, time_end, time_start, description }, body, filePath } = event;

            // Resolve filepath to image
            const url = links.find((link: any) => link.name === 'website')?.url;
            
            // const contentDir = path.join(__dirname, '..', '..', path.dirname(filePath));
            const cardImageURL = (card_image && card_image.background) ? `https://sigpwny.com${card_image.background.src}` : undefined;

            const descriptionText = description ? description : body;
            const fullDescription = url ? url + '\n' + descriptionText : descriptionText;

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