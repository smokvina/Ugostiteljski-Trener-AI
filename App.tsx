import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { ChatMessage } from './types';
import { initializeChat, sendMessageToAI, generateImage } from './services/geminiService';
import ChatMessageComponent from './components/ChatMessage';
import ImageGenerationModal from './components/ImageGenerationModal';

const App: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const init = async () => {
            const chatInstance = initializeChat();
            if (chatInstance) {
                setChat(chatInstance);
                const initialMessage: ChatMessage = {
                    id: Date.now().toString(),
                    role: 'model',
                    content: "Dobar dan. Krećemo s vježbom posluživanja. Očekujem potpunu pažnju i preciznost. Prvi zadatak: Što je 'mise en place' i zašto je važan?"
                };
                setMessages([initialMessage]);
            } else {
                 const errorMessage: ChatMessage = {
                    id: Date.now().toString(),
                    role: 'model',
                    content: "Greška: Inicijalizacija AI nije uspjela. Provjerite je li API ključ ispravno postavljen."
                };
                setMessages([errorMessage]);
            }
            setIsLoading(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const responseText = await sendMessageToAI(chat, input);

        const modelMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: responseText,
        };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    const handleGenerateImage = async (prompt: string) => {
        setIsLoading(true);
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: `Zahtjev za generiranje slike: "${prompt}"`,
        };
        setMessages(prev => [...prev, userMessage]);
        
        const imageUrl = await generateImage(prompt);
        
        const modelMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: imageUrl ? `Evo generirane slike za "${prompt}":` : `Nisam uspio generirati sliku za "${prompt}". Molimo pokušajte s drugačijim opisom.`,
            image: imageUrl ?? undefined,
        };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white">
            <header className="bg-gray-900 p-4 shadow-md z-10">
                <h1 className="text-xl font-bold text-center text-amber-400">Kolegij Šefova - Ugostiteljski Trener AI</h1>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg) => (
                        <ChatMessageComponent key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 my-4 justify-start">
                             <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="max-w-xl p-4 rounded-lg shadow-md bg-gray-700 text-gray-200 rounded-tl-none">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                    <span className="text-gray-300">Kolegij razmatra...</span>
                                </div>
                            </div>
                        </div>
                    )}
                     <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="bg-gray-900 p-4 border-t border-gray-700 sticky bottom-0">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsImageModalOpen(true)}
                        className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-amber-400 transition flex-shrink-0"
                        title="Generiraj sliku"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e as any);
                            }
                        }}
                        placeholder="Upiši svoj odgovor..."
                        className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </footer>

            <ImageGenerationModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                onGenerate={handleGenerateImage}
            />
        </div>
    );
};

export default App;
