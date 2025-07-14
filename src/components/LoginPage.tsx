import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Zap, Trophy, Users } from "lucide-react";

interface LoginPageProps {
  onLogin: (username: string, isAdmin: boolean) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte geben Sie Benutzername und Passwort ein",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate authentication - replace with real Supabase auth
    setTimeout(() => {
      const isAdmin = password === "admin123";
      onLogin(username.trim(), isAdmin);
      toast({
        title: isAdmin ? "Admin-Anmeldung erfolgreich" : "Anmeldung erfolgreich",
        description: `Willkommen ${username}! ${isAdmin ? "Sie haben Administrator-Rechte." : "Bereit zum Wettkampf!"}`,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full mb-4 animate-buzzer-pulse">
            <Zap className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Quiz Show Buzzer
          </h1>
          <p className="text-muted-foreground text-lg">
            Betreten Sie die Arena des Wissens
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Am Spiel teilnehmen</CardTitle>
            <CardDescription className="text-muted-foreground">
              Geben Sie Ihre Anmeldedaten ein, um an der Quiz-Show teilzunehmen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Benutzername</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Benutzername eingeben"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/50 border-border text-foreground"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Passwort eingeben"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-border text-foreground"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold py-3 transition-all duration-200 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? "Anmelden..." : "Spiel betreten"}
              </Button>
            </form>

            {/* Quick Access Info */}
            <div className="mt-6 p-4 bg-background/30 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Schnellzugang
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Passwort "admin123" für Administrator-Zugang</p>
                <p>• Beliebiges anderes Passwort für Teilnehmer-Zugang</p>
                <p>• Benutzername wird als Anzeigename verwendet</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gradient-card rounded-lg shadow-card animate-bounce-subtle">
            <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Schneller Buzzer</p>
          </div>
          <div className="p-3 bg-gradient-card rounded-lg shadow-card animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
            <Trophy className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Live-Punktzahl</p>
          </div>
          <div className="p-3 bg-gradient-card rounded-lg shadow-card animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>
            <Users className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Mehrspieler</p>
          </div>
        </div>
      </div>
    </div>
  );
}