import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Bot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      setMessages(prev => [...prev, { text: "Please type a message to continue.", sender: 'bot' }]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/bot/v1/message`, { text: input });


      if (res.status === 200) {
        setMessages(prev => [
          ...prev,
          { text: input, sender: 'user' }, // user message
          { text: res.data.botMessage, sender: 'bot' } // bot response
        ]);
      }

    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput('');
    setLoading(false);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="flex flex-col min-h-screen text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full border-b border-gray-800 bg-[#0d0d0d] z-10">
      <div className="container mx-auto flex justify-between items-center px-6 py-4 border-2 border-green-400 bg-gradient-to-r from-black to-green-600 text-white shadow-[0_0_12px_4px_rgba(34,197,94,0.5)] rounded-xl transition-all duration-500">

          <h1 className="text-lg font-bold hover:text-green-300">botNova</h1>
          <FaUserCircle size={30} className="cursor-pointer hover:text-green-300" />
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 text-lg">
              👋 Hi, I'm <span className="text-green-500 font-semibold">botNova</span>.<br/>
              Ask me about <br/>• Programming (Python, Java, recursion)<br/>• Interview questions<br/>• Current affairs (G20, India PM)<br/>• Sports (Virat Kohli, IPL)<br/>• Or just chat with me!
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-xl max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white self-end"
                      : "bg-gray-800 text-gray-100 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-xl max-w-[60%] self-start">
                  Bot is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      {/* Input & Footer */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-gray-800 bg-[#0d0d0d] z-10">
        <div className="max-w-4xl mx-auto flex justify-center px-4 py-3">
          <div className="w-full flex bg-gray-900 rounded-full px-4 py-2 shadow-lg">
            <input
  type="text"
  className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2 transition-all duration-300 
    hover:shadow-[0_0_12px_4px_rgba(34,197,94,0.5)] 
    hover:border-2 hover:border-green-400
    focus:shadow-[0_0_18px_6px_rgba(34,197,94,0.7)]
    focus:border-2 focus:border-green-500
    rounded-md"
  style={{ caretColor: '#22c55e' }}
  placeholder="Ask botNova..."
  value={input}
  onChange={e => setInput(e.target.value)}
  onKeyDown={handleKeyPress}
/>

            <button
              onClick={handleSendMessage}
              className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-full text-white font-medium transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Bot;
