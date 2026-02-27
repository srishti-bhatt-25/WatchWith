import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '@/stores/sessionStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send, Play, Pause, Link, Users, LogOut, Trash2, MessageCircle,
} from 'lucide-react';

const WatchRoom = () => {
  const navigate = useNavigate();
  const {
    currentUser, participants, messages, videoUrl, isPlaying,
    sendMessage, setVideoUrl, togglePlay, leaveSession, destroySession,
  } = useSessionStore();

  const [chatInput, setChatInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!currentUser) navigate('/');
  }, [currentUser, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.play().catch(() => {}) : videoRef.current.pause();
    }
  }, [isPlaying]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    sendMessage(chatInput.trim());
    setChatInput('');
  };

  const handleSetVideo = () => {
    if (urlInput.trim()) {
      setVideoUrl(urlInput.trim());
      setUrlInput('');
    }
  };

  const handleDestroy = () => {
    destroySession();
    navigate('/');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  if (!currentUser) return null;

  return (
    <div className="h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Video Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Video */}
        <div className="flex-1 bg-card relative flex items-center justify-center">
          {videoUrl ? (
            embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                controls
              />
            )
          ) : (
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Play className="w-10 h-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">Paste a video URL below to start watching</p>
              <p className="text-muted-foreground/60 text-sm mt-1">YouTube links or direct video files</p>
            </div>
          )}
        </div>

        {/* Video URL Bar */}
        <div className="p-3 bg-card border-t border-border flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste video URL (YouTube or direct link)..."
            className="bg-secondary border-border flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSetVideo()}
          />
          <Button onClick={handleSetVideo} size="icon" variant="secondary">
            <Link className="w-4 h-4" />
          </Button>
          {videoUrl && (
            <Button onClick={togglePlay} size="icon" variant="secondary">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border flex flex-col bg-card h-64 md:h-auto">
        {/* Participants */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Viewers ({participants.length}/4)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {participants.map((p) => (
              <div
                key={p.id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  p.id === currentUser.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {p.name} {p.gender === 'F' ? '♀' : '♂'}
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground/50 text-sm">Chat while you watch</p>
            </div>
          )}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${
                msg.participantId === currentUser.id ? 'text-right' : ''
              }`}
            >
              <span className="text-xs text-primary font-medium">{msg.participantName}</span>
              <p className={`text-sm mt-0.5 px-3 py-2 rounded-lg inline-block max-w-[90%] ${
                msg.participantId === currentUser.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {msg.text}
              </p>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-border flex gap-2">
          <Input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Say something..."
            className="bg-secondary border-border flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="p-3 border-t border-border flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => { leaveSession(); navigate('/'); }}
          >
            <LogOut className="w-3 h-3 mr-1" /> Leave
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={handleDestroy}
          >
            <Trash2 className="w-3 h-3 mr-1" /> End Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WatchRoom;
