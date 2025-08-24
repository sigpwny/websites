import type { CollectionEntry } from 'astro:content';
import { BugFlat, ButterflyFlat, PhoenixFlat } from '$/components/Icons/fluentemojis';

type MeetingDifficulty = Exclude<CollectionEntry<'meetings'>['data']['difficulty'], undefined>;

interface Props {
  difficulty: MeetingDifficulty;
};

const icons: Partial<Record<MeetingDifficulty, JSX.Element | null>> = {
  beginner: <BugFlat />,
  intermediate: <ButterflyFlat />,
  advanced: <PhoenixFlat />,
};

export default function MeetingDifficultyBadge({ difficulty }: Props) {
  const difficultyString = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const icon = icons[difficulty] ?? null;
  return (
    <span
      aria-hidden="true"
      className="badge flex flex-row gap-1 items-center text-sm md:text-md font-bold bg-surface-150 text-text"
    >
      {icon}
      <span>{difficultyString}</span>
    </span>
  )
};