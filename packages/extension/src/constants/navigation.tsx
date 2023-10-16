import React from 'react';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import SettingsIcon from '@mui/icons-material/Settings';
import { FaGhost, FaHatWizard, FaSpider } from 'react-icons/fa';
import { GiPumpkinLantern } from 'react-icons/gi';

import { HISTORY_PATH, HOME_PATH, NFT_VIEWER_PATH, SETTINGS_PATH } from './paths';

const isHalloween = process.env.REACT_APP_IS_HALLOWEEN === 'true';

export const navigation = [
  {
    label: 'Tokens',
    pathname: HOME_PATH,
    icon: isHalloween ? <GiPumpkinLantern size={25} /> : <AccountBalanceWalletIcon />
  },
  {
    label: 'History',
    pathname: HISTORY_PATH,
    icon: isHalloween ? <FaGhost size={25} /> : <HistoryIcon />
  },
  {
    label: 'NFTs',
    pathname: NFT_VIEWER_PATH,
    icon: isHalloween ? <FaHatWizard size={25} /> : <PhotoCameraBackIcon />
  },
  {
    label: 'Settings',
    pathname: SETTINGS_PATH,
    icon: isHalloween ? <FaSpider size={25} /> : <SettingsIcon />
  }
];
