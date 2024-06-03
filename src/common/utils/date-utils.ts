const moment = require('moment');

export const formatDateToHumanReadable = (date: Date) => {
  return moment(date).format('MMMM DD, YYYY');
};
