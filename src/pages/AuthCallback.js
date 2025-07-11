// src/pages/AuthCallback.jsx
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkAuth } = useContext(AuthContext);

useEffect(() => {
    const authenticateWithGoogle = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (token) {
        try {
          // Store the token
          localStorage.setItem('token', token);
          
          // Verify the token and get user data
          await checkAuth();
          
          // Redirect to dashboard
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error('Google auth failed:', error);
          navigate('/login?error=auth_failed');
        }
      } else {
        navigate('/login?error=auth_failed');
      }
    };

    authenticateWithGoogle();
  }, [location, navigate, checkAuth]);

  return <div>Processing login...</div>;
}

export default AuthCallback;