import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound, ShieldAlert, Clock } from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { soundEngine } from '../../utils/audioSynth';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login, isLockedOut, lockoutRemainingSeconds } = useCms();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedOut) return;

    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      setIsLoading(false);

      if (result.success) {
        soundEngine.playSuccessTone();
      } else {
        soundEngine.playChime(320, 'sawtooth', 0.2);
        setError(result.error || 'Identifiants invalides.');
      }
    } catch {
      setIsLoading(false);
      setError('Une erreur est survenue lors de l’authentification.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4 selection:bg-[#FFE248]">
      
      {/* Background Decor */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-[#FFE248]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md card-modern bg-white p-8 relative z-10 space-y-6 shadow-[6px_6px_0px_#18181B]"
      >
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE248] border-2 border-[#18181B] flex items-center justify-center mx-auto text-2xl shadow-[2px_2px_0px_#18181B]">
            ☕
          </div>
          <h1 className="font-display font-black text-2xl text-[#18181B] tracking-tight">
            Administration SLAKE
          </h1>
          <p className="text-xs text-[#71717A] font-medium">
            Gestion du Restaurant & Éditeur de Contenu en Ligne
          </p>
        </div>

        {/* Security Shield Banner */}
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-[11px] text-[#18181B] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">Session Sécurisée SHA-256</span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-300">
            Protégé
          </span>
        </div>

        {/* Lockout Banner */}
        <AnimatePresence>
          {isLockedOut && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-xl bg-red-50 border-2 border-red-400 text-xs text-red-800 font-bold space-y-1"
            >
              <div className="flex items-center gap-1.5 text-red-900">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>Verrouillage de Sécurité Actif</span>
              </div>
              <p className="text-[11px] text-red-700 font-normal">
                Trop de tentatives infructueuses. Réessayez dans{' '}
                <strong className="font-mono text-red-900">{lockoutRemainingSeconds} secondes</strong>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && !isLockedOut && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-[#18181B]">
              Identifiant
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nom d’utilisateur"
                required
                disabled={isLockedOut || isLoading}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#18181B] text-sm text-[#18181B] focus:bg-[#FFFDF5] focus:outline-none transition-colors disabled:bg-zinc-100 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-[#18181B]">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLockedOut || isLoading}
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border-2 border-[#18181B] text-sm text-[#18181B] focus:bg-[#FFFDF5] focus:outline-none transition-colors disabled:bg-zinc-100 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#18181B] p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isLockedOut}
            className="w-full btn-yellow py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#18181B] mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <KeyRound className="w-4 h-4" />
            <span>
              {isLockedOut
                ? `Verrouillé (${lockoutRemainingSeconds}s)`
                : isLoading
                ? 'Authentification...'
                : 'Connexion à l’administration'}
            </span>
          </button>
        </form>

        {/* Back to Site */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onBackToSite}
            className="text-xs font-bold text-[#71717A] hover:text-[#18181B] inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retourner au site public</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};
