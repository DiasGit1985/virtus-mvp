import { useState, useEffect } from 'react';
import { useVirtus } from '@/contexts/VirtusContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const bibleBooks = [
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

export default function BibleReadingPage() {
  const { user, currentReadingSession, setCurrentReadingSession, addBibleReading, addVirtueRecord, setCurrentPage } = useVirtus();
  const [selectedBook, setSelectedBook] = useState(currentReadingSession?.book || '');
  const [chapter, setChapter] = useState(currentReadingSession?.chapter?.toString() || '1');
  const [isReading, setIsReading] = useState(!!currentReadingSession);
  const [elapsedSeconds, setElapsedSeconds] = useState(currentReadingSession?.durationSeconds || 0);
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

  const handleStartReading = () => {
    if (!selectedBook || !chapter) {
      alert('Por favor, selecione um livro e capítulo.');
      return;
    }

    const session: typeof currentReadingSession = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      book: selectedBook,
      chapter: parseInt(chapter),
      startTime: new Date(),
      durationSeconds: 0,
      publishedToMural: false,
    };

    setCurrentReadingSession(session);
    setIsReading(true);
    setElapsedSeconds(0);
  };

  const handleStopReading = () => {
    if (!currentReadingSession) return;

    const reading = {
      ...currentReadingSession,
      endTime: new Date(),
      durationSeconds: elapsedSeconds,
    };

    setCurrentReadingSession(undefined);
    setIsReading(false);
    setShowPublishDialog(true);

    // Salvar a leitura
    addBibleReading(reading);
  };

  const handlePublishToMural = () => {
    if (!currentReadingSession || !user) return;

    const virtueRecord = {
      id: Date.now().toString(),
      userId: user.id,
      virtueText: `Leu ${currentReadingSession.book} ${currentReadingSession.chapter} por ${formatTime(elapsedSeconds)}.`,
      createdAt: new Date(),
      isAnonymous: true,
      type: 'bible_reading' as const,
    };

    addVirtueRecord(virtueRecord);
    setShowPublishDialog(false);
    setCurrentPage('dashboard');
  };

  if (showPublishDialog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Parabéns!</h2>
          <p className="text-muted-foreground mb-6">
            Você leu por {formatTime(elapsedSeconds)}. Deseja compartilhar essa atitude no mural para inspirar outros?
          </p>

          <div className="space-y-4">
            <Button onClick={handlePublishToMural} className="w-full">
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
          <h1 className="text-3xl font-bold text-foreground">Leitura da Bíblia</h1>
          <Button variant="ghost" onClick={() => setCurrentPage('dashboard')}>
            Voltar
          </Button>
        </div>

        <Card className="p-8 mb-8">
          {!isReading ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Livro da Bíblia
                </label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Selecione um livro</option>
                  {bibleBooks.map((book) => (
                    <option key={book} value={book}>
                      {book}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Capítulo
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

              <Button onClick={handleStartReading} className="w-full">
                Iniciar Leitura
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-8">
              <div>
                <p className="text-muted-foreground mb-2">Lendo agora</p>
                <h2 className="text-2xl font-bold text-foreground">
                  {currentReadingSession?.book} {currentReadingSession?.chapter}
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

        {!isReading && (
          <Card className="p-6 bg-muted">
            <h3 className="font-semibold text-foreground mb-3">Dica Espiritual</h3>
            <p className="text-sm text-muted-foreground">
              A leitura da Bíblia é um ato de comunhão com Deus. Dedique um tempo para meditar na Palavra e deixe que ela transforme seu coração.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

