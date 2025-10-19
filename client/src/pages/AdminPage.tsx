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
  const { user, setCurrentPage, generateInviteCode, generateInviteLink, inviteCodes, pendingUsers, approvePendingUser, rejectPendingUser, allUsers, updateUserMaturity, updateUserEndDate } = useVirtus();
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingMaturity, setEditingMaturity] = useState('');
  const [editingEndDate, setEditingEndDate] = useState('');
  const [tab, setTab] = useState<'convites' | 'membros' | 'pendentes'>('convites');

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

  const isCreatorAdmin = user?.adminType === 'creator';

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

  const handleGenerateLink = () => {
    if (user?.adminType !== 'creator') {
      alert('Apenas o Administrador Criador pode gerar links de convite.');
      return;
    }
    const link = generateInviteLink(user.id);
    setGeneratedLink(link.token);
    setCopiedLink(false);
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      const fullLink = `${window.location.origin}?invite=${generatedLink}`;
      navigator.clipboard.writeText(fullLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSelectUser = (u: any) => {
    setSelectedUser(u);
    setEditingMaturity(u.spiritualMaturity || '');
    setEditingEndDate(u.commitmentEndDate ? new Date(u.commitmentEndDate).toISOString().split('T')[0] : '');
  };

  const handleSaveUserChanges = () => {
    if (selectedUser && editingMaturity) {
      updateUserMaturity(selectedUser.id, editingMaturity);
      if (editingEndDate) {
        updateUserEndDate(selectedUser.id, new Date(editingEndDate));
      }
      setSelectedUser(null);
    }
  };

  const activeInvites = inviteCodes.filter((inv) => inv.isActive && !inv.usedBy);
  const pendingCount = pendingUsers.filter((u) => u.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground">{user?.username} - {isCreatorAdmin ? 'Criador' : 'Líder'}</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentPage('dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Invite Generation Section - Only for Creator Admin */}
        {isCreatorAdmin ? (
        <Card className="p-8 mb-8 bg-accent/5 border-accent/20">
          <h2 className="text-2xl font-bold text-foreground mb-6">Gerar Links de Convite</h2>
          <p className="text-muted-foreground mb-6">
            Use esta seção para gerar links de convite únicos que permitirão que novos membros se cadastrem na Rede Virtus. Cada link pode ser usado apenas uma vez.
          </p>

          <div className="space-y-4">
            {generatedLink ? (
              <div className="bg-background border-2 border-primary rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-3">Link de convite gerado com sucesso:</p>
                <div className="text-sm font-mono bg-muted p-3 rounded mb-6 break-all">{generatedLink}</div>
                <Button onClick={handleCopyLink} className="w-full">
                  {copiedLink ? '✓ Link Copiado!' : 'Copiar Link'}
                </Button>
              </div>
            ) : (
              <Button onClick={handleGenerateLink} className="w-full">
                Gerar Novo Link de Convite
              </Button>
            )}
          </div>
        </Card>
        ) : (
        <Card className="p-8 mb-8 bg-red-50 border-red-200">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Acesso Restrito</h2>
          <p className="text-red-600">
            Apenas o Administrador Criador pode gerar links de convite. Você é um Administrador Líder e pode gerenciar seus liderados.
          </p>
        </Card>
        )}

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

