var app = angular.module('calApp', ['ngSanitize']);
app.controller('calCtrl', function($scope, $http) {
  
  $scope.data_cal = {}
  $scope.cal = {};
  $scope.i = 0;
  
  $scope.selected = {};
  
  
  getData('calendar.json');
  
  function getData(url) {
    $http.get(url).then(function (response) {
      data_cal = response.data;
      $scope.data_cal = data_cal;
      
      cal = data_cal;
      
      var calendar = Calendar(cal);
      
      $scope.cal = calendar.parse(cal);
      $scope.selectDayById(0);
    });
  };
  
  $scope.selectDay = function(day, month) {
    $scope.selected.month = month;
    $scope.selected.day = day;
    $scope.selected.id = day.day_of_year;
  }
  $scope.selectDayById = function(id) {
    console.log(id);
    
    if (id < 0) {
      $scope.setYear($scope.data_cal.year - 1);
      id = $scope.cal.total_days - 1;
    }
    if (id >= $scope.cal.total_days) {
      $scope.setYear($scope.data_cal.year + 1);
      id = 0;
    }
    
    var cal = $scope.cal;
    
    // find month that has that day and day object
    for (var i = 0; i < cal.months.length; i ++) {
      
      for (var j = 0; j < cal.months[i].days.length; j++) {
        if (cal.months[i].days[j].day_of_year == id) {
          month = cal.months[i];
          day = cal.months[i].days[j];
          
          $scope.selected.month = month;
          $scope.selected.day = day;
          $scope.selected.id = id;
          console.log($scope.selected);
        }
      }
    }
    
  }
  
  $scope.setYear = function(new_year) {
    console.log($scope.data_cal);
    data_cal = $scope.data_cal;
    data_cal.year = new_year;
    
    var calendar = Calendar(data_cal);
    
    $scope.cal = calendar.parse(data_cal);
    
    $scope.selectDayById(0);
    console.log($scope.cal);
  }
  
  $scope.draw_moon = function(phase, size){ 
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
      '<svg width=' + size + ' height=' + size + ' viewbox="0 0 100 100">' +
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
        total_days += month.days_num;
      });
      return total_days;
    }
    
    // return an object that elaborates on each day of the calendar.
    Calendar.parse = function(calendar) {
      var cal = calendar;
      var month = 0;
      var i = 0;
      var total_days = Calendar.get_total_days(cal);
      cal.total_days = total_days;
      
      // for each month, create a day object with the following properties:
      // day_of_week, day_of_year
      for (var j = 0; j < cal.months.length; j++) {
        var weeks = [];
        var days = [];
        var week = [];
        
        for (var k = 0; k < cal.months[j].days_num; k++) {
          var day = {
            number: k + 1,
            day_of_week: cal.week_days[k % cal.week_days.length],
            day_of_year: i,
            moons: [],
            lunar_event: false
          };
          
          // check if there's a lunar event on this day
          var lunar_event = true;
          for (var l = 0; l < cal.moons.length; l ++ ) {
            day.moons[l] = {
              'phase': ( (i + cal.year * total_days) % cal.moons[l].period) / cal.moons[l].period,
              'name': cal.moons[l].name,
              'size': cal.moons[l].size
            };
            if (day.moons[l].phase % 0.5 != 0) {
              lunar_event = false;
            }
          }
          if (lunar_event == true) {
            day.lunar_event = true;
          }
          // put this day into a week
          var week_number = Math.floor((day.number - 1) / (cal.week_days.length));
          if ( weeks[week_number] === undefined ) {
            weeks[week_number] = [];
          }
          weeks[week_number].push(day);
          
          days.push(day);
          i ++;
        }
        cal.months[j].days = days;
        cal.months[j].weeks = weeks;
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