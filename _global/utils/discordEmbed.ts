export interface DiscordLink {
  label: string;
  url: string;
}

interface DiscordEmbedOptions {
  thumbnail?: string;
  thumbnailAlt?: string;
  details?: string;
  description?: string;
}

export function discordEmbed(
  content: string,
  links: DiscordLink[],
  accentColor = 0x33cc55,
  options: DiscordEmbedOptions = {},
) {
  return {
    component: {
      type: 17,
      accent_color: accentColor,
      components: [
        options.thumbnail ? {
          type: 9,
          components: [{ type: 10, content }],
          accessory: {
            type: 11,
            media: { url: options.thumbnail },
            ...(options.thumbnailAlt ? { description: options.thumbnailAlt } : {}),
          },
        } : { type: 10, content },
        ...(options.details ? [{ type: 10, content: options.details }] : []),
        ...(options.description ? [{ type: 10, content: options.description }] : []),
        ...(links.length ? [{
          type: 1,
          components: links.slice(0, 5).map(({ label, url }) => ({
            type: 2, style: 5, label: label.slice(0, 80), url,
          })),
        }] : []),
      ],
    },
  };
}

export type DiscordEmbed = ReturnType<typeof discordEmbed>;

/** Keep authored text from turning into headings, mentions, or unexpected links. */
export function discordText(value: string) {
  return value.replace(/([\\`*_{}\[\]()<>#|~])/g, '\\$1').replace(/@/g, '@\u200b');
}

/** JSON in an HTML script must not contain a literal closing script tag. */
export function serializeDiscordEmbed(embed: DiscordEmbed) {
  return JSON.stringify(embed).replace(/</g, '\\u003c');
}
