// @flow
import * as React from 'react';
import { withTheme } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';

// Custom Component
import BudgetTable from './BudgetTable';

// Material UI
import Typography from '@material-ui/core/Typography';
import Upload from '@material-ui/icons/CloudUpload';

export type Transaction = {
  id: number,
  date: Date,
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
  loading: boolean
};

class DropFile extends React.Component<Props, State> {
  state = {
    data: [],
    dropzoneActive: false,
    // TODO: Change back to true
    loading: false
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
    this.setState({ data, loading: false });
  };

  render() {
    const { data, dropzoneActive, loading } = this.state;
    const { theme } = this.props;

    const styles = {
      dropZone: {
        width: 847,
        height: 150,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'solid 1px',
        borderColor: theme.palette.accent.main,
        borderRadius: 10
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
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          multiple={false}
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

        {!loading && <BudgetTable data={data} />}
      </div>
    );
  }
}

export default withTheme()(DropFile);
