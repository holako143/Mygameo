export default function Sidebar({ players, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="w-64 bg-gray-800 h-full p-4">
        <h2 className="text-lg font-bold mb-4">Players</h2>
        <ul>
          {players.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
        <button onClick={onClose} className="btn-primary mt-4">Close</button>
      </div>
    </div>
  );
}