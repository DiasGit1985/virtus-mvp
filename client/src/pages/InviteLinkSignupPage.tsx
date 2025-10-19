import { useState } from 'react';
import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function InviteLinkSignupPage() {
  const { validateInviteLink, addPendingUser, setCurrentPage } = useVirtus();
  const [token, setToken] = useState('');
  const [step, setStep] = useState<'token' | 'form'>('token');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidateToken = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token.trim()) {
      setError('Por favor, insira o código de convite.');
      return;
    }

    if (validateInviteLink(token)) {
      setStep('form');
    } else {
      setError('Código de convite inválido ou expirado.');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    const newPendingUser = {
      id: Date.now().toString(),
      email,
      username: fullName.trim(),
      commitmentDate: new Date(),
      leaderId: 'admin',
      activities: [],
      status: 'pending' as const,
      createdAt: new Date(),
    };

    addPendingUser(newPendingUser);

    setTimeout(() => {
      setLoading(false);
      setCurrentPage('login');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Rede Virtus</h1>
          <p className="text-muted-foreground italic">Uma rede para eliminar as redes</p>
        </div>

        {step === 'token' ? (
          <form onSubmit={handleValidateToken} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Código de Convite
              </label>
              <Input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Cole seu código de convite aqui"
                className="w-full"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Você recebeu um código único de convite. Cole-o aqui para continuar.
              </p>
            </div>

            {error && <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Validando...' : 'Continuar'}
            </Button>

            <div className="text-center">
              <Button variant="link" onClick={() => setCurrentPage('login')} className="text-sm">
                Voltar ao Login
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Criar Conta</h2>

              <div className="space-y-4">
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
                    disabled={loading}
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
                    disabled={loading}
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
                    placeholder="Mínimo 6 caracteres"
                    className="w-full"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">{error}</div>}

              <p className="text-xs text-muted-foreground mt-4">
                Após o cadastro, sua conta ficará pendente de aprovação do seu líder espiritual.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  setStep('token');
                  setToken('');
                  setError('');
                }}
                className="text-sm"
                disabled={loading}
              >
                Usar outro código
              </Button>
            </div>
          </form>
        )}

        <div className="mt-8 p-4 bg-accent/10 rounded-lg text-center">
          <p className="text-sm text-muted-foreground italic">
            "O silêncio também é uma oração."
          </p>
        </div>
      </Card>
    </div>
  );
}

