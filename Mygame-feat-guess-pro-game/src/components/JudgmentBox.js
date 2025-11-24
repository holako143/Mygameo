export default function JudgmentBox({ socket, judgments }) {
  const handleJudgment = (judgment) => {
    socket.emit('submitJudgment', { room: 'public', judgment });
  };

  return (
    <div className="card text-center border-red-500 border-2">
      <h2 className="text-2xl font-bold mb-4 text-red-400 neon">Judgment Time!</h2>
      <p className="mb-6 text-gray-400">You lost the round. Now, you must face a judgment to earn a Brave Point.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {judgments.map((j, i) => (
          <button
            key={i}
            onClick={() => handleJudgment(j)}
            className="btn-primary bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 p-4 h-full flex items-center justify-center"
          >
            {j}
          </button>
        ))}
      </div>
    </div>
  );
}