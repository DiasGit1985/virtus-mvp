import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  commitmentDate: Date;
  commitmentLockedUntil: Date;
  spiritualLevel: number;
  isAdmin: boolean;
}

interface VirtueRecord {
  id: string;
  userId: string;
  virtueText: string;
  createdAt: Date;
  isAnonymous: boolean;
}

interface DailyPulse {
  id: string;
  pulseDate: Date;
  messageText: string;
  isActive: boolean;
}

interface VirtusContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  timeSpentToday: number;
  setTimeSpentToday: (value: number | ((prev: number) => number)) => void;
  isTimeBlocked: boolean;
  setIsTimeBlocked: (value: boolean) => void;
  virtueRecords: VirtueRecord[];
  addVirtueRecord: (virtue: VirtueRecord) => void;
  dailyPulse: DailyPulse | null;
  setDailyPulse: (pulse: DailyPulse | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const VirtusContext = createContext<VirtusContextType | undefined>(undefined);

export function VirtusProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeSpentToday, setTimeSpentToday] = useState(0);
  const [isTimeBlocked, setIsTimeBlocked] = useState(false);
  const [virtueRecords, setVirtueRecords] = useState<VirtueRecord[]>([]);
  const [dailyPulse, setDailyPulse] = useState<DailyPulse | null>(null);
  const [currentPage, setCurrentPage] = useState('login');

  // Simular carregamento de dados ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('virtus_user');
    const savedTime = localStorage.getItem('virtus_time_today');
    const savedVirtues = localStorage.getItem('virtus_virtues');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
    }

    if (savedTime) {
      const timeData = JSON.parse(savedTime);
      const today = new Date().toDateString();
      if (timeData.date === today) {
        setTimeSpentToday(timeData.seconds);
        setIsTimeBlocked(timeData.seconds >= 1800); // 30 minutos = 1800 segundos
      }
    }

    if (savedVirtues) {
      setVirtueRecords(JSON.parse(savedVirtues));
    }

    // Simular carregamento do "Pulso" diário
    const todayPulse: DailyPulse = {
      id: '1',
      pulseDate: new Date(),
      messageText: 'O silêncio também é uma oração. Hoje, dedique um momento para ouvir a voz de Deus em seu coração.',
      isActive: true,
    };
    setDailyPulse(todayPulse);
  }, []);

  const addVirtueRecord = (virtue: VirtueRecord) => {
    const updated = [...virtueRecords, virtue];
    setVirtueRecords(updated);
    localStorage.setItem('virtus_virtues', JSON.stringify(updated));
  };

  return (
    <VirtusContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        timeSpentToday,
        setTimeSpentToday,
        isTimeBlocked,
        setIsTimeBlocked,
        virtueRecords,
        addVirtueRecord,
        dailyPulse,
        setDailyPulse,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </VirtusContext.Provider>
  );
}

export function useVirtus() {
  const context = useContext(VirtusContext);
  if (context === undefined) {
    throw new Error('useVirtus must be used within a VirtusProvider');
  }
  return context;
}

