import { useState, useEffect } from 'react';
import storeItems from '@/lib/store';

export default function ShopModal({ onClose, user }) {
  const [items, setItems] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    setItems(storeItems);
    // In a real app, you'd fetch the user's points from your backend
    // For now, let's assume the user object passed in is up-to-date
    // A better approach would be to have a global state or fetch from an API endpoint.
    const fetchPoints = async () => {
        const res = await fetch(`/api/user/profile?email=${user.email}`);
        const data = await res.json();
        if(data) setUserPoints(data.points);
    }
    fetchPoints();
  }, [user]);

  const handlePurchase = (item) => {
    // Placeholder for purchase logic
    alert(`You clicked to buy ${item.name} for ${item.price} points.`);
    // Here you would typically emit a socket event or call an API route
    // to handle the purchase, update user inventory and points.
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
      <div className="card w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold neon">Cosmetics Shop</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        <p className="mb-4 text-yellow-400">Your points: {userPoints}</p>
        <ul className="overflow-y-auto space-y-3 pr-2">
          {items.map((item) => (
            <li key={item.id} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-400">Type: {item.type}</p>
              </div>
              <button
                onClick={() => handlePurchase(item)}
                className="btn-primary"
                disabled={userPoints < item.price}
              >
                {item.price} Points
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}