import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import './GenAI.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Helper function to format AI messages with better organization
const formatAIMessage = (text: string) => {
  // Convert markdown-style bold to HTML
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert bullet points to proper list items
  const lines = formatted.split('\n');
  let inList = false;
  let result: string[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Check if line starts with a bullet point or dash
    if (trimmed.match(/^[-•*]\s/)) {
      if (!inList) {
        result.push('<ul class="ai-list">');
        inList = true;
      }
      // Remove the bullet and wrap in li
      const content = trimmed.replace(/^[-•*]\s/, '');
      result.push(`<li>${content}</li>`);
    } else if (trimmed === '') {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push('<br/>');
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(`<p>${trimmed}</p>`);
    }
  });
  
  // Close list if still open
  if (inList) {
    result.push('</ul>');
  }
  
  return result.join('');
};

interface ChatHistory {
  id: number;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

// Helper function to get initial data from localStorage
const getInitialData = (userId: string | undefined) => {
  const initialMessage: Message = {
    id: 1,
    text: 'Hi there! How are you feeling today? I am here to help you with personalized wellness guidance and support your health goals.',
    sender: 'ai',
    timestamp: new Date()
  };
  
  try {
    // Use user-specific or guest storage key
    const chatsKey = userId ? `genai_chats_${userId}` : 'genai_chats_guest';
    const historyKey = userId ? `genai_chat_history_${userId}` : 'genai_chat_history_guest';
    
    const savedChats = localStorage.getItem(chatsKey);
    const savedHistory = localStorage.getItem(historyKey);
    
    if (savedChats && savedHistory) {
      const parsedChats = JSON.parse(savedChats);
      const parsedHistory = JSON.parse(savedHistory);
      
      // Convert timestamp strings back to Date objects
      Object.keys(parsedChats).forEach(id => {
        parsedChats[id] = parsedChats[id].map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      });
      
      const historyWithDates = parsedHistory.map((chat: any) => ({
        ...chat,
        timestamp: new Date(chat.timestamp)
      }));
      
      // Load the most recent chat (first in history)
      const mostRecentChat = historyWithDates[0];
      const mostRecentMessages = parsedChats[mostRecentChat.id] || [];
      
      return {
        chatsData: parsedChats,
        chatHistory: historyWithDates,
        currentChatId: mostRecentChat.id,
        messages: mostRecentMessages,
        showWelcome: mostRecentMessages.length <= 1
      };
    }
  } catch (error) {
    console.error('Error loading saved data:', error);
  }
  
  // Return default initial data if nothing saved
  const initialChatHistory: ChatHistory = {
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
  };
  
  return {
    chatsData: { 1: [initialMessage] },
    chatHistory: [initialChatHistory],
    currentChatId: 1,
    messages: [initialMessage],
    showWelcome: true
  };
};

export default function GenAI() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  // Get user-specific localStorage key
  const userId = user?.id || user?.email;
  const initialData = getInitialData(userId);
  
  const [messages, setMessages] = useState<Message[]>(initialData.messages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>(initialData.chatHistory);
  const [currentChatId, setCurrentChatId] = useState(initialData.currentChatId);
  const [sidebarState, setSidebarState] = useState<'minimized' | 'maximized'>('minimized');
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(initialData.showWelcome);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatsData, setChatsData] = useState<{ [key: number]: Message[] }>(initialData.chatsData);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reload data when userId changes (e.g., after login/logout)
  useEffect(() => {
    const reloadedData = getInitialData(userId);
    setMessages(reloadedData.messages);
    setChatHistory(reloadedData.chatHistory);
    setCurrentChatId(reloadedData.currentChatId);
    setChatsData(reloadedData.chatsData);
    setShowWelcomeScreen(reloadedData.showWelcome);
  }, [userId]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Don't close if clicking on the menu button or dropdown
      if (target.closest('.chat-item-menu-container')) {
        return;
      }
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    try {
      if (Object.keys(chatsData).length > 0) {
        const storageKey = userId ? `genai_chats_${userId}` : 'genai_chats_guest';
        localStorage.setItem(storageKey, JSON.stringify(chatsData));
      }
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  }, [chatsData, userId]);

