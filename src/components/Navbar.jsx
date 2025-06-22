import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext.jsx';
import { tancarSessio } from '@/firebase/firebase';

export default function Navbar() {
  const { usuari } = useAuth();

  const logout = async () => {
    await tancarSessio();
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Inici</Link></li>
        {!usuari && <li><Link to="/login">Login</Link></li>}
        {!usuari && <li><Link to="/register">Registrar-se</Link></li>}
        {usuari && (
          <>
            <li>Benvingut, {usuari.email}</li>
            <li><button onClick={logout}>Tancar sessió</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}
