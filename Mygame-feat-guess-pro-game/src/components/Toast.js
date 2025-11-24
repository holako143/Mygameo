import { useEffect } from 'react';

export default function Toast({ msg, onClear }) {
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(onClear, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg, onClear]);

  if (!msg) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
      {msg}
    </div>
  );
}