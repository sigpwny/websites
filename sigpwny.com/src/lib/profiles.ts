import { getCollection } from 'astro:content';


// Resolve credit names to profiles
export async function getProfilesFromNames(names: string[]) {
  const profiles = await getCollection('profiles');
  const credit = names.map((name: string) =>
    profiles.find((profile) => profile.data.name === name)?.data ||
    { name }
  );
  return credit;
}