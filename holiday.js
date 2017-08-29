(function(window, document, $, undefined) {
  'use strict';
  var HOST = 'https://holidayapi.com/v1/holidays?key=2d2ab822-cb88-4829-84b0-c5f3b41d7bd3';

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

})(window, document, window.jQuery);
