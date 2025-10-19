import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function MuralPage() {
  const { virtueRecords, setCurrentPage, user } = useVirtus();

  // Simular virtudes adicionais para demonstração
  const allVirtues = [
    {
      id: '0',
      text: 'Praticou a paciência hoje.',
      username: 'Maria Santos',
      time: '2 horas atrás',
    },
    {
      id: '1',
      text: 'Rezou o terço com devoção.',
      username: 'João Silva',
      time: '4 horas atrás',
    },
    {
      id: '2',
      text: 'Ajudou o próximo sem esperar reconhecimento.',
      username: 'Ana Costa',
      time: '6 horas atrás',
    },
    {
      id: '3',
      text: 'Resistiu à tentação digital.',
      username: 'Pedro Oliveira',
      time: '8 horas atrás',
    },
    ...virtueRecords.map((virtue) => ({
      id: virtue.id,
      text: virtue.virtueText,
      username: user?.username || 'Anônimo',
      time: 'Agora',
    })),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">Mural Coletivo</h1>
          <Button variant="outline" onClick={() => setCurrentPage('dashboard')}>
            Voltar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 mb-8 bg-accent/10 border-l-4 border-accent">
            <p className="text-lg text-foreground italic text-center">
              Uma rede social para silenciar o mundo e ouvir Deus.
            </p>
          </Card>

          <p className="text-muted-foreground text-center mb-8">
            Veja os testemunhos de fé de toda a comunidade. Conheça quem está cultivando virtudes e deixe-se inspirar por seus exemplos.
          </p>

          {/* Virtues Grid */}
          <div className="space-y-4">
            {allVirtues.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground italic">
                  Nenhuma virtude registrada ainda. Seja o primeiro a compartilhar!
                </p>
              </Card>
            ) : (
              allVirtues.map((virtue) => (
                <Card key={virtue.id} className="virtue-card">
                  <p className="text-foreground not-italic mb-3">{virtue.text}</p>
                  <div className="border-t border-border pt-3">
                    <p className="text-sm font-semibold text-primary mb-1">— {virtue.username}</p>
                    <p className="text-xs text-muted-foreground">{virtue.time}</p>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Call to Action */}
          <Card className="p-8 mt-12 bg-primary/10 border-2 border-primary text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Compartilhe Sua Virtude</h3>
            <p className="text-muted-foreground mb-6">
              Seu testemunho pode inspirar outros a cultivarem virtudes espirituais.
            </p>
            <Button onClick={() => setCurrentPage('register-virtue')} className="w-full">
              Registrar Minha Virtude
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}

