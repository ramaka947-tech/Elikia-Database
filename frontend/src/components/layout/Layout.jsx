// Layout commun (fichier partagé, géré par Rama)
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Tableau de bord' },
    { to: '/entreprises', label: 'Répertoire' },
    ...(isAdmin
      ? [
          { to: '/entreprises/nouveau', label: 'Ajouter' },
          { to: '/admin/import', label: 'Import CSV' },
        ]
      : []),
  ];

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-white/15 text-white' : 'text-white/80 hover:text-white'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-elikia border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-white font-bold text-lg">Elikia Database</span>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className={linkClass}>{l.label}</NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 text-white text-sm">
            <span>{user?.name}</span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20"
            >
              Déconnexion
            </button>
          </div>

          <button className="md:hidden text-white text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
            ☰
          </button>
        </div>

        {open && (
          <nav className="md:hidden px-4 pb-4 space-y-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
            <button onClick={() => { logout(); navigate('/login'); }} className="block px-3 py-2 text-white/80 text-sm">
              Déconnexion
            </button>
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
