import React, { FC } from 'react';

import { Pagination, PaginationItem } from '@mui/material';

interface StepperPaginationProps {
  navigable: boolean;
  steps: number;
  activeStep: number;
}

const StepperPagination: FC<StepperPaginationProps> = ({ navigable, steps, activeStep }) => {
  if (!navigable) return null;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1rem'
      }}
    >
      <Pagination
        count={steps}
        page={activeStep + 1}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                cursor: 'default'
              }
            }}
          />
        )}
        variant="outlined"
        color="primary"
        hidePrevButton
        hideNextButton
      />
    </div>
  );
};

export default StepperPagination;
