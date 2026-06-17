import { useState, useEffect } from 'react';
import { getTodayStr, addDays, diffDays } from './lib/utils';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
  completedLessons: Record<number, boolean>;
}

const INITIAL_STATE: AppState = {
  startDate: null,
  logs: {},
  completedLessons: {},
};

export function useTetiStore() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  useEffect(() => {
    let unsubscribeDoc: () => void;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setState({
              startDate: data.startDate || null,
              logs: data.logs || {},
              completedLessons: data.completedLessons || {}
            });
          }
        });
      } else {
        setState(INITIAL_STATE);
        if (unsubscribeDoc) unsubscribeDoc();
      }
    });
    
    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const markLessonCompleted = async (day: number) => {
    if (!auth.currentUser) return;
    const userRef = doc(db, 'users', auth.currentUser.uid);
    
    // Optimistic
    setState((prev) => ({
      ...prev,
      completedLessons: {
        ...prev.completedLessons,
        [day]: true
      }
    }));

    try {
      await setDoc(userRef, { completedLessons: { [day]: true } }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleHabit = async (date: string, habitId: string) => {
    if (!auth.currentUser) return;
    
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const currentValue = state.logs[date]?.[habitId] || false;
    const newValue = !currentValue;
    
    // Optimistic
    setState((prev) => {
      const newLogs = { ...prev.logs };
      if (!newLogs[date]) newLogs[date] = {};
      newLogs[date] = { ...newLogs[date], [habitId]: newValue };
      return { ...prev, startDate: prev.startDate || date, logs: newLogs };
    });

    try {
      const isFirstAction = !state.startDate;
      await setDoc(userRef, {
        ...(isFirstAction ? { startDate: date } : {}),
      }, { merge: true });
      
      // Update inner field precisely
      await updateDoc(userRef, {
        [`logs.${date}.${habitId}`]: newValue
      });
    } catch (e) {
      console.error(e);
    }
  };

  const startChallenge = async () => {
    if (!state.startDate && auth.currentUser) {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        startDate: getTodayStr()
      }, { merge: true });
    }
  };

  const resetData = async () => {
    if (!auth.currentUser) return;
    
    // Optimistic
    setState({
      startDate: null,
      logs: {},
      completedLessons: {}
    });

    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      startDate: null,
      logs: {},
      completedLessons: {}
    });
  };

  return { state, toggleHabit, startChallenge, resetData, markLessonCompleted };
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
