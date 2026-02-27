import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '@/stores/sessionStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, ArrowRight } from 'lucide-react';

const JoinSession = () => {
  const navigate = useNavigate();
  const { joinSession, participants } = useSessionStore();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'F' | 'M' | null>(null);
  const [age, setAge] = useState('');

  const canJoin = name.trim() && gender && age && parseInt(age) > 0;
  const isFull = participants.length >= 4;

  const handleJoin = () => {
    if (!canJoin || isFull) return;
    joinSession({ name: name.trim(), gender: gender!, age: parseInt(age) });
    navigate('/room');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Join the Party</h2>
          <p className="text-muted-foreground mt-2">
            {participants.length}/4 viewers in session
          </p>
        </div>

        <div className="space-y-6 bg-card rounded-xl p-6 border border-border glow-amber">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Your Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a temporary name..."
              className="bg-secondary border-border"
              maxLength={20}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">Gender</label>
            <div className="grid grid-cols-2 gap-3">
              {(['F', 'M'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-3 rounded-lg border text-sm font-medium transition-all ${
                    gender === g
                      ? 'bg-primary text-primary-foreground border-primary glow-amber'
                      : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'
                  }`}
                >
                  {g === 'F' ? '♀ Female' : '♂ Male'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Age</label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              className="bg-secondary border-border"
              min={1}
              max={120}
            />
          </div>

          <Button
            onClick={handleJoin}
            disabled={!canJoin || isFull}
            className="w-full py-6 text-base"
            size="lg"
          >
            {isFull ? 'Session is Full' : 'Enter Session'}
            {!isFull && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {participants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-card rounded-xl p-4 border border-border"
          >
            <p className="text-xs text-muted-foreground mb-3">Already in session:</p>
            <div className="flex flex-wrap gap-2">
              {participants.map((p) => (
                <span
                  key={p.id}
                  className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
                >
                  {p.name} ({p.gender}, {p.age})
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default JoinSession;
