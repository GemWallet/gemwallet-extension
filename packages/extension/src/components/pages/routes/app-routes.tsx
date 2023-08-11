import * as Sentry from '@sentry/react';
import { Route, Routes } from 'react-router-dom';

import { PrivateRoute } from '../../atoms';
import { Login } from '../Login';
import { privateRoutes } from './private.routes';
import { publicRoutes } from './public.routes';

const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

export const AppRoutes: React.FC = () => {
  return (
    <SentryRoutes>
      {publicRoutes.map(({ element: Component, ...rest }) => (
        <Route key={rest.path} {...rest} element={<Component />} />
      ))}

      {privateRoutes.map(({ element: Component, ...rest }) => (
        <Route
          key={rest.path}
          {...rest}
          element={
            <PrivateRoute>
              <Component />
            </PrivateRoute>
          }
        />
      ))}

      <Route path="*" element={<Login />} />
    </SentryRoutes>
  );
};
