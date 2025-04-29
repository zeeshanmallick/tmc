import React from 'react';

// Mock data for conversations - replace with actual data later
const mockConversations = [
  { id: 'conv1', participantName: 'Investor A', lastMessage: 'Sounds interesting, let us connect.', unread: true },
  { id: 'conv2', participantName: 'Company B', lastMessage: 'Thanks for reaching out!', unread: false },
  { id: 'conv3', participantName: 'Investor C', lastMessage: 'Can you share your pitch deck?', unread: false },
];

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelectConversation }) => {
  return (
    <div className="bg-gray-800 border-r border-gray-700 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-white p-4 border-b border-gray-700">Messages</h3>
      <ul>
        {mockConversations.map((conv) => (
          <li
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${conv.unread ? 'bg-gray-700 font-semibold' : ''}`}
          >
            <p className="text-white">{conv.participantName}</p>
            <p className={`text-sm ${conv.unread ? 'text-white' : 'text-gray-400'} truncate`}>{conv.lastMessage}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
