import React, { Suspense } from 'react';

import { render as rtlRender } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';

import i18n from './i18n';

const i18nextRender = (ui: React.ReactElement) => {
  return rtlRender(
    <Suspense fallback=''>
      <I18nextProvider i18n={i18n}>{ui}</I18nextProvider>
    </Suspense>
  );
};

export * from '@testing-library/react';
export { i18nextRender as render };