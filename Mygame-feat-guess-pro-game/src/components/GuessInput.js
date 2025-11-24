import { useState } from 'react';

export default function GuessInput({ socket, options }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleGuess = (guessIndex) => {
    if (submitted) return;
    setSelected(guessIndex);
    setSubmitted(true);
    // Add a small delay for visual feedback
    setTimeout(() => {
      socket.emit('guess', { room: 'public', guess: guessIndex });
    }, 500);
  };

  return (
    <div className="card text-center">
      <h2 className="text-2xl font-bold mb-4 neon">It&apos;s Guessing Time!</h2>
      <p className="mb-6 text-gray-400">One of these is the correct answer. Choose wisely.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleGuess(i)}
            className={`p-4 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105
                        ${selected === i ? 'bg-yellow-500 scale-110' : 'bg-gray-700 hover:bg-purple-600'}
                        ${submitted ? 'cursor-not-allowed opacity-70' : ''}`}
            disabled={submitted}
          >
            {opt}
          </button>
        ))}
      </div>
       {submitted && <p className="mt-4 text-yellow-400">Waiting for result...</p>}
    </div>
  );
}