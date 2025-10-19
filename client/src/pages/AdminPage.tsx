import { useState } from 'react';
import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const MOCK_USERS = [
  {
    id: '1',
    username: 'maria_santos',
    email: 'maria@example.com',
    spiritualMaturity: 'Avançada',
    lastAccess: '2 horas atrás',
    virtuesCount: 5,
    isActive: true,
  },
  {
    id: '2',
    username: 'joao_silva',
    email: 'joao@example.com',
    spiritualMaturity: 'Intermediária',
    lastAccess: '1 dia atrás',
    virtuesCount: 3,
    isActive: true,
  },
  {
    id: '3',
    username: 'ana_costa',
    email: 'ana@example.com',
    spiritualMaturity: 'Avançada',
    lastAccess: '4 horas atrás',
    virtuesCount: 8,
    isActive: true,
  },
  {
    id: '4',
    username: 'pedro_oliveira',
    email: 'pedro@example.com',
    spiritualMaturity: 'Iniciante',
    lastAccess: '3 dias atrás',
    virtuesCount: 1,
    isActive: false,
  },
];

export default function AdminPage() {
  const { user, setCurrentPage, generateInviteCode, inviteCodes } = useVirtus();
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleGenerateInvite = () => {
    const code = generateInviteCode(user.id);
    setGeneratedCode(code);
    setCopiedCode(false);
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const activeInvites = inviteCodes.filter((inv) => inv.isActive && !inv.usedBy);

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
        {/* Invite Generation Section */}
        <Card className="p-8 mb-8 bg-accent/5 border-accent/20">
          <h2 className="text-2xl font-bold text-foreground mb-6">Gerar Convites de Cadastro</h2>
          <p className="text-muted-foreground mb-6">
            Use esta seção para gerar códigos de convite exclusivos que permitirão que novos membros se cadastrem na Rede Virtus.
          </p>

          <div className="space-y-4">
            {generatedCode ? (
              <div className="bg-background border-2 border-primary rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-3">Código gerado com sucesso:</p>
                <div className="text-4xl font-bold text-primary tracking-widest mb-6">{generatedCode}</div>
                <Button onClick={handleCopyCode} className="w-full">
                  {copiedCode ? '✓ Código Copiado!' : 'Copiar Código'}
                </Button>
              </div>
            ) : (
              <Button onClick={handleGenerateInvite} className="w-full">
                Gerar Novo Convite
              </Button>
            )}

            {activeInvites.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Convites Ativos</h3>
                <div className="space-y-2">
                  {activeInvites.map((invite) => (
                    <div key={invite.code} className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                      <span className="font-mono font-bold text-primary">{invite.code}</span>
                      <span className="text-xs text-muted-foreground">
                        Criado {new Date(invite.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

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
            <p className="text-muted-foreground text-sm mb-2">Membros em Avaliação</p>
            <p className="text-4xl font-bold text-primary">
              {MOCK_USERS.filter((u) => u.isActive).length}
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
                  <th className="text-center py-4 px-4 text-foreground font-semibold">Maturidade Espiritual</th>
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
                        {member.spiritualMaturity}
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
      </main>
    </div>
  );
}

