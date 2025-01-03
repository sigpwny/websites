import './styles.css';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function Menu({ children, className }: Props) {
  return (
    <div className={className ? `pwny-menu ${className}` : "pwny-menu"}>
      {children}
    </div>
  );
}