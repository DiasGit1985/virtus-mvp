import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  commitmentDate: Date;
  commitmentEndDate?: Date;
  spiritualMaturity?: string;
  isAdmin: boolean;
  adminType?: 'creator' | 'leader';
  isLeader?: boolean;
  leaderId?: string;
  inviteCode?: string;
  activities: UserActivityParticipation[];
}

interface SpiritualLeader {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  createdBy: string;
}

interface PrivateMessage {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

interface VirtueRecord {
  id: string;
  userId: string;
  virtueText: string;
  createdAt: Date;
  isAnonymous: boolean;
  type: 'virtue' | 'bible_reading';
}

interface BibleReading {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  startTime: Date;
  endTime?: Date;
  durationSeconds: number;
  publishedToMural: boolean;
}

interface ParishActivity {
  id: string;
  name: string;
  dayOfWeek: number;
  createdBy: string;
}

interface UserActivityParticipation {
  userId: string;
  activityId: string;
  dayOfWeek: number;
}

interface InviteCode {
  code: string;
  createdBy: string;
  createdAt: Date;
  usedBy?: string;
  usedAt?: Date;
  isActive: boolean;
}

interface InviteLink {
  id: string;
  token: string;
  createdBy: string;
  createdAt: Date;
  usedBy?: string;
  usedAt?: Date;
  isActive: boolean;
  expiresAt: Date;
}

interface PendingUser {
  id: string;
  email: string;
  username: string;
  commitmentDate: Date;
  leaderId: string;
  activities: UserActivityParticipation[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  approvedAt?: Date;
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
  bibleReadings: BibleReading[];
  addBibleReading: (reading: BibleReading) => void;
  dailyPulse: DailyPulse | null;
  setDailyPulse: (pulse: DailyPulse | null) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  parishActivities: ParishActivity[];
  setParishActivities: (activities: ParishActivity[]) => void;
  addParishActivity: (name: string, daysOfWeek: number[]) => void;
  updateParishActivity: (id: string, name: string, daysOfWeek: number[]) => void;
  deleteParishActivity: (id: string) => void;
  inviteCodes: InviteCode[];
  generateInviteCode: (adminId: string) => string;
  validateInviteCode: (code: string) => boolean;
  currentReadingSession?: BibleReading;
  setCurrentReadingSession: (session: BibleReading | undefined) => void;
  inviteLinks: InviteLink[];
  generateInviteLink: (adminId: string) => InviteLink;
  validateInviteLink: (token: string) => boolean;
  pendingUsers: PendingUser[];
  addPendingUser: (user: PendingUser) => void;
  approvePendingUser: (userId: string) => void;
  rejectPendingUser: (userId: string) => void;
  allUsers: User[];
  updateUserMaturity: (userId: string, maturity: string) => void;
  updateUserEndDate: (userId: string, endDate: Date) => void;
}

const VirtusContext = createContext<VirtusContextType | undefined>(undefined);

export function VirtusProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeSpentToday, setTimeSpentToday] = useState(0);
  const [isTimeBlocked, setIsTimeBlocked] = useState(false);
  const [virtueRecords, setVirtueRecords] = useState<VirtueRecord[]>([]);
  const [bibleReadings, setBibleReadings] = useState<BibleReading[]>([]);
  const [dailyPulse, setDailyPulse] = useState<DailyPulse | null>(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [parishActivities, setParishActivities] = useState<ParishActivity[]>([]);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [currentReadingSession, setCurrentReadingSession] = useState<BibleReading | undefined>(undefined);
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const addVirtueRecord = (virtue: VirtueRecord) => {
    const updated = [...virtueRecords, virtue];
    setVirtueRecords(updated);
    localStorage.setItem('virtus_virtues', JSON.stringify(updated));
  };

  const addBibleReading = (reading: BibleReading) => {
    const updated = [...bibleReadings, reading];
    setBibleReadings(updated);
    localStorage.setItem('virtus_bible_readings', JSON.stringify(updated));
  };

  const generateInviteCode = (adminId: string): string => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newInvite: InviteCode = {
      code,
      createdBy: adminId,
      createdAt: new Date(),
      isActive: true,
    };
    const updated = [...inviteCodes, newInvite];
    setInviteCodes(updated);
    localStorage.setItem('virtus_invite_codes', JSON.stringify(updated));
    return code;
  };

  const validateInviteCode = (code: string): boolean => {
    const invite = inviteCodes.find(
      (inv) => inv.code === code && inv.isActive && !inv.usedBy
    );
    return !!invite;
  };

