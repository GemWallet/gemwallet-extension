import { FC, useCallback, useState } from 'react';
import { Mnemonic } from './Mnemonic';
import { CreatePassword } from '../CreatePassword';
import { Congratulations } from '../Congratulations';

const STEPS = 3;

export const ImportMnemonic: FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  if (activeStep === 2) {
    return <Congratulations activeStep={activeStep} steps={STEPS} handleBack={handleBack} />;
  }

  if (activeStep === 1) {
    return (
      <CreatePassword
        activeStep={activeStep}
        steps={STEPS}
        handleBack={handleBack}
        setActiveStep={setActiveStep}
      />
    );
  }

  return (
    <Mnemonic
      activeStep={activeStep}
      steps={STEPS}
      handleBack={handleBack}
      setActiveStep={setActiveStep}
    />
  );
};
