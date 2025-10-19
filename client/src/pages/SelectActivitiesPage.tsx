import { useState } from 'react';
import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default function SelectActivitiesPage() {
  const { parishActivities, setUser, setIsLoggedIn, setCurrentPage } = useVirtus();
  const [selectedActivities, setSelectedActivities] = useState<
    { activityId: string; dayOfWeek: number }[]
  >([]);

  const handleActivityToggle = (activityId: string, dayOfWeek: number) => {
    const isSelected = selectedActivities.some(
      (a) => a.activityId === activityId && a.dayOfWeek === dayOfWeek
    );

    if (isSelected) {
      setSelectedActivities(
        selectedActivities.filter(
          (a) => !(a.activityId === activityId && a.dayOfWeek === dayOfWeek)
        )
      );
    } else {
      setSelectedActivities([...selectedActivities, { activityId, dayOfWeek }]);
    }
  };

  const handleComplete = () => {
    // Criar usuário com atividades selecionadas
    const user = {
      id: '1',
      email: 'novo@virtus.com',
      username: 'Novo Usuário',
      commitmentDate: new Date(),
      commitmentLockedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      spiritualLevel: 1,
      isAdmin: false,
      activities: selectedActivities.map((a) => ({
        userId: '1',
        activityId: a.activityId,
        dayOfWeek: a.dayOfWeek,
      })),
    };

    setUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('virtus_user', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Atividades Paroquiais</h1>
          <p className="text-muted-foreground">
            Selecione em quais atividades você participa para que possamos lembrá-lo nos dias de compromisso.
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="space-y-6">
            {parishActivities.map((activity) => (
              <div key={activity.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-semibold text-foreground mb-3">{activity.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dayNames.map((dayName, dayIndex) => (
                    <label
                      key={dayIndex}
                      className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedActivities.some(
                          (a) => a.activityId === activity.id && a.dayOfWeek === dayIndex
                        )}
                        onChange={() => handleActivityToggle(activity.id, dayIndex)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{dayName}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {parishActivities.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma atividade paroquial disponível no momento.
            </p>
          )}
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setCurrentPage('login')} className="flex-1">
            Voltar
          </Button>
          <Button onClick={handleComplete} className="flex-1">
            Completar Cadastro
          </Button>
        </div>
      </div>
    </div>
  );
}

