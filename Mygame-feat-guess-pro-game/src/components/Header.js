import Image from 'next/image';

// The Header component is now simplified for guest mode.
// It no longer needs session-specific functions like signOut.
export default function Header({ user, onMenu, onShop }) {
  return (
    <header className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-4">
        {/* The menu button is kept for mobile navigation if needed */}
        <button onClick={onMenu} className="btn-primary lg:hidden">Menu</button>
        <h1 className="text-xl font-bold neon hidden sm:block">Guess & Dare</h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onShop} className="btn-primary">Shop</button>
        <div className="flex items-center gap-2">
            {/* Display the guest user's randomly generated image */}
            <Image src={user.image} alt={user.name} width={40} height={40} className="rounded-full"/>
            <span className="hidden md:inline">{user.name}</span>
        </div>
        {/* The Sign Out button is removed as there is no session to sign out from. */}
      </div>
    </header>
  );
}
