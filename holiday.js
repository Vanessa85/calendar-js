(function(window, document, undefined) {
  'use strict';
  var HOST = 'https://holidayapi.com/v1/holidays?key=abf70bac-0976-400e-a58e-b9517f4d6ad1';

  function getHolidays(code, year, month) {
    month = month < 10? `0${month}` : month;

    var url = `${HOST}&country=${code}&year=${year}&month=${month}`;

    if (window.fetch) {
      return window.fetch(url)
        .then(response => response.json());
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

  window.getHolidays = getHolidays;

})(window, document);
