(function(window, document, undefined) {
  'use strict';

  var startDateInput = document.getElementById('startDate');
  var form = document.querySelector('.form-calendar');
  var container = document.querySelector('#results');
  var milisecondsByDay = 1000*60*60*24;

  // value default for startDate
  var today = new Date();
  startDateInput.value = `${today.getFullYear()-1}-${formatNumber(today.getMonth()+1)}-${formatNumber(today.getDate())}`;
  startDateInput.max = `${today.getFullYear()-1}-12-31`;

  // event submit
  form.addEventListener('submit', sendForm);
  function sendForm(e) {
    e.preventDefault();
    container.innerHTML = '';

    var startDateString = e.target.startDate.value;
    var days = e.target.days.value;
    var countryCode = e.target.countryCode.value;

    var startDate = generateDate(startDateString);
    var endDate = generateDate(startDateString, days);

    var calendar = new Calendar(container, countryCode, startDate.getFullYear(), startDate.getMonth());
    var i;
    for (i = startDate.getTime(); i <= endDate.getTime(); i+=milisecondsByDay) {
      var currentDate = new Date();
      currentDate.setTime(i);

      if (currentDate.getDate() === 1) {
        calendar.draw();
        calendar = new Calendar(container, countryCode, currentDate.getFullYear(), currentDate.getMonth());
      }

      calendar.addDay(currentDate.getDate());
    }

    calendar.draw();

  }

  function formatNumber(number) {
    if (number < 10) {
      number = `0${number}`
    }

    return number;
  }

  function generateDate(dateString, days) {
    dateString = dateString.split('-');
    let date = new Date(dateString[0], dateString[1]-1, dateString[2]);
    if (days) {
      date.setDate(date.getDate() + Number(days));
    }

    return date;
  }

})(window, document);
