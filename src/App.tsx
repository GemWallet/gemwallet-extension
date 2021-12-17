import { useEffect } from 'react';
import { Transaction } from './components/pages/Transaction';

function App() {
  useEffect(() => {
    // Disable the scroll inside the react root container
    document.querySelector('#root')?.addEventListener('wheel', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
  }, []);

  return <Transaction />;
}

export default App;
