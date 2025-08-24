import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../helpers/useAuth';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      fetch(`${process.env.REACT_APP_API_PAYMENT}/stripe/verify-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ sessionId })
      }).then(() => refreshUser(), navigate('/dashboard'));
    }
  }, []);

  return <div>Paiement réussi ! Redirection en cours...</div>;
}