import { useState } from 'react';
import MUIDrawer from '@mui/material/Drawer';
import { Box } from '@mui/material';
import { useDrawer } from '../../../contexts/DrawerContext';
import { useLedger } from '../../../contexts/LedgerContext';
import { AboutPage } from './AboutPage';
import { DrawerContent } from './DrawerContent';
import { ResetSecretPhrase } from '../../pages/ResetSecretPhrase';

export const Drawer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { isOpen, openDrawer } = useDrawer();
  const { signOut } = useLedger();

  const handleClose = () => {
    openDrawer(false);
  };

  const handleLock = () => {
    signOut();
  };

  let contentDrawer = () => {
    return (
      <DrawerContent
        handleResetSecretPhrase={() => setActiveStep(2)}
        handleAbout={() => setActiveStep(1)}
        handleClose={handleClose}
        handleLock={handleLock}
      />
    );
  };

  // About page
  if (activeStep === 1) {
    contentDrawer = () => {
      return <AboutPage handleBack={() => setActiveStep(0)} />;
    };
  }

  // Reset Secret Phrase page
  if (activeStep === 2) {
    contentDrawer = () => {
      return <ResetSecretPhrase handleBack={() => setActiveStep(0)} />;
    };
  }

  return (
    <MUIDrawer anchor="right" open={isOpen} onClose={handleClose}>
      <Box style={{ width: '100vw' }} role="presentation">
        {contentDrawer()}
      </Box>
    </MUIDrawer>
  );
};
