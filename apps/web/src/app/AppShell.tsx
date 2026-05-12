import { Link, Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>ECOSYT</h1>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <Link to="/projects">Projects</Link>
        <Link to="/settings">Settings</Link>
      </nav>
      <Outlet />
    </main>
  );
}
