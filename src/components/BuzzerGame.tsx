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
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: currentUser, score: 0 }
  ]);
  const [buzzerPressed, setBuzzerPressed] = useState<string | null>(null);
  const [buzzerLocked, setBuzzerLocked] = useState(false);
  const [roundActive, setRoundActive] = useState(true);
  const [buzzTime, setBuzzTime] = useState<number | null>(null);
  const { toast } = useToast();

  // Initialize other players (simulate multiplayer)
  useEffect(() => {
    if (!isAdmin && players.length === 1) {
      const demoPlayers = [
        { id: '2', name: 'Alex', score: 150 },
        { id: '3', name: 'Sam', score: 200 },
        { id: '4', name: 'Jordan', score: 100 },
      ];
      setPlayers(prev => [...prev, ...demoPlayers]);
    }
  }, [isAdmin, players.length]);

  const handleBuzzer = () => {
    if (buzzerLocked || !roundActive) return;

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
      description: `${currentUser} buzzed in first!`,
      duration: 3000,
    });

    // Add some excitement with sound effect simulation
    setTimeout(() => {
      toast({
        title: "🎯 Ready to Answer",
        description: "Time to show your knowledge!",
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
      title: "🔄 Buzzer Reset",
      description: "Next round ready - buzzers are active!",
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
      title: "Score Updated!",
      description: `${player?.name} now has ${newScore} points`,
    });
  };

  const winner = players.reduce((prev, current) => 
    prev.score > current.score ? prev : current
  );

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
                {isAdmin ? `Admin Mode - ${currentUser}` : `Player: ${currentUser}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-foreground border-border">
              <Users className="w-4 h-4 mr-1" />
              {players.length} Players
            </Badge>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="border-border text-foreground hover:bg-background/50"
            >
              Logout
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
                  {roundActive ? 'Round Active - Buzzers Ready!' : 'Round Locked'}
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
                    {buzzerPressed} buzzed first!
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
                Buzzer System
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
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
                {buzzerPressed === currentUser ? 'YOU BUZZED!' : 'BUZZ!'}
              </button>
              
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  {roundActive 
                    ? "Click the buzzer to answer first!" 
                    : buzzerPressed 
                      ? `${buzzerPressed} has the floor`
                      : "Waiting for next round..."
                  }
                </p>
                
                {!isAdmin && buzzerPressed && buzzerPressed !== currentUser && (
                  <Badge variant="outline" className="text-muted-foreground border-border">
                    Too slow! Better luck next time.
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
                  Admin Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={resetBuzzer}
                  className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Buzzer for Next Round
                </Button>
                
                <div className="text-sm text-muted-foreground bg-background/30 p-3 rounded-lg">
                  <p className="font-semibold mb-1">Admin Tips:</p>
                  <ul className="space-y-1">
                    <li>• Reset buzzer after each question</li>
                    <li>• Award points using the scoring panel</li>
                    <li>• Monitor the leaderboard for game progress</li>
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
                Current Leader
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-3 animate-winner-glow">
                  <Crown className="w-8 h-8 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{winner.name}</h3>
                <p className="text-2xl font-bold text-secondary">{winner.score} points</p>
                {winner.name === currentUser && (
                  <Badge className="mt-2 bg-gradient-secondary text-secondary-foreground">
                    That's you! 🎉
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}