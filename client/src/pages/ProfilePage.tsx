import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
  const { user, virtueRecords, setCurrentPage } = useVirtus();

  if (!user) return null;

  const daysUntilPromotion = user.commitmentEndDate
    ? Math.ceil(
        (new Date(user.commitmentEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
          <Button variant="outline" onClick={() => setCurrentPage('dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* User Info */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Informações Pessoais</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Nome:</span>
                <span className="text-foreground font-semibold">{user.username}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">E-mail:</span>
                <span className="text-foreground font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Data de Adesão:</span>
                <span className="text-foreground font-semibold">
                  {new Date(user.commitmentDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {user.leaderId && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Seu Líder Espiritual:</span>
                  <span className="text-foreground font-semibold text-primary">
                    {user.leaderId === 'admin' ? 'Administrador' : 'Líder Espiritual'}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Commitment Status */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Termo de Compromisso</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-foreground font-semibold text-green-600">Ativo</span>
              </div>
              {user.commitmentEndDate ? (
                <>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-muted-foreground">Data de Encerramento:</span>
                    <span className="text-foreground font-semibold">
                      {new Date(user.commitmentEndDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Dias Restantes:</span>
                    <span className={`text-foreground font-semibold ${daysUntilPromotion && daysUntilPromotion <= 7 ? 'text-orange-600' : ''}`}>
                      {daysUntilPromotion && daysUntilPromotion > 0 ? `${daysUntilPromotion} dias` : 'Encerrado'}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground italic">
                  Seu termo de compromisso está em avaliação. Seu líder espiritual determinará a data de encerramento.
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground italic mt-6">
              Seu compromisso com a jornada espiritual é acompanhado por seu líder espiritual, que avaliará seu progresso e determinará quando você estará pronto para novas responsabilidades.
            </p>
          </Card>

          {/* Virtue Statistics */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Suas Virtudes Registradas</h2>
            {virtueRecords.length === 0 ? (
              <p className="text-muted-foreground italic">Você ainda não registrou nenhuma virtude.</p>
            ) : (
              <div className="space-y-3">
                <p className="text-muted-foreground mb-4">Total: {virtueRecords.length} virtude(s)</p>
                {virtueRecords.map((virtue) => (
                  <div key={virtue.id} className="p-4 bg-muted rounded-lg">
                    <p className="text-foreground">{virtue.virtueText}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(virtue.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Spiritual Journey */}
          <Card className="p-8 bg-accent/10">
            <h2 className="text-2xl font-bold text-foreground mb-6">Sua Jornada Espiritual</h2>
            <p className="text-foreground leading-relaxed">
              Você está em uma jornada de crescimento espiritual acompanhado por seu líder espiritual. Cada virtude registrada, cada leitura realizada e cada participação nas atividades paroquiais são passos importantes nessa caminhada.
            </p>
            <p className="text-foreground leading-relaxed mt-4">
              Seu líder avalia seu progresso e, quando julgar apropriado, poderá promovê-lo a Líder Espiritual para guiar outros que desejam passar pela mesma experiência que você está vivenciando.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}

