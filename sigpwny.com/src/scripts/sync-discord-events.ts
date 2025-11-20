import {
  Client,
  GatewayIntentBits,
  Events,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  GuildScheduledEvent,
  GuildScheduledEventStatus,
  type GuildScheduledEventCreateOptions,
} from 'discord.js';
import { getCollection } from 'astro:content';
import { getMeetings } from '@/utils/meetings';
import { meetingMetadata } from '$/utils/meetingMetadata';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
dayjs.extend(duration);
dayjs.extend(utc);

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0')

// https://stackoverflow.com/a/3809435/5684541
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

async function main() {
  const currentDate = new Date();

  const upcomingMeetings = (await getMeetings())
    .filter(m => m.data.time_start > currentDate)
    .filter(m => m.data.featured);

  const upcomingEvents = (await getCollection('events'))
    .filter(e => e.data.time_start > currentDate);

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

    const meetingsToUpdate = upcomingMeetings.map((meeting) : Promise<GuildScheduledEvent> => {
      const { data : { title, type, location, card_image, week_number, time_start, duration, description }, body, filePath, slug } = meeting;

      // Resolve filepath to image
      const cardImageURL = (card_image && card_image.background) ? `https://sigpwny.com${card_image.background.src}` : undefined;

      const noTrailingSlashSlug = slug.replace(/\/$/, '');
      const url = `https://sigpwny.com${slug}`;

      const cleanedBody = body ? body.replace('## Summary\n', ''): '';
      const descriptionText = description ? description : cleanedBody;
      const fullDescription = url + '\n' + descriptionText;

      const titleWithCategory = meetingMetadata[type]?.shortName ? `${title} [${meetingMetadata[type]?.shortName}]` : title;
      const optionalLocation = location || 'Location TBD';

      const existingMetadata = snowflakeMeetingLookup[noTrailingSlashSlug];
      const metadata : GuildScheduledEventCreateOptions = {
        description: fullDescription.length > 1000 ? fullDescription.substring(0, 997) + '...' : fullDescription,
        entityMetadata: {
          location: optionalLocation,
        },
        entityType: GuildScheduledEventEntityType.External,
        image: cardImageURL || existingMetadata?.coverImageURL({}) || undefined,
        name: (week_number !== undefined) ? `Week ${zeroPad(week_number, 2)}: ${titleWithCategory}` : titleWithCategory,
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        scheduledStartTime: time_start,
        scheduledEndTime: dayjs(time_start).add(dayjs.duration(duration)).toDate(),
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

    const eventsToUpdate = upcomingEvents.map((event) : Promise<GuildScheduledEvent> => {
      const { data : { title, location, card_image, links, time_start, duration, description }, body, filePath } = event;

      // Resolve filepath to image
      const url = links.find((link) => link.name === 'website')?.url?.replace(/\/$/, '');

      // const contentDir = path.join(__dirname, '..', '..', path.dirname(filePath));
      const cardImageURL = (card_image && card_image.background) ? `https://sigpwny.com${card_image.background.src}` : undefined;
      const descriptionText = description || body || '';
      const fullDescription = url ? url + '/' + '\n' + descriptionText : descriptionText;
      const optionalLocation = location || 'Location TBD';

      const existingMetadata = url ? snowflakeEventLookup[url] : undefined;
      const metadata : GuildScheduledEventCreateOptions = {
        description: fullDescription.length > 1000 ? fullDescription.substring(0, 997) + '...' : fullDescription,
        entityMetadata: {
          location: optionalLocation,
        },
        entityType: GuildScheduledEventEntityType.External,
        image: cardImageURL || existingMetadata?.coverImageURL({}) || undefined,
        name: title,
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        scheduledStartTime: time_start,
        scheduledEndTime: dayjs(time_start).add(dayjs.duration(duration)).toDate(),
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
