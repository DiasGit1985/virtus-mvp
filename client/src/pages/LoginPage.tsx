import { useState } from 'react';
import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const { setUser, setIsLoggedIn, setCurrentPage } = useVirtus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [acceptedManifesto, setAcceptedManifesto] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isSignUp) {
      if (!fullName.trim()) {
        alert('Por favor, preencha seu nome completo.');
        return;
      }
      setShowManifesto(true);
    } else {
      // Simular login
      const user = {
        id: '1',
        email,
        username: email.split('@')[0],
        commitmentDate: new Date(),
        commitmentLockedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        spiritualLevel: 1,
        isAdmin: false,
        activities: [],
      };
      setUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('virtus_user', JSON.stringify(user));
      setCurrentPage('dashboard');
    }
  };

  const handleManifestoAccept = () => {
    if (!acceptedManifesto) return;

    const user = {
      id: '1',
      email,
      username: fullName.trim(),
      commitmentDate: new Date(),
      commitmentLockedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      spiritualLevel: 1,
      isAdmin: false,
      activities: [],
    };
    setUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('virtus_user', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  if (showManifesto) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Termo de Compromisso</h1>
            <p className="text-xl text-muted-foreground">Silêncio Digital</p>
          </div>

          <div className="manifesto-text mb-8 space-y-6">
            <p>
              Eu, <strong>{email}</strong>, reconhecendo o poder das redes sociais em fragmentar minha atenção e afastar-me de Deus, declaro solenemente:
            </p>

            <div className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-lg">
              <p className="font-semibold mb-4">
                "Abandono as redes sociais como Instagram, TikTok, Facebook e similares, comprometendo-me a buscar o silêncio digital como caminho para ouvir a voz de Deus."
              </p>
            </div>

            <p>
              Compreendo que este aplicativo é um instrumento de conversão digital, não de entretenimento. Meu compromisso é:
            </p>

            <ul className="space-y-3 text-foreground">
              <li className="flex items-start">
                <span className="mr-3">✦</span>
                <span>Usar este app apenas 30 minutos por dia, respeitando o bloqueio automático.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✦</span>
                <span>Registrar minhas virtudes e hábitos espirituais com sinceridade.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✦</span>
                <span>Participar de uma comunidade de testemunho, sem buscar reconhecimento pessoal.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✦</span>
                <span>Permitir que meu progresso espiritual seja avaliado por meu líder/catequista.</span>
              </li>
            </ul>

            <p className="text-center italic text-muted-foreground">
              "Uma rede social para silenciar o mundo e ouvir Deus."
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedManifesto}
                onChange={(e) => setAcceptedManifesto(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-foreground">
                Aceito o Termo de Compromisso do Silêncio Digital e me comprometo com esta jornada espiritual.
              </span>
            </label>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowManifesto(false);
                  setEmail('');
                  setPassword('');
                  setIsSignUp(false);
                }}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleManifestoAccept}
                disabled={!acceptedManifesto}
                className="flex-1"
              >
                Aceitar e Continuar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Rede Virtus</h1>
          <p className="text-muted-foreground italic">Uma rede para eliminar as redes</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {isSignUp && (
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
          )}

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

          <Button type="submit" className="w-full">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-muted-foreground mb-4">
            {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setEmail('');
              setPassword('');
              setFullName('');
            }}
            className="w-full"
          >
            {isSignUp ? 'Entrar' : 'Criar Conta'}
          </Button>

          {!isSignUp && (
            <Button
              variant="ghost"
              onClick={() => setCurrentPage('invite-signup')}
              className="w-full text-sm"
            >
              Cadastrar com Código de Convite
            </Button>
          )}
        </div>

        <div className="mt-8 p-4 bg-accent/10 rounded-lg text-center">
          <p className="text-sm text-muted-foreground italic">
            "O silêncio também é uma oração."
          </p>
        </div>
      </Card>
    </div>
  );
}

