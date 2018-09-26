// @flow
import * as React from 'react';
import download from 'downloadjs';

// Custom Components
import FileDownloadIcon from '../FileDownload';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';

// Flow Type
import type { Transaction } from 'ducks/data';

// Helper Functions
import { headers } from 'Utils';

type Props = {
  data: Array<Transaction>,
  onFilterClicked: () => void,
  onExportClicked: () => void,
  title: string,
  theme: Object
};

const EnhancedTableToolbar = (props: Props) => {
  const { onFilterClicked, title, theme } = props;

  const onExportClicked = () => {
    const { data } = props;

    // Get the headers
    let csvContent = headers
      .reduce((accumulator, header) => {
        return (accumulator = accumulator.concat(`${header.label},`));
      }, '')
      .concat('\r\n');

    data.forEach(row => {
      delete row.id;
      let transaction = Object.values(row).join(',');
      csvContent = csvContent.concat(transaction) + '\r\n';
    });

    download(csvContent, `transactions-${Date.now()}`, 'text/csv');
  };

  const styles = {
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
  };

  return (
    <Toolbar>
      <div style={styles.title}>
        <Typography variant="title" id="tableTitle">
          {title}
        </Typography>
      </div>
      <div style={styles.spacer} />
      <div style={styles.actions}>
        <Tooltip title="Export">
          <IconButton aria-label="Export List" onClick={onExportClicked}>
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

export default withTheme()(EnhancedTableToolbar);
