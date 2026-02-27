import { create } from 'zustand';
import { Participant, ChatMessage } from '@/types/session';

interface SessionState {
  sessionId: string | null;
  participants: Participant[];
  currentUser: Participant | null;
  messages: ChatMessage[];
  videoUrl: string;
  isPlaying: boolean;
  createSession: () => string;
  joinSession: (participant: Omit<Participant, 'id'>) => void;
  sendMessage: (text: string) => void;
  setVideoUrl: (url: string) => void;
  togglePlay: () => void;
  leaveSession: () => void;
  destroySession: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: null,
  participants: [],
  currentUser: null,
  messages: [],
  videoUrl: '',
  isPlaying: false,

  createSession: () => {
    const id = generateId();
    set({ sessionId: id, participants: [], messages: [], videoUrl: '', isPlaying: false });
    return id;
  },

  joinSession: (participant) => {
    const id = generateId();
    const newParticipant = { ...participant, id };
    set((state) => ({
      currentUser: newParticipant,
      participants: [...state.participants, newParticipant],
      sessionId: state.sessionId || generateId(),
    }));
  },

  sendMessage: (text) => {
    const { currentUser } = get();
    if (!currentUser) return;
    const message: ChatMessage = {
      id: generateId(),
      participantId: currentUser.id,
      participantName: currentUser.name,
      text,
      timestamp: Date.now(),
    };
    set((state) => ({ messages: [...state.messages, message] }));
  },

  setVideoUrl: (url) => set({ videoUrl: url }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  leaveSession: () => {
    const { currentUser } = get();
    if (!currentUser) return;
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== currentUser.id),
      currentUser: null,
    }));
  },

  destroySession: () => {
    set({
      sessionId: null,
      participants: [],
      currentUser: null,
      messages: [],
      videoUrl: '',
      isPlaying: false,
    });
  },
}));
