import { useState, useEffect } from 'react';
import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const VIRTUE_SUGGESTIONS = [
  'Praticou a paciência hoje',
  'Rezou o terço com devoção',
  'Ajudou o próximo sem esperar reconhecimento',
  'Resistiu à tentação digital',
  'Meditou sobre a Palavra de Deus',
  'Participou da missa com atenção',
  'Fez uma ação de caridade',
  'Perdoou alguém do coração',
];

const BIBLE_BOOKS = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
  'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel',
  '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras',
  'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios',
  'Eclesiastes', 'Cântico dos Cânticos', 'Isaías', 'Jeremias', 'Lamentações',
  'Ezequiel', 'Daniel', 'Oséias', 'Joel', 'Amós',
  'Obadias', 'Jonas', 'Miqueias', 'Naum', 'Habacuque',
  'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'Mateus', 'Marcos', 'Lucas', 'João', 'Atos',
  'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios',
  'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo',
  '2 Timóteo', 'Tito', 'Filemon', 'Hebreus', 'Tiago',
  '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João',
  'Judas', 'Apocalipse',
];

export default function RegisterVirtuePage() {
  const { user, addVirtueRecord, setCurrentPage } = useVirtus();
  const [tab, setTab] = useState<'virtue' | 'reading'>('virtue');
  const [virtueText, setVirtueText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Leitura
  const [readingType, setReadingType] = useState<'bible' | 'other'>('bible');
  const [selectedBook, setSelectedBook] = useState('');
  const [customBook, setCustomBook] = useState('');
  const [chapter, setChapter] = useState('1');
  const [isReading, setIsReading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  useEffect(() => {
    if (!isReading) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isReading]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVirtueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!virtueText.trim() || !user) return;

    const newVirtue = {
      id: Date.now().toString(),
      userId: user.id,
      virtueText: virtueText.trim(),
      createdAt: new Date(),
      isAnonymous: true,
      type: 'virtue' as const,
    };

    addVirtueRecord(newVirtue);
    setSubmitted(true);
    setTimeout(() => {
      setCurrentPage('dashboard');
    }, 2000);
  };

  const handleStartReading = () => {
    const book = readingType === 'bible' ? selectedBook : customBook;
    if (!book || !chapter) {
      alert('Por favor, selecione um livro e capítulo.');
      return;
    }
    setIsReading(true);
    setElapsedSeconds(0);
  };

  const handleStopReading = () => {
    setIsReading(false);
    setShowPublishDialog(true);
  };

  const handlePublishReading = () => {
    if (!user) return;

    const book = readingType === 'bible' ? selectedBook : customBook;
    const virtueRecord = {
      id: Date.now().toString(),
      userId: user.id,
      virtueText: `${user.username} fez ${elapsedSeconds > 60 ? Math.floor(elapsedSeconds / 60) : elapsedSeconds} ${elapsedSeconds > 60 ? 'minutos' : 'segundos'} de leitura do livro ${book} ${chapter}.`,
      createdAt: new Date(),
      isAnonymous: false,
      type: 'bible_reading' as const,
    };

    addVirtueRecord(virtueRecord);
    setShowPublishDialog(false);
    setCurrentPage('dashboard');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Virtude Registrada!</h2>
          <p className="text-muted-foreground mb-6">
            Sua virtude foi registrada com sucesso. Obrigado por compartilhar sua jornada espiritual.
          </p>
          <div className="animate-pulse">
            <div className="text-4xl mb-4">✦</div>
          </div>
        </Card>
      </div>
    );
  }

  if (showPublishDialog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Parabéns!</h2>
          <p className="text-muted-foreground mb-6">
            Você leu por {formatTime(elapsedSeconds)}. Deseja compartilhar essa atitude no mural para inspirar outros?
          </p>

          <div className="space-y-4">
            <Button onClick={handlePublishReading} className="w-full">
              Publicar no Mural
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowPublishDialog(false);
                setCurrentPage('dashboard');
              }}
              className="w-full"
            >
              Não Publicar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Registrar Virtude</h1>
          <Button variant="ghost" onClick={() => setCurrentPage('dashboard')}>
            Voltar
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setTab('virtue')}
            variant={tab === 'virtue' ? 'default' : 'outline'}
            className="flex-1"
          >
            Virtude
          </Button>
          <Button
            onClick={() => setTab('reading')}
            variant={tab === 'reading' ? 'default' : 'outline'}
            className="flex-1"
          >
            Leitura
          </Button>
        </div>

        {/* Virtue Tab */}
        {tab === 'virtue' && (
          <Card className="p-8 mb-8">
            <form onSubmit={handleVirtueSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Sugestões de Virtudes
                </label>
                <div className="grid grid-cols-1 gap-2 mb-6">
                  {VIRTUE_SUGGESTIONS.map((virtue) => (
                    <button
                      key={virtue}
                      type="button"
                      onClick={() => setVirtueText(virtue)}
                      className="text-left p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <p className="text-foreground">{virtue}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Ou descreva sua virtude
                </label>
                <textarea
                  value={virtueText}
                  onChange={(e) => setVirtueText(e.target.value)}
                  placeholder="Descreva a virtude que você praticou hoje..."
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Registrar Virtude
              </Button>
            </form>
          </Card>
        )}

        {/* Reading Tab */}
        {tab === 'reading' && (
          <Card className="p-8 mb-8">
            {!isReading ? (
              <form onSubmit={(e) => { e.preventDefault(); handleStartReading(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Tipo de Leitura
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={readingType === 'bible'}
                        onChange={() => setReadingType('bible')}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground">Bíblia Sagrada</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={readingType === 'other'}
                        onChange={() => setReadingType('other')}
                        className="w-4 h-4"
                      />
                      <span className="text-foreground">Outro Livro</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {readingType === 'bible' ? 'Livro da Bíblia' : 'Nome do Livro'}
                  </label>
                  {readingType === 'bible' ? (
                    <select
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                    >
                      <option value="">Selecione um livro</option>
                      {BIBLE_BOOKS.map((book) => (
                        <option key={book} value={book}>
                          {book}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type="text"
                      value={customBook}
                      onChange={(e) => setCustomBook(e.target.value)}
                      placeholder="Digite o nome do livro"
                      className="w-full"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Capítulo / Página
                  </label>
                  <Input
                    type="number"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    min="1"
                    max="200"
                    className="w-full"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Iniciar Leitura
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-8">
                <div>
                  <p className="text-muted-foreground mb-2">Lendo agora</p>
                  <h2 className="text-2xl font-bold text-foreground">
                    {readingType === 'bible' ? selectedBook : customBook} {chapter}
                  </h2>
                </div>

                <div className="bg-accent/10 rounded-lg p-8">
                  <div className="text-5xl font-bold text-primary mb-4">
                    {formatTime(elapsedSeconds)}
                  </div>
                  <p className="text-muted-foreground">Tempo de leitura</p>
                </div>

                <Button onClick={handleStopReading} variant="destructive" className="w-full">
                  Encerrar Leitura
                </Button>
              </div>
            )}
          </Card>
        )}

        {tab === 'reading' && !isReading && (
          <Card className="p-6 bg-muted">
            <h3 className="font-semibold text-foreground mb-3">Dica Espiritual</h3>
            <p className="text-sm text-muted-foreground">
              A leitura da Bíblia e de bons livros é um ato de comunhão com Deus. Dedique um tempo para meditar na Palavra e deixe que ela transforme seu coração.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

