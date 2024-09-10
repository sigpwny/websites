import { motion } from 'framer-motion';

interface Props {
  id?: string;
  links: {
    name: string;
    url?: string;
    active?: boolean;
  }[];
};


export default function TabNav({ id, links }: Props) {
  return (
    <nav className="rounded-full p-1 bg-surface-100/80 backdrop-blur-xl border border-surface-150/70">
      <ul className="flex flex-row gap-1">
        {links.map((link) => (
          <li
            className="relative flex flex-row w-full"
            key={link.name}
          >
            {link.active ? (
              <motion.span
                className="absolute z-0 size-full rounded-full bg-surface-150/90 border border-surface-200"
                transition={{
                  ease: "easeOut",
                  duration: 0.2,
                }}
                layoutId={id ?? "tab-nav"}
              />
            ) : null}
            <a
              href={link.url}
              className={`z-10 px-3 py-1 font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full transition-colors ${link.active ? "text-white" : "text-gray-400"}`}
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}