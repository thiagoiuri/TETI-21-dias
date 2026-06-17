import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Logo } from '../components/Logo';
import { Loader2 } from 'lucide-react';

export const LoginView = ({ onRegisterClick }: { onRegisterClick: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("FIREBASE LOGIN ERROR:", err);
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 selection:bg-red-500/30 font-sans">
      <div className="w-full max-w-sm flex flex-col items-center">
        
        <Logo className="w-12 h-12 mb-8 opacity-80" />
        
        <div className="w-full text-center mb-10">
          <h1 className="text-2xl font-display font-medium text-white tracking-tight mb-2">Seja bem vindo(a)</h1>
          <p className="text-zinc-500 text-sm">Acesse sua área de membro</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-5">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-medium">{error}</div>}
          
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
              className="w-full bg-transparent border-b border-zinc-800 px-2 py-3 text-white focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600 text-sm"
              placeholder="Senha"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-3.5 rounded-lg transition-colors mt-8 flex justify-center items-center h-12 text-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Entrar'}
          </button>
        </form>

        <p className="mt-8 text-xs text-zinc-500">
          Ainda não tem acesso?{' '}
          <button onClick={onRegisterClick} className="text-white hover:text-zinc-300 transition-colors font-medium">
            Registrar-se
          </button>
        </p>
      </div>
    </div>
  );
};
