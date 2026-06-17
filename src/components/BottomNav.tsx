import { CalendarDays, Home, User, Video } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export type Tab = 'today' | 'journey' | 'profile' | 'lessons';

interface BottomNavProps {
  currentTab: Tab;
  onChange: (tab: Tab) => void;
}

export const BottomNav = ({ currentTab, onChange }: BottomNavProps) => {
  const tabs = [
    { id: 'today', label: 'Hoje', icon: Home },
    { id: 'journey', label: 'Jornada', icon: CalendarDays },
    { id: 'lessons', label: 'Aulas', icon: Video },
    { id: 'profile', label: 'Perfil', icon: User },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-md pb-safe">
      <div className="mx-auto flex max-w-xl items-center justify-around px-6 py-3">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id as Tab)}
              className="relative flex flex-col items-center justify-center p-2 text-xs group w-full"
            >
              <div className="relative mb-1 flex h-10 w-full items-center justify-center">
                {isActive && (
                  <motion.div
                    layoutId="pill"
                    className="absolute inset-0 rounded-xl bg-red-600/10 border border-red-600/20"
                  />
                )}
                <Icon
                  className={cn(
                    "relative z-10 w-5 h-5 transition-colors",
                    isActive ? "text-red-500" : "text-zinc-500 group-hover:text-zinc-300"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className={cn(
                  "font-bold transition-colors tracking-widest text-[9px] uppercase",
                  isActive ? "text-red-500" : "text-zinc-500 group-hover:text-zinc-300"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
