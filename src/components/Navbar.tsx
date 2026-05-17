import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/interMin.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="InterMin" className="navbar-logo" />
      </Link>

      <div className="navbar-links">
        {!user ? (
          // Non connecté → affiche Se connecter et S'inscrire
          <>
            <Link to="/login">Se connecter</Link>
            <Link to="/register" className="btn-primary">S'inscrire</Link>
          </>
        ) : user.role === 'ENTREPRISE' ? (
          // Connecté en tant qu'Entreprise
          <>
            <Link to="/">Missions</Link>
            <Link to="/mission/nouvelle">+ Mission</Link>
            <span className="navbar-nom">Bonjour, {user.nom}</span>
            <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
          </>
        ) : (
          // Connecté en tant qu'Intérimaire
          <>
            <Link to="/">Missions disponibles</Link>
            <span className="navbar-nom">Bonjour, {user.nom}</span>
            <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
          </>
        )}
      </div>
    </nav>
  );
}
