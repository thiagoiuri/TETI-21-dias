import { Play } from 'lucide-react';
import { AppState } from '../store';
import { cn } from '../lib/utils';
import { useState } from 'react';

const LESSONS = [
  { day: 1, title: 'INTRODUÇÃO', url: 'https://www.youtube.com/embed/s2QM2ZefkOE' },
  { day: 2, title: 'EXERCICIOS PRÁTICOS', url: 'https://www.youtube.com/embed/QneI2Jn99x0' },
  { day: 3, title: 'HIGIENE SOCIAL', url: 'https://www.youtube.com/embed/mEfPMADr1oo' },
  { day: 4, title: 'HIGIENE DO SONO', url: 'https://www.youtube.com/embed/YRfx-USwD0w' },
  { day: 5, title: 'ALIMENTAÇÃO SAUDÁVEL', url: 'https://www.youtube.com/embed/vyvLAEfSHiM' },
  { day: 6, title: 'MEDITAÇÃO ZEN', url: 'https://www.youtube.com/embed/6bBKnB2SsTk' },
  { day: 7, title: 'FILOSOFIA ZEN', url: 'https://www.youtube.com/embed/C2J3cuUbUSg' },
  { day: 8, title: 'HÁBITOS PRODUTIVOS', url: 'https://www.youtube.com/embed/pbrK5WZlxDA' },
  { day: 9, title: 'DINHEIRO', url: 'https://www.youtube.com/embed/vpsn2DGP0tQ' },
  { day: 10, title: 'TÉCNICA DE ECONOMIA 01', url: 'https://www.youtube.com/embed/X4HCf2TveiY' },
  { day: 11, title: 'TÉCNICA DE ECONOMIA 02', url: 'https://www.youtube.com/embed/uhQug_fQ38E?start=185' },
  { day: 12, title: 'INTRODUÇÃO AOS INVESTIMENTOS', url: 'https://www.youtube.com/embed/x9e68Ggb-X8' },
  { day: 13, title: 'RESERVA DE LIQUIDEZ E EMERGÊNCIA', url: 'https://www.youtube.com/embed/fXF-ePGIFZQ' },
  { day: 14, title: 'MERCADO DE AÇÕES', url: 'https://www.youtube.com/embed/n60VMzSrnX0' },
  { day: 15, title: 'FUNDOS IMOBILIÁRIOS', url: 'https://www.youtube.com/embed/5hJauQrJZdk' },
  { day: 16, title: 'APOSENTADORIA', url: 'https://www.youtube.com/embed/Mm8E4t-qw10' },
  { day: 17, title: 'BITCOIN E CRIPTOMOEDAS', url: 'https://www.youtube.com/embed/giZhLSUh978' },
  { day: 18, title: 'MONTANDO CARTEIRA DE INVESTIMENTOS', url: 'https://www.youtube.com/embed/bJzdD9o44cw' },
  { day: 19, title: 'INVESTINDO NA PRÁTICA', url: 'https://www.youtube.com/embed/WMIskG8D5c8' },
  { day: 20, title: 'INTRODUÇÃO AO IMATERIAL', url: 'https://www.youtube.com/embed/U7X-ZcHez9U' },
  { day: 21, title: 'CONSIDERAÇÕES FINAIS', url: 'https://www.youtube.com/embed/lLQJjhSZ_ok' },
];

interface LessonsViewProps {
  dayOfChallenge: number;
}

export const LessonsView = ({ dayOfChallenge }: LessonsViewProps) => {
  const [activeLesson, setActiveLesson] = useState<number | null>(null);

  // Users can only access lessons up to their current challenge day 
  // (unless challenge not started yet, then we'll show just day 1 or all locked, 
  // let's show day 1 as unlocked so they can watch intro).
  const maxUnlockedsDay = Math.max(1, dayOfChallenge);

  return (
    <div className="flex flex-col gap-6 pt-8 pb-8">
      <header className="mb-6">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase font-display">AULAS <span className="text-red-600">TETI</span></h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="h-[2px] w-8 bg-red-600"></div>
          <span className="text-zinc-400 font-bold text-xs tracking-widest uppercase">Conteúdo da Mentoria</span>
        </div>
      </header>
      
      {activeLesson && (
        <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black sticky top-4 z-20 shadow-2xl">
           <div className="relative pt-[56.25%] w-full">
              <iframe 
                src={LESSONS.find(l => l.day === activeLesson)?.url} 
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
           </div>
           <div className="p-4 flex justify-between items-center bg-zinc-950 border-t border-zinc-900">
             <h3 className="font-bold text-white uppercase tracking-wider text-sm">Aula {activeLesson}</h3>
             <button 
               onClick={() => setActiveLesson(null)}
               className="text-xs font-bold text-red-500 uppercase tracking-widest px-3 py-1 bg-red-500/10 rounded border border-red-500/20"
             >
               Fechar
             </button>
           </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {LESSONS.map((lesson) => {
          const isUnlocked = lesson.day <= maxUnlockedsDay;
          const isPlaying = activeLesson === lesson.day;
          
          return (
            <div 
              key={lesson.day}
              onClick={() => {
                if (isUnlocked) setActiveLesson(lesson.day);
              }}
              className={cn(
                "rounded-xl border p-4 transition-all flex items-center justify-between gap-4",
                isUnlocked ? "cursor-pointer hover:border-zinc-700" : "opacity-50 cursor-not-allowed",
                isPlaying ? "border-red-600 bg-red-600/5" : "border-zinc-800 bg-zinc-900/40"
              )}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border",
                  isPlaying ? "bg-red-600 border-red-600 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                )}>
                  {isUnlocked ? <Play className={cn("w-5 h-5", isPlaying ? "fill-white" : "")} /> : <span className="text-xs font-mono">{lesson.day}</span>}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Dia {lesson.day}</span>
                  <h3 className={cn(
                    "text-sm font-bold uppercase transition-colors",
                    isPlaying ? "text-white" : "text-zinc-300"
                  )}>
                    {lesson.title}
                  </h3>
                </div>
              </div>
              {!isUnlocked && (
                <div className="shrink-0">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Travado</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};
