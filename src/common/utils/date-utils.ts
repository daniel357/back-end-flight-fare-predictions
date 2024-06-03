const moment = require('moment');

export const formatDateToHumanReadable = (date: Date) => {
  console.log('DATE: ', date);
  const newD = moment(date).format('MMMM DD, YYYY');
  console.log(newD);
  return newD;
};
