import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '@/stores/sessionStore';
import { Film, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const Landing = () => {
  const navigate = useNavigate();
  const createSession = useSessionStore((s) => s.createSession);

  const handleCreate = () => {
    createSession();
    navigate('/join');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8"
        >
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">No login. No trace. Just vibes.</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          <span className="text-gradient">WatchWith</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          Binge-watch together in ephemeral sessions. Once you leave, everything vanishes.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={handleCreate}
            className="glow-amber text-lg px-8 py-6"
          >
            <Film className="w-5 h-5 mr-2" />
            Start a Session
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-8 text-muted-foreground text-sm"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>1–4 viewers</span>
          </div>
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            <span>Any video</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Zero storage</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;
