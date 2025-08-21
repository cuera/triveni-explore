import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const { pathname } = useLocation();
  const Tab = ({ to, label }: {to:string;label:string}) => (
    <Link to={to} className={`flex-1 py-3 text-center ${pathname===to?'font-semibold text-foreground':'text-muted-foreground'}`}>{label}</Link>
  );
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t flex z-50">
      <Tab to="/" label="Home" />
      <Tab to="/departments" label="Departments" />
      <Tab to="/timeline" label="Timeline" />
      <Tab to="/map" label="Map" />
    </nav>
  );
}

