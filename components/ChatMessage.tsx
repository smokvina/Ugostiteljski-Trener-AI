import React, { useState } from 'react';
import { ChatMessage } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
  onFeedback: (messageId: string, feedback: 'up' | 'down' | null, comment?: string) => void;
}

const ModelIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 00.788 1.84L10 5.382l6.606 2.038a1 1 0 00.788-1.84l-7-3.5zM3 9.418l7 3.5 7-3.5v3.582l-7 3.5-7-3.5V9.418z" />
        </svg>
    </div>
);

const ThumbUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.364a1 1 0 00.949-.684l2.121-6.364A1 1 0 0015.364 9H12V5a1 1 0 00-1-1h-1a1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6 10.333z" />
    </svg>
);

const ThumbDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1h-6.364a1 1 0 00-.949.684L3.565 9A1 1 0 004.636 11H8v4a1 1 0 001 1h1a1 1 0 001-1v-.667a4 4 0 01.8-2.4L14 9.667z" />
    </svg>
);


const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message, onFeedback }) => {
  const isModel = message.role === 'model';
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState(message.feedbackComment || '');

  const handleFeedbackClick = (feedback: 'up' | 'down') => {
    const newFeedback = message.feedback === feedback ? null : feedback;
    onFeedback(message.id, newFeedback);
    if (newFeedback === 'down') {
      setShowCommentBox(true);
    } else {
      setShowCommentBox(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFeedback(message.id, message.feedback, comment);
    setShowCommentBox(false);
  };

  return (
    <div className={`flex items-start gap-3 my-4 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && <ModelIcon />}
      <div className={`w-full max-w-xl`}>
        <div className={`p-4 rounded-lg shadow-md ${isModel ? 'bg-gray-700 text-gray-200 rounded-tl-none' : 'bg-amber-700 text-white rounded-tr-none'}`}>
            {message.content && (
                <div className="prose prose-invert max-w-none prose-p:my-2 prose-pre:bg-gray-800 prose-pre:p-3 prose-pre:rounded-md">
                    {message.content.split('```').map((part, index) =>
                        index % 2 === 1 ? (
                            <pre key={index} className="whitespace-pre-wrap font-mono text-sm"><code>{part}</code></pre>
                        ) : (
                            <p key={index} className="whitespace-pre-wrap">{part}</p>
                        )
                    )}
                </div>
            )}
            {message.image && (
            <div>
                <img src={message.image} alt="Generated content" className="mt-2 rounded-lg max-w-full h-auto" />
            </div>
            )}
        </div>

        {isModel && (
            <div className="mt-2 pl-1">
                <div className="flex items-center gap-3">
                     <button onClick={() => handleFeedbackClick('up')} title="Dobro" className={`transition-transform duration-150 ease-in-out hover:scale-125 ${message.feedback === 'up' ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'}`}>
                        <ThumbUpIcon />
                    </button>
                    <button onClick={() => handleFeedbackClick('down')} title="Loše" className={`transition-transform duration-150 ease-in-out hover:scale-125 ${message.feedback === 'down' ? 'text-red-400' : 'text-gray-500 hover:text-gray-300'}`}>
                        <ThumbDownIcon />
                    </button>
                </div>
                 {showCommentBox && message.feedback === 'down' && (
                    <form onSubmit={handleCommentSubmit} className="mt-2 flex items-center gap-2">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Dodaj komentar..."
                            className="w-full text-sm px-2 py-1 bg-gray-600 text-white border border-gray-500 rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                        />
                        <button type="submit" className="px-3 py-1 text-sm bg-amber-600 text-white rounded-md hover:bg-amber-500">
                            Pošalji
                        </button>
                    </form>
                )}
            </div>
        )}
      </div>
      {!isModel && <UserIcon />}
    </div>
  );
};

export default ChatMessageComponent;