  // Save chat history to localStorage
  useEffect(() => {
    try {
      if (chatHistory.length > 0) {
        const storageKey = userId ? `genai_chat_history_${userId}` : 'genai_chat_history_guest';
        localStorage.setItem(storageKey, JSON.stringify(chatHistory));
      }
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [chatHistory, userId]);

  // Save current chat ID
  useEffect(() => {
    try {
      const storageKey = userId ? `genai_current_chat_id_${userId}` : 'genai_current_chat_id_guest';
      localStorage.setItem(storageKey, currentChatId.toString());
    } catch (error) {
      console.error('Error saving current chat ID:', error);
    }
  }, [currentChatId, userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Transition from welcome screen to chat interface
    if (showWelcomeScreen) {
      setShowWelcomeScreen(false);
    }

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // Save to chatsData
    setChatsData(prev => ({
      ...prev,
      [currentChatId]: updatedMessages
    }));
    
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call the AI API with conversation history
      const token = localStorage.getItem('authToken');
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

      if (data.success) {
        const aiMessage: Message = {
          id: messages.length + 2,
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);
        
        // Save to chatsData
        setChatsData(prev => ({
          ...prev,
          [currentChatId]: finalMessages
        }));
        
        // Update chat history with the latest message timestamp
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
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };
      const messagesWithError = [...updatedMessages, errorMessage];
      setMessages(messagesWithError);
      
      // Save error message to chatsData
      setChatsData(prev => ({
        ...prev,
        [currentChatId]: messagesWithError
      }));
      
      // Update chat history with the error message timestamp
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
    } finally {
      setIsTyping(false);
    }
  };

  const handleBackClick = () => {
    navigate('/loading/home');
  };

  const handleNewChat = () => {
    // Find the maximum existing chat ID from both chatHistory and chatsData to avoid collisions
    const historyMaxId = chatHistory.length > 0 ? Math.max(...chatHistory.map(chat => chat.id)) : 0;
    const chatsDataMaxId = Object.keys(chatsData).length > 0 
      ? Math.max(...Object.keys(chatsData).map(id => parseInt(id))) 
      : 0;
    const maxId = Math.max(historyMaxId, chatsDataMaxId, 0);
    const newChatId = maxId + 1;
    
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
    
    const initialMessage: Message = {
      id: 1,
      text: 'Hi there! How are you feeling today? I am here to help you with personalized wellness guidance and support your health goals.',
      sender: 'ai',
      timestamp: now
    };
    
    setMessages([initialMessage]);
    setChatsData(prev => ({
      ...prev,
      [newChatId]: [initialMessage]
    }));
    setShowWelcomeScreen(true);
  };

  const handleSelectChat = (chatId: number) => {
    setCurrentChatId(chatId);
    
    // Load messages for this chat from chatsData
    if (chatsData[chatId]) {
      setMessages(chatsData[chatId]);
      setShowWelcomeScreen(chatsData[chatId].length <= 1);
    } else {
      // New chat or no saved data
      const initialMessage = {
        id: 1,
        text: 'Hi there! How are you feeling today? I am here to help you with personalized wellness guidance and support your health goals.',
        sender: 'ai' as const,
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      setChatsData(prev => ({
        ...prev,
        [chatId]: [initialMessage]
      }));
      setShowWelcomeScreen(true);
    }
  };

  const toggleSidebar = () => {
    if (sidebarState === 'minimized') {
      setSidebarState('maximized');
    } else {
      setSidebarState('minimized');
    }
  };

  const handleAccountClick = () => {
    navigate('/loading/account');
  };

  // Filter chat history based on search query - searches through actual message content
  const filteredChatHistory = chatHistory.filter(chat => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    
    // Get the messages for this chat
    const chatMessages = chatsData[chat.id] || [];
    
    // Search through all message text content in this chat
    const hasMatchingMessage = chatMessages.some(message => 
      message.text.toLowerCase().includes(query)
    );
    
    // Also search in title and last message for convenience
    return hasMatchingMessage || 
           chat.title.toLowerCase().includes(query) || 
           chat.lastMessage.toLowerCase().includes(query);
  });

  const toggleMenu = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === chatId ? null : chatId);
  };

