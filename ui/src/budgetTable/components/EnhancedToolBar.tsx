import * as React from 'react';
import { connect } from 'react-redux';
import download from 'downloadjs';

// Material UI
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FileDownloadIcon from '@material-ui/icons/GetApp';
import FilterListIcon from '@material-ui/icons/FilterList';

// Helper Functions
import { getData } from 'ducks/data';
import { headers } from 'lib/Utils';

// TypeScript
import { Transaction } from 'ducks/data';
import { AppState } from 'ducks';

type Props = {
  classes: {
    spacer: string;
    actions: string;
    title: string;
  };
  data: Array<Transaction>;
  onFilterClicked: () => void;
  title: string;
};

const styles = ({ palette }: Theme) =>
  createStyles({
    spacer: {
      flex: '1 1 100%'
    },
    actions: {
      display: 'flex',
      color: palette.text.secondary
    },
    title: {
      flex: '0 0 auto'
    }
  });

const EnhancedTableToolbar = (props: Props) => {
  const { classes, data, onFilterClicked, title } = props;

  const onExportClicked = () => {
    // Get the headers
    let csvContent = headers
      .reduce((accumulator, header) => {
        return (accumulator = accumulator.concat(`${header.label},`));
      }, '')
      .concat('\r\n');

    data.forEach(transaction => {
      // Change Date object to a readable string and delete row.id
      const row = { ...transaction, date: transaction.date.toDateString() };
      delete row.id;

      csvContent = csvContent.concat(Object.values(row).join(',')) + '\r\n';
    });

    download(csvContent, `transactions-${Date.now()}`, 'text/csv');
  };

  return (
    <Toolbar>
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          {title}
        </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Tooltip title="Export">
          <div>
            <IconButton aria-label="Export List" disabled={!data.length} onClick={onExportClicked}>
              <FileDownloadIcon />
            </IconButton>
          </div>
        </Tooltip>
        <Tooltip title="Filter list">
          <IconButton aria-label="Filter list" onClick={onFilterClicked}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

const mapStateToProps = (state: AppState) => ({ data: getData(state.transactions) });

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(EnhancedTableToolbar)
);
