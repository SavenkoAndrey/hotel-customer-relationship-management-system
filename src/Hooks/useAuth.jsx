import { useState, useEffect } from 'react';

function useAuth() {
  // const userToken = localStorage.getItem('username');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('username') || sessionStorage.getItem('temporaryToken'));
  
  useEffect(() => {
    const storageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('username') || sessionStorage.getItem('temporaryToken'));
    };

    // add EventListener for storage 
    window.addEventListener('storage', storageChange);

    // Clean EventListener when unmounting a component 
    return () => {
      window.removeEventListener('storage', storageChange);
    };
  }, []);

  return isAuthenticated;
}

export default useAuth;
