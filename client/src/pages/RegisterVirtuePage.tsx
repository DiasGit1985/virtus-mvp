import { useState } from 'react';
import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const VIRTUE_SUGGESTIONS = [
  'Rezei o terço.',
  'Agradeci por algo.',
  'Perdoei alguém.',
  'Ajudei o próximo.',
  'Meditei na Palavra de Deus.',
  'Fiz uma ação de caridade.',
  'Resisti à tentação digital.',
  'Pratiquei a paciência.',
  'Confessava meus pecados.',
  'Participei da Missa.',
];

export default function RegisterVirtuePage() {
  const { addVirtueRecord, setCurrentPage, user } = useVirtus();
  const [virtueText, setVirtueText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!virtueText.trim() || !user) return;

    const newVirtue = {
      id: Date.now().toString(),
      userId: user.id,
      virtueText: virtueText.trim(),
      createdAt: new Date(),
      isAnonymous: true,
    };

    addVirtueRecord(newVirtue);
    setSubmitted(true);
    setTimeout(() => {
      setCurrentPage('dashboard');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-6">Virtude Registrada!</h1>
          <div className="bg-accent/10 border-l-4 border-accent p-6 rounded-r-lg mb-8">
            <p className="text-lg text-foreground italic">
              "{virtueText}"
            </p>
          </div>
          <p className="text-muted-foreground mb-8">
            Seu testemunho foi compartilhado anonimamente no mural coletivo. Que Deus abençoe sua jornada!
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
          <h1 className="text-3xl font-bold text-foreground">Registrar Virtude</h1>
          <Button variant="outline" onClick={() => setCurrentPage('dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Compartilhe Sua Virtude
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Descreva a virtude ou ação que você praticou hoje:
                  </label>
                  <textarea
                    value={virtueText}
                    onChange={(e) => setVirtueText(e.target.value)}
                    placeholder="Ex: Rezei o terço..."
                    className="w-full p-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Seu nome não será exibido. Apenas sua ação será compartilhada anonimamente.
                  </p>
                </div>

                <Button type="submit" disabled={!virtueText.trim()} className="w-full">
                  Registrar Virtude
                </Button>
              </form>
            </Card>
          </div>

          {/* Suggestions */}
          <div>
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Ideias de Virtudes</h3>
              <div className="space-y-2">
                {VIRTUE_SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setVirtueText(suggestion)}
                    className="w-full text-left p-3 rounded-lg bg-muted hover:bg-accent/20 transition-colors text-foreground text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

