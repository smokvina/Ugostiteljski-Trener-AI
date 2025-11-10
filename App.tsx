import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Chat } from '@google/genai';
import { ChatMessage as ChatMessageType } from './types';
import { initializeChat, sendMessageToAI, generateImage } from './services/geminiService';
import ChatMessageComponent from './components/ChatMessage';
import ImageGenerationModal from './components/ImageGenerationModal';
import HelpModal from './components/HelpModal';
import TutorialModal from './components/TutorialModal';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load chat history from local storage and initialize chat
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatHistory');
      const initialMessages = savedMessages ? JSON.parse(savedMessages) : [];
      setMessages(initialMessages);

      const historyForAI = initialMessages.map((msg: ChatMessageType) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const chatInstance = initializeChat(historyForAI);
      if (chatInstance) {
        setChat(chatInstance);
        if (initialMessages.length === 0) {
            // Start with a message from the model if chat is new
            setIsLoading(true);
            sendMessageToAI(chatInstance, "Započni s prvim zadatkom.")
                .then(response => {
                    const modelMessage: ChatMessageType = {
                        id: uuidv4(),
                        role: 'model',
                        content: response,
                    };
                    setMessages([modelMessage]);
                })
                .catch(err => {
                    console.error(err);
                    setError("Došlo je do pogreške prilikom inicijalizacije chata.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
      } else {
        setError("Nije moguće inicijalizirati AI. Provjerite je li API ključ postavljen.");
      }

      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
      if (!hasSeenTutorial) {
        setIsTutorialModalOpen(true);
      }

    } catch (e) {
        console.error("Failed to load from local storage or initialize chat", e);
        setError("Došlo je do pogreške prilikom učitavanja aplikacije.");
        localStorage.removeItem('chatHistory'); // Clear corrupted storage
    }
  }, []);

  // Save chat history to local storage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: 'user',
      content: userInput.trim(),
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await sendMessageToAI(chat, userMessage.content);
      const modelMessage: ChatMessageType = {
        id: uuidv4(),
        role: 'model',
        content: responseText,
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error(err);
      setError("Došlo je do pogreške prilikom slanja poruke. Molimo pokušajte ponovo.");
      // Optionally remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    const loadingMessage: ChatMessageType = {
        id: uuidv4(),
        role: 'model',
        content: `Generiram sliku na temelju opisa: "${prompt}"...`
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
        const imageUrl = await generateImage(prompt);
        if (imageUrl) {
            const imageMessage: ChatMessageType = {
                id: uuidv4(),
                role: 'user',
                content: `Generirana slika za: "${prompt}"`,
                image: imageUrl
            };
            // Replace loading message with the image message
            setMessages(prev => [...prev.slice(0, -1), imageMessage]);
        } else {
            throw new Error("Image generation returned null.");
        }
    } catch (err) {
        console.error(err);
        const errorMessage: ChatMessageType = {
            id: uuidv4(),
            role: 'model',
            content: 'Došlo je do pogreške prilikom generiranja slike. Molimo pokušajte ponovo.'
        };
        setMessages(prev => [...prev.slice(0, -1), errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down' | null, comment?: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, feedback, feedbackComment: comment } : msg
      )
    );
  };
  
  const handleCloseTutorial = () => {
    setIsTutorialModalOpen(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white font-sans">
        {/* Header */}
        <header className="bg-gray-900 shadow-lg p-4 flex justify-between items-center z-10 flex-shrink-0">
            <h1 className="text-xl font-bold text-amber-400">Ugostiteljski Trener AI</h1>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsImageModalOpen(true)}
                    title="Generiraj sliku"
                    className="text-gray-400 hover:text-amber-400 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </button>
                 <button
                    onClick={() => setIsHelpModalOpen(true)}
                    title="Pomoć"
                    className="text-gray-400 hover:text-amber-400 transition"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
        </header>

        {/* Chat Area */}
        <main ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                {messages.map(msg => (
                    <ChatMessageComponent key={msg.id} message={msg} onFeedback={handleFeedback} />
                ))}
                 {isLoading && (
                    <div className="flex justify-start items-start gap-3 my-4">
                       <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="w-full max-w-xl">
                            <div className="p-4 rounded-lg shadow-md bg-gray-700 text-gray-200 rounded-tl-none animate-pulse">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {error && <div className="text-red-400 text-center p-2">{error}</div>}
            </div>
        </main>
        
        {/* Input Form */}
        <footer className="bg-gray-900 p-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Unesi svoj odgovor..."
                        className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!userInput.trim() || isLoading}
                        className="p-3 bg-amber-600 text-white rounded-md hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </footer>

        {/* Modals */}
        <ImageGenerationModal 
            isOpen={isImageModalOpen} 
            onClose={() => setIsImageModalOpen(false)} 
            onGenerate={handleGenerateImage} 
        />
        <HelpModal 
            isOpen={isHelpModalOpen} 
            onClose={() => setIsHelpModalOpen(false)} 
        />
        <TutorialModal 
            isOpen={isTutorialModalOpen} 
            onClose={handleCloseTutorial}
        />
    </div>
  );
};

export default App;
