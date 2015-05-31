(function() {
  var order = JSON.parse($rd.store.getItem('order'));
  $.get('orders/'+order.order_no, {}, function(response) {
    var orderHtml = Mustache.render($('#order-template').html(), response);
    $('#order').html(orderHtml);
  });
}) ();