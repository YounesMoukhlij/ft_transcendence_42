export interface Conversation {
  conversation_id: number;
  members: string;
  block_user: string;
  is_double_block: number;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender: string;
}

export interface EmojiClickData {
  emoji: string;
}



export interface Message{
  sender_user_id: number;
  message: string;
  conv_id: number;
  created_at: string;
  isSeen: boolean;
}