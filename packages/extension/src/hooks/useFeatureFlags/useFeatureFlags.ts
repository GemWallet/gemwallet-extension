import { useState, useEffect } from 'react';

export const useFeatureFlags = () => {
  const [featureFlags, setFeatureFlags] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatureFlags = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/ThibautBremand/gw-feature-flags/main/featureFlags.json'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch feature flags');
        }

        const flagsData = await response.json();
        setFeatureFlags(flagsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureFlags();
  }, []);

  return { featureFlags, isLoading };
};
