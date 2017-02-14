module.exports = {
  totalTime: function(tally) {
    var hours = Math.floor((tally * 25) / 60);
    var minutes = (tally * 25) % 60;

    return {hours: hours, minutes: minutes};
  },
  buildRangeData: function(moment, task, range) {
    var start = moment().startOf(range).valueOf();
    var end = moment().endOf(range).valueOf();
    var tallies = task.tallies.filter(tally => moment(tally.date).isBetween(start, end));

    var tally = tallies.reduce((a, b) => a + b.tally, 0);
    var time = this.totalTime(tally);

    return {
      tally: tally,
      time: time,
      fullData: tallies
    };
  }
};
