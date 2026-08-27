import './styles.css';

const menuItemSelector = 'a[href], button:not(:disabled)';

export function handleMenuKeyDown(event: React.KeyboardEvent<HTMLElement>) {
  if (
    event.defaultPrevented ||
    !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
  ) return;

  const menuItems = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(menuItemSelector)
  ).filter((item) => item.getAttribute('aria-disabled') !== 'true');
  const currentItem = (event.target as HTMLElement).closest<HTMLElement>(menuItemSelector);
  const currentIndex = currentItem ? menuItems.indexOf(currentItem) : -1;

  if (currentIndex === -1 || menuItems.length === 0) return;

  event.preventDefault();

  if (event.key === 'Home') {
    menuItems[0].focus();
  } else if (event.key === 'End') {
    menuItems.at(-1)?.focus();
  } else {
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    menuItems[(currentIndex + direction + menuItems.length) % menuItems.length].focus();
  }
}

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function Menu({ children, className }: Props) {
  return (
    <div
      className={className ? `pwny-menu ${className}` : "pwny-menu"}
      onKeyDown={handleMenuKeyDown}
    >
      {children}
    </div>
  );
}
