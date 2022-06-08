import { FC, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import { HISTORY_PATH, HOME_PATH, SETTINGS_PATH } from '../../../constants/routes';

const navigation = [
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

export const NavMenu: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const value = useMemo(
    () => navigation.findIndex((link) => link.pathname === pathname),
    [pathname]
  );

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        const { pathname } = navigation[newValue];
        navigate(pathname);
      }}
    >
      {navigation.map(({ label, icon }) => {
        return <BottomNavigationAction key={label} label={label} icon={icon} />;
      })}
    </BottomNavigation>
  );
};
