import GameScreen from '@/components/GameScreen';
import { v4 as uuidv4 } from 'uuid';

// Create a default "Guest" user.
// A unique ID is generated each time to distinguish between guests in the same room.
const guestUser = {
  name: `Guest-${uuidv4().substring(0, 4)}`,
  email: `${uuidv4()}@guest.com`, // Unique email to prevent conflicts in the player list
  image: `https://i.pravatar.cc/150?u=${uuidv4()}`,
};

export default function Home() {
  // Directly render the GameScreen with the guest user.
  // No need for session checks.
  return <GameScreen user={guestUser} />;
}
