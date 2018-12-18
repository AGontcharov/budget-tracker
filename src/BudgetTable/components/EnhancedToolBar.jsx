// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import download from 'downloadjs';

// Custom Components
import FileDownloadIcon from 'components/svgIcons/FileDownload';

// Material UI
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';

// Helper Functions
import { getData } from 'ducks/data';
import { headers } from 'lib/Utils';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  classes: {
    spacer: string,
    actions: string,
    title: string
  },
  data: Array<Transaction>,
  onFilterClicked: () => void,
  title: string,
  theme: Object
};

const styles = theme => ({
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
      const row = { ...transaction };

      delete row.id;
      // TODO: Why do I have to flow it like this?
      row.date = new Date(row.date).toDateString();
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
          <IconButton aria-label="Export List" disabled={!data.length} onClick={onExportClicked}>
            <FileDownloadIcon />
          </IconButton>
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

const mapStateToProps = state => {
  return {
    data: getData(state.transactions)
  };
};

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(EnhancedTableToolbar)
);
