import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiChefHatFill } from "react-icons/pi";
import { RiRobot2Fill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { GiShinyApple, GiForkKnifeSpoon } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import './MyBotPage.css';

function MyBotPage({onLogout}) {

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigate("/home");
  };

  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your MySousChef! I can help you with nutritional information, cooking tips, and ingredient uses. Ask me anything or use the quick questions below!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick question buttons
  const quickQuestions = [
    {
      icon: <GiShinyApple />,
      question: "What are the nutritional values of this ingredient?",
      prompt: "nutritional",
      color: "green"
    },
    {
      icon: <FaLeaf />,
      question: "What are alternative uses for this ingredient?",
      prompt: "alternative",
      color: "yellow"
    },
    {
      icon: <GiForkKnifeSpoon />,
      question: "How do I properly store this ingredient?",
      prompt: "storage",
      color: "pastel"
    }
  ];

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to Google Gemini API
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Call your backend API that connects to Google Gemini
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      
      // Add assistant response
      const assistantMessage = {
        role: 'assistant',
        content: data.response || "I'm sorry, I couldn't process that. Please try again."
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  // Handle quick question click
  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  return (
    <div className="mybot-page">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-logo">

          <span className="logo-text">WHAT'S IN MY FRIDGE?</span>
        </div>
        <div className="navbar-links">
          <button
            className={`nav-link ${location.pathname === "/home" ? "active" : ""}`}
            onClick={() => navigate("/home")}
          >
            Home
          </button>
              <button
                className={`nav-link ${location.pathname === "/input" ? "active" : ""}`}
                onClick={() => navigate("/input")}
              >
                Add Ingredients
              </button>
              <button
                className={`nav-link ${location.pathname === "/myrecipes" ? "active" : ""}`}
                onClick={() => navigate("/myrecipes")}
              >
                My Recipes
              </button>
              <button
                className={`nav-link ${location.pathname === "/mybot" ? "active" : ""}`}
                onClick={() => navigate("/mybot")}
              >
                MySousChef
              </button>
              <button className="nav-profile" onClick={onLogout}>
                <PiChefHatFill /> Logout
              </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mybot-container">
        {/* Header */}
        <div className="mybot-header">
          <RiRobot2Fill className="bot-icon-large" />
          <div>
            <h1 className="mybot-title">MySousChef AI</h1>
            <h2 className="mybot-subtitle">Your personal cooking assistant</h2>
            <p className="mybot-subtitle">Disclaimer: This chatbot is intended for general information and convenience only. Its suggestions should not be taken as professional, medical, or safety advice. Always use your own judgment and follow proper food safety guidelines when storing, preparing, or consuming items. </p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-container">
          {/* Quick Questions - Show only at start */}
          {messages.length <= 1 && (
            <div className="quick-questions">
              <p className="quick-title">Quick Questions:</p>
              <div className="quick-grid">
                {quickQuestions.map((q, index) => (
                  <button
                    key={index}
                    className={`quick-btn quick-btn-${q.color}`}
                    onClick={() => handleQuickQuestion(q.question)}
                  >
                    <span className="quick-icon">{q.icon}</span>
                    <span className="quick-text">{q.question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="messages-area">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="message-avatar">
                    <RiRobot2Fill />
                  </div>
                )}
                <div className="message-bubble">
                  <p className="message-text">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="message-avatar message-avatar-user">
                    <PiChefHatFill />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="message message-assistant">
                <div className="message-avatar">
                  <RiRobot2Fill />
                </div>
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="input-area">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about cooking, nutrition, or ingredients..."
              className="chat-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={loading || !inputMessage.trim()}
            >
              <IoSend />
            </button>
          </form>
        </div>

        {/* Tips Section */}
        <div className="tips-section">
          <p className="tips-title">💡 Try asking me:</p>
          <div className="tips-grid">
            <div className="tip-item">• "What vitamins are in spinach?"</div>
            <div className="tip-item">• "How can I use leftover rice?"</div>
            <div className="tip-item">• "What's the best way to store tomatoes?"</div>
            <div className="tip-item">• "Give me a healthy breakfast idea"</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBotPage;
