import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import { HOME_PATH, SETTINGS_PATH } from './routes';

export const navigation = [
  {
    label: 'Wallets',
    pathname: HOME_PATH,
    icon: <AccountBalanceWalletIcon />
  },
  // TODO: History will be added in a separate ticket
  // {
  //   label: 'History',
  //   pathname: HISTORY_PATH,
  //   icon: <HistoryIcon />
  // },
  {
    label: 'Settings',
    pathname: SETTINGS_PATH,
    icon: <SettingsIcon />
  }
];
