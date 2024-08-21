export interface ISiteConfig {
  // Required
  title: string;
  description: string;
  image: string;
  twitterUsername: string;
  timezone: string;
  [key: string]: any;
}

const sigpwnyConfig : ISiteConfig = {
  title: `SIGPwny`,
  description: `SIGPwny is a student-run organization at the University of Illinois Urbana-Champaign focused on information security and privacy.`,
  image: `https://sigpwny.com/favicons/touch-512x512.png`,
  navLinks: [
    { name: `About`, url: `/about/` },
    { name: `Meetings`, url: `/meetings/` },
    { name: `Publications`, url: `/publications/`},
    { name: `Events`, url: `/events/` },
    { name: `Sponsors`, url: `/sponsors/` },
  ],
  navCallToActionLinks: [
    { name: `Join`, url: `/join/` }
  ],
  socialLinks: [
    { name: `Discord`, url: `https://discord.gg/cWcZ6a9` },
    { name: `GitHub`, url: `https://github.com/sigpwny` },
    { name: `Instagram`, url: `https://www.instagram.com/sigpwny/` },
    { name: `Twitter`, url: `https://twitter.com/sigpwny` },
    { name: `YouTube`, url: `https://www.youtube.com/@sigpwny` },
  ],
  twitterUsername: `@sigpwny`,
  timezone: `America/Chicago`,
  flags: {
    enableCtfd: true,
  },
};

const fallctfConfig: ISiteConfig = {
  title: `Fall CTF`,
  description: `SIGPwny is a student-run organization at the University of Illinois Urbana-Champaign focused on information security and privacy.`,
  image: `https://sigpwny.com/favicons/touch-512x512.png`,
  twitterUsername: `@sigpwny`,
  timezone: `America/Chicago`,
}

export type SiteName = 'sigpwny.com' | 'fallctf.com';

const consts : Record<SiteName, ISiteConfig> = {
  'sigpwny.com': sigpwnyConfig,
  'fallctf.com': fallctfConfig,
};

export const getSiteConfig = (site: SiteName) => consts[site];