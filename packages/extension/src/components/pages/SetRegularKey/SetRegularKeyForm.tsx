import { ChangeEvent, FC, useCallback } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Checkbox, FormControlLabel, Link, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { ERROR_RED, SETTINGS_PATH } from '../../../constants';
import { ActionButtons } from '../../molecules';
import { PageWithReturn } from '../../templates';

interface SetRegularKeyFormProps {
  // UI specific params
  hasEnoughFunds: boolean;
  inputRegularKey: string | null;
  inputRegularKeyError: string;
  removeKeyChecked: boolean;
  // UI functions
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClickApprove: () => void;
  isApproveEnabled?: boolean;
}

export const SetRegularKeyForm: FC<SetRegularKeyFormProps> = ({
  hasEnoughFunds,
  inputRegularKey,
  inputRegularKeyError,
  handleInputChange,
  removeKeyChecked,
  handleCheckboxChange,
  onClickApprove,
  isApproveEnabled
}) => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(SETTINGS_PATH);
  }, [navigate]);

  return (
    <>
      <PageWithReturn title="Set Regular Key" onBackClick={handleBack}>
        <Typography align="center" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          You can protect your account by assigning a regular key pair to it and using it instead of
          the master key pair to sign transactions whenever possible.
        </Typography>
        <Typography align="center" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          If your regular key pair is compromised, but your master key pair is not, you can use a
          SetRegularKey transaction to regain control of your account.
        </Typography>
        <Typography
          align="center"
          style={{ marginTop: '0.5rem', fontSize: '0.9rem', marginBottom: '1rem' }}
        >
          <Link
            href="https://xrpl.org/assign-a-regular-key-pair.html?utm_source=gemwallet.app"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about regular keys
          </Link>
        </Typography>
        {!hasEnoughFunds ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ErrorIcon style={{ color: ERROR_RED }} />
            <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
              Insufficient funds.
            </Typography>
          </div>
        ) : null}
        <TextField
          fullWidth
          style={{ marginBottom: '15px' }}
          id="regularKey"
          name="regularKey"
          label="Regular Key"
          variant="outlined"
          value={inputRegularKey || ''}
          onChange={handleInputChange}
          disabled={removeKeyChecked}
          error={!!inputRegularKeyError}
          helperText={inputRegularKeyError}
        />
        <Typography style={{ marginBottom: '15px', fontSize: '0.9rem !important' }}>
          <FormControlLabel
            control={
              <Checkbox
                id="deleteRegularKey"
                name="deleteRegularKey"
                checked={removeKeyChecked}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Check this box to remove the current regular key"
          />
        </Typography>
      </PageWithReturn>
      <ActionButtons
        onClickReject={handleBack}
        onClickApprove={onClickApprove}
        approveButtonText="Submit"
        rejectButtonText="Cancel"
        isApproveEnabled={isApproveEnabled}
      />
    </>
  );
};
