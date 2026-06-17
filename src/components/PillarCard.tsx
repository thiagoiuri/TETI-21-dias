import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface PillarCardProps {
  title: string;
  subTitle: string;
  description: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export const PillarCard = ({ title, subTitle, description, icon, isActive, onClick }: PillarCardProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "bg-zinc-900/80 border rounded-2xl p-6 flex flex-col justify-between text-left transition-all duration-300 group overflow-hidden relative",
        isActive
          ? "border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.15)] bg-zinc-900/90"
          : "border-zinc-800 hover:border-red-600/50 bg-zinc-900/60"
      )}
    >
      <div className="flex justify-between items-start w-full relative z-10">
        <div>
          <p className="text-red-600 font-bold text-[10px] uppercase tracking-widest mb-1">{title}</p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tighter text-white">{subTitle}</h2>
          <p className="text-zinc-400 text-sm mt-2">{description}</p>
        </div>
        <div className={cn("p-3 rounded-xl transition-colors shrink-0", isActive ? "bg-red-600/20" : "bg-zinc-800")}>
           <div className={cn("w-6 h-6", isActive ? "text-red-500" : "text-zinc-500 group-hover:text-red-500 transition-colors")}>
             {icon}
           </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between w-full relative z-10">
        {isActive ? (
           <span className="text-emerald-400 font-mono text-sm tracking-tight">+ Progresso Registrado</span>
        ) : (
           <span className="text-zinc-500 font-mono text-sm tracking-tight">Pendente</span>
        )}
        <div className={cn(
          "px-4 py-2 font-bold rounded-lg text-sm transition-colors",
          isActive ? "bg-zinc-800 text-zinc-400 shadow-inner" : "bg-red-600 text-white shadow-lg shadow-red-900/20"
        )}>
          {isActive ? "CONCLUÍDO" : "VALIDAR"}
        </div>
      </div>
    </motion.button>
  );
};
