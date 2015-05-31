(function() {
  var order = JSON.parse($rd.store.getItem('order')) || {};
  var ADDRS_URL = '/useraddrs/';
  var addrId = null;
  $.get(ADDRS_URL, {}, function(response) {
    var addrs = response;
    var addr = (addrs && addrs.length > 0) ? addrs[addrs.length-1] : {};
    addrId = addr.id;
    $('#form').html(Mustache.render($('#form-template').html(),addr));
  });

  $('#form-bottom-btn').click(function() {
    var name = $('#form-name').val().trim();
    var mobile = $('#form-mobile').val().trim();
    var address = $('#form-address').val().trim();
    var comment = $('#form-comment').val().trim();

    order.user = {
      name : name,
      mobile : mobile,
      address : address
    };
    order.comment = comment;

    var url = addrId ? '/useraddrs/' + addrId : '/useraddrs';
    var method = addrId ? 'PUT' : 'POST';

    $.ajax({
      type : method,
      url : url,
      data : {
        consignee_name : name,
        consignee_mobile : mobile,
        consignee_address : address
      },
      success : function(response) {
        addrId = response.id;
        order.user.address_id = addrId;
        $rd.store.setItem('order', JSON.stringify(order));
        location.href = 'order2';
      }
    });
  });
})();