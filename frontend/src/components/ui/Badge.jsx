// Composant partagé (Rama). Ex : <Badge color="green">Vérifié</Badge>
export default function Badge({ color = 'gray', children }) {
  const colors = {
    green: 'bg-elikia-light text-elikia',
    gold: 'bg-yellow-50 text-yellow-800',
    red: 'bg-red-50 text-red-700',
    gray: 'bg-gray-100 text-gray-700',
  };
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>{children}</span>;
}
