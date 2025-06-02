'use client';

import React, { useState, useCallback } from 'react';
import { FaPaperPlane, FaEnvelopeOpenText, FaPen, FaBrain, FaPlusCircle, FaSyncAlt, FaListAlt, FaLanguage, FaUserTie, FaSmile, FaMagic, FaCompressAlt } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { insertIntoOutlook, getCurrentEmail } from '@/utils/outlook';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
      <span className="text-sm">{message}</span>
    </div>
  );
};

interface ContentProps {
  onToast: (message: string) => void;
  onThinking: () => void;
  onAiRequest: (prompt: string, mode: 'reply' | 'compose' | 'summarize') => Promise<void>;
}

interface ReadModeProps extends ContentProps {
  onInsertReply: () => void;
  aiResponse: string;
}

const ReadModeContent: React.FC<ReadModeProps> = ({ 
  onToast, 
  onThinking, 
  onAiRequest,
  onInsertReply,
  aiResponse 
}) => {
  const [emailContent, setEmailContent] = useState('');

  const handleAction = (action: string) => {
    if (!emailContent) {
      onToast('Please enter email content first');
      return;
    }
    onAiRequest(emailContent, action.toLowerCase() as 'reply' | 'summarize');
  };

  return (
    <div className="p-4">
      <h2 className="text-base font-semibold mb-3 text-gray-800">Email Content</h2>
      
      <textarea
        className="w-full border border-gray-300 rounded-md p-3 text-sm min-h-24 mb-4 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Paste email content here..."
        value={emailContent}
        onChange={(e) => setEmailContent(e.target.value)}
      />
      
      {/* AI Generated Reply */}
      {aiResponse && (
        <div className="bg-white p-4 rounded-md mb-4 max-h-48 overflow-y-auto border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed">
            {aiResponse}
          </p>
        </div>
      )}
      
      {/* Action Buttons */}
      <button 
        onClick={onInsertReply}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mb-3 flex items-center justify-center"
      >
        <i className="fas fa-plus-circle mr-2"></i>
        Insert Reply
      </button>
      
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => handleAction('Regenerate')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center"
        >
          <i className="fas fa-sync-alt mr-1"></i>
          Regenerate
        </button>
        <button 
          onClick={() => handleAction('Summarize')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center"
        >
          <i className="fas fa-list-alt mr-1"></i>
          Summarize
        </button>
        <button 
          onClick={() => handleAction('Translate')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center"
        >
          <i className="fas fa-language mr-1"></i>
          Translate
        </button>
      </div>
    </div>
  );
};

interface ComposeModeProps extends ContentProps {
  emailContent: string;
  setEmailContent: (content: string) => void;
}

const ComposeModeContent: React.FC<ComposeModeProps> = ({ 
  onToast, 
  onThinking, 
  onAiRequest,
  emailContent,
  setEmailContent
}) => {
  const handleAction = (action: string) => {
    if (!emailContent) {
      onToast('Please enter email content first');
      return;
    }
    onAiRequest(emailContent, action.toLowerCase() as 'compose' | 'summarize');
  };

  return (
    <div className="p-4">
      <h2 className="text-base font-semibold mb-3 text-gray-800">AI Compose Tools</h2>
      
      {/* Write from bullet points */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Write from bullet points
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 text-sm min-h-24 focus:ring-blue-500 focus:border-blue-500"
          placeholder="• Need quarterly report by Friday
• Include sales figures
• Highlight marketing campaign results"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        ></textarea>
        <button 
          onClick={() => handleAction('Compose')}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          <i className="fas fa-magic mr-1"></i> Generate Email
        </button>
      </div>
      
      {/* Quick tools */}
      <div className="mt-5">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Quick tools</h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => handleAction('Make Polite')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center"
          >
            <i className="fas fa-smile mr-1"></i>
            Make Polite
          </button>
          <button 
            onClick={() => handleAction('Shorten')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center"
          >
            <i className="fas fa-compress-alt mr-1"></i>
            Shorten
          </button>
          <button 
            onClick={() => handleAction('Translate')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center"
          >
            <i className="fas fa-language mr-1"></i>
            Translate
          </button>
          <button 
            onClick={() => handleAction('Summarize')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-md flex items-center justify-center"
          >
            <i className="fas fa-list-alt mr-1"></i>
            Summarize
          </button>
        </div>
      </div>
    </div>
  );
};

export const MailPilotSidebar: React.FC = () => {
  const { data: session } = useSession();
  const [mode, setMode] = useState<'read' | 'compose'>('read');
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleToast = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
  }, []);

  const handleAiRequest = useCallback(async (prompt: string, mode: 'reply' | 'compose' | 'summarize') => {
    try {
      setIsThinking(true);
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, mode }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setAiResponse(data.response);
      handleToast('AI response generated successfully!');
    } catch (error) {
      console.error('AI request error:', error);
      handleToast('Failed to generate AI response');
    } finally {
      setIsThinking(false);
    }
  }, [handleToast]);

  const handleInsertReply = useCallback(async () => {
    if (!aiResponse) {
      handleToast('Please generate a reply first');
      return;
    }
    try {
      await insertIntoOutlook(aiResponse);
      handleToast('Reply inserted into Outlook!');
    } catch (error) {
      console.error('Failed to insert reply:', error);
      handleToast('Failed to insert reply into Outlook');
    }
  }, [aiResponse, handleToast]);

  const handleAction = useCallback((action: string, content: string) => {
    switch (action) {
      case 'Regenerate':
        handleAiRequest(content, 'reply');
        break;
      case 'Summarize':
        handleAiRequest(content, 'summarize');
        break;
      case 'Translate':
        // Implement translation logic
        handleToast('Translation feature coming soon!');
        break;
      default:
        handleToast(`${action} completed!`);
    }
  }, [handleAiRequest, handleToast]);

  if (!session) {
    return (
      <div className="flex flex-col h-screen w-80 bg-white border-l border-gray-200 shadow-sm overflow-hidden relative">
        <div className="p-4 text-center">
          <p className="text-gray-600">Please sign in to use MailPilot AI</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-80 bg-white border-l border-gray-200 shadow-sm overflow-hidden relative">
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
      
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center">
          <FaPaperPlane className="text-blue-600 mr-2" />
          <h1 className="text-base font-semibold text-gray-800">MailPilot AI</h1>
        </div>
        <div className="flex items-center">
          <span className="text-xs mr-2 text-gray-600">{language === 'english' ? 'EN' : 'HI'}</span>
          <button
            onClick={() => setLanguage(language === 'english' ? 'hindi' : 'english')}
            className="relative inline-flex items-center h-5 w-10 rounded-full bg-gray-200 cursor-pointer"
            aria-label="Toggle language"
          >
            <span className={`absolute h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${language === 'english' ? 'translate-x-5' : 'translate-x-1'}`}></span>
          </button>
        </div>
      </header>
      
      {/* Mode Selector */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setMode('read')}
          className={`flex-1 py-2 text-sm font-medium whitespace-nowrap cursor-pointer ${mode === 'read' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FaEnvelopeOpenText className="mr-1 inline" /> Read Mode
        </button>
        <button
          onClick={() => setMode('compose')}
          className={`flex-1 py-2 text-sm font-medium whitespace-nowrap cursor-pointer ${mode === 'compose' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <FaPen className="mr-1 inline" /> Compose Mode
        </button>
      </div>
      
      {/* AI Thinking Indicator */}
      {isThinking && (
        <div className="absolute top-24 left-0 right-0 bg-blue-50 py-2 px-4 z-10 flex items-center justify-center border-b border-blue-100">
          <div className="flex items-center">
            <div className="animate-pulse mr-2">
              <FaBrain className="text-blue-500" />
            </div>
            <span className="text-sm text-blue-700">AI is thinking...</span>
          </div>
        </div>
      )}
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'read' ? (
          <ReadModeContent 
            onToast={handleToast} 
            onThinking={() => setIsThinking(true)}
            onAiRequest={handleAiRequest}
            onInsertReply={handleInsertReply}
            aiResponse={aiResponse}
          />
        ) : (
          <ComposeModeContent 
            onToast={handleToast} 
            onThinking={() => setIsThinking(true)}
            onAiRequest={handleAiRequest}
            emailContent={emailContent}
            setEmailContent={setEmailContent}
          />
        )}
      </div>
    </div>
  );
}; 