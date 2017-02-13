module.exports = {
  totalTime: function(tally) {
    var hours = Math.floor((tally * 25) / 60);
    var minutes = (tally * 25) % 60;

    return {hours: hours, minutes: minutes};
  }
};
