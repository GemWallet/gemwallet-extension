import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './components/atoms/PrivateRoute';
import { Login } from './components/pages/Login';
import { Welcome } from './components/pages/Welcome';
import { CreateWallet } from './components/pages/CreateWallet';
import { ImportSeed } from './components/pages/ImportSeed';
import { Home } from './components/pages/Home';
import { Transaction } from './components/pages/Transaction';
import { ErrorBoundary } from './components/templates';

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
    <ErrorBoundary>
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/import-seed" element={<ImportSeed />} />
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
    </ErrorBoundary>
  );
}

export default App;
