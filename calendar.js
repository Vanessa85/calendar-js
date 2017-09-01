(function(window, document, undefined) {
  'use strict';

  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octuber', 'November', 'December'];

  function getHolidays(country, year, month) {
    var HOST = 'https://holidayapi.com/v1/holidays?key=abf70bac-0976-400e-a58e-b9517f4d6ad1';
    month = month < 10? `0${month}` : month;
    var url = `${HOST}&country=${country}&year=${year}&month=${month}`;

    if (fetch) {
      return fetch(url).then(response => response.json());
    } else {
      return new Promise(function(resolve, reject) {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', url, true);
        ajax.send(null);
        ajax.onreadystatechange = function() {
          if (ajax.readyState === 4) {
            if (ajax.status == 200) {
              resolve(JSON.parse(ajax.response));
            } else {
              reject(new Error('Error request holidays'));
            }
          }
        }
      });
    }
  }

  function Calendar(container, country, year, month) {
    this.year = year;
    this.month = month; // 0 -11
    this.days = [];
    this.country = country;
    this.container = container;
    this.holidays = [];
  }

  Calendar.prototype.addDay = function(day) {
    this.days.push(day);
  }

  Calendar.prototype.draw = function() {
    getHolidays(this.country, this.year, this.month+1)
      .then(response => response.holidays)
      .then(data => {
        var span;
        // holidays
        this.holidays = data.map(item => {
          return {
            day: parseInt(item.date.split('-')[2]),
            name: item.name
          };
        });

        var containerMonth = document.createElement('div');
        containerMonth.className = 'calendar-month';
        // header month
        var headerMonth = document.createElement('header');
        var headerMonthTitle = document.createElement('h5');
        var headerText = document.createTextNode(months[this.month] + ' ' + this.year);
        headerMonthTitle.appendChild(headerText);
        headerMonth.appendChild(headerMonthTitle);
        // header month days week
        var daysWeek = document.createElement('div');
        daysWeek.className = 'week-header';
        var daysWeekString = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        for (i = 0; i < daysWeekString.length; i++) {
          span = document.createElement('span');
          span.appendChild(document.createTextNode(daysWeekString[i]));
          daysWeek.appendChild(span);
        }
        headerMonth.appendChild(daysWeek);

        containerMonth.appendChild(headerMonth);
        this.container.appendChild(containerMonth);

        // draw days
        var firstDay = new Date(this.year, this.month, 1);
        var firstWeekDay = firstDay.getDay();
        var lastDay = this.days[this.days.length-1];
        var i, weekMonth, index, holiday;

        for (i = 0; i < 42; i++) { //42 = 7*6
          span = document.createElement('span');

          if (i % 7 === 0) {
            weekMonth = document.createElement('div');
            weekMonth.className = 'week-month';

            // days weekend: Sunday
            span.className = 'weekend-day';
            containerMonth.appendChild(weekMonth);
          }

          // days added of the month
          index = this.days.indexOf(i-firstWeekDay + 1);
          if (index !== -1) {
            if (!span.className) {
              span.className = 'week-day';
            }

            span.appendChild(document.createTextNode(this.days[index]));
          }

          // days weekend: Saturday
          if (i % 7 === 6) {
            span.className = 'weekend-day';
          }

          // holiday
          holiday = this.holidays.find(item => item.day === i-firstWeekDay + 1);
          if (holiday) {
            if (span.className === 'week-day' || span.className === 'weekend-day') {
              span.className = 'week-holiday';
              span.setAttribute('title', holiday.name);
            }
          }

          weekMonth.appendChild(span);
        }
      });
  }

  window.Calendar = Calendar;

})(window, document);
