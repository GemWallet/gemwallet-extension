import { useState, useEffect } from 'react';

import * as Sentry from '@sentry/react';

import { RequestPayload } from '@gemwallet/constants';

import { loadFromChromeSessionStorage } from '../../utils';

export const useFetchFromSessionStorage = (key?: string) => {
  const [fetchedData, setFetchedData] = useState<RequestPayload | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (key) {
          const storedData = await loadFromChromeSessionStorage<string>(key, true);
          if (storedData) {
            setFetchedData(JSON.parse(storedData));
          }
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    fetchData();
  }, [key]);

  return { fetchedData };
};
