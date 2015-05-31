(function() {
  var EmptyStore = Class.extend({
    setItem : function() {},
    getItem : function() {},
    removeItem : function() {}
  });

  //用web storage实现的统一store接口
  var WebStore = Class.extend({
    _store : null,

    init : function(type) {
      this._store = (type=='sessionStorage') ? sessionStorage : localStorage;
    },
    setItem : function(key,value) {
      this._store.setItem(key,value);
    },
    getItem : function(key) {
      return this._store.getItem(key);
    },
    removeItem : function(key) {
      this._store.removeItem(key);
    }
  });

  //用cookie实现的统一store接口
  var CookieStore = Class.extend({
    setItem : function(key,value) {
      $.cookie(key,value,{path:'/'});
    },
    getItem : function(key) {
      return $.cookie(key);
    },
    removeItem : function(key) {
      $.cookie(key,'',{path:'/',expires:-1});
    }
  });

  //存储类，支持自动降级。用法var store = $wm.StoreFactory.getStore('sessionStorage')
  var RdStoreFactory = {
    supportTypes : [],

    init : function() {
      this.supportTypes = this.getSupportTypes();
    },

    getStore : function(type) {
      //需要判断一下是否支持，否则自动降级
      type = this._getAvailableType(type);
      if (type==null) {
        return new EmptyStore();
      } else if (type == 'cookie') {
        return new CookieStore();
      } else {
        return new WebStore(type);
      }
    },

    //返回一个数组，标识浏览器所支持的存储类型，如['sessionStorage','localStorage','cookie']
    getSupportTypes : function() {
      var types = [];
      var storages = ['sessionStorage','localStorage'];
      for (var i=0; i<storages.length; i++) {
        var storeName = storages[i];
        try {
          var storage = window[storeName];
          if (storage) {
            storage.setItem('test','fortest');
            if (storage.getItem('test')=='fortest') {
              types.push(storeName);
            }
            storage.removeItem('test');
          }
        } catch (e) {
          //不支持这类storage
        }
      }
      //检测cookie
      try {
        $.cookie('test','fortest',{path:'/'});
        if ($.cookie('test')=='fortest') {
          types.push('cookie');
        }
        $.cookie('test','',{path:'/',expires:-1});
      } catch (e) {
        //不支持cookie
      }
      return types;
    },

    _getAvailableType : function(type) {
      //需要判断一下是否支持，否则自动降级
      if (type==null) type = 'localStorage';  //默认为localStorage
      var supportTypes = this.supportTypes;
      var finalType = null;

      function isSupport(type,supportTypes) {
        for (var i=0; i<supportTypes.length; i++) {
          if (type==supportTypes[i]) {
            return true;
          }
        }
        return false;
      }

      if (type=='sessionStorage' && isSupport('sessionStorage',supportTypes)) {
        finalType = 'sessionStorage';
      } else if (type != 'cookie' && isSupport('localStorage',supportTypes)) {
        finalType = 'localStorage';
      } else if (isSupport('cookie',supportTypes)) {
        finalType = 'cookie';
      } else {
        // error
      }
      return finalType;
    }
  };

  RdStoreFactory.init();

  window.$rd = window.$rd || {};
  $rd.StoreFactory = RdStoreFactory;
  $rd.store = RdStoreFactory.getStore();  //全局的store
})();