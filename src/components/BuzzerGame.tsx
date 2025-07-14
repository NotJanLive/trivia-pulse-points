import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Zap, RotateCcw, Trophy, Crown, Users, Timer } from "lucide-react";
import PlayerScoring from "./PlayerScoring";
import Leaderboard from "./Leaderboard";

interface Player {
  id: string;
  name: string;
  score: number;
  lastBuzzTime?: number;
}

interface BuzzerGameProps {
  currentUser: string;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function BuzzerGame({ currentUser, isAdmin, onLogout }: BuzzerGameProps) {
  const [players, setPlayers] = useState<Player[]>(
    isAdmin ? [] : [{ id: '1', name: currentUser, score: 0 }]
  );
  const [buzzerPressed, setBuzzerPressed] = useState<string | null>(null);
  const [buzzerLocked, setBuzzerLocked] = useState(false);
  const [roundActive, setRoundActive] = useState(true);
  const [buzzTime, setBuzzTime] = useState<number | null>(null);
  const { toast } = useToast();

  // Auto-add non-admin users as players
  useEffect(() => {
    if (!isAdmin && !players.some(p => p.name === currentUser)) {
      setPlayers(prev => [...prev, { id: Date.now().toString(), name: currentUser, score: 0 }]);
    }
  }, [isAdmin, currentUser, players]);

  const handleBuzzer = () => {
    if (buzzerLocked || !roundActive || isAdmin) return;

    const currentTime = Date.now();
    setBuzzerPressed(currentUser);
    setBuzzerLocked(true);
    setBuzzTime(currentTime);
    setRoundActive(false);

    // Update player's last buzz time
    setPlayers(prev => 
      prev.map(p => 
        p.name === currentUser 
          ? { ...p, lastBuzzTime: currentTime }
          : p
      )
    );

    toast({
      title: "🚨 BUZZ!",
      description: `${currentUser} hat zuerst gebuzzert!`,
      duration: 3000,
    });

    // Add some excitement with sound effect simulation
    setTimeout(() => {
      toast({
        title: "🎯 Bereit zum Antworten",
        description: "Zeit, Ihr Wissen zu zeigen!",
        duration: 2000,
      });
    }, 1000);
  };

  const resetBuzzer = () => {
    setBuzzerPressed(null);
    setBuzzerLocked(false);
    setRoundActive(true);
    setBuzzTime(null);
    
    toast({
      title: "🔄 Buzzer zurückgesetzt",
      description: "Nächste Runde bereit - Buzzer sind aktiv!",
    });
  };

  const updatePlayerScore = (playerId: string, newScore: number) => {
    setPlayers(prev => 
      prev.map(p => 
        p.id === playerId ? { ...p, score: newScore } : p
      )
    );
    
    const player = players.find(p => p.id === playerId);
    toast({
      title: "Punktzahl aktualisiert!",
      description: `${player?.name} hat jetzt ${newScore} Punkte`,
    });
  };

  const winner = players.length > 0 
    ? players.reduce((prev, current) => 
        prev.score > current.score ? prev : current
      )
    : { id: '', name: 'Keine Spieler', score: 0 };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center animate-buzzer-pulse">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
            <h1 className="text-3xl font-bold text-foreground">Quiz Show Buzzer</h1>
            <p className="text-muted-foreground">
              {isAdmin ? `Administrator-Modus - ${currentUser}` : `Spieler: ${currentUser}`}
            </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-foreground border-border">
              <Users className="w-4 h-4 mr-1" />
              {players.length} Spieler
            </Badge>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="border-border text-foreground hover:bg-background/50"
            >
              Abmelden
            </Button>
          </div>
        </div>

        {/* Game Status */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${roundActive ? 'bg-correct-green animate-pulse' : 'bg-wrong-red'}`} />
                <span className="text-foreground font-medium">
                  {roundActive ? 'Runde aktiv - Buzzer bereit!' : 'Runde gesperrt'}
                </span>
                {buzzTime && (
                  <Badge variant="secondary" className="text-secondary-foreground">
                    <Timer className="w-3 h-3 mr-1" />
                    {new Date(buzzTime).toLocaleTimeString()}
                  </Badge>
                )}
              </div>
              
              {buzzerPressed && (
                <div className="flex items-center gap-2 animate-winner-glow">
                  <Crown className="w-5 h-5 text-secondary" />
                  <span className="text-secondary font-bold">
                    {buzzerPressed} hat zuerst gebuzzert!
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Buzzer Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Buzzer */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Buzzer-System
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              {!isAdmin ? (
                <button
                  onClick={handleBuzzer}
                  disabled={buzzerLocked || !roundActive}
                  className={`
                    w-48 h-48 rounded-full text-4xl font-bold transition-all duration-200 transform
                    ${!buzzerLocked && roundActive
                      ? 'bg-gradient-to-b from-buzzer-red to-red-600 hover:scale-105 shadow-buzzer animate-buzzer-pulse text-white border-4 border-red-300'
                      : 'bg-gray-600 cursor-not-allowed text-gray-400 border-4 border-gray-500'
                    }
                    ${buzzerPressed === currentUser ? 'animate-winner-glow bg-gradient-secondary' : ''}
                  `}
                >
                  {buzzerPressed === currentUser ? 'SIE HABEN GEBUZZERT!' : 'BUZZ!'}
                </button>
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold text-gray-600">
                  ADMIN
                </div>
              )}
              
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  {isAdmin 
                    ? "Administrator können nicht buzzern"
                    : roundActive 
                      ? "Klicken Sie den Buzzer, um zuerst zu antworten!" 
                      : buzzerPressed 
                        ? `${buzzerPressed} ist an der Reihe`
                        : "Warten auf nächste Runde..."
                  }
                </p>
                
                {!isAdmin && buzzerPressed && buzzerPressed !== currentUser && (
                  <Badge variant="outline" className="text-muted-foreground border-border">
                    Zu langsam! Viel Glück beim nächsten Mal.
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Admin Controls */}
          {isAdmin && (
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground flex items-center gap-2">
                  <Crown className="w-5 h-5 text-secondary" />
                  Administrator-Kontrollen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={resetBuzzer}
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Buzzer für nächste Runde zurücksetzen
                </Button>
                
                <div className="text-sm text-muted-foreground bg-background/30 p-3 rounded-lg">
                  <p className="font-semibold mb-1">Administrator-Tipps:</p>
                  <ul className="space-y-1">
                    <li>• Buzzer nach jeder Frage zurücksetzen</li>
                    <li>• Punkte über das Bewertungsfeld vergeben</li>
                    <li>• Bestenliste für Spielfortschritt überwachen</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Player Scoring (Admin Only) */}
          {isAdmin && (
            <PlayerScoring 
              players={players} 
              onUpdateScore={updatePlayerScore}
            />
          )}
        </div>

        {/* Leaderboard */}
        <div className="space-y-6">
          <Leaderboard players={players} currentUser={currentUser} />
          
          {/* Current Winner */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                Aktueller Führender
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3 animate-winner-glow">
                  <Crown className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{winner.name}</h3>
                <p className="text-2xl font-bold text-secondary">{winner.score} Punkte</p>
                {winner.name === currentUser && !isAdmin && winner.id !== '' && (
                  <Badge className="mt-2 bg-gradient-secondary text-secondary-foreground">
                    Das sind Sie! 🎉
                  </Badge>
                )}
                {winner.id === '' && (
                  <p className="text-sm text-muted-foreground mt-2">Warten auf Spieler...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}