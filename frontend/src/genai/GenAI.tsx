import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import './GenAI.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatHistory {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function GenAI() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'How are you feeling today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: 1,
      title: 'Health Check-in',
      lastMessage: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      timestamp: new Date()
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the AI API with conversation history
      const token = localStorage.getItem('token');
      console.log('🚀 Calling AI API with message:', currentInput);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentInput,
          context: 'Health conversation with Neural Guardian assistant',
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        })
      });

      const data = await response.json();
      console.log('📥 API Response:', data);

      if (data.success) {
        const aiMessage: Message = {
          id: messages.length + 2,
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Update chat history with the latest message
        setChatHistory(prev => 
          prev.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, lastMessage: new Date().toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                }) }
              : chat
          )
        );
      } else {
        console.error('API Error Response:', data);
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      console.error('Full error details:', JSON.stringify(error, null, 2));
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBackClick = () => {
    navigate('/loading/home');
  };

  const handleNewChat = () => {
    const newChatId = chatHistory.length + 1;
    const now = new Date();
    const newChat: ChatHistory = {
      id: newChatId,
      title: 'Health Check-in',
      lastMessage: now.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      timestamp: now
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([
      {
        id: 1,
        text: 'How are you feeling today?',
        sender: 'ai',
        timestamp: now
      }
    ]);
  };

  const handleSelectChat = (chatId: number) => {
    setCurrentChatId(chatId);
    // In a real app, you would load the messages for this chat
    setMessages([
      {
        id: 1,
        text: 'How are you feeling today?',
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className={`genai-container ${theme}`}>
      {/* Background Effects */}
      <div className="genai-bg">
        <div className="genai-bg-circuit"></div>
        <div className="genai-bg-grid"></div>
        <div className="genai-bg-glow"></div>
      </div>

      {/* Sidebar */}
      <div className={`genai-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button 
          className="sidebar-toggle" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '◀' : '▶'}
        </button>
        <div className="sidebar-header">
          <button className="new-chat-button" onClick={handleNewChat}>
            <span className="new-chat-icon">+</span>
            <span className="new-chat-text">New Chat</span>
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="chat-history-section">
            <h3 className="section-title">Chat History</h3>
            <div className="chat-history-list">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-history-item ${currentChatId === chat.id ? 'active' : ''}`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <div className="chat-item-icon">💬</div>
                  <div className="chat-item-content">
                    <div className="chat-item-title">{chat.title}</div>
                    <div className="chat-item-preview">{chat.lastMessage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`genai-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <div className="genai-header">
          <div className="genai-header-left">
            <div className="genai-logo">
              <img src="/logo/Neural Guardian.png" alt="Neural Guardian" className="genai-logo-image" />
              <div className="genai-logo-text">
                <h1>NEURAL GUARDIAN</h1>
                <p>Your Personal Health AI Assistant</p>
              </div>
            </div>
          </div>
          <div className="genai-header-right">
            <div className="genai-status">
              <div className="genai-status-dot"></div>
              <span>ONLINE</span>
            </div>
            <button 
              className="genai-reminders-button"
              onClick={() => navigate('/smart-reminders')}
              title="View Neural Reminders"
            >
              NEURAL REMINDERS
            </button>
            <button 
              className="genai-theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="theme-icon">
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
            </button>
            <button onClick={handleBackClick} className="genai-back-button">
              <span className="back-arrow">←</span>
              <span className="back-text">BACK</span>
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="genai-chat-container">
        <div className="genai-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`genai-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-avatar">
                {message.sender === 'ai' ? (
                  <img src="/logo/Neural Guardian.png" alt="Neural Guardian" className="avatar-logo" />
                ) : (
                  '👤'
                )}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {message.text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="genai-message ai-message">
              <div className="message-avatar">
                <img src="/logo/Neural Guardian.png" alt="Neural Guardian" className="avatar-logo" />
              </div>
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

        {/* Input Area */}
        <div className="genai-input-container">
          <form onSubmit={handleSendMessage} className="genai-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your health question..."
              className="genai-input"
            />
            <button type="submit" className="genai-send-button" disabled={!inputMessage.trim()}>
              <span className="send-icon">➤</span>
            </button>
          </form>
          <div className="genai-input-footer">
            <p>Neural Guardian can make mistakes. Consider checking important information.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
