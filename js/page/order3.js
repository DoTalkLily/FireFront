(function() {
  var order = JSON.parse($rd.store.getItem('order'));

  function getNumLimit(maxNum,minNum) {
    var str="";
    if(minNum && !isNaN(minNum)){
      str += " 大于"+minNum+"人";
    }
    if(maxNum && !isNaN(maxNum)){
      str += "小于"+maxNum+"人";
    }
    return str
  }

  $.get('/orders/price', {
    sport_id : order.sport.id,
    coach_id : order.coach.id,
    sport_order_num : order.sport.num
  }, function(response) {
    var projectHtml = Mustache.render($('#project-item-template').html(), {
      head_image_url : order.sport.head_image_url,
      name : order.sport.name,
      time : order.sport.start_time + ' - ' + order.sport.end_time,
      order_pay_fee : response.order_pay_fee,
      people : getNumLimit(order.sport.max_user_num,order.sport.min_user_num)
    });
    $('#project-item').html(projectHtml);

    var addressHtml = Mustache.render($('#address-template').html(), {
      name : order.user.name,
      mobile : order.user.mobile,
      address : order.user.address,
      comment : order.comment
    });
    $('#form-address').html(addressHtml);
  });

  $('#btn-submit').click(function() {
    $.post('/orders', {
      sport_id : order.sport.id,
      coach_id : order.coach.id,
      useraddr_id : order.user.address_id,
      sport_date : order.sport.date,
      sport_start_time : order.sport.start_time,
      sport_order_num : order.sport.num,
      mark : order.comment
    }, function(response) {
      if (response.order_no) {
        order.order_no = response.order_no;
        $rd.store.setItem(JSON.stringify(order));
        location.href = 'order_pay'
      } else {
        new Toast({message:response.error}).show();
      }
    });
  });
})();