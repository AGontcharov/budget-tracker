// @flow
import * as React from 'react';

// Material UI
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Icons
import MenuIcon from '@material-ui/icons/Menu';

// Icons
import HomeIcon from '@material-ui/icons/Home';

type Props = {};

type State = {
  open: boolean
};

export default class Navbar extends React.Component<Props, State> {
  state = {
    open: false
  };

  onClick = () => {
    this.setState({ open: !this.state.open });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;

    const styles = {
      list: {
        minWidth: 250
      }
    };

    return (
      <>
        <AppBar position="static">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu" onClick={this.onClick}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Budget Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer open={open} onClose={this.onClose}>
          <List style={styles.list}>
            {['Home'].map(text => (
              <ListItem button key={text} selected>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>

                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
      </>
    );
  }
}
