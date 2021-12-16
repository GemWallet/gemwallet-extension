import Chip from '@mui/material/Chip';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export function NetworkIndicator() {
  return (
    <Chip
      label="Dev net"
      size="small"
      icon={
        <FiberManualRecordIcon
          style={{
            color: 'green'
          }}
        />
      }
      onClick={() => {}}
    />
  );
}
