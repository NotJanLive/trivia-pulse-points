import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Award, Target } from "lucide-react";

interface Player {
  id: string;
  name: string;
  score: number;
  lastBuzzTime?: number;
}

interface PlayerScoringProps {
  players: Player[];
  onUpdateScore: (playerId: string, newScore: number) => void;
}

export default function PlayerScoring({ players, onUpdateScore }: PlayerScoringProps) {
  const [customScores, setCustomScores] = useState<{ [key: string]: string }>({});

  const quickAdjustScore = (player: Player, adjustment: number) => {
    const newScore = Math.max(0, player.score + adjustment);
    onUpdateScore(player.id, newScore);
  };

  const setCustomScore = (player: Player) => {
    const customScore = customScores[player.id];
    if (customScore !== undefined && customScore !== '') {
      const newScore = Math.max(0, parseInt(customScore) || 0);
      onUpdateScore(player.id, newScore);
      setCustomScores(prev => ({ ...prev, [player.id]: '' }));
    }
  };

  const handleCustomScoreChange = (playerId: string, value: string) => {
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setCustomScores(prev => ({ ...prev, [playerId]: value }));
    }
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-lg text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-secondary" />
          Player Scoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id} 
            className="p-4 bg-background/30 rounded-lg border border-border animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-gradient-secondary text-secondary-foreground' :
                  index === 1 ? 'bg-gray-400 text-gray-900' :
                  index === 2 ? 'bg-orange-500 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{player.name}</h4>
                  <p className="text-sm text-muted-foreground">Current: {player.score} points</p>
                </div>
              </div>
              
              {index === 0 && (
                <Badge className="bg-gradient-secondary text-secondary-foreground animate-winner-glow">
                  Leader
                </Badge>
              )}
            </div>

            {/* Quick Adjust Buttons */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-muted-foreground w-16">Quick:</span>
              <Button
                size="sm"
                onClick={() => quickAdjustScore(player, -10)}
                disabled={player.score < 10}
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <Minus className="w-3 h-3 mr-1" />
                10
              </Button>
              <Button
                size="sm"
                onClick={() => quickAdjustScore(player, -5)}
                disabled={player.score < 5}
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <Minus className="w-3 h-3 mr-1" />
                5
              </Button>
              <Button
                size="sm"
                onClick={() => quickAdjustScore(player, 5)}
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
              >
                <Plus className="w-3 h-3 mr-1" />
                5
              </Button>
              <Button
                size="sm"
                onClick={() => quickAdjustScore(player, 10)}
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
              >
                <Plus className="w-3 h-3 mr-1" />
                10
              </Button>
              <Button
                size="sm"
                onClick={() => quickAdjustScore(player, 25)}
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
              >
                <Plus className="w-3 h-3 mr-1" />
                25
              </Button>
            </div>

            {/* Custom Score Input */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-16">Set to:</span>
              <Input
                type="text"
                placeholder="Enter score"
                value={customScores[player.id] || ''}
                onChange={(e) => handleCustomScoreChange(player.id, e.target.value)}
                className="flex-1 bg-background/50 border-border text-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setCustomScore(player);
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => setCustomScore(player)}
                disabled={!customScores[player.id] || customScores[player.id] === ''}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                <Target className="w-3 h-3 mr-1" />
                Set
              </Button>
            </div>
          </div>
        ))}

        <div className="text-sm text-muted-foreground bg-background/30 p-3 rounded-lg">
          <p className="font-semibold mb-1">Scoring Guidelines:</p>
          <ul className="space-y-1">
            <li>• Award 5-10 points for correct answers</li>
            <li>• Award 25+ points for difficult questions</li>
            <li>• Deduct points for wrong answers if needed</li>
            <li>• Use "Set to" for precise score adjustments</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}