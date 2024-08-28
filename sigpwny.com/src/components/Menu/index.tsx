import './styles.css';

export default function Menu({ children }: { children: React.ReactNode }) {
  return (
    <div className="pwny-menu">
      {children}
    </div>
  );
}