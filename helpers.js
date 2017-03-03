const moment = require('moment');

module.exports = {
  totalTime: function(tally) {
    // build time object from tally number
    const hours = Math.floor((tally * 25) / 60);
    const minutes = (tally * 25) % 60;

    return {hours, minutes};
  },
  buildRangeData: function(task, range) {
    // build range data for this week, month, or year
    const start = moment().startOf(range).valueOf();
    const end = moment().endOf(range).valueOf();
    const tallies = task.tallies.filter(tally => moment(tally.date).isBetween(start, end, null, '[]'));

    const tally = tallies.reduce((a, b) => a + b.tally, 0);
    const time = this.totalTime(tally);
    const graphData = this.buildGraph(range, tallies);

    return {
      tally,
      time,
      graphData,
      fullData: tallies
    };
  },
  buildGraph: function(range, tallies) {
    // generate data to be used in bar graphs
    let data = [];
    let ranges = {
      week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      month: [],
      year: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
    const dateFormat = range === 'week' ? 'dddd' : 'D';

    if (range === 'month') {
      // build monthly days array according to this month
      const now = moment();
      const daysInMonth = now.endOf('month').format('D');

      for (var i = 1; i <= daysInMonth; i++) {
        ranges.month.push(i.toString());
      }
    }

    if (range === 'year') {
      ranges.year.forEach(month => {
        // get the tally total for each month and push data into array by month
        const thisMonth = tallies
          .filter(tally => moment(tally.date).format('MMMM') === month)
          .reduce((a, b) => a + b.tally, 0);
        data.push({tally: thisMonth, date: month});
      });
    } else {
      ranges[range].forEach(date => {
        // get the data for each day and push data for the month or for the week into array
        const index = tallies.findIndex(tally => moment(tally.date).format(dateFormat) === date);

        if (index > -1) {
          data.push(tallies[index]);
        } else {
          data.push({tally: 0, date: null});
        }
      });
    }

    return data;
  }
};
