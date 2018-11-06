// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

// Custom Component
import EnhancedSnackbar from 'components/EnhancedSnackbar';

// Material UI
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Upload from '@material-ui/icons/CloudUpload';

// Helper Functions
import { loadData } from 'ducks/data';

// Flow Type
import type { Transaction } from 'ducks/data';

type Props = {
  theme: Object,
  loadData: (Array<Transaction>) => void
};

type State = {
  dropzoneActive: boolean,
  isRejected: boolean
};

class DropFile extends React.Component<Props, State> {
  state = {
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
        date: new Date(transaction[2]),
        type: transaction[0],
        category: '',
        // Remove the quotes around the details
        details: transaction[4].replace(/^"(.*)"$/, '$1'),
        price: Number(transaction[6])
      };
    });

    // Remove the headers
    data.shift();
    this.props.loadData(data);
  };

  render() {
    const { dropzoneActive, isRejected } = this.state;
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
      <React.Fragment>
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
              <Typography align="center">Drop files...</Typography>
            </div>
          )}
          {!dropzoneActive && (
            <div style={styles.dropZoneInactive}>
              <Typography align="center" style={styles.dropZoneInactiveText}>
                Drop your RBC CSV file here to get started!
              </Typography>
              <Upload style={styles.upload} color="primary" />
            </div>
          )}
        </Dropzone>

        {isRejected && (
          <EnhancedSnackbar
            open={isRejected}
            message="Only CSV files are accepted"
            variant="error"
          />
        )}
      </React.Fragment>
    );
  }
}

export default withTheme()(
  connect(
    null,
    { loadData }
  )(DropFile)
);
