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
  const { user, setCurrentPage, generateInviteCode, generateInviteLink, inviteCodes, pendingUsers, approvePendingUser, rejectPendingUser, allUsers, updateUserMaturity, updateUserEndDate, parishActivities, addParishActivity, deleteParishActivity } = useVirtus();
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingMaturity, setEditingMaturity] = useState('');
  const [editingEndDate, setEditingEndDate] = useState('');
  const [tab, setTab] = useState<'convites' | 'membros' | 'pendentes' | 'atividades'>('convites');
  const [newActivityName, setNewActivityName] = useState('');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

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
  const daysOfWeek = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const handleAddActivity = () => {
    if (!newActivityName.trim() || selectedDays.length === 0) {
      alert('Por favor, preencha o nome da atividade e selecione pelo menos um dia.');
      return;
    }
    addParishActivity(newActivityName, selectedDays);
    setNewActivityName('');
    setSelectedDays([]);
  };

  const handleToggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const uniqueActivities = Array.from(
    new Map(parishActivities.map((a: any) => [a.name, a])).values()
  );

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
                  <tr key={member.id} className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleSelectUser(member)}>
                    <td className="py-4 px-4 text-foreground font-medium">{member.username}</td>
                    <td className="py-4 px-4 text-muted-foreground">{member.email}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                        {member.spiritualMaturity || 'Não definido'}
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

        {/* Member Profile Modal */}
        {selectedUser && (
          <Card className="p-8 mt-8 bg-accent/5 border-2 border-accent">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Perfil do Membro</h2>
              <Button variant="ghost" onClick={() => setSelectedUser(null)}>
                Fechar
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Member Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Informações Pessoais</h3>
                  <div className="space-y-3 bg-background p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="text-foreground font-semibold">{selectedUser.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="text-foreground font-semibold">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                      <p className="text-foreground font-semibold">{new Date(selectedUser.joinDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Último Acesso</p>
                      <p className="text-foreground font-semibold">{selectedUser.lastAccess}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Maturidade Espiritual</h3>
                  <div className="space-y-3">
                    <select
                      value={editingMaturity}
                      onChange={(e) => setEditingMaturity(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="">Selecione a maturidade</option>
                      <option value="Iniciante">Iniciante</option>
                      <option value="Aprendiz">Aprendiz</option>
                      <option value="Praticante">Praticante</option>
                      <option value="Dedicado">Dedicado</option>
                      <option value="Maduro">Maduro</option>
                      <option value="Sábio">Sábio</option>
                      <option value="Mestre">Mestre</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Statistics and Activities */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{selectedUser.virtuesCount}</p>
                      <p className="text-xs text-muted-foreground">Virtudes</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{selectedUser.readingCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Leituras</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{selectedUser.activitiesCount || 0}</p>
                      <p className="text-xs text-muted-foreground">Atividades</p>
                    </div>
                    <div className="bg-background p-4 rounded-lg text-center">
                      <p className={`text-2xl font-bold ${selectedUser.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                        {selectedUser.isActive ? 'Ativo' : 'Inativo'}
                      </p>
                      <p className="text-xs text-muted-foreground">Status</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Atividades Paroquiais</h3>
                  <div className="space-y-2 bg-background p-4 rounded-lg max-h-40 overflow-y-auto">
                    {selectedUser.activities && selectedUser.activities.length > 0 ? (
                      selectedUser.activities.map((activity: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-foreground font-medium">{activity.name}</span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {activity.day}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhuma atividade registrada</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Date of Completion */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Data de Encerramento / Promoção a Líder</h3>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={editingEndDate}
                  onChange={(e) => setEditingEndDate(e.target.value)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                />
                <Button onClick={handleSaveUserChanges} className="px-6">
                  Salvar Alterações
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Deixe em branco para manter indefinido. Quando preenchido, o membro será notificado sobre sua promoção a líder.
              </p>
            </div>
          </Card>
        )}

        {/* Parish Activities Management - Only for Creator Admin */}
        {isCreatorAdmin && (
          <Card className="p-8 mt-8 bg-accent/5 border-accent/20">
            <h2 className="text-2xl font-bold text-foreground mb-6">Gerenciar Atividades Paroquiais</h2>
            <p className="text-muted-foreground mb-6">
              Cadastre as atividades e compromissos paroquiais que os liderados poderão selecionar para registrar seu compromisso espiritual.
            </p>

            {/* Add New Activity */}
            <div className="bg-background p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Cadastrar Nova Atividade</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nome da Atividade</label>
                  <input
                    type="text"
                    value={newActivityName}
                    onChange={(e) => setNewActivityName(e.target.value)}
                    placeholder="Ex: Missa Dominical, Grupo de Oração, Catequese"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Dias da Semana</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daysOfWeek.map((day, idx) => (
                      <label key={idx} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDays.includes(idx)}
                          onChange={() => handleToggleDay(idx)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-foreground">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button onClick={handleAddActivity} className="w-full">
                  Cadastrar Atividade
                </Button>
              </div>
            </div>

            {/* List of Activities */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Atividades Cadastradas</h3>
              {uniqueActivities.length > 0 ? (
                <div className="space-y-3">
                  {uniqueActivities.map((activity: any) => {
                    const activityDays = parishActivities
                      .filter((a) => a.name === activity.name)
                      .map((a) => daysOfWeek[a.dayOfWeek])
                      .join(', ');
                    return (
                      <div key={activity.id} className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                        <div>
                          <p className="font-semibold text-foreground">{activity.name}</p>
                          <p className="text-xs text-muted-foreground">{activityDays}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteParishActivity(activity.id)}
                        >
                          Deletar
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Nenhuma atividade cadastrada ainda.</p>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

