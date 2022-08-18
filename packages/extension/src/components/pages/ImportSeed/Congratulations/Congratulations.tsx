import { FC, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TwitterIcon from '@mui/icons-material/Twitter';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { PageWithStepper } from '../../../templates';
import { openExternalLink } from '../../../../utils';
import { HOME_PATH, TRANSACTION_PATH, TWITTER_LINK } from '../../../../constants';
import { STEPS } from '../constants';

interface CongratulationsProps {
  activeStep: number;
  handleBack: () => void;
}

export const Congratulations: FC<CongratulationsProps> = ({ activeStep, handleBack }) => {
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleNext = useCallback(() => {
    if (search.includes('transaction=payment')) {
      navigate(`${TRANSACTION_PATH}${search}`);
      // Handle as well the publicKeyMethod
    } else {
      navigate(`${HOME_PATH}${search}`);
    }
  }, [navigate, search]);

  return (
    <PageWithStepper
      steps={STEPS}
      activeStep={activeStep}
      handleBack={handleBack}
      handleNext={handleNext}
      buttonText="Finish"
    >
      <Typography variant="h4" component="h1" style={{ marginTop: '30px' }}>
        Woo, you're in!
      </Typography>
      <Typography variant="subtitle1" component="h2" style={{ marginTop: '30px' }}>
        Follow along with product updates or reach out if you have any questions.
      </Typography>
      <Button
        variant="contained"
        startIcon={<TwitterIcon />}
        endIcon={<NavigateNextIcon />}
        style={{ width: '100%', marginTop: '25px' }}
        color="info"
        onClick={() => {
          openExternalLink(TWITTER_LINK);
        }}
      >
        Follow us on Twitter
      </Button>
    </PageWithStepper>
  );
};
