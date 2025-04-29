import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface MessageInputProps {
  conversationId: string | null;
  onSendMessage: (content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && conversationId) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversationId) {
    return null;
  }

  return (
    <div className="p-4 border-t border-gray-700 bg-gray-800">
      <div className="flex items-end space-x-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-grow bg-gray-700 border-gray-600 text-white resize-none"
          rows={3}
        />
        <Button 
          onClick={handleSend} 
          disabled={!message.trim()} 
          className="bg-white text-black hover:bg-gray-200"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
