import React, { Dispatch, FC } from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
  Typography
} from '@mui/material';

import { AccountTransaction } from '../../../types';

interface TransactionFiltersProps {
  transactions: AccountTransaction[];
  filterTypes: string[];
  setFilterTypes: Dispatch<React.SetStateAction<string[]>>;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export const TransactionFilters: FC<TransactionFiltersProps> = ({
  transactions,
  filterTypes,
  setFilterTypes,
  dialogOpen,
  setDialogOpen
}) => {
  const transactionTypes = [...new Set(transactions.map((tx) => tx.tx?.TransactionType))].sort();

  return (
    <div style={{ position: 'relative', margin: '0' }}>
      <IconButton
        onClick={() => setDialogOpen(true)}
        style={{ float: 'right' }}
        size="small"
        data-testid="filter-button"
      >
        <FilterListIcon style={{ fontSize: '18px' }} />
      </IconButton>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent style={{ maxHeight: '250px', minWidth: '220px', overflowY: 'auto' }}>
          <Typography variant="h6" style={{ marginBottom: '5px' }}>
            Transaction types
          </Typography>
          {transactionTypes.map((type) => (
            <div key={type}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    color="primary"
                    value={type}
                    checked={filterTypes.includes(type as string)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      if (type) {
                        setFilterTypes((prev) =>
                          checked ? [...prev, type] : prev.filter((t) => t !== type)
                        );
                      }
                    }}
                  />
                }
                label={type}
              />
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFilterTypes([]);
            }}
            color="secondary"
          >
            Reset Filters
          </Button>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
