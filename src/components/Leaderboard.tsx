import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Target, Crown } from "lucide-react";

interface Player {
  id: string;
  name: string;
  score: number;
  lastBuzzTime?: number;
}

interface LeaderboardProps {
  players: Player[];
  currentUser: string;
}

export default function Leaderboard({ players, currentUser }: LeaderboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <Target className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-secondary text-secondary-foreground animate-winner-glow";
      case 1:
        return "bg-gray-400 text-gray-900";
      case 2:
        return "bg-orange-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getProgressBarWidth = (score: number) => {
    const maxScore = Math.max(...players.map(p => p.score), 100);
    return Math.max((score / maxScore) * 100, 2);
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-lg text-foreground flex items-center gap-2">
          <Trophy className="w-5 h-5 text-secondary" />
          Live Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id}
            className={`
              p-4 rounded-lg border transition-all duration-300 animate-fade-in
              ${player.name === currentUser 
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-background/30 border-border'
              }
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Rank */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${getRankBadge(index)}
                `}>
                  {index + 1}
                </div>

                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getRankIcon(index)}
                    <span className={`font-semibold ${
                      player.name === currentUser ? 'text-primary' : 'text-foreground'
                    }`}>
                      {player.name}
                    </span>
                    {player.name === currentUser && (
                      <Badge variant="outline" className="text-primary border-primary">
                        You
                      </Badge>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-background/50 rounded-full h-2 mb-1">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-gradient-secondary' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-500' :
                        'bg-muted'
                      }`}
                      style={{ width: `${getProgressBarWidth(player.score)}%` }}
                    />
                  </div>
                  
                  {/* Last Buzz Time */}
                  {player.lastBuzzTime && (
                    <p className="text-xs text-muted-foreground">
                      Last buzz: {new Date(player.lastBuzzTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    index === 0 ? 'text-secondary' :
                    player.name === currentUser ? 'text-primary' :
                    'text-foreground'
                  }`}>
                    {player.score}
                  </div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
              </div>
            </div>

            {/* Special Effects for Top 3 */}
            {index === 0 && (
              <div className="mt-2 text-center">
                <Badge className="bg-gradient-secondary text-secondary-foreground animate-winner-glow">
                  🏆 Leading the Pack!
                </Badge>
              </div>
            )}
            {index === 1 && player.score > 0 && (
              <div className="mt-2 text-center">
                <Badge variant="secondary" className="bg-gray-400 text-gray-900">
                  🥈 Close Second!
                </Badge>
              </div>
            )}
            {index === 2 && player.score > 0 && (
              <div className="mt-2 text-center">
                <Badge variant="outline" className="border-orange-500 text-orange-500">
                  🥉 Bronze Position!
                </Badge>
              </div>
            )}
          </div>
        ))}

        {players.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No players yet. Waiting for contestants to join...</p>
          </div>
        )}

        {/* Game Stats */}
        <div className="mt-4 p-3 bg-background/30 rounded-lg border border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-foreground">
                {players.length}
              </div>
              <div className="text-xs text-muted-foreground">Active Players</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {Math.max(...players.map(p => p.score), 0)}
              </div>
              <div className="text-xs text-muted-foreground">High Score</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}