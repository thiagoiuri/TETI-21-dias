import { useState, useEffect } from 'react';
import { getTodayStr, addDays, diffDays } from './lib/utils';

export type Pillar = 'trabalhar' | 'estudar' | 'treinar' | 'investir';

export interface Habit {
  id: string;
  label: string;
  points: number;
  pillar: Pillar;
}

export const EXERCISE_HABITS: Habit[] = [
  { id: 'alarme', label: '1 ÚNICO ALARME', points: 1, pillar: 'treinar' },
  { id: 'contagem', label: 'CONTAGEM REGRESSIVA (5 SEG.)', points: 1, pillar: 'treinar' },
  { id: 'alongamento', label: 'ALONGAMENTO BÁSICO', points: 2, pillar: 'treinar' },
  { id: 'abdominais', label: 'ABDOMINAIS DIÁRIAS', points: 2, pillar: 'treinar' },
  { id: 'meditacao1', label: 'MEDITAÇÃO ZEN (1 MINUTO)', points: 2, pillar: 'investir' },
  { id: 'agua_jejum', label: 'ÁGUA EM JEJUM', points: 1, pillar: 'treinar' },
  { id: 'gratidao1', label: 'EXERCÍCIO DA GRATIDÃO', points: 1, pillar: 'investir' },
  { id: 'afirmacao1', label: 'AUTOAFIRMAÇÃO FRENTE AO ESPELHO', points: 1, pillar: 'investir' },
  { id: 'fruta1', label: 'HÁBITO DA FRUTA', points: 1, pillar: 'treinar' },
  { id: 'livro1', label: '1 PÁGINA DE LIVRO', points: 2, pillar: 'estudar' },
  { id: 'pomodoro', label: 'TÉCNICA POMODORO', points: 2, pillar: 'trabalhar' },
  { id: 'agua_almoco', label: 'ÁGUA ANTES DO ALMOÇO', points: 1, pillar: 'treinar' },
  { id: 'marmita', label: 'HÁBITO DA MARMITA', points: 2, pillar: 'investir' },
  { id: 'fruta2', label: 'HÁBITO DA FRUTA', points: 1, pillar: 'treinar' },
  { id: 'org_trabalho', label: 'ORGANIZAÇÃO DO TRABALHO', points: 1, pillar: 'trabalhar' },
  { id: 'preparo_dia', label: 'PREPARO PARA O DIA SEGUINTE', points: 1, pillar: 'trabalhar' },
  { id: 'exercicio_pos', label: 'EXERCÍCIO PÓS TRABALHO', points: 3, pillar: 'treinar' },
  { id: 'agua_pos', label: 'ÁGUA PÓS EXERCÍCIO', points: 1, pillar: 'treinar' },
  { id: 'agua_jantar', label: '1 COPO D\'AGUA ANTES DE JANTAR', points: 1, pillar: 'treinar' },
  { id: 'fruta_jantar', label: '1 FRUTA ANTES DE JANTAR', points: 2, pillar: 'treinar' },
  { id: 'livro2', label: '1 PÁGINA DE LIVRO', points: 2, pillar: 'estudar' },
  { id: 'conhecimento', label: '1 CONHECIMENTO NOVO, OU REVISITA', points: 1, pillar: 'estudar' },
  { id: 'gratidao2', label: 'EXERCÍCIO DA GRATIDÃO DO DIA', points: 1, pillar: 'investir' },
  { id: 'afirmacao2', label: 'AUTOAFIRMAÇÃO NO ESPELHO', points: 2, pillar: 'investir' },
  { id: 'luz_celular', label: 'REDUZIR A LUZ DO CELULAR', points: 1, pillar: 'trabalhar' },
  { id: 'sem_redes', label: 'EVITAR REDES SOCIAIS 30 MINUTOS ANTE DE DORMIR', points: 1, pillar: 'trabalhar' },
  { id: 'agua_dormir', label: 'ÁGUA ANTES DE DORMIR', points: 1, pillar: 'treinar' },
  { id: 'meditacao_sono', label: '1 MEDITAÇÃO PRÉ SONO', points: 1, pillar: 'treinar' },
];

