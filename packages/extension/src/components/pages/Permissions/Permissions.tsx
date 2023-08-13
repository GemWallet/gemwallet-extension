import { FC, useCallback, useState, useEffect } from 'react';

import { Switch, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { SETTINGS_PATH, STORAGE_PERMISSION_SUBMIT_BULK } from '../../../constants';
import { loadFromChromeStorage, saveInChromeStorage } from '../../../utils';
import { PageWithReturn } from '../../templates';

export const Permissions: FC = () => {
  const navigate = useNavigate();
  const [isSubmitBulkTransactionsEnabled, setIsSubmitBulkTransactionsEnabled] =
    useState<boolean>(false);

  useEffect(() => {
    const loadInitialData = async () => {
      const storedData = await loadFromChromeStorage(STORAGE_PERMISSION_SUBMIT_BULK);
      if (!storedData) return;
      if (!(STORAGE_PERMISSION_SUBMIT_BULK in storedData)) return;

      setIsSubmitBulkTransactionsEnabled(storedData[STORAGE_PERMISSION_SUBMIT_BULK] === 'true');
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    saveInChromeStorage(STORAGE_PERMISSION_SUBMIT_BULK, isSubmitBulkTransactionsEnabled.toString());
  }, [isSubmitBulkTransactionsEnabled]);

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  const toggleSubmitBulkTransactions = () => {
    setIsSubmitBulkTransactionsEnabled(!isSubmitBulkTransactionsEnabled);
  };

  return (
    <PageWithReturn title="Permissions" onBackClick={handleBack}>
      <div style={{ marginTop: '1rem' }}>
        <Typography variant="subtitle2">Permissions</Typography>
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={isSubmitBulkTransactionsEnabled}
              onChange={toggleSubmitBulkTransactions}
              color="primary"
              inputProps={{ 'aria-label': 'Enable or disable bulk transactions' }}
            />
            <Typography style={{ marginLeft: '1rem' }}>Submit Bulk Transactions</Typography>
          </div>
          <Typography variant="body2" color="textSecondary" style={{ marginLeft: '0.7rem' }}>
            Enabling this will allow to submit multiple transactions at once. Enable at your own
            risk.
          </Typography>
        </div>
      </div>
    </PageWithReturn>
  );
};
