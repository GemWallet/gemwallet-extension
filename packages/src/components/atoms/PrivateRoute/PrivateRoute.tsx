import { Navigate, useLocation } from 'react-router-dom';
import { useLedger } from '../../../contexts/LedgerContext';

export function PrivateRoute({ children }: { children: JSX.Element }): JSX.Element {
  const { wallet } = useLedger();
  const location = useLocation();
  const { search } = location;

  if (!wallet) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to={`/${search}`} state={{ from: location }} replace />;
  }

  return children;
}
