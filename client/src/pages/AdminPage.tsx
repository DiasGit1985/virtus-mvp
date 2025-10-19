import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Simular dados de usuários para o painel admin
const MOCK_USERS = [
  {
    id: '1',
    username: 'maria_santos',
    email: 'maria@example.com',
    spiritualLevel: 3,
    lastAccess: '2 horas atrás',
    virtuesCount: 5,
    isActive: true,
  },
  {
    id: '2',
    username: 'joao_silva',
    email: 'joao@example.com',
    spiritualLevel: 2,
    lastAccess: '1 dia atrás',
    virtuesCount: 3,
    isActive: true,
  },
  {
    id: '3',
    username: 'ana_costa',
    email: 'ana@example.com',
    spiritualLevel: 4,
    lastAccess: '4 horas atrás',
    virtuesCount: 8,
    isActive: true,
  },
  {
    id: '4',
    username: 'pedro_oliveira',
    email: 'pedro@example.com',
    spiritualLevel: 1,
    lastAccess: '3 dias atrás',
    virtuesCount: 1,
    isActive: false,
  },
];

const SPIRITUAL_LEVELS = ['Fé', 'Esperança', 'Caridade', 'Fortaleza', 'Temperança', 'Prudência', 'Justiça'];

export default function AdminPage() {
  const { user, setCurrentPage } = useVirtus();

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Acesso Negado</h1>
          <p className="text-muted-foreground mb-8">
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <Button onClick={() => setCurrentPage('dashboard')} className="w-full">
            Voltar ao Dashboard
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
            <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground">Acompanhe o progresso espiritual do grupo</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentPage('dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground text-sm mb-2">Total de Membros</p>
            <p className="text-4xl font-bold text-primary">{MOCK_USERS.length}</p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-muted-foreground text-sm mb-2">Membros Ativos</p>
            <p className="text-4xl font-bold text-primary">
              {MOCK_USERS.filter((u) => u.isActive).length}
            </p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-muted-foreground text-sm mb-2">Total de Virtudes</p>
            <p className="text-4xl font-bold text-primary">
              {MOCK_USERS.reduce((sum, u) => sum + u.virtuesCount, 0)}
            </p>
          </Card>
          <Card className="p-6 text-center">
            <p className="text-muted-foreground text-sm mb-2">Nível Médio</p>
            <p className="text-4xl font-bold text-primary">
              {(MOCK_USERS.reduce((sum, u) => sum + u.spiritualLevel, 0) / MOCK_USERS.length).toFixed(1)}
            </p>
          </Card>
        </div>

        {/* Members List */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Membros do Grupo</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-foreground font-semibold">Nome</th>
                  <th className="text-left py-4 px-4 text-foreground font-semibold">E-mail</th>
                  <th className="text-center py-4 px-4 text-foreground font-semibold">Nível</th>
                  <th className="text-center py-4 px-4 text-foreground font-semibold">Virtudes</th>
                  <th className="text-left py-4 px-4 text-foreground font-semibold">Último Acesso</th>
                  <th className="text-center py-4 px-4 text-foreground font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((member) => (
                  <tr key={member.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 text-foreground">{member.username}</td>
                    <td className="py-4 px-4 text-muted-foreground">{member.email}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                        {SPIRITUAL_LEVELS[member.spiritualLevel - 1]}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-foreground font-semibold">{member.virtuesCount}</td>
                    <td className="py-4 px-4 text-muted-foreground">{member.lastAccess}</td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          member.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {member.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-8 mt-8 bg-accent/10">
          <h2 className="text-2xl font-bold text-foreground mb-6">Ações Administrativas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              Enviar Mensagem Pulso
            </Button>
            <Button variant="outline" className="w-full">
              Gerar Relatório
            </Button>
            <Button variant="outline" className="w-full">
              Promover a Guia
            </Button>
            <Button variant="outline" className="w-full">
              Avaliar Progresso
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

