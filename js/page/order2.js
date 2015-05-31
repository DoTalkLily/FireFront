(function() {

  var order = JSON.parse($rd.store.getItem('order')) || {};
  var from = order.coach? 'coach' : 'sport';  //指示从哪个页面过来的，教练或者是项目
  var jQtimeChooseSection = $('#time-choose-section');
  var jQtimeConfirmSection = $('#time-confirm-section');

  function getDate(value) {
    var day = new Date(value);
    return [day.getFullYear(),day.getMonth()+1,day.getDate(),day.getDay()];
  }

  //初始化日期栏
  function initDateBar() {
    var todayValue = Date.now();

    var dates = [];
    var oralDay = ['今天','明天','后天'];
    var weekday = ['周日','周一','周二','周三','周四','周五','周六'];
    for (var i=0; i<5; i++) {
      var dayValue = todayValue + i*24*60*60*1000;
      var dayArr = getDate(dayValue);
      var name;
      if (i < 3) {
        name = oralDay[i];
      } else {
        name = weekday[dayArr[3]];
      }
      var value = dayArr[0] + '-' + (dayArr[1]>10?dayArr[1]:'0'+dayArr[1]) + '-' + (dayArr[2]>10?dayArr[2]:'0'+dayArr[2]);
      dates.push({name:name, value:value, idx:i});
    }

    var dateBarHtml = Mustache.render($('#date-item-template').html(), {
      dates : dates,
      showSep : function() {
        return this.idx>0;
      },
      currDate : function() {
        return this.idx==0;
      }
    });
    $('#date-bar').html(dateBarHtml);

    $('.j-date-item').click(function() {
      var jQitem = $(this);
      jQitem.addClass('date-item-light').siblings('.j-date-item').removeClass('date-item-light');
      var value = jQitem.data('value');
      order.sport.date = value;
      $.get('/coaches/'+ order.coach.id +'/schedule', {date:value}, function(response) {
        initTimeList(response);
      });
    });
    $('.j-date-item:first-child').click();
  }

  //初始化时间
  function initTimeList(timeList) {
    var timeListHtml = Mustache.render($('#time-item-template').html(), {
      timeList : timeList
    });
    $('#time-list').html(timeListHtml);
  }

  //选择时间后显示结果区
  function showTimeResult() {
    history.pushState({'page':'order2-confirm'}, "", "order2#confirm");
    $('#time-show').text(order.sport.date + ' ' + order.sport.start_time + ' - ' + order.sport.end_time);
    jQtimeChooseSection.hide();
    jQtimeConfirmSection.show();
  }

  function getCoachList() {
    $.get('/sports/'+order.sport.id+'/coaches?date='+order.sport.date+'&start_time='+order.sport.start_time+'&end_time='+order.sport.end_time,function(response) {
      showCoachList(response);
    });
  }

  function showOrderCoach() {
    showCoachList([order.coach]);
  }

  function showCoachList(coachList) {
    for (var i= 0,len=coachList.length; i<len; i++) {
      coachList[i].idx = i;
    }
    var coachListHtml = Mustache.render($('#coach-item-template').html(), {
      coachList : coachList,
      isFirst : function() {
        return this.idx==0;
      }
    });
    $('#coach-list').html(coachListHtml);
  }

  function initNext() {
    $('#next-btn').click(function() {
      $rd.store.setItem('order', JSON.stringify(order));
      location.href = 'order3';
    });
  }

  function initPageHistory() {
    if (location.hash=='#confirm') {  //confirm页面不会页面一进来就出现
      history.back();
    }
    window.onpopstate = function(event) {
      if (event && event.state && event.state.page == 'order2-confirm') {
        jQtimeChooseSection.hide();
        jQtimeConfirmSection.show();
      } else {
        jQtimeChooseSection.show();
        jQtimeConfirmSection.hide();
      }
    };
  }

  function initTimeEvent() {
    $('#time-list').delegate('.j-time', 'click', function() {
        var startTime = order.sport.start_time = $(this).data('time');
        var startTimeArr = /(\d\d):(\d\d)/.exec(startTime);
        var hour = parseInt(startTimeArr[1],10);
        var min = parseInt(startTimeArr[2],10);
        min += order.sport.duaration * order.sport.num;
        hour += Math.floor(min/60);
        min = min%60;
        order.sport.end_time = (hour>=10?hour:'0'+hour) + ':' + (min>=10?min:'0'+min);
        if (from == 'coach') {
          showOrderCoach();
        } else {
          getCoachList();
        }

        showTimeResult();
      });
  }

  initDateBar();
  initTimeEvent();
  initNext();
  initPageHistory();
})();