import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  token: string;
  role: string;
  nom: string;
  entityId: number | null; // id de l'Entreprise ou de l'Intérimaire lié au compte
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Charge l'utilisateur depuis localStorage au démarrage (persistance entre rechargements)
function loadUser(): AuthUser | null {
  const raw = localStorage.getItem('auth');
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUser);

  const login = (authUser: AuthUser) => {
    localStorage.setItem('auth', JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour accéder au contexte facilement dans n'importe quel composant
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
