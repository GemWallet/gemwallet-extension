import { useContext } from 'react';
import * as Sentry from '@sentry/react';
import { NavBarPositionContext, NavBarPositionContextType } from './NavBarContext';

export const useNavBarPosition = (): NavBarPositionContextType => {
  const context = useContext(NavBarPositionContext);

  if (context === undefined) {
    const error = new Error('useNavBarPosition must be used within a NavBarPositionProvider');
    Sentry.captureException(error);
    throw error;
  }

  return context;
};
