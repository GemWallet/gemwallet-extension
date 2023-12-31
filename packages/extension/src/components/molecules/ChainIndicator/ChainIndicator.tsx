import { FC, MouseEvent, useState } from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { Chain } from '@gemwallet/constants';

import { useNetwork } from '../../../contexts';
import { Xahau, Xrp } from '../../atoms';
import { LoadingOverlay } from '../../templates';

export const ChainIndicator: FC = () => {
  const { chainName, switchChain } = useNetwork();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setIsLoading(false);
  };

  const handleChangeChain = (chain: Chain) => {
    setIsLoading(true);
    switchChain(chain).then(() => {
      handleClose();
    });
  };

  const renderChainIcon = (chain: Chain) => {
    switch (chain) {
      case Chain.XRPL:
        return <Xrp style={{ width: '24px', height: '24px' }} />;
      case Chain.XAHAU:
        return <Xahau style={{ width: '24px', height: '24px' }} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Button
        aria-controls="chain-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          backgroundColor: '#ffffff29',
          borderRadius: '20px',
          color: 'white',
          padding: '6px 12px',
          textTransform: 'none',
          minWidth: 0,
          '& .MuiButton-endIcon': {
            margin: 0,
            marginLeft: '-4px'
          },
          '&:hover': {
            backgroundColor: '#555'
          }
        }}
        startIcon={renderChainIcon(chainName)}
        endIcon={<ArrowDropDownIcon />}
      >
        <span style={{ visibility: 'hidden', width: '0' }}>{chainName}</span>
      </Button>
      <Menu id="chain-menu" anchorEl={anchorEl} keepMounted open={isOpen} onClose={handleClose}>
        <MenuItem onClick={() => handleChangeChain(Chain.XRPL)}>
          <Xrp style={{ marginRight: '10px', width: '24px', height: '24px' }} /> XRPL
        </MenuItem>
        <MenuItem onClick={() => handleChangeChain(Chain.XAHAU)}>
          <Xahau style={{ marginRight: '10px', width: '24px', height: '24px' }} /> XAHAU
        </MenuItem>
      </Menu>
      {isLoading ? <LoadingOverlay /> : null}
    </div>
  );
};
