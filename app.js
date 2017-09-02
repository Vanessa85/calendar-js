(function(window, document, undefined) {
  'use strict';

  var utils = (function() {
    function setInputDate() {
      var today = new Date();
      this.value = `${today.getFullYear()-1}-${formatNumber(today.getMonth()+1)}-${formatNumber(today.getDate())}`;
      this.max = `${today.getFullYear()-1}-12-31`;
    }

    function formatNumber(number) {
      return (number < 10? `0${number}` : number);
    }

    function generateDate(dateString, days) {
      dateString = dateString.split('-');
      var date = new Date(dateString[0], dateString[1]-1, dateString[2]);
      if (days) {
        date.setDate(date.getDate() + Number(days));
      }

      return date;
    }

    var publicUtils = {
      setInputDate: setInputDate,
      formatNumber: formatNumber,
      generateDate: generateDate
    };

    return publicUtils;
  })();

  // declare variables for form
  var startDateInput = document.getElementById('startDate');
  var form = document.querySelector('.form-calendar');
  var container = document.querySelector('#results');

  // value default for startDate
  utils.setInputDate.call(startDateInput);

  // event submit
  form.addEventListener('submit', sendForm);
  function sendForm(e) {
    e.preventDefault();
    container.innerHTML = '';

    var startDateString = e.target.startDate.value;
    var days = e.target.days.value;
    var countryCode = e.target.countryCode.value;

    var startDate = utils.generateDate(startDateString);
    var endDate = utils.generateDate(startDateString, days);

    console.time('timecalendar');
    drawCalendar(container, countryCode, startDate, endDate);
    console.timeEnd('timecalendar');
  }

  function drawCalendar(container, countryCode, startDate, endDate) {
    if (startDate.getTime() > endDate.getTime()) {
      return;
    }

    var milisecondsByDay = 1000*60*60*24;
    var calendar = new Calendar(container, countryCode, startDate.getFullYear(), startDate.getMonth());
    var i, currentDate, endMonth;
    endMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    for (i = startDate.getTime(); i <= endDate.getTime() && i <= endMonth.getTime(); i+=milisecondsByDay) {
      currentDate = new Date();
      currentDate.setTime(i);
      calendar.addDay(currentDate.getDate());
    }

    calendar.draw().then(() => {
      startDate.setTime(i);
      return drawCalendar(container, countryCode, startDate, endDate);
    });
  }

})(window, document);
