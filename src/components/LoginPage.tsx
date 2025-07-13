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
        title: "Missing Information",
        description: "Please enter both username and password",
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
        title: isAdmin ? "Admin Login Successful" : "Login Successful",
        description: `Welcome ${username}! ${isAdmin ? "You have admin privileges." : "Ready to compete!"}`,
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
            Enter the arena of knowledge
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Join the Game</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to participate in the quiz show
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/50 border-border text-foreground"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
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
                {isLoading ? "Joining..." : "Enter Game"}
              </Button>
            </form>

            {/* Quick Access Info */}
            <div className="mt-6 p-4 bg-background/30 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Quick Access
              </h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>• Use password "admin123" for admin access</p>
                <p>• Any other password for contestant access</p>
                <p>• Username becomes your display name</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gradient-card rounded-lg shadow-card animate-bounce-subtle">
            <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Fast Buzzer</p>
          </div>
          <div className="p-3 bg-gradient-card rounded-lg shadow-card animate-bounce-subtle" style={{ animationDelay: '0.2s' }}>
            <Trophy className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Live Scoring</p>
          </div>
          <div className="p-3 bg-gradient-card rounded-lg shadow-card animate-bounce-subtle" style={{ animationDelay: '0.4s' }}>
            <Users className="w-6 h-6 text-accent mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Multiplayer</p>
          </div>
        </div>
      </div>
    </div>
  );
}