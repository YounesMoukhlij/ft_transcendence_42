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

export interface friendType{
  bio  : string;
  blockedByUser1  : number;
  blockedByUser2  : number;
  conversation_id  : number;
  fullname  : string;
  id_user  : number;
  lastMessage  : string;
  lastMessageSender  : number;
  lastMessageTime  : string;
  lastseen : string;
  pinnedDateUser1 : string;
  pinnedDateUser2 : string;
  pinnedUser1 : number;
  pinnedUser2 : number;
  profile_img : string;
  status : boolean;
  username : string;
  xp : number;
  isBot: boolean;
}

export interface friendRequestType{
  expired: string;
  notify_id:number;
  sender_profile_img:string;
  sender_user:number;
  sender_username:string;
  title:string;
}