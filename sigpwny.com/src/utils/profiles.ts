import { getCollection, type CollectionEntry } from 'astro:content';

type Profile = CollectionEntry<'profiles'>['data'];


// Resolve credit names to profiles
export async function getProfilesFromNames(names: string[]): Promise<Profile[]> {
  const profiles = await getCollection('profiles');
  const credit = names.map((name: string) =>
    profiles.find((profile) => profile.data.name === name)?.data ||
    { name } as Profile
  );
  return credit;
}