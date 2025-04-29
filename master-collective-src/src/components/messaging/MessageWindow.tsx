import React from 'react';
import { Message } from '@/lib/db/schema'; // Assuming schema types are defined

// Mock messages for a conversation - replace with actual data later
const mockMessages: (Message & { senderName: string })[] = [
  { id: 'msg1', conversationId: 'conv1', senderId: 'user1', recipientId: 'user2', content: 'Hi there, interested in learning more about your company.', sentAt: new Date(Date.now() - 1000 * 60 * 5), readAt: null, senderName: 'Investor A' },
  { id: 'msg2', conversationId: 'conv1', senderId: 'user2', recipientId: 'user1', content: 'Hello Investor A, thanks for reaching out! Happy to share more details.', sentAt: new Date(Date.now() - 1000 * 60 * 3), readAt: null, senderName: 'Company X' },
  { id: 'msg3', conversationId: 'conv1', senderId: 'user1', recipientId: 'user2', content: 'Sounds interesting, let us connect.', sentAt: new Date(Date.now() - 1000 * 60 * 1), readAt: null, senderName: 'Investor A' },
];

interface MessageWindowProps {
  conversationId: string | null;
}

const MessageWindow: React.FC<MessageWindowProps> = ({ conversationId }) => {
  if (!conversationId) {
    return <div className="flex items-center justify-center h-full text-gray-500">Select a conversation to view messages</div>;
  }

  // TODO: Fetch actual messages based on conversationId
  const messages = mockMessages.filter(msg => msg.conversationId === conversationId);
  const currentUserId = 'user2'; // Mock current user ID

  return (
    <div className="flex flex-col h-full">
      {/* Header for the conversation - could show participant name */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <h4 className="font-semibold text-white">Conversation with {messages[0]?.senderId === currentUserId ? messages[0]?.recipientId : messages[0]?.senderName}</h4>
      </div>

      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs lg:max-w-md ${message.senderId === currentUserId ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}
            >
              <p>{message.content}</p>
              <p className="text-xs text-gray-400 mt-1 text-right">{message.sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageWindow;
