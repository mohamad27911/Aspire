import React, { useState } from 'react';
import axios from 'axios';
import type { Event } from './types';

interface ChatbotProps {
  events: Event[];
}

const Chatbot: React.FC<ChatbotProps> = ({ events }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, `You: ${userMessage}`]);
    setInput('');

    try {
      const res = await axios.post('http://127.0.0.1:8000/chat', {
        message: userMessage,
        events: events,
      });

      setMessages(prev => [...prev, `Bot: ${res.data.reply}`]);
    } catch (error) {
      setMessages(prev => [...prev, 'Bot: Error getting response.']);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="w-80 bg-[#2a2a2a] border border-green-500 rounded-xl shadow-2xl overflow-hidden">
          {/* Chatbot Header */}
          <div 
            className="flex items-center justify-between p-3 bg-[#1e1e1e] border-b border-green-500 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <h3 className="font-semibold text-white">Event Assistant</h3>
            </div>
            <svg 
              className="w-5 h-5 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Messages Container */}
          <div className="h-64 p-4 overflow-y-auto bg-[#2a2a2a] space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg 
                  className="w-10 h-10 mb-2 text-green-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p>Ask me about your events!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.startsWith('You:') ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs p-3 rounded-lg ${msg.startsWith('You:') 
                      ? 'bg-green-600 text-white rounded-tr-none' 
                      : 'bg-[#1e1e1e] text-gray-300 rounded-tl-none border border-green-500/30'}`}
                  >
                    <p className="text-sm">{msg.replace('You: ', '').replace('Bot: ', '')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-3 bg-[#1e1e1e] border-t border-green-500">
            <div className="flex items-center space-x-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 p-2 text-sm rounded-lg bg-[#2a2a2a] text-white border border-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ask about your events..."
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg transition-all"
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Chatbot;