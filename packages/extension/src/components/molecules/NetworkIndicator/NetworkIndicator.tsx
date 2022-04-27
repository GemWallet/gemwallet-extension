import Chip from '@mui/material/Chip';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useLedger } from '../../../contexts/LedgerContext';

export function NetworkIndicator() {
  const { client } = useLedger();

  return (
    <Chip
      label="Testnet"
      size="small"
      icon={
        <FiberManualRecordIcon
          style={{
            color: client ? 'green' : 'red'
          }}
        />
      }
      onClick={() => {}}
    />
  );
}
