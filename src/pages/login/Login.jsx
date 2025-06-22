import { useState } from 'react';
import { loginUser } from '@/firebase/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginUser(email, password);
      navigate('/');
    } catch (err) {
      // Missatges clars segons codi d’error de Firebase
      if (err.code === 'auth/user-not-found') {
        setError('No existeix cap usuari amb aquest correu.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Contrasenya incorrecta.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Format de correu no vàlid.');
      } else {
        setError('Error en iniciar sessió: ' + err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inicia sessió</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="email"
        placeholder="Correu electrònic"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contrasenya"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Iniciar sessió</button>
    </form>
  );
}
