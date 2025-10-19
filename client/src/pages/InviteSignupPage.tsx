import { useState } from 'react';
import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function InviteSignupPage() {
  const { setCurrentPage, validateInviteCode, setCurrentPage: setPage } = useVirtus();
  const [inviteCode, setInviteCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'invite' | 'signup'>('invite');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inviteCode.trim()) {
      setError('Por favor, insira o código de convite.');
      return;
    }

    if (validateInviteCode(inviteCode.toUpperCase())) {
      setStep('signup');
    } else {
      setError('Código de convite inválido ou já utilizado.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // Prosseguir para seleção de atividades paroquiais
    setPage('activities');
  };

  if (step === 'invite') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Rede Virtus</h1>
            <p className="text-muted-foreground italic">Uma rede para eliminar as redes</p>
          </div>

          <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-8">
            <p className="text-sm text-foreground text-center">
              Bem-vindo à Rede Virtus! Para se cadastrar, você precisa de um código de convite fornecido por um líder espiritual.
            </p>
          </div>

          <form onSubmit={handleInviteSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Código de Convite
              </label>
              <Input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="w-full text-center text-lg tracking-widest"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full">
              Validar Convite
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Não tem um código? Peça a um líder espiritual da sua paróquia.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Criar Conta</h1>
          <p className="text-muted-foreground">Complete seu cadastro</p>
        </div>

        <form onSubmit={handleSignupSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nome Completo
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              E-mail
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Senha
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full">
            Próximo: Atividades Paroquiais
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStep('invite');
              setError('');
            }}
            className="w-full"
          >
            Voltar
          </Button>
        </form>
      </Card>
    </div>
  );
}

