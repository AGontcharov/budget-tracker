// @flow
import * as React from 'react';

// Material UI
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// Icons
import HomeIcon from '@material-ui/icons/Home';

type Props = { onClose: () => void, open: boolean };

type State = {};

export default class DrawerMenu extends React.Component<Props, State> {
  render() {
    const { open, onClose } = this.props;

    return (
      <Drawer open={open} onClose={onClose}>
        <List>
          {['Home'].map(text => (
            <ListItem button key={text}>
              <ListItemIcon>
                <HomeIcon />{' '}
              </ListItemIcon>

              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    );
  }
}