  const handleDeleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't delete if it's the only chat
    if (chatHistory.length === 1) {
      alert('Cannot delete the last chat. At least one chat must remain.');
      setOpenMenuId(null);
      return;
    }
    
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this chat?')) {
      setOpenMenuId(null);
      return;
    }
    
    // Remove from chat history
    const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
    setChatHistory(updatedHistory);
    
    // Remove from chats data
    const updatedChatsData = { ...chatsData };
    delete updatedChatsData[chatId];
    setChatsData(updatedChatsData);
    
    // If deleting current chat, switch to another chat
    if (currentChatId === chatId) {
      const nextChat = updatedHistory[0];
      if (nextChat) {
        handleSelectChat(nextChat.id);
      }
    }
    
    setOpenMenuId(null);
  };

  // Welcome Screen (shown on first load)
  if (showWelcomeScreen) {
    return (
      <div className={`genai-container ${theme}`}>
        {/* Background Effects */}
        <div className="genai-bg">
          <div className="genai-bg-circuit"></div>
          <div className="genai-bg-grid"></div>
          <div className="genai-bg-glow"></div>
        </div>

        {/* Sidebar */}
        <div className={`genai-sidebar ${sidebarState}`}>
          <div className="sidebar-header">
            {sidebarState === 'maximized' ? (
              <>
                <button 
                  className="sidebar-toggle" 
                  onClick={toggleSidebar}
                  title="Minimize sidebar"
                >
                  ◀
                </button>
                <button className="new-chat-button" onClick={handleNewChat}>
                  <span className="new-chat-icon">+</span>
                  <span className="new-chat-text">New Chat</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  className="sidebar-toggle" 
                  onClick={toggleSidebar}
                  title="Expand sidebar"
                >
                  ▶
                </button>
                <button className="new-chat-button" onClick={handleNewChat}>
                  <span className="new-chat-icon">+</span>
                </button>
              </>
            )}
          </div>
          
          {sidebarState === 'maximized' && (
            <div className="sidebar-content">
              <div className="sidebar-search">
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="chat-history-section">
                <h3 className="section-title">Chat History</h3>
                <div className="chat-history-list">
                  {filteredChatHistory.map((chat) => (
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
                      <div className="chat-item-menu-container">
                        <button 
                          className="chat-item-menu" 
                          onClick={(e) => toggleMenu(chat.id, e)}
                        >
                          ⋮
                        </button>
                        {openMenuId === chat.id && (
                          <div className="chat-item-dropdown">
                            <button 
                              className="dropdown-item delete-item"
                              onClick={(e) => handleDeleteChat(chat.id, e)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Section */}
              <div className="sidebar-user-section">
                <button className="user-profile" onClick={handleAccountClick}>
                  <div className="user-avatar">👤</div>
                  <div className="user-info">
                    <div className="user-name">{user?.fullName || user?.firstName || 'User'}</div>
                    <div className="user-status">Manage Account</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back Button and Theme Toggle - Top Right */}
        <div className="welcome-back-button-container">
          <button onClick={() => navigate('/loading/neural-reminders')} className="welcome-reminder-button" title="Go to Smart Reminders">
            <span className="reminder-text">NEURAL REMINDER</span>
          </button>
          <button onClick={toggleTheme} className="welcome-theme-toggle" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
          <button onClick={() => navigate('/loading/home')} className="welcome-back-button">
            <span className="back-arrow">←</span>
            <span className="back-text">BACK</span>
          </button>
        </div>

        {/* Welcome Screen Content */}
        <div className="genai-welcome-screen">
          <div className="welcome-content">
            {/* Logo and Title */}
            <div className="welcome-header">
              <div className="welcome-logo-container">
                <img src="/logo/Neural Guardian.png" alt="Neural Guardian" className="welcome-logo-image" />
                <div className="welcome-logo-glow"></div>
              </div>
              <h1 className="welcome-title">NEURAL GUARDIAN</h1>
            </div>

            {/* Greeting Message */}
            <div className="welcome-greeting">
              <p className="greeting-line">Hi there! How are you feeling today?</p>
              <p className="greeting-line">I am here to help you with personalized wellness guidance and support your health goals.</p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="welcome-input-form">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                className="welcome-input"
                autoFocus
              />
              <button type="submit" className="welcome-send-button" disabled={!inputMessage.trim()}>
                <span className="send-icon">➤</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Full Chat Interface (shown after first message)
  return (
    <div className={`genai-container ${theme}`}>
      {/* Background Effects */}
      <div className="genai-bg">
        <div className="genai-bg-circuit"></div>
        <div className="genai-bg-grid"></div>
        <div className="genai-bg-glow"></div>
      </div>

      {/* Sidebar */}
      <div className={`genai-sidebar ${sidebarState}`}>
        <div className="sidebar-header">
          {sidebarState === 'maximized' ? (
            <>
              <button 
                className="sidebar-toggle" 
                onClick={toggleSidebar}
                title="Minimize sidebar"
              >
                ◀
              </button>
              <button className="new-chat-button" onClick={handleNewChat}>
                <span className="new-chat-icon">+</span>
                <span className="new-chat-text">New Chat</span>
              </button>
            </>
          ) : (
            <>
              <button 
                className="sidebar-toggle" 
                onClick={toggleSidebar}
                title="Expand sidebar"
              >
                ▶
              </button>
              <button className="new-chat-button" onClick={handleNewChat}>
                <span className="new-chat-icon">+</span>
              </button>
            </>
          )}
        </div>
        
        {sidebarState === 'maximized' && (
          <div className="sidebar-content">
            <div className="sidebar-search">
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="chat-history-section">
              <h3 className="section-title">Chat History</h3>
              <div className="chat-history-list">
                {filteredChatHistory.map((chat) => (
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
                    <div className="chat-item-menu-container">
                      <button 
                        className="chat-item-menu" 
                        onClick={(e) => toggleMenu(chat.id, e)}
                      >
                        ⋮
                      </button>
                      {openMenuId === chat.id && (
                        <div className="chat-item-dropdown">
                          <button 
                            className="dropdown-item delete-item"
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Section */}
            <div className="sidebar-user-section">
              <button className="user-profile" onClick={handleAccountClick}>
                <div className="user-avatar">👤</div>
                <div className="user-info">
                  <div className="user-name">{user?.fullName || user?.firstName || 'User'}</div>
                  <div className="user-status">Manage Account</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`genai-main sidebar-${sidebarState}`}>
        {/* Header */}
        <div className="genai-header">
          <div className="genai-header-left">
            <div className="genai-logo">
              <div className="genai-logo-image-container">
                <img src="/logo/Neural Guardian.png" alt="Neural Guardian" className="genai-logo-image" />
              </div>
              <div className="genai-logo-text">
                <h1>
                  NEURAL GUARDIAN
                  <div className="genai-powered-by-inline">
                    <span className="genai-powered-by-text">powered by</span>
                    <img src="/logo/logo.png" alt="Buddy Your Health Logo" className="genai-company-logo" />
                  </div>
                </h1>
                <p>Your Personal Health AI Assistant</p>
              </div>
            </div>
          </div>
          <div className="genai-header-right">
            <div className="genai-status">
              <div className="genai-status-dot"></div>
              <span>ONLINE</span>
            </div>
            <button onClick={() => navigate('/loading/neural-reminders')} className="genai-reminder-button" title="Go to Smart Reminders">
              <span className="reminder-text">NEURAL REMINDER</span>
            </button>
            <button onClick={toggleTheme} className="genai-theme-toggle" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
              <span className="theme-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
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
                  <img src="/logo/Neural Guardian.png" alt="Neural Guardian" className="message-avatar-image" />
                ) : (
                  '👤'
                )}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {message.sender === 'ai' ? (
                    <div dangerouslySetInnerHTML={{ __html: formatAIMessage(message.text) }} />
                  ) : (
                    message.text
                  )}
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
                <img src="/logo/Neural Guardian.png" alt="Neural Guardian" className="message-avatar-image" />
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
