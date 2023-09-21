import { CSSProperties, FC } from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

interface MenuGroupProps {
  sectionName: string;
  items: {
    name: string;
    onClick: () => void;
  }[];
}

const groupStyles: CSSProperties = {
  backgroundColor: '#272727',
  borderRadius: '12px',
  marginBottom: '16px'
};

const listItemStyles: CSSProperties = {
  borderBottom: '0.5px solid #000'
};

const sectionHeaderStyle: CSSProperties = {
  fontSize: '16px',
  color: '#ffffff',
  margin: '0 6px 10px 6px'
};

export const MenuGroup: FC<MenuGroupProps> = ({ sectionName, items }) => {
  return (
    <>
      <div style={sectionHeaderStyle}>{sectionName}</div>
      <div style={groupStyles}>
        {items.map(({ name, onClick }, index, arr) => (
          <ListItem
            button
            key={name}
            onClick={onClick}
            style={index !== arr.length - 1 ? listItemStyles : {}}
          >
            <ListItemText primary={name} style={{ flex: 1 }} />
            <ListItemIcon style={{ minWidth: '32px' }}>
              <NavigateNextIcon />
            </ListItemIcon>
          </ListItem>
        ))}
      </div>
    </>
  );
};
