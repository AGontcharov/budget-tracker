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
  // blueGrey
} from '@material-ui/core/colors';

const categoryColors = {
  Debt: brown,
  Entertainment: red,
  'Eating Out': green,
  Food: lightGreen,
  'Health Care': cyan,
  Housing: orange,
  Income: grey,
  Investment: purple,
  'No Categories': grey,
  Other: blue,
  'Personal Care': deepPurple,
  Transportation: yellow,
  Savings: indigo,
  Subscription: amber,
  Utilities: teal
};

const getCategoryColor = (category: string, shade?: numer = 500) => {
  if (categoryColors.hasOwnProperty(category)) {
    return categoryColors[category][shade];
  }
};

export default getCategoryColor;
