export interface Participant {
  id: string;
  name: string;
  gender: 'F' | 'M';
  age: number;
}

export interface ChatMessage {
  id: string;
  participantId: string;
  participantName: string;
  text: string;
  timestamp: number;
}

export interface Session {
  id: string;
  participants: Participant[];
  messages: ChatMessage[];
  videoUrl: string;
  isPlaying: boolean;
}
