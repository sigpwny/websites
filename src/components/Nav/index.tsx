import { motion } from 'framer-motion';
import { PwnySvg } from '@/components/Icons';
import consts from '@/consts';
import './styles.css';


interface Props {
  curr_path: string;
};


// TODO: Remove
const ctfd_base = 'https://ctf.sigpwny.com';
const ctfLinks = [
  { name: 'Users', url: `${ctfd_base}/users` },
  { name: 'Scoreboard', url: `${ctfd_base}/scoreboard` },
  { name: 'Challenges', url: `${ctfd_base}/challenges` },
  // { name: 'Profile', url: `${ctfd_base}/profile` },
  // { name: 'Logout', url: `${ctfd_base}/logout` },
]

export default function Nav({ curr_path }: Props) {
  // Configuration constants
  const title = consts.title;
  const navLinks = consts.navLinks;
  const ctfd = consts.flags.enableCtfd || false;

  const path_name = curr_path + '';
  const subpath = path_name.split('/').filter((x) => x !== '');

  const ctfdExpanded = ctfd ? (
    // If the current path is the CTF base path, expand the CTF navigation
    subpath[0]?.toLowerCase() === 'ctf'
  ) : false;

  const Link = ({ href, className, activeClassName, children }: any) => {
    const isActive = (href === path_name || href === '/' + subpath?.[0] + '/');
    return (
      <a
        href={href}
        className={`${className} ${isActive ? activeClassName : ""}`}
      >
        {children}
      </a>
    )
  };

  return (
    <span className="has-[:checked]:bg-surface-100/70 has-[:checked]:mb-4 mb-2 flex flex-col whitespace-pre bg-surface-000/50 lg:!bg-transparent backdrop-blur-xl lg:backdrop-blur-none shadow-md lg:shadow-none shadow-surface-000 transition-colors duration-200">
      <div className="container px-4 md:px-8 py-4 lg:py-8 flex flex-row ">
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
        <span className="[&>nav>.nav-mobile-hide-when-unchecked]:hidden peer-checked:[&>nav>.nav-mobile-hide-when-unchecked]:flex lg:[&>nav>.nav-mobile-hide-when-unchecked]:flex flex grow flex-col lg:flex-row justify-start lg:justify-between">
          {/* Main navigation */}
          <nav
            className="flex flex-col lg:flex-row item-start lg:items-center lg:rounded-full lg:bg-surface-100/70 lg:border-surface-150/90 lg:border-2 lg:backdrop-blur-xl overflow-hidden"
            role="navigation"
            aria-label="Main"
          >
            {/* Brand */}
            <Link
              href="/"
              className="nav-main-brand flex flex-row max-w-fit gap-2 lg:gap-1 items-center text-primary hover:text-secondary lg:px-4 lg:py-2"
            >
              <PwnySvg className="h-12 lg:h-8" />
              <span className="font-bold max-lg:text-2xl">
                {title}
              </span>
            </Link>
            <motion.span
              className="nav-mobile-hide-when-unchecked overflow-hidden flex flex-row h-full show-nav lg:hide-nav"
              initial={!ctfdExpanded ? { width: 'auto', opacity: 1 } : { width: "var(--nav-hidden-width)", opacity: "var(--nav-hidden-opacity)"}}
              animate={!ctfdExpanded ? { width: 'auto', opacity: 1 } : { width: "var(--nav-hidden-width)", opacity: "var(--nav-hidden-opacity)"}}
            >
              {/* Divider/spacer */}
              <span className="hidden lg:flex h-full border-l-2 border-surface-150/90" />
              {/* Nav links */}
              <ul className="flex flex-col grow max-lg:text-xl lg:flex-row item-start lg:items-center gap-4 lg:gap-6 lg:px-4 py-2">
                {navLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.url}
                      className="flex flex-row max-w-fit font-bold text-slate-300 hover:text-secondary"
                      activeClassName="!text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.span>
          </nav>
          {/* CTF navigation */}
          {ctfd ? (
            <nav
              className="flex flex-col lg:flex-row item-start lg:items-center lg:rounded-full lg:bg-surface-100/70 lg:border-surface-150/90 lg:border-2 lg:backdrop-blur-xl overflow-hidden"
              role="navigation"
              aria-label="CTF"
            >
              {/* Brand */}
              <Link
                href="/ctf/"
                className="nav-mobile-hide-when-unchecked flex flex-row max-w-fit gap-1 items-center text-primary hover:text-secondary lg:px-4 lg:py-2 max-lg:pt-4"
                // activeClassName="text-surface-200"
              >
                {/* <PwnySvg className="h-8" /> */}
                <span className="font-bold max-lg:text-2xl">
                  Pwny CTF
                </span>
              </Link>
              <motion.span
                key="ctf-nav-links"
                className="nav-mobile-hide-when-unchecked overflow-hidden flex flex-row h-full show-nav lg:hide-nav"
                initial={ctfdExpanded ? { width: 'auto', opacity: 1 } : { width: "var(--nav-hidden-width)", opacity: "var(--nav-hidden-opacity)"}}
                animate={ctfdExpanded ? { width: 'auto', opacity: 1 } : { width: "var(--nav-hidden-width)", opacity: "var(--nav-hidden-opacity)"}}
              >
                {/* Divider/spacer */}
                <span className="hidden lg:flex h-full border-l-2 border-surface-150/90" />
                {/* Nav links */}
                <ul className="flex flex-col grow max-lg:text-xl lg:flex-row item-start lg:items-center gap-4 lg:gap-6 lg:px-4 py-2">
                  {ctfLinks.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.url}
                        className="flex flex-row max-w-fit font-bold text-slate-300 hover:text-secondary"
                        activeClassName="!text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.span>
            </nav>
          ) : (
            <p>Pwny CTF is disabled</p>
          )}
        </span>
      </div>
    </span>
  )
}