import React from 'react';
import { connect } from 'react-redux';
import download from 'downloadjs';

// Custom Components
import { headers } from 'budgetTable/components/EnhancedTableHead';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// Material UI Icons
import FileDownloadIcon from '@material-ui/icons/GetApp';
import FilterListIcon from '@material-ui/icons/FilterList';

// Helper Functions
import { getData } from 'ducks/data';

// TypeScript
import { Transaction } from 'ducks/data';
import { AppState } from 'ducks';

type Props = {
  data: Array<Transaction>;
  onFilterClicked: () => void;
};

const useStyles = makeStyles(theme => ({
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    display: 'flex',
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  }
}));

const EnhancedTableToolbar = (props: Props) => {
  const { data, onFilterClicked } = props;
  const classes = useStyles();

  const onExportClicked = () => {
    // Get the headers
    let csvContent = headers
      .reduce((accumulator, header) => (accumulator = accumulator.concat(`${header.label},`)), '')
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
          {'Transaction'}
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

const mapStateToProps = (state: AppState) => ({ data: getData(state) });

export default connect(mapStateToProps)(EnhancedTableToolbar);
