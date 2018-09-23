// @flow
import * as React from 'react';

// Material UI
import { withTheme } from '@material-ui/core/styles';
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
  classes: Object,
  theme: Object
};

class TablePaginationActions extends React.Component<Props> {
  handleFirstPageButtonClick = (event: SyntheticEvent<>) => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = (event: SyntheticEvent<>) => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = (event: SyntheticEvent<>) => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = (event: SyntheticEvent<>) => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { count, page, rowsPerPage, theme } = this.props;

    const styles = {
      root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5
      }
    };

    return (
      <div style={styles.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          <LastPageIcon />
        </IconButton>
      </div>
    );
  }
}

export default withTheme()(TablePaginationActions);
