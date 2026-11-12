// Composant partagé (Rama)
export default function Button({ variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-elikia text-white hover:bg-elikia-dark',
    secondary: 'bg-white text-ink border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
