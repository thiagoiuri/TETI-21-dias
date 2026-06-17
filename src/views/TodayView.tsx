import { AppState } from '../store';
import { getTodayStr } from '../lib/utils';
import { EXERCISE_HABITS } from '../store';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from '../components/Logo';

interface TodayViewProps {
  state: AppState;
  onToggleHabit: (date: string, habitId: string) => void;
  dayOfChallenge: number;
}

export const TodayView = ({ state, onToggleHabit, dayOfChallenge }: TodayViewProps) => {
  const today = getTodayStr();
  const log = state.logs[today] || {};

  const dailyPoints = EXERCISE_HABITS.reduce((acc, habit) => {
    return acc + (log[habit.id] ? habit.points : 0);
  }, 0);

  const targetReached = dailyPoints >= 21;

  return (
    <div className="flex flex-col gap-6 pt-8">
      <header className="mb-2">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase font-display">MÉTODO <span className="text-red-600">TETI</span></h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="h-[2px] w-8 bg-red-600"></div>
          <span className="text-zinc-400 font-bold text-xs tracking-widest uppercase">
            {dayOfChallenge === 0 ? "A Jornada o aguarda" : `DIA ${dayOfChallenge}: AÇÃO CONTÍNUA`}
          </span>
        </div>
      </header>

      <div className="overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 relative">
        <div className="absolute -top-10 -right-10 w-48 h-48 opacity-[0.03] pointer-events-none mix-blend-screen scale-150">
          <Logo className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
            Status da Mentoria
          </h2>
          
          <div className="flex justify-between items-end gap-2 mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">{dayOfChallenge > 0 ? dayOfChallenge : 0}</span>
              {dayOfChallenge <= 21 && <span className="text-xl font-bold text-zinc-600">/ 21</span>}
            </div>
            {targetReached && (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold tracking-widest uppercase border border-emerald-500/20">Meta Atingida</span>
            )}
          </div>
          
          {dayOfChallenge <= 21 && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${dayOfChallenge > 0 ? Math.min((dayOfChallenge / 21) * 100, 100) : 0}%` }}
                className="h-full bg-red-600"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Hábitos Diários</h2>
        <div className="text-xs font-mono text-zinc-500">{dailyPoints} / 21 Pts</div>
      </div>

      <div className="flex flex-col gap-3 pb-8">
        {EXERCISE_HABITS.map((habit) => {
          const isActive = log[habit.id] || false;
          return (
            <div
              key={habit.id}
              onClick={() => onToggleHabit(today, habit.id)}
              className={cn(
                "group cursor-pointer rounded-2xl border p-4 transition-all duration-300 flex items-center justify-between gap-4",
                isActive 
                  ? "border-red-600/50 bg-red-950/20 shadow-[0_0_15px_rgba(220,38,38,0.15)]" 
                  : "border-zinc-800 bg-zinc-900/60 hover:border-red-600/30 hover:bg-zinc-900/80"
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 transition-all",
                  isActive ? "bg-red-600 border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" : "border-zinc-700 bg-zinc-900 group-hover:border-red-600/50"
                )}>
                  {isActive && <Check className="w-5 h-5 text-white" strokeWidth={3} />}
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-xs sm:text-sm font-bold transition-colors uppercase tracking-wide",
                    isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                  )}>
                    {habit.label}
                  </span>
                </div>
              </div>
              <div className={cn(
                "shrink-0 flex items-center justify-center px-2 py-1 rounded-md border transition-colors",
                isActive ? "bg-red-600/20 border-red-600/30" : "bg-zinc-900 border-zinc-800 group-hover:border-zinc-700"
              )}>
                <span className={cn(
                  "text-[10px] font-bold tracking-widest whitespace-nowrap",
                   isActive ? "text-red-400" : "text-zinc-500"
                )}>+{habit.points} PT{habit.points > 1 ? 'S' : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
