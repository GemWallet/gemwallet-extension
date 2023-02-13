import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';

import { HISTORY_PATH, HOME_PATH, SETTINGS_PATH } from './routes';

export const navigation = [
  {
    label: 'Wallets',
    pathname: HOME_PATH,
    icon: <AccountBalanceWalletIcon />
  },
  {
    label: 'History',
    pathname: HISTORY_PATH,
    icon: <HistoryIcon />
  },
  {
    label: 'Settings',
    pathname: SETTINGS_PATH,
    icon: <SettingsIcon />
  }
];
