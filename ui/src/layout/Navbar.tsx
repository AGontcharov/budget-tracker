import React, { useCallback, useState } from 'react';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// Material UI Icons
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles({
  list: {
    minWidth: 256
  }
});

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const onClick = useCallback(() => {
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu" onClick={onClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            {'Budget Tracker'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={onClose}>
        <List className={classes.list}>
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
};

export default React.memo(Navbar);
