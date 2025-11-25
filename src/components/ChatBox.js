import { useState, useEffect, useRef, useContext } from 'react';
import { LanguageContext } from '@/pages/_app';

export default function ChatBox({ socket, user }) {
  const { t } = useContext(LanguageContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on('chat', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      socket.emit('chat', { room: 'public', name: user.name, msg: input });
      setInput('');
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4 neon">{t('liveChat')}</h2>
      <div className="flex-grow h-64 overflow-y-auto mb-4 pr-2">
        {messages.map((m, i) => (
          <p key={i} className="mb-2">
            <strong style={{ color: m.name === user.name ? '#9333ea' : 'inherit' }}>
              {m.name === user.name ? 'You' : m.name}:
            </strong> {m.msg}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Say something..."
        />
      </form>
    </div>
  );
}