// @flow
import * as React from 'react';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';

type Props = {
  onFilterClicked: () => void,
  title: string,
  theme: Object
};

const EnhancedTableToolbar = (props: Props) => {
  const { onFilterClicked, title, theme } = props;

  const styles = {
    spacer: {
      flex: '1 1 100%'
    },
    actions: {
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
