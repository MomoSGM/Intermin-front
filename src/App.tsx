import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import MissionsDisponibles from './pages/MissionsDisponibles';
import CreateEntreprise from './pages/CreateEntreprise';
import CreateInterimaire from './pages/CreateInterimaire';
import CreateMission from './pages/CreateMission';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// ProtectedRoute : redirige vers /login si l'utilisateur n'est pas connecté
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

// Layout : Navbar visible sur toutes les pages
function Layout() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes protégées — nécessitent d'être connecté */}
        <Route path="/" element={<ProtectedRoute><MissionsDisponibles /></ProtectedRoute>} />
        <Route path="/entreprise/nouveau" element={<ProtectedRoute><CreateEntreprise /></ProtectedRoute>} />
        <Route path="/interimaire/nouveau" element={<ProtectedRoute><CreateInterimaire /></ProtectedRoute>} />
        <Route path="/mission/nouvelle" element={<ProtectedRoute><CreateMission /></ProtectedRoute>} />

        {/* Toute URL inconnue → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    // AuthProvider enveloppe toute l'app → le contexte auth est accessible partout
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
