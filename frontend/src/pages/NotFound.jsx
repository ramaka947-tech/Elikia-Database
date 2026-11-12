import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-elikia">Page introuvable</h1>
      <Link to="/" className="text-elikia underline">Retour à l'accueil</Link>
    </div>
  );
}
