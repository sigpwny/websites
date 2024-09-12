import { motion } from 'framer-motion';
import './styles.css';

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
    <div id={id}>
      {/* Mobile toggle */}
      <input
        id="nav-mobile-toggle-input"
        className="nav-mobile-toggle-input peer"
        type="checkbox"
        defaultChecked={false}
        // Enable toggling of the checkbox using the Enter key
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const input = e.target as HTMLInputElement;
            input.checked = !input.checked;
          }
        }}
      />
      <label
        htmlFor="nav-mobile-toggle-input"
        className="nav-mobile-toggle-label text-primary hover:text-secondary h-8 w-8 my-2 place-content-center order-last"
      >
        <span className="sr-only">Open main menu</span>
        <span>
          <span className="icon-bar top-bar" />
          <span className="icon-bar middle-bar" />
          <span className="icon-bar bottom-bar" />
        </span>
      </label>
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
                className={`z-10 px-3 py-1 font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full hover:text-white ${link.active ? "text-white" : "text-gray-400 transition-colors"}`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}