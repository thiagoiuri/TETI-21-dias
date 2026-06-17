import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';
import { Loader2 } from 'lucide-react';

export const ProfileSetupView = () => {
  const { user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [mainObjective, setMainObjective] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError('');
    setLoading(true);

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        fullName,
        nickname,
        birthDate,
        mainObjective,
        profileCompleted: true
      });
      await refreshProfile();
    } catch (err: any) {
      setError('Erro ao salvar o perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 py-8 selection:bg-red-500/30 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        <Logo className="w-12 h-12 mb-8 opacity-80" />
        
        <div className="w-full text-center mb-10">
          <h1 className="text-2xl font-display font-medium text-white tracking-tight mb-2">Complete seu Perfil</h1>
          <p className="text-zinc-500 text-sm">Para personalizar sua experiência</p>
        </div>

        <form onSubmit={handleSave} className="w-full space-y-5">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-medium">{error}</div>}
          
          <div>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-transparent border-b border-zinc-800 px-2 py-3 text-white focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600 text-sm"
              placeholder="Nome Completo"
            />
          </div>

          <div>
            <input 
              type="text" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full bg-transparent border-b border-zinc-800 px-2 py-3 text-white focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600 text-sm"
              placeholder="Apelido (como quer ser chamado)"
            />
          </div>

          <div>
            <input 
              type="date" 
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full bg-transparent border-b border-zinc-800 px-2 py-3 text-zinc-400 focus:outline-none focus:border-zinc-400 focus:text-white transition-colors text-sm"
            />
          </div>

          <div>
            <textarea 
              value={mainObjective}
              onChange={(e) => setMainObjective(e.target.value)}
              required
              rows={3}
              className="w-full bg-transparent border-b border-zinc-800 px-2 py-3 text-white focus:outline-none focus:border-zinc-400 transition-colors resize-none placeholder:text-zinc-600 text-sm"
              placeholder="Principal Objetivo com o TETI (Ex: Ter mais disciplina)"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-3.5 rounded-lg transition-colors mt-8 flex justify-center items-center h-12 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Salvar Perfil'}
          </button>
        </form>
      </div>
    </div>
  );
};
