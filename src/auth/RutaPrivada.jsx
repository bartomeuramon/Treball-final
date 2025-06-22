// RutaPrivada.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function RutaPrivada({ children }) {
  const { usuari } = useAuth();

  if (!usuari) return <Navigate to="/login" replace />;
  return children;
}

