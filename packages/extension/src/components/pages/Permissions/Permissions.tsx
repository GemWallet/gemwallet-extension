import { FC, useCallback, useState, useEffect } from 'react';

import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  SETTINGS_PATH,
  STORAGE_PERMISSION_ADVANCED_MODE,
  STORAGE_PERMISSION_SUBMIT_BULK
} from '../../../constants';
import { loadFromChromeLocalStorage, saveInChromeLocalStorage } from '../../../utils';
import { PageWithReturn } from '../../templates';
import { PermissionSwitch } from './PermissionsSwitch';

export const Permissions: FC = () => {
  const navigate = useNavigate();
  const [isSubmitBulkTransactionsEnabled, setIsSubmitBulkTransactionsEnabled] = useState<
    boolean | undefined
  >(undefined);
  const [isAdvancedModeEnabled, setIsAdvancedModeEnabled] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const loadInitialData = async () => {
      const storedDataSubmitBulk = await loadFromChromeLocalStorage(STORAGE_PERMISSION_SUBMIT_BULK);
      setIsSubmitBulkTransactionsEnabled(storedDataSubmitBulk === 'true');

      const storedDataAdvancedMode = await loadFromChromeLocalStorage(
        STORAGE_PERMISSION_ADVANCED_MODE
      );
      setIsAdvancedModeEnabled(storedDataAdvancedMode === 'true');
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (isSubmitBulkTransactionsEnabled === undefined) {
      return;
    }

    saveInChromeLocalStorage(
      STORAGE_PERMISSION_SUBMIT_BULK,
      isSubmitBulkTransactionsEnabled.toString()
    );
  }, [isSubmitBulkTransactionsEnabled]);

  useEffect(() => {
    if (isAdvancedModeEnabled === undefined) {
      return;
    }

    saveInChromeLocalStorage(STORAGE_PERMISSION_ADVANCED_MODE, isAdvancedModeEnabled.toString());
  }, [isAdvancedModeEnabled]);

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  const toggleSubmitBulkTransactions = () => {
    setIsSubmitBulkTransactionsEnabled(!isSubmitBulkTransactionsEnabled);
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedModeEnabled(!isAdvancedModeEnabled);
  };

  return (
    <PageWithReturn title="Permissions" onBackClick={handleBack}>
      <div style={{ marginTop: '1rem' }}>
        <Typography variant="subtitle2">Permissions</Typography>
        <PermissionSwitch
          isEnabled={isAdvancedModeEnabled || false}
          toggleSwitch={toggleAdvancedMode}
          name="Advanced Mode"
          description="Unlocks the advanced features."
        />
        <PermissionSwitch
          isEnabled={isSubmitBulkTransactionsEnabled || false}
          toggleSwitch={toggleSubmitBulkTransactions}
          name="Bulk Transactions"
          description="Enabling this will allow to submit multiple transactions at once. Enable at your own risk."
        />
      </div>
    </PageWithReturn>
  );
};
