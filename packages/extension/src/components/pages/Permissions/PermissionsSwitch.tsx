import { FC } from 'react';

import { Switch, Typography } from '@mui/material';

export interface PermissionSwitchProps {
  isEnabled: boolean;
  toggleSwitch: () => void;
  name: string;
  description: string;
}

export const PermissionSwitch: FC<PermissionSwitchProps> = ({
  isEnabled,
  toggleSwitch,
  name,
  description
}) => {
  return (
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Switch
          checked={isEnabled}
          onChange={toggleSwitch}
          color="primary"
          inputProps={{ 'aria-label': `Enable or disable ${name.toLowerCase()}` }}
        />
        <Typography style={{ marginLeft: '1rem' }}>{name}</Typography>
      </div>
      <Typography variant="body2" color="textSecondary" style={{ marginLeft: '0.7rem' }}>
        {description}
      </Typography>
    </div>
  );
};
