import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/atoms/PrivateRoute';
import { Welcome } from './components/pages/Welcome';
import { CreateWallet } from './components/pages/CreateWallet';
import { Home } from './components/pages/Home';
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

  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/create-new-wallet" element={<CreateWallet />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      /
      <Route
        path="/transaction"
        element={
          <PrivateRoute>
            <Transaction />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