export type DailyLog = Record<string, boolean>;

export interface AppState {
  startDate: string | null;
  logs: Record<string, DailyLog>;
}

const INITIAL_STATE: AppState = {
  startDate: null,
  logs: {},
};

export function useTetiStore() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem('teti-state-v2');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load state', e);
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('teti-state-v2', JSON.stringify(state));
  }, [state]);

  const toggleHabit = (date: string, habitId: string) => {
    setState((prev) => {
      const newLogs = { ...prev.logs };
      if (!newLogs[date]) {
        newLogs[date] = {};
      }
      
      newLogs[date] = {
        ...newLogs[date],
        [habitId]: !newLogs[date][habitId]
      };
      
      return {
        ...prev,
        startDate: prev.startDate || date,
        logs: newLogs
      };
    });
  };

  const startChallenge = () => {
    if (!state.startDate) {
      setState((prev) => ({ ...prev, startDate: getTodayStr() }));
    }
  };

  const resetData = () => {
    if (confirm('Atenção, leão! Tem certeza que deseja zerar sua jornada? Isso não pode ser desfeito.')) {
      setState(INITIAL_STATE);
    }
  };

  return { state, toggleHabit, startChallenge, resetData };
}

export const checkDayCompletion = (log?: DailyLog) => {
  if (!log) return false;
  let points = 0;
  EXERCISE_HABITS.forEach(habit => {
    if (log[habit.id]) points += habit.points;
  });
  return points >= 21;
};

export const calculateStats = (state: AppState) => {
  let totalPoints = 0;
  let completedDays = 0;
  let streak = 0;
  const today = getTodayStr();

  Object.values(state.logs).forEach((log) => {
    let dailyPoints = 0;
    EXERCISE_HABITS.forEach(habit => {
      if (log[habit.id]) dailyPoints += habit.points;
    });
    
    if (dailyPoints >= 21) {
      dailyPoints += 20; // Bonus for reaching the target 21 points
      completedDays++;
    }
    totalPoints += dailyPoints;
  });

  if (state.startDate) {
    let currentDate = today;
    let tempStreak = 0;
    
    if (checkDayCompletion(state.logs[today])) {
      tempStreak = 1;
      currentDate = addDays(today, -1);
    } else {
      currentDate = addDays(today, -1);
    }

    while (checkDayCompletion(state.logs[currentDate])) {
      tempStreak++;
      currentDate = addDays(currentDate, -1);
    }
    streak = tempStreak;
  }

  const level = Math.floor(totalPoints / 200) + 1;
  const nextLevelPoints = level * 200;
  const prevLevelPoints = (level - 1) * 200;
  
  const levelProgressRange = nextLevelPoints - prevLevelPoints;
  const pointsInCurrentLevel = totalPoints - prevLevelPoints;
  const progressToNextLevel = levelProgressRange > 0 ? pointsInCurrentLevel / levelProgressRange : 0;

  let currentDayOfChallenge = 0;
  if (state.startDate) {
    currentDayOfChallenge = diffDays(state.startDate, today) + 1;
  }

  const chartData = [];
  if (state.startDate) {
    for (let i = 0; i < 21; i++) {
      const dateStr = addDays(state.startDate, i);
      if (diffDays(today, dateStr) > 0) break; // Don't show future days
      
      const log = state.logs[dateStr] || {};
      let trabalhar = 0, estudar = 0, treinar = 0, investir = 0;
      
      EXERCISE_HABITS.forEach(h => {
        if (log[h.id]) {
          if (h.pillar === 'trabalhar') trabalhar += h.points;
          if (h.pillar === 'estudar') estudar += h.points;
          if (h.pillar === 'treinar') treinar += h.points;
          if (h.pillar === 'investir') investir += h.points;
        }
      });
      
      chartData.push({
        day: `Dia ${i + 1}`,
        Trabalhar: trabalhar,
        Estudar: estudar,
        Treinar: treinar,
        Investir: investir,
      });
    }
  }

  return {
    totalPoints,
    completedDays,
    streak,
    level,
    nextLevelPoints,
    progressToNextLevel,
    currentDayOfChallenge,
    chartData,
  };
};
