import { useState } from 'react';
import { useTetiStore, calculateStats } from './store';
import { BottomNav, Tab } from './components/BottomNav';
import { TodayView } from './views/TodayView';
import { JourneyView } from './views/JourneyView';
import { ProfileView } from './views/ProfileView';
import { LessonsView } from './views/LessonsView';

export default function App() {
  const { state, toggleHabit, resetData } = useTetiStore();
  const [currentTab, setCurrentTab] = useState<Tab>('today');
  
  const stats = calculateStats(state);

  return (
    <div className="min-h-[100dvh] bg-black font-sans text-white selection:bg-red-500/30 overflow-x-hidden flex flex-col relative w-full pb-safe">
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none z-0">
        <img src="/teti-logo.png" alt="" className="w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] object-contain grayscale mix-blend-screen" />
      </div>

      <main className="mx-auto w-full max-w-xl px-6 relative z-10 pb-28">
        {currentTab === 'today' && (
          <TodayView 
            state={state} 
            onToggleHabit={toggleHabit} 
            dayOfChallenge={stats.currentDayOfChallenge}
          />
        )}
        
        {currentTab === 'journey' && (
          <JourneyView state={state} />
        )}

        {currentTab === 'lessons' && (
          <LessonsView dayOfChallenge={stats.currentDayOfChallenge} />
        )}
        
        {currentTab === 'profile' && (
          <ProfileView state={state} onReset={resetData} />
        )}
      </main>

      <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
    </div>
  );
}
