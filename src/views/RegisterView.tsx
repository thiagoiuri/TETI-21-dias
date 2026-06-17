import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Logo } from '../components/Logo';
import { Loader2 } from 'lucide-react';

export const RegisterView = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [memberCode, setMemberCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (memberCode.trim() !== 'membroteti') {
      setError('Código de membro inválido.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Criar o perfil inicial vazio
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        isMember: true,
        createdAt: new Date().toISOString(),
        profileCompleted: false,
        startDate: '',
        logs: {}
      });

    } catch (err: any) {
      console.error("FIREBASE REGISTRATION ERROR:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(`Erro: ${err.message || err.code || 'Desconhecido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 py-8 selection:bg-red-500/30 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        <Logo className="w-12 h-12 mb-8 opacity-80" />
        
        <div className="w-full text-center mb-10">
          <h1 className="text-2xl font-display font-medium text-white tracking-tight mb-2">Criar conta</h1>
          <p className="text-zinc-500 text-sm">Registre seu acesso exclusivo</p>
        </div>

        <form onSubmit={handleRegister} className="w-full space-y-5">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-medium">{error}</div>}
          
          <div>
            <input 
              type="text" 
              value={memberCode}
              onChange={(e) => setMemberCode(e.target.value)}
              required
              className="w-full bg-transparent border-b border-zinc-800 px-2 py-3 text-white focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600 text-sm"
              placeholder="Código de membro (ex: membroteti)"
            />
          </div>

          <div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-zinc-800 px-2 py-3 text-white focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600 text-sm"
              placeholder="E-mail"
            />
          </div>

          <div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-transparent border-b border-zinc-800 px-2 py-3 text-white focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600 text-sm"
              placeholder="Senha (mínimo 6 caracteres)"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-3.5 rounded-lg transition-colors mt-8 flex justify-center items-center h-12 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-4 w-full">
          <a 
            href="https://wa.me/5511999689395?text=Quero%20entrar%20para%20o%20TETI."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium py-3.5 rounded-lg transition-colors text-center text-xs"
          >
            Ainda não sou membro TETI
          </a>
        </div>

        <p className="mt-8 text-xs text-zinc-500">
          Já tem uma conta?{' '}
          <button onClick={onLoginClick} className="text-white font-medium hover:text-zinc-300 transition-colors">
            Fazer login
          </button>
        </p>

      </div>
    </div>
  );
};
