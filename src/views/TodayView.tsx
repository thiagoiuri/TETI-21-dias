import { AppState } from '../store';
import { getTodayStr } from '../lib/utils';
import { EXERCISE_HABITS } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronDown, ChevronUp, Play, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from '../components/Logo';
import { useState } from 'react';
import { LESSONS } from './LessonsView';

interface TodayViewProps {
  state: AppState;
  onToggleHabit: (date: string, habitId: string) => void;
  dayOfChallenge: number;
  onStartChallenge: () => void;
  onMarkLessonCompleted: (day: number) => void;
}

const MOTIVATIONAL_QUOTES = [
  "A disciplina é a ponte entre seus objetivos e suas realizações.",
  "Não existe atalho para o sucesso, existe o Método TETI.",
  "O sacrifício de hoje é a força de amanhã.",
  "A dor do esforço é temporária, a dor do arrependimento é para sempre.",
  "Seu progresso é medido pelas suas ações diárias.",
  "Um dia de cada vez. Uma vitória de cada vez.",
  "O verdadeiro desafio não é começar, é manter o ritmo.",
  "Grandes resultados nascem da execução implacável do básico.",
  "Você é o único responsável pela sua jornada.",
  "Mentalidade forte, execução perfeita. Siga o método.",
  "Não pare quando estiver cansado, pare quando terminar.",
  "Sua mente desiste antes do seu corpo. Mostre quem manda.",
  "O sucesso deixa pistas. O método é o mapa.",
  "A consistência supera o talento quando o talento não é consistente.",
  "Você está a um passo da sua melhor versão.",
  "Cada ponto conta. Cada escolha molda seu futuro.",
  "Aja hoje como a pessoa que você deseja ser amanhã.",
  "O método funciona se você trabalha.",
  "Ame o processo e os resultados chegarão.",
  "Ação contínua vence a ansiedade paralisante.",
  "Resiliência não é sobre não cair, é sobre levantar mais rápido.",
];

export const TodayView = ({ state, onToggleHabit, dayOfChallenge, onStartChallenge, onMarkLessonCompleted }: TodayViewProps) => {
  const today = getTodayStr();
  const log = state.logs[today] || {};
  
  const [showHabits, setShowHabits] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const dailyPoints = EXERCISE_HABITS.reduce((acc, habit) => {
    return acc + (log[habit.id] ? habit.points : 0);
  }, 0);

  const targetReached = dailyPoints >= 21;
  const lessonOfDay = LESSONS.find(l => l.day === Math.max(1, Math.min(dayOfChallenge, 21))) || LESSONS[0];
  const isLessonCompleted = state.completedLessons[lessonOfDay.day];

  const todaysQuote = MOTIVATIONAL_QUOTES[dayOfChallenge % MOTIVATIONAL_QUOTES.length];

  return (
    <div className="flex flex-col gap-6 pt-8">
      <header className="mb-2">
        <h1 className="text-4xl font-black tracking-tighter text-white uppercase font-display">DESAFIO <span className="text-red-600">TETI</span></h1>
        <div className="flex items-center gap-4 mt-2">
          <div className="h-[2px] w-8 bg-red-600"></div>
          <span className="text-zinc-400 font-bold text-xs tracking-widest uppercase">
            {dayOfChallenge === 0 ? "A Jornada o aguarda" : `DIA ${dayOfChallenge}: AÇÃO CONTÍNUA`}
          </span>
        </div>
      </header>

      {dayOfChallenge > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
          <p className="text-xs font-medium text-zinc-300 italic">"{todaysQuote}"</p>
          <span className="text-[9px] font-bold tracking-widest uppercase text-red-500 mt-2 block">
            Frase do Dia
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 relative">
        <div className="absolute -top-10 -right-10 w-48 h-48 opacity-[0.03] pointer-events-none mix-blend-screen scale-150">
          <Logo className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
            Status da Jornada
          </h2>
          
          <div className="flex justify-between items-end gap-2 mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">{dayOfChallenge > 0 ? Math.min(dayOfChallenge, 21) : 0}</span>
              <span className="text-xl font-bold text-zinc-600">/ 21</span>
            </div>
            {targetReached && dayOfChallenge > 0 && (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold tracking-widest uppercase border border-emerald-500/20">Meta Atingida</span>
            )}
          </div>
          
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${dayOfChallenge > 0 ? Math.min((dayOfChallenge / 21) * 100, 100) : 0}%` }}
              className="h-full bg-red-600"
            />
          </div>
        </div>
      </div>

      {dayOfChallenge === 0 && (
        <button
          onClick={onStartChallenge}
          className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold uppercase tracking-widest text-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)] mt-2"
        >
          <Play className="w-5 h-5 fill-white" />
          Iniciar Jornada
        </button>
      )}

      {dayOfChallenge > 0 && (
        <div className="flex flex-col gap-8 mt-2">
          {/* Aula do dia */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Aula do Dia</h2>
            
            {!showVideo ? (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center mb-1 relative">
                  <Play className="w-5 h-5 text-red-500 fill-red-500" />
                  {isLessonCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border border-zinc-900">
                      <Check className="w-3 h-3 text-black font-bold" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 uppercase">Dia {lessonOfDay.day}: {lessonOfDay.title}</h3>
                  <p className="text-xs text-zinc-400">
                    {isLessonCompleted ? "Você já concluiu a aula de hoje." : "Assista ao conteúdo diário antes de iniciar seus hábitos."}
                  </p>
                </div>
                <button
                  onClick={() => setShowVideo(true)}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold uppercase tracking-widest text-white transition-colors mt-2 text-xs"
                >
                  Assistir Desafio do Dia
                </button>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-2xl relative">
                <div className="relative pt-[56.25%] w-full">
                  <iframe 
                    src={lessonOfDay.url} 
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4 flex flex-col gap-3 bg-zinc-950 border-t border-zinc-900">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                      Aula {lessonOfDay.day}
                      {isLessonCompleted && <Check className="w-4 h-4 text-emerald-500" />}
                    </h3>
                    <button 
                      onClick={() => setShowVideo(false)}
                      className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-1.5 bg-zinc-900 rounded border border-zinc-800"
                    >
                      Fechar
                    </button>
                  </div>
                  {!isLessonCompleted && (
                    <button 
                      onClick={() => {
                        onMarkLessonCompleted(lessonOfDay.day);
                        setShowVideo(false);
                      }}
                      className="w-full text-xs font-bold text-emerald-500 uppercase tracking-widest px-3 py-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                    >
                      Marcar Aula como Concluída
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Habitos Diarios */}
          <div className="flex flex-col gap-4 pb-8">
            <p className="text-xs text-zinc-400/80 leading-relaxed text-center px-4 mb-2">
              Você deve completar 21 pontos para validar o seu dia na jornada e avançar no desafio, para cada dia você terá uma aula e para liberar a aula de amanhã, você deve assistir a de hoje e completar os 21 pontos.
            </p>
            <div 
              className="flex items-center justify-between cursor-pointer group bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all"
              onClick={() => setShowHabits(!showHabits)}
            >
              <div className="flex flex-col">
                <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-2">
                  Hábitos Diários
                  {showHabits ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                </h2>
                <div className="text-[10px] font-bold text-red-500 tracking-widest uppercase mt-1">Toque para {showHabits ? 'esconder' : 'revelar'}</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs font-mono text-zinc-500 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                  {dailyPoints} / 21 Pts
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showHabits && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-3 overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

