// Material UI
import {
  red,
  // pink,
  purple,
  deepPurple,
  indigo,
  blue,
  // lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  // lime,
  yellow,
  amber,
  orange,
  // deepOrange,
  brown,
  grey
  // blueGrey,
} from '@material-ui/core/colors';

type CategoryColors = {
  Debt: string;
  Entertainment: string;
  Dinning: string;
  Food: string;
  'Health Care': string;
  Housing: string;
  Income: string;
  Investment: string;
  'No Categories': string;
  Other: string;
  'Personal Care': string;
  Transportation: string;
  Savings: string;
  Subscription: string;
  Utilities: string;
  [key: string]: string;
};

const categoryColors: CategoryColors = {
  Debt: brown[500],
  Entertainment: red[500],
  Dinning: green[500],
  Food: lightGreen[500],
  'Health Care': cyan[500],
  Housing: orange[500],
  Income: grey[500],
  Investment: purple[500],
  'No Categories': grey[500],
  Other: blue[500],
  'Personal Care': deepPurple[500],
  Transportation: yellow[500],
  Savings: indigo[500],
  Subscription: amber[500],
  Utilities: teal[500]
};

const getCategoryColor = (category: string): string | undefined => {
  if (categoryColors.hasOwnProperty(category)) {
    return categoryColors[category];
  }
};

export default getCategoryColor;
