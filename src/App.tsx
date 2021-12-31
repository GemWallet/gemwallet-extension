import { useEffect } from 'react';
import { Login } from './components/pages/Login';

function App() {
  useEffect(() => {
    // Disable the scroll inside the react root container
    document.querySelector('#root')?.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }, []);

  return <Login />;
}

export default App;
