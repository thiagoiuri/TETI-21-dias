import { AppState, checkDayCompletion } from '../store';
import { addDays, formatDateBR } from '../lib/utils';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

interface JourneyViewProps {
  state: AppState;
}

export const JourneyView = ({ state }: JourneyViewProps) => {
  if (!state.startDate) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-black tracking-tighter text-white uppercase mb-2">A Jornada o Aguarda</h2>
        <p className="text-zinc-500 mb-6 max-w-sm">
          Complete seu primeiro hábito na aba "Hoje" para dar início ao seu ciclo de 21 dias.
        </p>
      </div>
    );
  }

  // Generate 21 days array based on start date
  const challengeDays = Array.from({ length: 21 }, (_, i) => {
    const dateStr = addDays(state.startDate!, i);
    const log = state.logs[dateStr];
    const isCompleted = checkDayCompletion(log);
    const isMissed = !isCompleted && new Date(dateStr) < new Date(new Date().toDateString());
    
    return {
      day: i + 1,
      dateStr,
      isCompleted,
      isMissed
    };
  });

  return (
    <div className="flex flex-col gap-6 pt-8 pb-8">
      <header className="mb-2">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase font-display">A <span className="text-red-600">Jornada</span></h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="h-[2px] w-8 bg-red-600"></div>
          <span className="text-zinc-400 font-bold text-xs tracking-widest uppercase">Mentoria 21 Dias</span>
        </div>
      </header>

      <div className="relative border-l-2 border-zinc-800 ml-4 lg:ml-8 pl-8 flex flex-col gap-6 mt-4">
        {challengeDays.map((d, index) => {
          let statusColor = "bg-zinc-950 border-zinc-700 text-zinc-500"; // default/pending
          let content = (
            <div className="text-xs font-bold w-full h-full flex items-center justify-center text-zinc-500">{d.day}</div>
          );
          
          if (d.isCompleted) {
            statusColor = "bg-zinc-950 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] scale-110 z-10";
            content = <div className="text-xs font-bold text-red-500 w-full h-full flex items-center justify-center">{d.day}</div>;
          } else if (d.isMissed) {
             statusColor = "bg-zinc-900 border-zinc-900 opacity-50";
             content = <div className="text-xs font-bold text-zinc-600 w-full h-full flex items-center justify-center">{d.day}</div>;
          }

          return (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              key={d.day} 
              className="relative w-full"
            >
              <div 
                className={cn(
                  "absolute -left-[49px] top-4 rounded-full border-2 transition-all w-10 h-10 shrink-0",
                  statusColor
                )}
              >
                {content}
              </div>
              
              <div className={cn(
                "rounded-2xl border p-5 transition-colors group ml-2", 
                d.isCompleted ? "border-red-900/30 bg-red-950/10 hover:border-red-600/50" : d.isMissed ? "border-zinc-800/50 bg-zinc-900/20" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
              )}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className={cn("font-bold uppercase tracking-widest", d.isCompleted ? "text-red-500" : "text-white")}>
                    DIA {d.day}
                  </h3>
                  <span className="text-[10px] text-zinc-500 font-mono tracking-widest">{formatDateBR(d.dateStr)}</span>
                </div>
                <p className="text-sm text-zinc-400 mt-2">
                  {d.isCompleted ? (
                     <span className="flex items-center gap-2 text-emerald-400"><Check className="w-4 h-4" /> Vitória conquistada</span>
                  ) : (d.isMissed ? "Estagnado." : "O dia te espera.")}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
