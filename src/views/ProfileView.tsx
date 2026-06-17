import React, { useState } from 'react';
import { AppState, calculateStats } from '../store';
import { Logo } from '../components/Logo';
import { motion } from 'motion/react';
import { Flame, Star, Target, Zap, Medal, LogOut, Camera, X } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

import maleAvatar from '../assets/images/avatar_male_1_1781730774594.jpg';
import femaleAvatar from '../assets/images/avatar_female_1_1781730787055.jpg';
import lionAvatar from '../assets/images/avatar_lion_1781730798800.jpg';
import wolfAvatar from '../assets/images/avatar_wolf_1781730809507.jpg';

interface ProfileViewProps {
  state: AppState;
  onReset: () => void;
}

export const ProfileView = ({ state, onReset }: ProfileViewProps) => {
  const stats = calculateStats(state);
  const { profile, refreshProfile } = useAuth();
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  const avatars = [
    { id: 'male', src: maleAvatar },
    { id: 'female', src: femaleAvatar },
    { id: 'lion', src: lionAvatar },
    { id: 'wolf', src: wolfAvatar },
  ];

  const handleSelectAvatar = async (src: string) => {
    if (!profile) return;
    setUpdatingAvatar(true);
    try {
      await updateDoc(doc(db, 'users', profile.uid), {
        photoURL: src
      });
      await refreshProfile();
      setIsEditingAvatar(false);
    } catch (err) {
      console.error("Avatar failed:", err);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleConfirmReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await auth.signOut();
  };

  const BADGES = [
    { id: 'step1', title: 'Primeiro Passo', desc: 'Conclua o Dia 1', unlocked: stats.completedDays >= 1 },
    { id: 'const7', title: 'Constância', desc: '7 Dias Seguidos', unlocked: stats.streak >= 7 },
    { id: 'half', title: 'Meio Caminho', desc: '10 Dias Concluídos', unlocked: stats.completedDays >= 10 },
    { id: 'iron', title: 'Disciplina de Ferro', desc: '14 Dias Seguidos', unlocked: stats.streak >= 14 },
    { id: 'lion', title: 'Leão de TETI', desc: '21 Dias Concluídos', unlocked: stats.completedDays >= 21 },
  ];

  return (
    <div className="flex flex-col gap-6 pt-8 pb-8">
      <header className="mb-4">
        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase font-display">MEU <span className="text-red-600">PERFIL</span></h1>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 text-zinc-500 hover:text-white bg-zinc-900 border border-zinc-800 rounded-xl transition-colors"
            title="Sair da conta"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-2 mb-6">
          <div className="h-[2px] w-8 bg-red-600"></div>
          <span className="text-zinc-400 font-bold text-xs tracking-widest uppercase">Estatísticas e Conquistas</span>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center pb-0">
        <div className="relative mb-6 group">
          <div className="w-28 h-28 bg-zinc-950 border-2 border-red-900/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.2)] p-2 overflow-hidden">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <Logo className="w-full h-full scale-125 object-contain" />
            )}
          </div>
          <button 
            onClick={() => setIsEditingAvatar(true)}
            className="absolute bottom-0 right-0 p-2 bg-red-600 rounded-full hover:bg-red-500 transition-colors shadow-lg border-2 border-zinc-950"
          >
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-white mb-1 uppercase font-display">{profile?.nickname || 'O Leão de TETI'}</h1>
        <p className="text-sm text-red-500 font-bold tracking-widest uppercase mb-6">Nível {stats.level} • {stats.totalPoints} XP</p>
      </div>

      {/* Level Progress */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mb-2 hover:border-zinc-700 transition-colors">
        <div className="flex justify-between items-end mb-3">
           <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Progresso de Nível</p>
           <p className="text-sm font-bold font-mono">
             {stats.totalPoints} / {stats.nextLevelPoints} XP
           </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stats.progressToNextLevel * 100}%` }}
            className="h-full bg-red-600 rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          icon={<Flame className="w-6 h-6 text-red-500 fill-red-500/20" />}
          label="Sequência"
          value={`${stats.streak} Dias`}
        />
        <StatCard 
          icon={<Star className="w-6 h-6 text-amber-500 fill-amber-500/20" />}
          label="Vitórias"
          value={`${stats.completedDays} Dias`}
        />
        <StatCard 
          icon={<Zap className="w-6 h-6 text-zinc-100 fill-zinc-100/20" />}
          label="Total XP"
          value={stats.totalPoints.toString()}
        />
        <StatCard 
          icon={<Target className="w-6 h-6 text-emerald-500 fill-emerald-500/20" />}
          label="Jornada"
          value={stats.currentDayOfChallenge > 0 ? `Dia ${stats.currentDayOfChallenge}` : 'Início'}
        />
      </div>

      {/* Progress Chart */}
      {stats.chartData.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mt-2 grid gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Progresso por Pilar (Últimos Dias)</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#71717a' }} 
                  dy={10}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="Trabalhar" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Estudar" stackId="a" fill="#a855f7" />
                <Bar dataKey="Investir" stackId="a" fill="#10b981" />
                <Bar dataKey="Treinar" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-[10px] uppercase font-bold text-zinc-400">Trabalhar</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500" /> <span className="text-[10px] uppercase font-bold text-zinc-400">Estudar</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[10px] uppercase font-bold text-zinc-400">Investir</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-[10px] uppercase font-bold text-zinc-400">Treinar</span></div>
          </div>
        </div>
      )}

      {/* Badges / Conquistas */}
      <div className="mt-2">
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Conquistas</h2>
        <div className="flex flex-col gap-3">
          {BADGES.map(badge => (
            <div key={badge.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${badge.unlocked ? 'bg-zinc-900 border-red-900/30' : 'bg-black border-zinc-900 opacity-60 grayscale'}`}>
               <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 ${badge.unlocked ? 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-zinc-800 bg-zinc-900'}`}>
                 <Medal className={`w-6 h-6 ${badge.unlocked ? 'text-red-500' : 'text-zinc-600'}`} />
               </div>
               <div>
                  <h3 className={`text-sm font-bold uppercase tracking-wide ${badge.unlocked ? 'text-white' : 'text-zinc-500'}`}>{badge.title}</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${badge.unlocked ? 'text-red-400' : 'text-zinc-600'}`}>{badge.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => setShowResetConfirm(true)}
          className="text-xs font-bold tracking-widest cursor-pointer uppercase px-6 py-3 rounded-xl border border-red-900/30 text-red-500/80 hover:bg-red-950/40 hover:text-red-500 transition-colors"
        >
          Resetar Jornada
        </button>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm relative text-center">
            <h2 className="text-xl font-bold text-white mb-2 font-display uppercase">Atenção, Leão!</h2>
            <p className="text-sm text-zinc-400 mb-6">Tem certeza que deseja zerar sua jornada? Isso não pode ser desfeito.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmReset}
                className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold uppercase tracking-widest text-white transition-colors"
              >
                Sim, Resetar
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="w-full py-3 bg-transparent hover:bg-zinc-800 border border-zinc-700 rounded-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm relative text-center">
            <h2 className="text-xl font-bold text-white mb-2 font-display uppercase">Sair da Conta</h2>
            <p className="text-sm text-zinc-400 mb-6">Tem certeza que deseja sair agora?</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleConfirmLogout}
                className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold uppercase tracking-widest text-white transition-colors"
              >
                Sair
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-3 bg-transparent hover:bg-zinc-800 border border-zinc-700 rounded-xl font-bold uppercase tracking-widest text-zinc-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingAvatar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm relative">
            <button 
              onClick={() => setIsEditingAvatar(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6 font-display uppercase text-center">Escolha seu Avatar</h2>
            
            <div className="grid grid-cols-2 gap-4">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handleSelectAvatar(avatar.src)}
                  disabled={updatingAvatar}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    profile?.photoURL === avatar.src 
                      ? 'border-red-500 scale-105 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                      : 'border-zinc-800 hover:border-zinc-600 grayscale hover:grayscale-0'
                  }`}
                >
                  <img src={avatar.src} alt="Opção de avatar" className="w-full h-full object-cover" />
                  {updatingAvatar && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <p className="text-xs text-zinc-500 mt-6 text-center">Mais avatares em breve.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex flex-col justify-between rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors p-6">
    <div className="bg-zinc-800/80 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-zinc-700">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{label}</p>
      <p className="text-2xl font-black text-white font-display">{value}</p>
    </div>
  </div>
);
