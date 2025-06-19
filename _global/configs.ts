export interface ISiteConfig {
  // Required
  title: string;
  description: string;
  image: string;
  twitterUsername: string;
  timezone: string;
  navLinks?: { name: string, url: string }[];
  navCallToActionLinks?: { name: string, url: string }[];
  socialLinks?: { name: string, url: string }[];
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
    // { name: `Events`, url: `/events/` },
    { name: `Gallery`, url: `/gallery/` },
    { name: `Sponsors`, url: `/sponsors/` },
    { name: `Join`, url: `/join/` },
  ],
  navCallToActionLinks: [
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
    enableCtfd: false,
  },
};

const fallctfConfig: ISiteConfig = {
  title: `Fall CTF`,
  description: `SIGPwny is a student-run organization at the University of Illinois Urbana-Champaign focused on information security and privacy.`,
  image: `https://sigpwny.com/favicons/touch-512x512.png`,
  twitterUsername: `@sigpwny`,
  timezone: `America/Chicago`,
}

const uiuctfConfig: ISiteConfig = {
  title: `UIUCTF`,
  description: `SIGPwny is a student-run organization at the University of Illinois Urbana-Champaign focused on information security and privacy.`,
  image: `https://sigpwny.com/favicons/touch-512x512.png`,
  twitterUsername: `@sigpwny`,
  timezone: `America/Chicago`,
}

export type SiteName = 'sigpwny.com' | 'fallctf.com' | 'uiuc.tf';

const configs : Record<SiteName, ISiteConfig> = {
  'sigpwny.com': sigpwnyConfig,
  'fallctf.com': fallctfConfig,
  'uiuc.tf': uiuctfConfig,
};

export const getSiteConfig = (site: SiteName) => configs[site];