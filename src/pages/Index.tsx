import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import BuzzerGame from "@/components/BuzzerGame";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (username: string, adminStatus: boolean) => {
    setCurrentUser(username);
    setIsAdmin(adminStatus);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <BuzzerGame 
      currentUser={currentUser} 
      isAdmin={isAdmin} 
      onLogout={handleLogout} 
    />
  );
};

export default Index;
