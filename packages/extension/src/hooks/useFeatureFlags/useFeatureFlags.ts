import { useState, useEffect } from 'react';

import { STORAGE_FEATURE_FLAGS, TTL_FEATURE_FLAGS } from '../../constants';

interface FeatureFlagsData {
  data: Record<string, boolean>;
  expiration: number;
}

const isDataWithinTTL = (data: FeatureFlagsData) => {
  return new Date().getTime() - data.expiration < TTL_FEATURE_FLAGS;
};

const fetchAndSaveFeatureFlags = async (): Promise<Record<string, boolean>> => {
  if (!process.env.REACT_APP_FEATURE_FLAGS_URL) {
    return {};
  }

  const response = await fetch(process.env.REACT_APP_FEATURE_FLAGS_URL);

  if (!response.ok) {
    return {};
  }

  const data: Record<string, boolean> = await response.json();
  const featureFlagsData: FeatureFlagsData = {
    data,
    expiration: new Date().getTime() + TTL_FEATURE_FLAGS
  };

  localStorage.setItem(STORAGE_FEATURE_FLAGS, JSON.stringify(featureFlagsData));
  return data;
};

export const useFeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const cachedData = localStorage.getItem(STORAGE_FEATURE_FLAGS);

        if (cachedData) {
          const parsedData: FeatureFlagsData = JSON.parse(cachedData);

          if (isDataWithinTTL(parsedData)) {
            setFeatureFlags(parsedData.data);
            setLoading(false);
            return;
          }
        }

        const data = await fetchAndSaveFeatureFlags();
        setFeatureFlags(data);
      } catch (error) {
        console.error('Error fetching feature flags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureFlags();
  }, []);

  return { featureFlags, isLoading };
};
