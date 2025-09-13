import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function TutorChat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const websocket = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (websocket.current) {
        websocket.current.close();
      }
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const connectWebSocket = () => {
    if (!user || !user.id) {
      console.error('No user ID available for WebSocket connection');
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/tutor/${user.id}`);
    
    ws.onopen = () => {
      console.log('Connected to AI Tutor');
      setIsConnected(true);
      setMessages(prev => [...prev, {
        type: 'system',
        message: 'Connected to AI Tutor. How can I help you with your learning goals today?',
        timestamp: new Date().toISOString()
      }]);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev, {
          type: 'ai',
          message: data.message,
          timestamp: data.timestamp || new Date().toISOString()
        }]);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('Disconnected from AI Tutor');
      setIsConnected(false);
      setMessages(prev => [...prev, {
        type: 'system',
        message: 'Disconnected from AI Tutor. Trying to reconnect...',
        timestamp: new Date().toISOString()
      }]);
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (user && user.id) {
          connectWebSocket();
        }
      }, 3000);
    };

    websocket.current = ws;
  };

  const sendMessage = () => {
    if (inputMessage.trim() && websocket.current && isConnected) {
      const messageData = {
        type: 'user_message',
        message: inputMessage,
        timestamp: new Date().toISOString(),
        context: 'learning'
      };

      try {
        websocket.current.send(JSON.stringify(messageData));
        
        setMessages(prev => [...prev, {
          type: 'user',
          message: inputMessage,
          timestamp: new Date().toISOString()
        }]);
        
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        setIsConnected(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">AI</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">AI Learning Tutor</h2>
          <p className="text-gray-600">Get personalized help with your goals</p>
        </div>
        <div className={`ml-auto w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      </div>
      
      {/* Chat Messages */}
      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Welcome to your AI Tutor! Start a conversation by typing below.</p>
            <p className="text-sm mt-2">Ask about your goals, get learning advice, or request explanations.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.type === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block max-w-xs lg:max-w-md p-3 rounded-lg ${
                msg.type === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : msg.type === 'ai'
                  ? 'bg-green-100 text-gray-800 border border-green-200'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                <div className="text-sm">{msg.message}</div>
              </div>
              <div className={`text-xs text-gray-500 mt-1 ${msg.type === 'user' ? 'text-right' : ''}`}>
                {formatTime(msg.timestamp)}
                {msg.type === 'ai' && ' • AI Tutor'}
                {msg.type === 'user' && ' • You'}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your AI tutor about your goals..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !inputMessage.trim()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send
        </button>
      </div>

      {/* Status */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
          {!isConnected && ' - Trying to reconnect...'}
        </div>
        <div className="text-xs text-gray-500">
          {user ? `Logged in as ${user.name}` : 'Not logged in'}
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "How do I stay motivated?",
            "Explain React hooks",
            "Learning schedule tips",
            "Project ideas"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(suggestion)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Modules Quick Access */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h3 className="font-semibold text-indigo-800 mb-3">Learning Modules</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-white text-indigo-700 px-3 py-2 rounded text-sm hover:bg-indigo-100 transition">
            Python 
          </button>
          <button className="bg-white text-indigo-700 px-3 py-2 rounded text-sm hover:bg-indigo-100 transition">
            Data Structures
          </button>
          <button className="bg-white text-indigo-700 px-3 py-2 rounded text-sm hover:bg-indigo-100 transition">
            OOP Concepts
          </button>
          <button className="bg-white text-indigo-700 px-3 py-2 rounded text-sm hover:bg-indigo-100 transition">
            APIs & Libraries
          </button>
        </div>
      </div>
    </div>
  );
}