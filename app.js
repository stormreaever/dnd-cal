var app = angular.module('calApp', ['ngSanitize']);
app.controller('calCtrl', function($scope, $http) {
  
  $scope.cal = {};
  $scope.i = 0;
  
  
  getData('calendar.json');
  
  function getData(url) {
    $http.get(url).then(function (response) {
      cal = response.data;
      
      var abs_day = 0;
      for ( var i = 0; i < cal.months.length; i++ ) {
        // cal.months[i];
      }
      
      var calendar = Calendar(cal);
      
      $scope.cal = calendar.parse(cal);
    });
  };
  
  $scope.draw_moon = function(phase){ 
    if ( isNaN(phase) || phase < 0 || phase >= 1 ) {
      console.log('phase ' + phase + ' is not good');
      return false;
    }
    
    if (phase < 0.5) { // waxing
      var colors = {
        'foreground': '#999999',
        'background': '#dddddd'
      };
    } else { // waning
      var colors = {
      'foreground': '#dddddd',
      'background': '#999999'
      };
    }
    phase = (phase % 0.5) * 2; // turn phase into a number between 0 and < 1
    phase = 100 - (phase * 100);
    
    var svg_str = '' +
      '<svg width=25 height=25 viewbox="0 0 100 100">' +
        '<!-- draw bg moon -->' +
        '<circle cx="50" cy="50" r="50" ' + 
        'fill="' + colors.background + '"/>' +
        '<!-- draw curves -->' +
        '<path d="' +
        'M0 50 ' +
        'C 0 0, 50 0, 50 0 ' +
        'S ' + phase + ' 0, ' + phase + ' 50' +
        'S 50 100, 50 100' +
        'S 0 100, 0 50z' +
        '" fill="' + colors.foreground + '"/>' +
        
        '<circle cx="50" cy="50" r="49" ' + 
        'fill="transparent" stroke="#999999"/>' +
      '</svg>';
      
    // console.log(svg_str);
    return svg_str;
    
  };
  
  function Calendar(cal) {
    var Calendar = {};
    
    
    // count number of days in the full calendar 
    Calendar.get_total_days = function(cal) {
      var total_days = 0;
      cal.months.forEach(function(month) {
        total_days += month.days;
      });
      return total_days;
    }
    
    // return an object that elaborates on each day of the calendar.
    Calendar.parse = function(cal) {
      var month = 0;
      var i = 0;
      var total_days = Calendar.get_total_days(cal);
      
      // for each month, create a day object with the following properties:
      // day_of_week, day_of_year
      for (var j = 0; j < cal.months.length; j++) {
        var days = [];
        for (var k = 0; k < cal.months[j].days; k++) {
          var day = {
            day_of_week: cal.week_days[k % cal.week_days.length],
            day_of_year: i,
            moons: []
          };
          var lunar_event = true;
          for (var l = 0; l < cal.moons.length; l ++ ) {
            day.moons[l] = {
              'phase': ( (i + cal.year * total_days) % cal.moons[l].period) / cal.moons[l].period,
              'name': cal.moons[l].name
            };
            if (day.moons[l].phase % 0.5 != 0) {
              lunar_event = false;
            }
          }
          if (lunar_event == true) {
            console.log(day);
          }
          
          days.push(day);
          i ++;
        }
        cal.months[j].days = days;
      }
      
      return cal;
      
    }
    
    Calendar.total_days = Calendar.get_total_days(cal);
    // console.log(cal);
    
    return Calendar;
  }
  
  $scope.getNumber = function(num) {
    return new Array(num);   
  }
  
  $scope.reset = function() {
    $scope.i = 0;
  }
  $scope.increase = function(a,b) {
    // console.log( a + ' ' + b + ' ' + $scope.i );
    $scope.i ++;
    return $scope.i;
  }
  
  // $scope.getMoonState(month_num, day_num, period) {
  //   
  // }
  
});