import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import SettingsIcon from '@mui/icons-material/Settings';

import { HISTORY_PATH, HOME_PATH, NFT_VIEWER_PATH, SETTINGS_PATH } from './paths';

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
    label: 'NFTs',
    pathname: NFT_VIEWER_PATH,
    icon: <PhotoCameraBackIcon />
  },
  {
    label: 'Settings',
    pathname: SETTINGS_PATH,
    icon: <SettingsIcon />
  }
];