  const generateInviteLink = (adminId: string): InviteLink => {
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const newLink: InviteLink = {
      id: Date.now().toString(),
      token,
      createdBy: adminId,
      createdAt: new Date(),
      isActive: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    const updated = [...inviteLinks, newLink];
    setInviteLinks(updated);
    localStorage.setItem('virtus_invite_links', JSON.stringify(updated));
    return newLink;
  };

  const validateInviteLink = (token: string): boolean => {
    const link = inviteLinks.find(
      (l) => l.token === token && l.isActive && !l.usedBy && new Date(l.expiresAt) > new Date()
    );
    return !!link;
  };

  const addPendingUser = (newUser: PendingUser) => {
    const updated = [...pendingUsers, newUser];
    setPendingUsers(updated);
    localStorage.setItem('virtus_pending_users', JSON.stringify(updated));
  };

  const approvePendingUser = (userId: string) => {
    const pending = pendingUsers.find((u) => u.id === userId);
    if (!pending) return;

    const newUser: User = {
      id: pending.id,
      email: pending.email,
      username: pending.username,
      commitmentDate: pending.commitmentDate,
      isAdmin: false,
      leaderId: pending.leaderId,
      activities: pending.activities,
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem('virtus_all_users', JSON.stringify(updatedUsers));

    const updatedPending = pendingUsers.map((u) =>
      u.id === userId ? { ...u, status: 'approved' as const, approvedAt: new Date() } : u
    );
    setPendingUsers(updatedPending);
    localStorage.setItem('virtus_pending_users', JSON.stringify(updatedPending));
  };

  const rejectPendingUser = (userId: string) => {
    const updatedPending = pendingUsers.map((u) =>
      u.id === userId ? { ...u, status: 'rejected' as const } : u
    );
    setPendingUsers(updatedPending);
    localStorage.setItem('virtus_pending_users', JSON.stringify(updatedPending));
  };

  const updateUserMaturity = (userId: string, maturity: string) => {
    const updatedUsers = allUsers.map((u) =>
      u.id === userId ? { ...u, spiritualMaturity: maturity } : u
    );
    setAllUsers(updatedUsers);
    localStorage.setItem('virtus_all_users', JSON.stringify(updatedUsers));
  };

  const updateUserEndDate = (userId: string, endDate: Date) => {
    const updatedUsers = allUsers.map((u) =>
      u.id === userId ? { ...u, commitmentEndDate: endDate } : u
    );
    setAllUsers(updatedUsers);
    localStorage.setItem('virtus_all_users', JSON.stringify(updatedUsers));
  };

  const addParishActivity = (name: string, daysOfWeek: number[]) => {
    const newActivities = daysOfWeek.map((day) => ({
      id: Date.now().toString() + day,
      name,
      dayOfWeek: day,
      createdBy: user?.id || 'admin',
    }));
    const updated = [...parishActivities, ...newActivities];
    setParishActivities(updated);
    localStorage.setItem('virtus_parish_activities', JSON.stringify(updated));
  };

  const updateParishActivity = (id: string, name: string, daysOfWeek: number[]) => {
    const filtered = parishActivities.filter((a) => a.id !== id);
    const newActivities = daysOfWeek.map((day) => ({
      id: id + day,
      name,
      dayOfWeek: day,
      createdBy: user?.id || 'admin',
    }));
    const updated = [...filtered, ...newActivities];
    setParishActivities(updated);
    localStorage.setItem('virtus_parish_activities', JSON.stringify(updated));
  };

  const deleteParishActivity = (id: string) => {
    const updated = parishActivities.filter((a) => !a.id.startsWith(id));
    setParishActivities(updated);
    localStorage.setItem('virtus_parish_activities', JSON.stringify(updated));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('virtus_user');
    const savedTime = localStorage.getItem('virtus_time_today');
    const savedVirtues = localStorage.getItem('virtus_virtues');
    const savedReadings = localStorage.getItem('virtus_bible_readings');
    const savedActivities = localStorage.getItem('virtus_parish_activities');
    const savedInvites = localStorage.getItem('virtus_invite_codes');

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
        setIsTimeBlocked(timeData.seconds >= 1800);
      }
    }

    if (savedVirtues) {
      setVirtueRecords(JSON.parse(savedVirtues));
    }

    if (savedReadings) {
      setBibleReadings(JSON.parse(savedReadings));
    }

    if (savedActivities) {
      setParishActivities(JSON.parse(savedActivities));
    } else {
      const defaultActivities: ParishActivity[] = [
        { id: '1', name: 'Missa Dominical', dayOfWeek: 0, createdBy: 'admin' },
        { id: '2', name: 'Catequese', dayOfWeek: 3, createdBy: 'admin' },
        { id: '3', name: 'Grupo de Oração', dayOfWeek: 5, createdBy: 'admin' },
        { id: '4', name: 'Confissão', dayOfWeek: 6, createdBy: 'admin' },
      ];
      setParishActivities(defaultActivities);
      localStorage.setItem('virtus_parish_activities', JSON.stringify(defaultActivities));
    }

    if (savedInvites) {
      setInviteCodes(JSON.parse(savedInvites));
    }

    const todayPulse: DailyPulse = {
      id: '1',
      pulseDate: new Date(),
      messageText: 'O silêncio também é uma oração. Hoje, dedique um momento para ouvir a voz de Deus em seu coração.',
      isActive: true,
    };
    setDailyPulse(todayPulse);
  }, []);

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
        bibleReadings,
        addBibleReading,
        dailyPulse,
        setDailyPulse,
        currentPage,
        setCurrentPage,
        parishActivities,
        setParishActivities,
        addParishActivity,
        updateParishActivity,
        deleteParishActivity,
        inviteCodes,
        generateInviteCode,
        validateInviteCode,
        currentReadingSession,
        setCurrentReadingSession,
        inviteLinks,
        generateInviteLink,
        validateInviteLink,
        pendingUsers,
        addPendingUser,
        approvePendingUser,
        rejectPendingUser,
        allUsers,
        updateUserMaturity,
        updateUserEndDate,
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

