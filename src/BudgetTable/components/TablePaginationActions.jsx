// @flow
import * as React from 'react';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

type Props = {
  onChangePage: Function,
  count: number,
  page: number,
  rowsPerPage: number,
  classes: {
    root: string
  }
};

const styles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

const TablePaginationActions = (props: Props) => {
  const { classes, count, onChangePage, page, rowsPerPage } = props;

  const handleFirstPageButtonClick = (event: SyntheticEvent<>) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event: SyntheticEvent<>) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event: SyntheticEvent<>) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event: SyntheticEvent<>) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="First Page"
      >
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Next Page"
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Last Page"
      >
        <LastPageIcon />
      </IconButton>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(TablePaginationActions);
