import { FC, useState, useEffect, useCallback } from 'react';

import { Button } from '@mui/material';
import * as Sentry from '@sentry/react';

import { STORAGE_FEATURE_FLAGS, TTL_FEATURE_FLAGS } from '../../../../constants';
import {
  loadFromChromeSessionStorage,
  saveInChromeSessionStorage
} from '../../../../utils/storageChromeSession';

const blinking = `
    .blink {
      animation: blink ease 30s infinite;
      -webkit-animation: blink ease 30s infinite;
      -moz-animation: blink ease 30s infinite;
      -o-animation: blink ease 30s infinite;
      -ms-animation: blink ease 30s infinite;
    }
    
    @keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
    
    @-moz-keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
    
    @-webkit-keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
    
    @-o-keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
    
    @-ms-keyframes blink {
      0%, 2% { opacity: 0; }
      5%, 95% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
  `;

export const XPUNKS_1: FC = () => {
  const [isFeatureFlagEnabled, setIsFeatureFlagEnabled] = useState<boolean>(false);
  const [collabURL, setCollabURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const cachedData = await loadFromChromeSessionStorage(STORAGE_FEATURE_FLAGS);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          if (parsedData.expiration > new Date().getTime()) {
            setIsFeatureFlagEnabled(parsedData.data.FF_COLLAB_XPUNKS_1 === 1);
            setCollabURL(parsedData.data.PARAM_COLLAB_XPUNKS_1_URL);
            return;
          }
        }

        if (process.env.REACT_APP_FEATURE_FLAGS_URL) {
          const response = await fetch(process.env.REACT_APP_FEATURE_FLAGS_URL);
          const data = await response.json();
          setIsFeatureFlagEnabled(data.FF_COLLAB_XPUNKS_1 === 1);
          setCollabURL(data.PARAM_COLLAB_XPUNKS_1_URL);

          const cacheData = {
            data,
            expiration: new Date().getTime() + TTL_FEATURE_FLAGS
          };
          saveInChromeSessionStorage(STORAGE_FEATURE_FLAGS, JSON.stringify(cacheData));
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    };

    fetchFlags();
  }, []);

  const handleClick = useCallback(() => {
    if (collabURL) {
      window.open(collabURL);
    }
  }, [collabURL]);

  if (isFeatureFlagEnabled !== true) {
    return null;
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '5px' }}
    >
      <Button
        size="small"
        onClick={handleClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <style>{blinking}</style>
        <img
          alt="XPUNKS"
          height={40}
          src={'./collabs/XPUNKS/XPUNKS-Logo-Full-White.png'}
          style={{ marginBottom: '7px' }}
          className={'blink'}
        />
      </Button>
    </div>
  );
};
