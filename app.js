(function(window, document, fetch, undefined) {
  'use strict';

  var startDateInput = document.getElementById('startDate');
  var form = document.querySelector('.form-calendar');
  var container = document.querySelector('#results');
  var milisecondsByDay = 1000*60*60*24;

  // to call methods utilities
  var fnUtils = utils();

  // value default for startDate
  var today = new Date();
  startDateInput.value = `${today.getFullYear()-1}-${fnUtils.formatNumber(today.getMonth()+1)}-${fnUtils.formatNumber(today.getDate())}`;
  startDateInput.max = `${today.getFullYear()-1}-12-31`;

  // event submit
  form.addEventListener('submit', sendForm);
  function sendForm(e) {
    e.preventDefault();
    container.innerHTML = '';

    var startDateString = e.target.startDate.value;
    var days = e.target.days.value;
    var countryCode = e.target.countryCode.value;

    var startDate = fnUtils.generateDate(startDateString);
    var endDate = fnUtils.generateDate(startDateString, days);

    var calendar = new Calendar(container, countryCode, startDate.getFullYear(), startDate.getMonth());
    var i, currentDate;
    for (i = startDate.getTime(); i <= endDate.getTime(); i+=milisecondsByDay) {
      currentDate = new Date();
      currentDate.setTime(i);

      if (currentDate.getDate() === 1) {
        if (startDate.getTime() !== currentDate.getTime()) {
          calendar.draw();
          calendar = new Calendar(container, countryCode, currentDate.getFullYear(), currentDate.getMonth());
        }
      }

      calendar.addDay(currentDate.getDate());
    }

    calendar.draw();
  }

  function utils() {
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
      formatNumber: formatNumber,
      generateDate: generateDate
    };

    return publicUtils;
  }

})(window, document, window.fetch);
