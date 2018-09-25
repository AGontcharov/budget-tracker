// @flow
import * as React from 'react';
import Dropzone from 'react-dropzone';

// Custom Component
import Dashboard from 'Dashboard';
import BudgetTable from 'BudgetTable';
import EnhancedSnackbar from 'Components/EnhancedSnackbar';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Upload from '@material-ui/icons/CloudUpload';

export type Transaction = {
  id: number,
  date: string,
  type: string,
  category: string,
  details: string,
  price: number
};

type Props = {
  theme: Object
};

type State = {
  data: Array<Transaction>,
  dropzoneActive: boolean,
  isRejected: boolean
};

class DropFile extends React.Component<Props, State> {
  state = {
    data: [],
    dropzoneActive: false,
    isRejected: false
  };

  onDrop = (acceptedFiles: Array<Blob>, rejectedFiles: Array<Blob>) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        this.modifyFile(result.toString());
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });

    this.setState({ dropzoneActive: false });
  };

  onDragEnter = () => {
    this.setState({ dropzoneActive: true });
  };

  onDragLeave = () => {
    this.setState({ dropzoneActive: false });
  };

  modifyFile = (csvFile: string) => {
    const results = csvFile.split('\n');
    results.pop();

    const data = results.map((row, index) => {
      // Convert every row into an array of strings
      const transaction = row.split(',');
      return {
        id: index - 1,
        date: new Date(transaction[2]).toDateString(),
        type: transaction[0],
        category: '',
        // Remove the quotes around the details
        details: transaction[4].replace(/^"(.*)"$/, '$1'),
        price: Number(transaction[6])
      };
    });

    // Remove the headers
    data.shift();
    this.setState({ data });
  };

  render() {
    const { data, dropzoneActive, isRejected } = this.state;
    const { theme } = this.props;

    const styles = {
      dropZone: {
        width: 800,
        height: 125,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'solid 1px',
        borderColor: theme.palette.accent.main,
        borderRadius: 10,
        margin: theme.spacing.unit * 4.5,
        marginBottom: theme.spacing.unit * 2
      },
      dropZoneInactive: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      },
      dropZoneInactiveText: {
        margin: theme.spacing.unit
      },
      rejectedStyle: {
        borderColor: theme.palette.error.dark
      },
      upload: {
        fontSize: theme.spacing.unit * 4
      }
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Dropzone
          accept="text/csv"
          onDrop={this.onDrop}
          onDropAccepted={() => this.setState({ isRejected: false })}
          onDropRejected={() => this.setState({ isRejected: true })}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          multiple={false}
          rejectStyle={styles.rejectedStyle}
          style={styles.dropZone}
        >
          {dropzoneActive && (
            <div>
              <Typography variant="body1" align="center">
                Drop files...
              </Typography>
            </div>
          )}
          {!dropzoneActive && (
            <div style={styles.dropZoneInactive}>
              <Typography variant="body1" align="center" style={styles.dropZoneInactiveText}>
                Drop your RBC CSV file here to get started!
              </Typography>
              <Upload style={styles.upload} color="primary" />
            </div>
          )}
        </Dropzone>

        <BudgetTable data={data} />
        <Dashboard data={data} />

        {isRejected && (
          <EnhancedSnackbar
            open={isRejected}
            message="Only CSV files are accepted"
            variant="error"
          />
        )}
      </div>
    );
  }
}

export default withTheme()(DropFile);
