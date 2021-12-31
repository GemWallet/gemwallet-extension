import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { PrivateRoute } from './components/atoms/PrivateRoute';
import { Login } from './components/pages/Login';
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
      <Route path="/login" element={<Login />} />
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
