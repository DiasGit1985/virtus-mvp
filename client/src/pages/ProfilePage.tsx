import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SPIRITUAL_LEVELS = [
  { level: 1, name: 'Fé', description: 'Início da jornada espiritual' },
  { level: 2, name: 'Esperança', description: 'Confiança em Deus' },
  { level: 3, name: 'Caridade', description: 'Amor ao próximo' },
  { level: 4, name: 'Fortaleza', description: 'Força espiritual' },
  { level: 5, name: 'Temperança', description: 'Domínio de si mesmo' },
  { level: 6, name: 'Prudência', description: 'Sabedoria' },
  { level: 7, name: 'Justiça', description: 'Retidão' },
];

export default function ProfilePage() {
  const { user, virtueRecords, setCurrentPage } = useVirtus();

  if (!user) return null;

  const currentLevel = SPIRITUAL_LEVELS[user.spiritualLevel - 1];
  const daysUntilUnlock = Math.ceil(
    (new Date(user.commitmentLockedUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

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
                <span className="text-muted-foreground">E-mail:</span>
                <span className="text-foreground font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Nome de Usuário:</span>
                <span className="text-foreground font-semibold">{user.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Data de Adesão:</span>
                <span className="text-foreground font-semibold">
                  {new Date(user.commitmentDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </Card>

          {/* Spiritual Level */}
          <Card className="p-8 bg-primary/10 border-2 border-primary">
            <h2 className="text-2xl font-bold text-foreground mb-6">Seu Nível Espiritual</h2>
            <div className="flex items-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">{user.spiritualLevel}</div>
                <p className="text-lg font-semibold text-foreground">{currentLevel.name}</p>
              </div>
              <div className="flex-1">
                <p className="text-foreground mb-4">{currentLevel.description}</p>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${(user.spiritualLevel / 7) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Nível {user.spiritualLevel} de 7
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Seu nível é avaliado pelo seu catequista com base em constância, convivência e crescimento espiritual.
            </p>
          </Card>

          {/* Commitment Status */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Termo de Compromisso</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-foreground font-semibold text-green-600">Ativo</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <span className="text-muted-foreground">Conta Bloqueada Até:</span>
                <span className="text-foreground font-semibold">
                  {new Date(user.commitmentLockedUntil).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Dias Restantes:</span>
                <span className="text-foreground font-semibold">{daysUntilUnlock} dias</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic mt-6">
              Sua conta está protegida por 30 dias após a aceitação do Termo de Compromisso do Silêncio Digital. Isso
              garante seu compromisso com a jornada espiritual.
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

          {/* Spiritual Levels Guide */}
          <Card className="p-8 bg-muted">
            <h2 className="text-2xl font-bold text-foreground mb-6">Guia dos Níveis Espirituais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPIRITUAL_LEVELS.map((level) => (
                <div
                  key={level.level}
                  className={`p-4 rounded-lg ${
                    level.level === user.spiritualLevel
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-background border border-border'
                  }`}
                >
                  <p className="font-semibold text-foreground">
                    {level.level}. {level.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

