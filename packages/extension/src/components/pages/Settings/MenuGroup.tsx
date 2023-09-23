import { CSSProperties, FC } from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { SECONDARY_GRAY } from '../../../constants';

const radiusSize = '12px';

export type ItemMenuGroup = {
  name: string;
  type: 'link' | 'button';
  onClick: () => void;
};
export interface MenuGroupProps {
  sectionName: string;
  items: ItemMenuGroup[];
}

const groupStyles: CSSProperties = {
  backgroundColor: '#272727',
  borderRadius: radiusSize,
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

const firstListItemStyles: CSSProperties = {
  borderTopLeftRadius: radiusSize,
  borderTopRightRadius: radiusSize
};

const lastListItemStyles: CSSProperties = {
  borderBottomLeftRadius: radiusSize,
  borderBottomRightRadius: radiusSize
};

const listItemTextStyle: CSSProperties = {
  flex: 1,
  paddingLeft: '5px'
};

const listItemIconStyle: CSSProperties = {
  minWidth: '32px',
  marginRight: '-10px'
};

export const MenuGroup: FC<MenuGroupProps> = ({ sectionName, items }) => {
  return (
    <>
      <div style={sectionHeaderStyle}>{sectionName}</div>
      <div style={groupStyles}>
        {items.map(({ name, type, onClick }, index, arr) => (
          <ListItem
            button
            key={name}
            onClick={onClick}
            style={{
              ...(index === 0
                ? firstListItemStyles
                : index === arr.length - 1
                ? lastListItemStyles
                : {}),
              ...(index !== arr.length - 1 ? listItemStyles : {})
            }}
            sx={{
              '.MuiListItemIcon-root': {
                color: SECONDARY_GRAY
              },
              '&:hover': {
                '.MuiListItemIcon-root': {
                  color: 'inherit'
                }
              }
            }}
          >
            <ListItemText primary={name} style={listItemTextStyle} />
            <ListItemIcon style={listItemIconStyle}>
              {type === 'link' ? (
                <OpenInNewIcon fontSize="small" sx={{ height: '18px' }} />
              ) : (
                <NavigateNextIcon />
              )}
            </ListItemIcon>
          </ListItem>
        ))}
      </div>
    </>
  );
};
