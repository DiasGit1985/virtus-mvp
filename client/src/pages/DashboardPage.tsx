import { useState, useEffect } from 'react';
import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const { user, timeSpentToday, isTimeBlocked, setTimeSpentToday, setIsTimeBlocked, setCurrentPage, dailyPulse } = useVirtus();
  const [remainingTime, setRemainingTime] = useState(1800 - timeSpentToday);
  const [sessionActive, setSessionActive] = useState(!isTimeBlocked);

  useEffect(() => {
    if (!sessionActive || isTimeBlocked) return;

    const timer = setInterval(() => {
      setRemainingTime((prev: number) => {
        if (prev <= 1) {
          setSessionActive(false);
          setIsTimeBlocked(true);
          return 0;
        }
        return prev - 1;
      });

      setTimeSpentToday((prev: number) => {
        const newTime = prev + 1;
        localStorage.setItem(
          'virtus_time_today',
          JSON.stringify({
            date: new Date().toDateString(),
            seconds: newTime,
          })
        );
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionActive, isTimeBlocked, setTimeSpentToday, setIsTimeBlocked]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('virtus_user');
    setCurrentPage('login');
  };

  if (isTimeBlocked && !sessionActive) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">Tempo Expirado</h1>
          <div className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-lg mb-8">
            <p className="text-xl text-foreground italic">
              "O silêncio também é uma oração."
            </p>
          </div>
          <p className="text-muted-foreground mb-8">
            Seu tempo de 30 minutos foi utilizado hoje. Volte amanhã para continuar sua jornada espiritual.
          </p>
          <Button onClick={handleLogout} className="w-full">
            Sair
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Rede Virtus</h1>
            <p className="text-muted-foreground">Bem-vindo, {user?.username}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Timer Section - Discreto */}
        <div className="mb-8 text-right">
          <p className="text-sm text-muted-foreground mb-1">Tempo disponível</p>
          <div className="text-3xl font-bold text-primary">{formatTime(remainingTime)}</div>
        </div>

        {/* Daily Pulse */}
        {dailyPulse && (
          <Card className="pulse-message mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Pulso do Dia</h3>
            <p className="text-foreground leading-relaxed">{dailyPulse.messageText}</p>
          </Card>
        )}

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('register-virtue')}>
            <h3 className="text-2xl font-bold text-foreground mb-2">✦ Registrar Virtude</h3>
            <p className="text-muted-foreground">
              Compartilhe suas boas ações e hábitos espirituais com a comunidade.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('mural')}>
            <h3 className="text-2xl font-bold text-foreground mb-2">✦ Mural Coletivo</h3>
            <p className="text-muted-foreground">
              Veja os testemunhos anônimos de virtudes de toda a comunidade.
            </p>
          </Card>

          {user?.isAdmin && (
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('admin')}>
              <h3 className="text-2xl font-bold text-foreground mb-2">✦ Painel Admin</h3>
              <p className="text-muted-foreground">
                Acompanhe o progresso espiritual dos membros do grupo.
              </p>
            </Card>
          )}

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentPage('profile')}>
            <h3 className="text-2xl font-bold text-foreground mb-2">✦ Meu Perfil</h3>
            <p className="text-muted-foreground">
              Veja seu nível espiritual e histórico de compromisso.
            </p>
          </Card>
        </div>

        {/* Spiritual Level */}
        <Card className="p-6 mt-8 bg-accent/10">
          <h3 className="text-lg font-semibold text-foreground mb-4">Seu Nível Espiritual</h3>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">{user?.spiritualLevel}</div>
            <div className="flex-1">
              <p className="text-foreground font-semibold">
                {['Fé', 'Esperança', 'Caridade', 'Fortaleza', 'Temperança', 'Prudência', 'Justiça'][
                  (user?.spiritualLevel ?? 1) - 1
                ]}
              </p>
              <p className="text-muted-foreground text-sm">
                Avaliado pelo seu catequista com base em constância e convivência.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

