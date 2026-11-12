// Routes de l'application (fichier partagé, géré par Rama)
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Repertoire from './pages/Repertoire.jsx';
import Fiche from './pages/Fiche.jsx';
import CompanyForm from './pages/CompanyForm.jsx';
import Import from './pages/Import.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entreprises" element={<Repertoire />} />
          <Route path="/entreprises/:id" element={<Fiche />} />

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/entreprises/nouveau" element={<CompanyForm />} />
            <Route path="/entreprises/:id/modifier" element={<CompanyForm />} />
            <Route path="/admin/import" element={<Import />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
