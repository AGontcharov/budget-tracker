import React, { MouseEvent, useCallback } from 'react';

// Material UI
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';

// Material UI Icons
import FirstPageIcon from '@material-ui/icons/FirstPage';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

type Props = {
  /**
   * @ignore
   */
  classes: {
    root: string;
  };

  /**
   * The total number of rows.
   * @type {number}
   */
  count: number;

  /**
   * Callback fired when the page is changed.
   * @type {Function}
   */
  onChangePage: (event: MouseEvent<HTMLButtonElement> | null, page: number) => void;

  /**
   * The zero-based index of the current page.
   * @type {number}
   */
  page: number;

  /**
   * The number of rows per page.
   * @type {number}
   */
  rowsPerPage: number;
};

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      color: palette.text.secondary,
      marginLeft: spacing(2.5)
    }
  });

const TablePaginationActions = (props: Props) => {
  const { classes, count, onChangePage, page, rowsPerPage } = props;

  const handleFirstPageButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, 0);
    },
    [onChangePage]
  );

  const handleBackButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, page - 1);
    },
    [onChangePage, page]
  );

  const handleNextButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, page + 1);
    },
    [onChangePage, page]
  );

  const handleLastPageButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    },
    [count, onChangePage, rowsPerPage]
  );

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
