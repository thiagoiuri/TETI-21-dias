import { useState, useEffect } from 'react';
import { useTetiStore, calculateStats } from './store';
import { BottomNav, Tab } from './components/BottomNav';
import { TodayView } from './views/TodayView';
import { JourneyView } from './views/JourneyView';
import { ProfileView } from './views/ProfileView';
import { LessonsView } from './views/LessonsView';
import { LoginView } from './views/LoginView';
import { RegisterView } from './views/RegisterView';
import { ProfileSetupView } from './views/ProfileSetupView';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, profile, loading } = useAuth();
  const { state, toggleHabit, resetData, startChallenge, markLessonCompleted } = useTetiStore();
  const [currentTab, setCurrentTab] = useState<Tab>('today');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  
  const stats = calculateStats(state);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-black font-sans text-white">
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none z-0">
          <img src="/teti-logo.png" alt="" className="w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] object-contain grayscale mix-blend-screen" />
        </div>
        <div className="relative z-10">
          {authView === 'login' ? (
            <LoginView onRegisterClick={() => setAuthView('register')} />
          ) : (
            <RegisterView onLoginClick={() => setAuthView('login')} />
          )}
        </div>
      </div>
    );
  }

  if (profile && !profile.profileCompleted) {
    return (
      <div className="min-h-[100dvh] bg-black font-sans text-white">
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none z-0">
          <img src="/teti-logo.png" alt="" className="w-[120vw] h-[120vw] max-w-[800px] max-h-[800px] object-contain grayscale mix-blend-screen" />
        </div>
        <div className="relative z-10">
          <ProfileSetupView />
        </div>
      </div>
    );
  }

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
            onStartChallenge={startChallenge}
            onMarkLessonCompleted={markLessonCompleted}
          />
        )}
        
        {currentTab === 'journey' && (
          <JourneyView state={state} />
        )}

        {currentTab === 'lessons' && (
          <LessonsView 
            dayOfChallenge={stats.currentDayOfChallenge} 
            state={state}
            onMarkLessonCompleted={markLessonCompleted}
          />
        )}
        
        {currentTab === 'profile' && (
          <ProfileView state={state} onReset={resetData} />
        )}
      </main>

      <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
    </div>
  );
}
