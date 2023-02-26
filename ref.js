"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var DrukPhoto = {
  "container": jQuery('#js-row-photo'),
  "info": {
    "cnt": $("#js-table-order"),
    "total": $("#js-table-order-total"),
    "cntVal": 0,
    "sum": $("#js-order-summ"),
    "sumVal": 0.0
  },
  "onPhotoAdd": function onPhotoAdd(e) {
    DrukPhoto.container.append(photoTemplate('photoCard', e));

    jQuery('.box-full-upload').addClass('is-hidden');
    jQuery('.box-photo').removeClass('is-hidden');
    jQuery('.box-sidebar').removeClass('is-hidden');

    DrukPhotoDraft.save();
  },
  "onPhotoChange": function onPhotoChange(e) {
    var p = DrukPhoto.container.find("#" + e.id);
    console.log(p, p.find("img"));
    p.find("img").attr("src", e.img);
    DrukPhoto.changeClass(p, 'photo-wide-', e.wide);

    if (e.full != undefined) {
      p.removeClass("is-loading");
      p.find('.card-photo-loading').addClass('is-hidden');
      DrukPhotoDraft.save();
    }
  },
  "onChange": function onChange(items, cnt, suma) {
    DrukPhoto.info.cntVal = parseInt(cnt);
    DrukPhoto.info.sumVal = parseFloat(suma);

    var total = 0;
    var arrTotal = [];

    DrukPhoto.info.cnt.html('');
    for (var i = 0; i < items.length; i++) {
      total += items[i].cnt;
      DrukPhoto.info.cnt.append(photoTemplate('orderTableRow', items[i]));
    }

    jQuery('.js-total-photo').html(total);
    jQuery('.js-total-summ').html(suma);

    arrTotal['cnt'] = total;
    arrTotal['price'] = suma;

    DrukPhoto.info.total.html(photoTemplate('orderTableFoot', arrTotal));
    DrukPhoto.info.sum.html(suma);
    DrukPhoto.correctSum();

    DrukPhotoDraft.save();
  }
};

// photo list
(function () {
  var pList = [];
  var photoInfo = {};
  var uplProgress = {
    "cnt": 0,
    "all": 0
  };
  var uplModalBlock = jQuery('#uplModal');

  function elFind(id) {
    var el = elFindID(id);
    if (el >= 0) {
      return pList[el];
    }
    return false;
  }

  function elCopyID(id) {
    var tmp_id = String(id);
    if (tmp_id.indexOf("_c") > 0) {
      tmp_id = tmp_id.split("_c")[0];
    }
    // generate new ID
    var next_id = 1;
    for (var i = 0; i < pList.length; i++) {
      if (String(pList[i].id).startsWith(tmp_id)) {
        var tmp = parseInt(pList[i].id.split("_c")[1]);
        if (next_id <= tmp) {
          next_id = tmp + 1;
        }
      }
    }
    return tmp_id + "_c" + next_id;
  }

  function elFindID(id) {
    for (var i = 0; i < pList.length; i++) {
      if (pList[i].id == id) {
        return i;
      }
    }
    return -1;
  }

  function notifyChange() {
    var items = getItems();
    // console.log( items );
    DrukPhoto.onChange(items.items, items.cnt, items.suma);
  }

  function notifyAlertAdd() {
    window.onbeforeunload = function () {
      return PhotoJSTrans.beforeClose;
    };
  }

  function notifyAlertRemove() {
    window.onbeforeunload = function () {};
    window.onunload = function () {};
  }

  function notifyPhotoAdd(id) {
    if (typeof DrukPhoto.onPhotoAdd == 'function') {
      var el = elFind(id);
      if (el) {
        DrukPhoto.onPhotoAdd(el);
        notifyChange();
      }
    }
  }

  function notifyPhotoChange(id) {
    if (typeof DrukPhoto.onPhotoChange == 'function') {
      var el = elFind(id);
      if (el) {
        DrukPhoto.onPhotoChange(el);
      }
    }
  }

  DrukPhoto.uplModal = function (show) {
    uplModalBlock.modal(show ? 'show' : 'hide');
    if (!show) {
      var $scroll = DrukPhoto.container.closest('.scroll');
      $scroll.stop().animate({ scrollTop: $scroll[0].scrollHeight }, 1000);
    }
  };

  function init() {
    for (var i = 0; i < PhotoSizes.length; i++) {
      photoInfo[PhotoSizes[i].id] = {
        "size": PhotoSizes[i].size,
        "price": PhotoSizes[i].price
      };
    }
  }

  DrukPhoto.photoAdd = function (el) {
    var tmp = el;
    if (isFinite(tmp.id) || !tmp.id.startsWith("upl") && tmp.id.indexOf("_df") == -1) {
      tmp.id = tmp.id + "_df" + Math.round(Math.random() * 10000);
    }

    if (typeof tmp.cnt == 'undefined') {
      tmp.cnt = 1;
    }

    if (typeof tmp.size == 'undefined') {
      tmp.size = PhotoSizeDefault;
    }

    if (typeof tmp.border == 'undefined') {
      tmp.border = PhotoPrintTypes[0].id;
    }
    if (typeof tmp.type == 'undefined') {
      tmp.type = PhotoPaperTypes[0].id;
    }

    pList.push(tmp);
    notifyPhotoAdd(tmp.id);
    notifyAlertAdd();
  };

  DrukPhoto.photoChange = function (id, src, full, wide) {
    var el = elFind(id);
    if (el) {
      el.img = src;
      if (full != undefined) {
        el.full = full;
      }
      if (wide != undefined) {
        el.wide = wide;
      }
      notifyPhotoChange(id);
    }
  };

  DrukPhoto.photoDuplicate = function (id) {
    var el = elFind(id);
    if (el) {
      var tmp = el;
      var tmp = jQuery.extend({}, el);
      tmp.id = elCopyID(id);
      var eID = elFindID(id);
      pList.splice(eID, 0, tmp);
      notifyChange();
      return tmp.id;
    }
    return false;
  };

  DrukPhoto.photoRemove = function (id) {
    var el = elFindID(id);
    if (el >= 0) {
      Photos.photoUplCancel(id);
      pList.splice(el, 1);
      notifyChange();
      DrukPhotoDraft.save();
    }
    if (pList.length == 0) {
      notifyAlertRemove();
    }
  };

  DrukPhoto.photoInfo = function (id) {
    var el = elFind(id);
    if (el) {
      return el;
    }
    return false;
  };

  DrukPhoto.photoSize = function (id, size) {
    var el = elFind(id);
    if (el) {
      el.size = size;
      notifyChange();
    }
  };

  DrukPhoto.photoType = function (id, typeID) {
    var el = elFind(id);
    if (el) {
      el.type = typeID;
      notifyChange();
    }
  };

  DrukPhoto.photoBorder = function (id, borderID) {
    var el = elFind(id);
    if (el) {
      el.border = borderID;
      notifyChange();
    }
  };

  DrukPhoto.photoCount = function (id, count) {
    var el = elFind(id);
    if (el) {
      el.cnt = parseInt(count);
      notifyChange();
    }
  };

  DrukPhoto.photoList = function () {
    return pList;
  };

  DrukPhoto.removeNotify = function () {
    notifyAlertRemove();
  };

  DrukPhoto.changeClass = function (el, classBase, classSuffix) {
    el.removeClass(function (index, c) {
      var strt = new RegExp(classBase + '([0-9a-z]+)', 'g');
      return (c.match(strt) || []).join(' ');
    }).addClass(classBase + classSuffix);
  };

  function getItems() {
    var ar = {};
    var cnt = 0;
    var suma = 0.0;
    for (var i = 0; i < pList.length; i++) {
      if (_typeof(ar[photoInfo[pList[i].size]["size"]]) != 'object') {
        ar[photoInfo[pList[i].size]["size"]] = { "cnt": 0, "price": 0 };
      }
      var inf = photoInfo[pList[i].size];
      ar[inf["size"]]["cnt"] += parseInt(pList[i].cnt);
      ar[inf["size"]]["price"] += parseInt(pList[i].cnt) * inf["price"];
    }
    var arr = [];
    for (i in ar) {
      var pr = Math.round(ar[i].price * 100) / 100;
      arr.push({
        "size": i,
        "cnt": ar[i].cnt,
        "price": pr.toFixed(2)
      });
      cnt += ar[i].cnt;
      suma += pr;
    }
    return {
      "items": arr,
      "cnt": cnt,
      "suma": (Math.round(suma * 100) / 100).toFixed(2)
    };
  }

  init();
})();
var PhotoActionNew = {};

(function () {

  var el = {
    "duplicate": '.js-duplicate',
    "remove": '.js-remove',
    "overlay": ".card-photo-overlay",

    "isTouch": 'ontouchstart' in window
  };

  function photoDuplicate(card) {
    var id = card.attr('id');
    var clonedCard = card.clone(false).removeClass('is-checked');
    var getID = DrukPhoto.photoDuplicate(id);

    if (getID) {
      clonedCard.attr('id', getID);
      card.after(clonedCard);
    }
    totalChecked();
  }

  function photoRemove(card) {
    DrukPhoto.photoRemove(card.attr('id'));
    card.remove();

    totalChecked();
  }

  function totalChecked() {}

  function footShow(need) {
    if (need) {

      el.sizeDrop.find('.js-caption').html(el.sizeDrop.data('placeholder'));
      el.borderDrop.find('.js-caption').html(el.borderDrop.data('placeholder'));
      el.paperDrop.find('.js-caption').html(el.paperDrop.data('placeholder'));

      el.foot.find('#js-dropdrop-cnt .js-caption').html('1');
      el.foot.find('#js-dropdrop-cnt .box-counter-field').val(1);

      // close
      el.foot.find('.dropdrop.is-open').removeClass('is-open');

      el.foot.addClass('is-active');
      el.container.addClass('is-foot-active');
    } else {
      el.foot.removeClass('is-active');
      el.container.removeClass('is-foot-active');
    }
  }

  function footCheckedAll(all) {
    el.checkAll.prop('checked', all);
  }

  function initElements() {
    el.container = jQuery('#js-row-photo');

    el.foot = jQuery('#js-foot-action');

    el.footHide = el.foot.find('.js-foot-hide');
    el.checkAll = el.foot.find('#js-checked-all');
    el.duplAll = el.foot.find('#js-duplicate-all');
    el.remAll = el.foot.find('#js-remove-all');

    el.sizeDrop = el.foot.find('#js-dropdrop-size .dropdrop-btn');
    el.borderDrop = el.foot.find('#js-dropdrop-border .dropdrop-btn');
    el.paperDrop = el.foot.find('#js-dropdrop-paper .dropdrop-btn');

    jQuery('body').addClass(el.isTouch ? 'has-touch' : 'has-hover');
  }

  function photoClassType(content, value, type) {
    var classBase = 'photo-' + type + '-';
    DrukPhoto.changeClass(content, classBase, value);
  }

  function initCardActions() {
    // duplicate
    el.container.on('click', el.duplicate, function () {
      var card = jQuery(this).parents('.card-photo');
      photoDuplicate(card);
    });

    // remove
    el.container.on('click', el.remove, function () {
      var card = jQuery(this).parents('.card-photo');
      photoRemove(card);
    });

    // check
    el.container.on('click', el.overlay, function (e) {
      if (e.target == this) {
        var card = jQuery(this).parents('.card-photo');
        card.toggleClass('is-checked');
      }

      var cnt = el.container.find('.card-photo.is-checked').length;
      var all = el.container.find('.card-photo').length;

      if (cnt > 0) {
        footShow(true);
        footCheckedAll(cnt == all);
      } else {
        footShow(false);
      }
    });

    // change size & other hrin'
    el.container.on('click', '.dropdrop-item', function () {
      var elm = jQuery(this);
      var childID = elm.data('id');
      var childType = elm.data('type');
      var card = elm.parents('.card-photo');
      var cardID = card.attr('id');

      switch (childType) {
        case 'size':
          DrukPhoto.photoSize(cardID, childID);
          photoClassType(card, childID, 'size');
          break;
        case 'border':
          DrukPhoto.photoBorder(cardID, childID);
          photoClassType(card, childID, 'border');
          break;
        case 'paper':
          DrukPhoto.photoType(cardID, childID);
          photoClassType(card, childID, 'paper');
          break;
      }

      if (el.isTouch && elm.parents('.dropdrop').attr('data-close') == 'close') {
        elm.parents('.dropdrop').removeClass('is-open');
      }
    });

    el.container.on('click', '[data-toggle="counter"]', function () {
      var btn = jQuery(this);

      var card = btn.parents('.card-photo');
      var cardID = card.attr('id');

      var input = card.find('.box-counter-field');
      var inputVal = parseInt(input.val()) || 0;

      var title = card.find('.js-caption');

      if (typeof inputVal != 'number') {
        inputVal = 0;
      }

      var newInputVal = inputVal + (btn.data('type') == 'increment' ? 1 : -1);

      if (newInputVal < 1) {
        newInputVal = 1;
      }

      input.val(newInputVal);
      title.html(newInputVal);

      DrukPhoto.photoCount(cardID, newInputVal);
      photoClassType(card, newInputVal, 'counter');
    });

    el.container.on('change paste keyup', '.box-counter-field', function () {
      var input = jQuery(this);

      var card = input.parents('.card-photo');
      var cardID = card.attr('id');

      var title = card.find('.js-caption');

      var inputVal = parseInt(input.val());

      if (typeof inputVal != 'number' || isNaN(inputVal) || inputVal < 1) {
        inputVal = 1;
        input.val(1);
      }

      title.html(inputVal);
      DrukPhoto.photoCount(cardID, inputVal);
      photoClassType(card, inputVal, 'counter');
    });
  }

  function initDrop() {
    if (el.isTouch) {
      el.container.on('click', '.dropdrop', function () {
        var item = jQuery(this);
        var ID = item.attr('id');
        el.container.find('.dropdrop.is-open').not('#' + ID).removeClass('is-open');
        item.toggleClass('is-open');
      });
      el.foot.on('click', '.dropdrop', function () {
        var item = jQuery(this);
        var ID = item.attr('id');
        el.foot.find('.dropdrop.is-open').not('#' + ID).removeClass('is-open');
        item.toggleClass('is-open');
      });
    } else {
      el.container.on('mouseenter', '.dropdrop', function () {
        jQuery(this).addClass('is-open');
      });

      el.foot.on('mouseenter', '.dropdrop', function () {
        jQuery(this).addClass('is-open');
      });

      el.container.on('mouseleave', '.dropdrop', function () {
        jQuery(this).removeClass('is-open');
      });

      el.foot.on('mouseleave', '.dropdrop', function () {
        jQuery(this).removeClass('is-open');
      });
    }
  }

  function initFootActions() {
    el.footHide.click(function () {
      footShow(false);
      el.container.find('.card-photo').removeClass('is-checked');
    });

    el.checkAll.on('change', function () {
      if (this.checked) {
        el.container.find('.card-photo').addClass('is-checked');
      } else {
        el.container.find('.card-photo').removeClass('is-checked');
        footShow(false);
      }
    });

    el.duplAll.on('click', function () {
      el.container.find('.card-photo.is-checked').each(function () {
        var card = jQuery(this);
        photoDuplicate(card);
      });
    });

    el.remAll.on('click', function () {
      el.container.find('.card-photo.is-checked').each(function () {
        var card = jQuery(this);
        photoRemove(card);
      });
      footShow(false);
    });

    // Dropdown replace title
    el.foot.find('.dropdrop-item').on('click', function () {
      var dataType = this.getAttribute('data-type');
      if (typeof dataType == 'undefined' || dataType == null) {
        return false;
      }
      var dataID = parseInt(this.getAttribute('data-id'));

      var parent = jQuery(this).parents('.dropdrop');
      parent.find('.js-caption').html(this.innerHTML);

      el.container.find('.card-photo.is-checked').each(function () {
        var card = jQuery(this);
        var cardID = card.attr('id');
        switch (dataType) {
          case 'border':
            DrukPhoto.photoBorder(cardID, dataID);
            break;
          case 'paper':
            DrukPhoto.photoType(cardID, dataID);
            break;
          case 'size':
            DrukPhoto.photoSize(cardID, dataID);
            break;
        }
        photoClassType(card, dataID, dataType);
      });

      setTimeout(function () {
        parent.removeClass('is-open');
      }, 1);
    });

    el.foot.find('[data-toggle="counter-all"]').on('click', function () {
      var btn = jQuery(this);

      var parent = btn.parents('.dropdrop');

      var input = parent.find('.box-counter-field');
      var inputVal = parseInt(input.val());

      var title = parent.find('.js-caption');

      if (typeof inputVal != 'number' || isNaN(inputVal)) {
        inputVal = 0;
      }

      inputVal += btn.data('type') == 'increment' ? 1 : -1;

      if (inputVal < 1) {
        inputVal = 1;
      }

      el.container.find('.card-photo.is-checked').each(function () {
        var card = jQuery(this);
        var cardID = card.attr('id');

        DrukPhoto.photoCount(cardID, inputVal);
        photoClassType(card, inputVal, 'counter');
        card.find('.dropdrop-counter.js-caption').html(inputVal);
        card.find('.box-counter-field').val(inputVal);
      });

      input.val(inputVal);
      title.html(inputVal);
    });
  }

  function initCtrlA() {
    // Ctrl A select all
    var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        aKey = 97,
        AKey = 65;

    jQuery(document).keydown(function (e) {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function (e) {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    jQuery(document).keydown(function (e) {
      if (!jQuery(e.target).is('input') && !jQuery(e.target).is('textarea')) {
        if (ctrlDown && (e.keyCode == aKey || e.keyCode == AKey)) {

          if (jQuery('#js-photos-social-popup').is('.in')) {
            var not = jQuery('#js-photos-list .js-photos-item:not(.photos-photo-selected)');
            var all = jQuery('#js-photos-list .js-photos-item');
            if (all.length > 0 && not.length == 0) {
              all.click();
            } else {
              not.click();
            }
            return false;
          }

          // select all in editor
          if (el.container.find('.card-photo').length && !jQuery('#js-photos-social-popup').is('.in')) {
            if (el.checkAll.prop("checked")) {
              el.checkAll.prop("checked", false).change();
              footShow(false);
            } else {
              el.checkAll.prop("checked", true).change();
              footShow(true);
            }
            return false;
          }
        }
      }
    });
  }

  function sidebarUnselect() {
    jQuery('.js-button-order').on('click', function () {
      el.checkAll.prop("checked", false).change();
    });
  }

  function init() {
    initElements();
    initCardActions();
    initFootActions();
    initDrop();
    initCtrlA();
    sidebarUnselect();
  }
  init();
})();

// С€Рµ С‚Р° С…СЂС–РЅСЊ... Р°Р»Рµ Р±РµР· РЅРµС— РЅРµ РїСЂР°С†СЋС”
var MobileSidebar = {
  elements: {
    show: '.js-aside-show',
    hide: '.js-aside-hide'
  },

  init: function init() {
    jQuery(this.elements.show).on('click', this.onShow);
    jQuery('#js-photos-container').on('click', this.elements.show, this.onShow);

    jQuery(this.elements.hide).on('click', this.onHide);
    jQuery('#js-photos-container').on('click', this.elements.hide, this.onHide);
  },

  onShow: function onShow() {
    console.log('opened');
    var target = jQuery(this).data('target');
    jQuery(target).addClass('is-opened');
  },

  onHide: function onHide() {
    console.log('closed');
    var target = jQuery(this).data('target');
    jQuery(target).removeClass('is-opened');
  }
};

MobileSidebar.init();

// Init tooltip
if (!('ontouchstart' in window)) {
  jQuery(document).tooltip({
    selector: '[data-toggle="tooltip"]',
    trigger: 'focus'
  });
}

jQuery(document).on('click', '.tabbar-item', function () {
  var item = jQuery(this);
  var imageURL = item.find('img').attr('src');
  var albumTitle = item.find('.content').text();
  jQuery('#jsActiveAlbumImage').attr('src', imageURL);
  jQuery('#jsActiveAlbumText').html(albumTitle);
});

(function (window, document, undefined) {

  var smBreakpoint = window.matchMedia('(max-width: 767px)');
  var container = jQuery('#order-form-container');
  var panels0 = container.find('.panel-order:eq(0)');
  var panels1 = container.find('.panel-order:eq(1)');
  var panels2 = container.find('.panel-order:eq(2)');

  smBreakpoint.addListener(sidebarResize);

  function sidebarResize(query) {
    container.find('.js-button-order').removeClass('is-active');

    panels2.removeClass('is-active');
    panels2.find('.panel-collapse').removeClass('in');

    if (query.matches) {
      panels0.removeClass('is-active');
      panels0.find('.panel-collapse').removeClass('in');
      panels1.addClass('is-active').find('.panel-collapse').addClass('in');
      container.find('.js-button-order[data-index="2"]').addClass('is-active');
      // console.log('< 767px');
    } else {
      panels1.removeClass('is-active');
      panels1.find('.panel-collapse').removeClass('in');
      panels0.addClass('is-active').find('.panel-collapse').addClass('in');
      container.find('.js-button-order[data-index="1"]').addClass('is-active');
      // console.log('767px >');
    }
  }

  sidebarResize(smBreakpoint);
})(window, document);

(function ($$) {

  var GridView = function GridView() {

    var title = $$('#js-row-photo-title');
    var childs = $$('.dropdown-view').find('.dropdown-item');

    function setCurrentItem(items, view) {
      for (var i = 0; i < items.length; i++) {
        var item = $$(items[i]);
        if (item.data('view-type') == view) {
          item.addClass('is-active');
        }
      }
    }

    function setCurrentView(view) {
      if (isLocalStorageNameSupported()) {
        localStorage.setItem('viewStyle', view);
      }
      DrukPhoto.changeClass($$('#js-row-photo'), 'row-photo-', view);
      DrukPhoto.changeClass(title, 'row-photo-title-', view);
    }

    function getCurrentView() {
      if (isLocalStorageNameSupported()) {
        if (localStorage.getItem('viewStyle') == null) {
          localStorage.setItem('viewStyle', 'grid');
        }
        return localStorage.getItem('viewStyle');
      }
    }

    function init() {
      var current = getCurrentView();
      // console.log(current);
      var current = getCurrentView();
      setCurrentView(current);

      setCurrentItem(childs, current);

      childs.on('click', function () {
        childs.removeClass('is-active');
        $$(this).addClass('is-active');
        setCurrentView($$(this).data('view-type'));
      });
    }

    return {
      init: init()
    };
  };

  GridView().init;

  function notification() {
    var notif = $$('.notification');
    var notifClose = notif.find('.notification-close');
    notifClose.on('click', function () {
      var parent = $$(this).parent();
      if (parent.hasClass('is-open')) {
        parent.removeClass('is-open');
      };
    });
  }

  notification();

  function isLocalStorageNameSupported() {
    try {
      localStorage.setItem('localStorageTest', 1);
      localStorage.removeItem('localStorageTest');
      return true;
    } catch (error) {
      return false;
    }
  }

  function languageChooser() {
    var $languagesLink = $$('.js-languages'),
        $languagesBlock = $languagesLink.parent();

    $languagesLink.on('click', function () {
      $languagesBlock.toggleClass('is-languages-active');
    });

    $$('body').on('click', function (e) {
      if (!$$(e.target).closest($languagesBlock).length) {
        $languagesBlock.removeClass('is-languages-active');
      }
    });
  }

  languageChooser();
})(jQuery);
var DrukPhotoCheckout = {
  "onReady": function onReady() {},
  "onComplete": function onComplete(data) {
    LiqPayCheckout.call('liqpay.close');
    DrukPhoto.showOK();
  },
  "onClose": function onClose() {}
};
(function () {
  var conf = {
    id: "#js-liqpay-container",
    url: "//static.liqpay.ua/libjs/checkout.js",
    jsAdded: false,
    data: null,
    sign: null
  };

  function addJs() {
    var script = document.createElement('script');
    script.setAttribute('src', conf.url);
    document.head.appendChild(script);

    conf.jsAdded = true;
  }

  function openPopup(data, sign) {
    conf.data = data;
    conf.sign = sign;
    if (!conf.jsAdded) {
      addJs();
      window.LiqPayCheckoutCallback = function () {
        events();
        init();
      };
    } else {
      init();
    }
  }

  function events() {
    LiqPayCheckout.on("liqpay.callback", function (data) {
      DrukPhotoCheckout.onComplete();
      console.log('callback', data);
    }).on("liqpay.ready", function (data) {
      DrukPhotoCheckout.onReady();
      jQuery(conf.id).removeClass('is-invisible');
      console.log('ready', data);
    }).on("liqpay.close", function (data) {
      DrukPhotoCheckout.onClose();
      jQuery(conf.id).addClass('is-invisible');
      console.log('close', data);
    });
  }

  function init() {
    LiqPayCheckout.init({
      data: conf.data,
      signature: conf.sign,
      embedTo: conf.id,
      mode: "embed"
    });
  }

  DrukPhotoCheckout.try = function (data, sign) {
    openPopup(data, sign);
  };
})();

(function () {

  window.PhotosInit = function () {
    var loadingLine = jQuery('.loading-line');
    var loadingText = loadingLine.find('.loading-text');

    Photos.init({
      fb: true,
      vk: false,
      instagram: false,
      uploader: true,
      needServerAuth: true,
      transparentAuth: true,
      directUpload: true,
      needGetPhotos: true,
      templates: {
        container: DrukPhotoTemplates.photoModalSocial,
        photoSocialItem: DrukPhotoTemplates.socialItem,
        photoFolder: DrukPhotoTemplates.photoModalFolder,
        photoItem: DrukPhotoTemplates.photoModalItem,
        photoBack: DrukPhotoTemplates.photoModalBack
      },
      photoOpenSocial: function photoOpenSocial() {
        $("#js-photos-social-popup").modal('show');
      },
      photoUplStart: function photoUplStart(id, prev, wide) {
        if (prev == undefined) {
          prev = '';
          // prev = 'http://static.foto.office.qubstudio.com/loading.gif';
        }
        DrukPhoto.photoAdd({ "id": id, "img": prev, "social": "own", "size": PhotoSizeDefault, "cnt": 1, "wide": wide });
      },
      photoUplFinish: function photoUplFinish(e) {
        DrukPhoto.photoChange(e.id, e.prev, e.full, e.wide);
      },
      photoUplError: function photoUplError(id) {
        DrukPhoto.photoRemove(id);
        DrukPhoto.container.find("#" + id).remove();
      },
      photoSelect: function photoSelect(id, el) {
        if (el != false) {
          if (el.social != 'own') {
            PhotosFromSocial.push(el);
          }
        } else {
          for (var i = 0; i < PhotosFromSocial.length; i++) {
            if (PhotosFromSocial[i].id == id) {
              PhotosFromSocial.splice(i, 1);
            }
          }
        }
        PhotosModal.updateCnt();
      },
      photoUploadPrevStart: function photoUploadPrevStart(cnt) {
        DrukPhoto.uplModal(true);
      },
      photoUploadPrevFinish: function photoUploadPrevFinish() {
        console.log('finish');
        DrukPhoto.uplModal(false);
        DrukPhoto.notifyPopup({ 'text': PhotoJSTrans.uploading });
      },
      photoUplPercent: function photoUplPercent(p) {
        loadingLine.removeClass('is-hidden').css({ 'width': p + '%' });
        loadingText.html(p + '%');
        if (p == 100) {
          setTimeout(function () {
            loadingLine.addClass('is-hidden');
          }, 500);
        }
      },
      onInit: function onInit() {
        DrukPhotoDraft.load();
      },
      onInitFinish: function onInitFinish() {
        jQuery('.box-full-loading').addClass('is-hidden');
        DrukPhoto.notifyPopup({ 'text': Photos.isAuth() ? PhotoJSTrans.days3 : PhotoJSTrans.needAuth });

        if ( /*PhotoOpenAuthPopup*/location.hash == '#auth' && !Photos.isAuth()) {
          location.href = location.href.replace('#auth', '#');
          $('#auth').modal('show');
        }
      },
      onUserAuth: function onUserAuth(u) {
        if (u.auth) {
          DrukPhotoDraft.auth(true);
          DrukPhotoDraft.load();
          DrukPhoto.userLogin(u);

          DrukPhoto.notifyPopup({ 'text': PhotoJSTrans.days3 });
          DrukPhoto.correctSum();
        }
      },
      onUserLogout: function onUserLogout() {
        $.post("/user/logout", {}, function (r) {
          DrukPhoto.userLogin(false);
          DrukPhoto.notifyPopup({ 'text': PhotoJSTrans.needAuth });
          DrukPhoto.correctSum();

          /*DrukPhoto.removeNotify();
          location.href = '/';*/
        });
      }
    });

    var PhotosModal = $("#js-photos-social-popup");

    PhotosModal.on("hide.bs.modal", function (e) {
      Photos.containerClose();
    }).on("show.bs.modal", function () {
      PhotosModal.updateCnt();
    });

    PhotosModal.updateCnt = function () {
      PhotosModal.find("#js-photos-selected-photos").html(PhotosFromSocial.length);
      PhotosFromSocial.length != 0 ? PhotosModal.addClass('is-foot-active') : PhotosModal.removeClass('is-foot-active');
    };

    PhotosModal.find(".js-photos-add-button").click(addPhotos);

    function addPhotos() {
      for (var i = 0; i < PhotosFromSocial.length; i++) {
        DrukPhoto.photoAdd(PhotosFromSocial[i]);
      }
      Photos.photoClearSelected();
      PhotosModal.modal('hide');
      PhotosFromSocial = [];

      // scroll down
      DrukPhoto.uplModal(false);
    }
  };
})();
var DrukPhotoDraft = {};

(function () {
  var key = "DrukPhotoItems";
  var auth = false;
  var tID = null;
  var loaded = false;

  function tryLoad() {
    if (auth && !loaded) {
      $.ajax({
        "url": "/draft/get",
        "method": "POST",
        "success": function success(r) {
          loaded = true;
          if (r.data && r.data.length > 0) {
            addItems(r.data);
          }
        },
        "complete": function complete() {
          Photos.socialInit();
        }
      });
    } else {
      Photos.socialInit();
    }
  }

  function addItems(obj) {
    for (var i = 0; i < obj.length; i++) {
      DrukPhoto.photoAdd(obj[i]);
    }
  }

  function trySave() {
    clearTimeout(tID);
    tID = setTimeout(function () {
      var obj = getList();
      $.post("/draft/" + (auth ? "set" : "clear"), { "data": obj });
    }, 1500);
  }

  function getList() {
    var ar = DrukPhoto.photoList();
    var arr = [];
    for (var i = 0; i < ar.length; i++) {
      if (ar[i].img.startsWith('http') && typeof ar[i].full == 'string') {
        arr.push(ar[i]);
      }
    }
    return arr;
  }

  function check() {
    if (window.localStorage) {
      return true;
    }
    return false;
  }

  DrukPhotoDraft.load = function () {
    if (auth) {
      tryLoad();
    }
  };

  DrukPhotoDraft.save = function () {
    if (auth) {
      trySave();
    }
  };

  DrukPhotoDraft.auth = function (isAuth) {
    auth = isAuth ? true : false;
  };
})();
if ((typeof DrukPhoto === "undefined" ? "undefined" : _typeof(DrukPhoto)) != 'object') {
  DrukPhoto = {};
}
(function () {
  // GA - category, action
  // fb - action
  // ya - target

  /*
  
  	landing-Login
  	landing-AddPhoto
  
  	editor-Login
  	editor-AddPhoto
  	editor-OrderInit
  	editor-OrderNext
  	editor-OrderMake
  	editor-OrderOK
  */

  function ev_ga(category, action) {
    ga('send', 'event', category, action);
  }

  function ev_fb(action) {
    fbq('track', action);
  }

  function ev_ya(target) {
    yaCounter39206285.reachGoal(target);
  }

  function event(ev) {
    var e = ev.split('-');
    try {
      ev_ga(e[0], e[1]);
    } catch (err) {}
    try {
      ev_fb(e[0] + e[1]);
    } catch (err) {}
    try {
      ev_ya(e[0] + e[1]);
    } catch (err) {}
  }

  DrukPhoto.analytics = function (ev) {
    event(ev);
  };
})();
(function () {

  var close_timeout = 5;
  var popup = jQuery('#notifyPopup');
  var popupID = null;

  function tm() {
    clearTimeout(popupID);
    popupID = setTimeout(close, close_timeout * 1000);
  }

  function open(params) {
    tm();
    popup.addClass("is-open").find('p').html(params.text);
  }

  function close() {
    popup.removeClass("is-open");
  }

  function init() {
    popup.on("click", ".notification-close", close);
    DrukPhoto.notifyPopup = function (params) {
      open(params);
    };
  }
  init();
})();
(function () {

  var conf = {
    "container": jQuery("#order-form-container"),

    "infoForm": null,

    "deliveryTab": null,
    "deliveryForm": null,
    "orderBtn": null,

    "npStoresSelect": null,

    "promoInput": null,
    "promoInfoBlock": null,

    "percentBlock": null,
    "totalSum": null,

    "deliveryPrice": 0,

    "boxOK": null,
    "boxERR": null,
    "boxes": null,

    "values": {
      "delivery": 0,
      "promo": 0,
      "percent": 0
    }
  };

  function forms() {
    conf.infoForm.validate({
      submitHandler: function submitHandler(form) {
        enableLastTab();
      }
    });

    conf.deliveryForm.validate({
      submitHandler: function submitHandler(form) {
        makeOrder();
      }
    });
  }

  function orderOK() {
    DrukPhoto.analytics('editor-OrderOK');
    conf.boxes.addClass("is-hidden");
    conf.boxOK.removeClass("is-hidden");
    DrukPhoto.removeNotify();
  }

  function orderErr() {
    conf.boxes.addClass("is-hidden");
    conf.boxERR.removeClass("is-hidden");
    DrukPhoto.removeNotify();
  }

  function orderLiqPay(info) {
    DrukPhotoCheckout.try(info.data, info.sign);
    DrukPhoto.removeNotify();
  }

  function makeOrder() {
    var items = DrukPhoto.photoList();
    for (var i = 0; i < items.length; i++) {
      if (typeof items[i].full != 'string' || items[i].full.length < 10) {
        conf.uplNotFinished.modal('show');
        return false;
      }
    }

    conf.orderBtn.attr("disabled", true);
    var ar = conf.infoForm.serializeArray();
    ar = ar.concat(conf.deliveryForm.serializeArray());
    var obj = {};
    for (var i = 0; i < ar.length; i++) {
      obj[ar[i].name] = ar[i].value;
    }
    obj["items"] = items;

    $.ajax({
      url: PhotoOrderUrl,
      data: obj,
      method: "POST",
      success: function success(r) {
        if (r.err == false) {
          if (r.liqpay) {
            orderLiqPay(r.liqpay);
          } else {
            orderOK();
          }
        } else {
          orderErr();
        }
      },
      error: function error(e) {
        try {
          var json = JSON.parse(e.responseText);
          for (i in json) {
            DrukPhoto.notifyPopup({ 'text': json[i] });
          }
        } catch (err) {}
      },
      complete: function complete() {
        conf.orderBtn.attr("disabled", false);
      }
    });
  }

  function disableLastTab() {
    conf.deliveryTab.addClass("is-disabled");
  }

  function enableLastTab() {
    conf.deliveryTab.removeClass("is-disabled");
    conf.deliveryTab.find(".panel-title").click();
    options();
    //conf.deliveryTab.click();
  }

  function btns() {
    conf.container.find(".js-order-accordion-paym").on("click", function () {
      if (conf.infoForm.valid()) {
        enableLastTab();
        DrukPhoto.analytics('editor-OrderNext');
      }
    });

    conf.container.find(".js-order-accordion-order").on("click", function () {
      if (conf.deliveryForm.valid()) {
        makeOrder();
        DrukPhoto.analytics('editor-OrderMake');
      }
    });
  }

  function loadTab() {
    var item = jQuery(this);
    var index = parseInt(item.data('index'));
    var parent = item.parents(".panel-order");

    parent.prev().find('.panel-title').addClass('is-complete');

    if (parent.hasClass('is-active') || parent.hasClass('is-disabled')) {
      return false;
    }

    if (index >= 0) {
      item = conf.container.find('.panel-order:eq(' + index + ') .panel-title');
      var parent = item.parents(".panel-order");
      if (parent.hasClass('is-active') || parent.hasClass('is-disabled')) {
        return false;
      }
      item.click();
    }

    conf.container.find('.panel-order').removeClass('is-active');
    conf.container.find('.js-button-order').removeClass('is-active');

    var po = item.parents(".panel-order");
    po.addClass('is-active');
    var step = po.index();
    conf.container.find('.js-button-order[data-index="' + (step + 1) + '"]').addClass('is-active');
  }

  function collapse() {
    var accordion = jQuery('#order-accordion');
    conf.container.find('[data-toggle="collapse"]').on('click', loadTab);
  }

  function mask() {
    conf.container.find(".mask-phone").mask('+38 (000) 000-00-00');
  }

  function onlyCyrInput() {
    conf.container.find(".only-cyr").on('keyup', function () {
      var that = this;

      setTimeout(function () {
        that.value = that.value.replace(/[^Р°-СЏРђ-РЇС–Р†Т‘ТђР‡С—Р„С”'-]+/i, '');
      }, 1);
    });
  }

  function npStores(cityID) {
    conf.npStoresSelect.html('');
    $.get('/np/stores/' + cityID, function (data) {
      for (var i = 0; i < data.data.length; i++) {
        conf.npStoresSelect.append('<option value="' + data.data[i].id + '">' + data.data[i].name + '</option>');
      }
    });
  }

  function np() {
    conf.npStoresSelect = conf.container.find(".np-store");
    conf.container.find(".np-city").typeahead({
      source: function source(query, process) {
        return $.get('/np/cities/' + query, function (data) {
          return process(data.data);
        });
      },
      afterSelect: function afterSelect(obj) {
        npStores(obj.id);
      }
    });
  }

  function enablePromo(info) {
    conf.values.promo = info.grn;
    conf.promoInfoBlock.find("#js-order-promo-sum").html(info.grn);
    conf.promoInfoBlock.show();
    correctSum();
  }

  function disablePromo() {
    conf.values.promo = 0;
    conf.promoInfoBlock.hide();
    console.log('disable promo');
    correctSum();
  }

  function promo() {
    conf.promoInfoBlock = conf.container.find("#js-order-promo-block");
    conf.promoInput = conf.container.find(".promo-code");
    conf.promoInput.on("change", function () {
      var code = this.value;
      $.post("/promoInfo", { "code": code }, function (r) {
        if (r.info) {
          enablePromo(r.info);
        } else {
          disablePromo();
        }
      });
    });
  }

  function percentDiscount(percent) {
    if (percent > 0) {
      conf.percentBlock.find("#js-order-price-discount").html(percent + ' %');
      conf.percentBlock.show();
    } else {
      conf.percentBlock.hide();
    }
    conf.values.percent = percent;
  }

  function freeDelivery(en) {
    if (en) {
      conf.values.delivery = 0;
    } else {
      conf.values.delivery = conf.deliveryPrice;
    }
    conf.container.find("#js-order-price-delivery").html(conf.values.delivery.toFixed(2));
  }

  function correctSum() {
    var finishSum = 0.0;
    var sam = !conf.container.find('input[name="delivery_type"][data-type=NP]').is(":checked");
    if (conf.promoInfoBlock.is(":visible")) {
      percentDiscount(0);

      freeDelivery(sam);

      finishSum = DrukPhoto.info.sumVal;
      finishSum -= conf.values.promo;
      if (finishSum < 0) {
        finishSum = 0;
      }
    } else {
      var percent = 0;
      for (var i = 0; i < PhotoCtnDiscount.length; i++) {
        if (DrukPhoto.info.cntVal >= PhotoCtnDiscount[i].cnt) {
          percent = PhotoCtnDiscount[i].percent;
        }
      }
      percentDiscount(percent);

      // free delivery
      if (DrukPhoto.info.sumVal >= PhotoFreeDelivery && PhotoFreeDelivery > 10) {
        freeDelivery(true);
      } else {
        freeDelivery(sam);
      }

      finishSum = DrukPhoto.info.sumVal;
      if (percent > 0) {
        finishSum = finishSum * (100 - percent) / 100;
      }
    }
    finishSum += conf.values.delivery;
    var summ = Math.round(finishSum * 100) / 100;
    conf.totalSum.html(summ.toFixed(2));
  }

  function options() {
    conf.container.find('input[name="payment_type"][data-type=CASH]').prop("disabled", !Photos.isAuth());
    conf.container.find('input[name="delivery_type"][data-type=SAM]').prop("disabled", !Photos.isAuth());
  }

  function changePaymType(type) {
    var el = conf.container.find('input[name="delivery_type"][data-type=NP]');
    if (type == 'CASH') {
      if (el.is(":checked")) {
        el.prop("checked", false);
      }
      el.prop("disabled", true);
    } else {
      el.prop("disabled", false);
    }
  }

  function changeDeliveryType(type) {
    var el = conf.container.find('input[name="payment_type"][data-type=ONLINE]');
    if (type == 'NP') {
      if (!el.is(":checked")) {
        el.prop("checked", true);
      }
    }
    correctSum();
  }

  function init() {
    conf.uplNotFinished = $("#uplNotFinishedModal");
    conf.deliveryTab = conf.container.find("#order-accordion-delivery").parents(".panel");
    conf.infoForm = conf.container.find("#order-accordion-form-info");
    conf.deliveryForm = conf.container.find("#order-accordion-form-delivery");
    conf.orderBtn = conf.container.find(".js-order-accordion-order");

    conf.percentBlock = conf.container.find("#js-order-discount-block");
    conf.totalSum = conf.container.find('#js-order-total-summ');

    conf.boxes = $(".box-photo, .box-sidebar");
    conf.boxOK = $("#js-order-success");
    conf.boxERR = $("#js-order-error");

    conf.deliveryPrice = parseInt(conf.container.find('input[name="delivery_type"][data-type=NP]').attr("data-price"));

    conf.container.find('input[name="payment_type"]').on("change", function () {
      var dt = this.getAttribute("data-type");
      changePaymType(dt);
    });

    conf.container.find('input[name="delivery_type"]').on("change", function () {
      var dt = this.getAttribute("data-type");
      changeDeliveryType(dt);
    });

    disableLastTab();
    forms();
    btns();
    collapse();

    mask();
    onlyCyrInput();
    np();
    promo();
    DrukPhoto.correctSum = function () {
      correctSum();
      options();
    };
    DrukPhoto.showOK = function () {
      orderOK();
    };
  }

  init();
})();

var DrukPhotoTemplates = {
  name: "-",
  // socialItem: `<a href="#" class="js-photos-social" data-social="%type%">%name%</a>`,
  socialItem: "",

  photoCard: "\n    <div class=\"card-photo photo-size-%size% photo-border-%border% photo-paper-%type% photo-counter-%cnt% photo-wide-%wide%\" id=\"%id%\">\n      <div class=\"card-photo-inner\">\n        <div class=\"card-body\">\n          <div class=\"card-photo-overlay\">\n            <div class=\"box-action\">\n              <a class=\"item-link js-duplicate\" href=\"#\"><i class=\"ion ion-print-duplicate\"></i></a>\n              <a class=\"item-link js-remove\" href=\"#\"><i class=\"ion ion-print-remove\"></i></a>\n            </div>\n          </div>\n          <span class=\"card-photo-social\">\n            <i class=\"ion ion-print-%social%\"></i>\n          </span>\n          <div class=\"card-body-inner\">\n            <div class=\"card-photo-size\">\n              <div class=\"card-photo-border\"><img onerror=\"Photos.imLoadErr('%id%', this.src)\" onload=\"Photos.imLoad('%id%', this.src)\" src=\"%img%\" alt=\"\"></div>\n            </div>\n            <div class=\"card-photo-size card-photo-duplicate-1\"><div class=\"card-photo-border\"></div>\n            </div>\n            <div class=\"card-photo-size card-photo-duplicate-2\"><div class=\"card-photo-border\"></div>\n            </div>\n          </div>\n        </div>\n        <div class=\"card-foot\">\n\n          <ul class=\"list-action\">\n            <li class=\"wi dropdrop dropdrop-size\" data-close=\"close\">\n              <a class=\"dropdrop-btn\" href=\"#\" data-toggle=\"dropdrop\">\n                <span class=\"icons-photo-size icons\"></span>\n                " + photoSizeTitle() + "\n              </a>\n              <div class=\"dropdrop-menu\">" + photoSizeDropdown() + "</div>\n            </li>\n            <li class=\"wi dropdrop dropdrop-border\" data-close=\"close\">\n              <a class=\"dropdrop-btn\" href=\"#\" data-toggle=\"dropdrop\">\n                <span class=\"icons-photo-fields icons\"></span>\n                " + photoBorderTitle() + "\n              </a>\n              <div class=\"dropdrop-menu\">" + photoBorderDropdown() + "</div>\n            </li>\n            <li class=\"wi dropdrop dropdrop-paper\" data-close=\"close\">\n              <a class=\"dropdrop-btn\" href=\"#\" data-toggle=\"dropdrop\">\n                <span class=\"icons-photo-mat icons\"></span>\n                " + photoPaperTitle() + "\n              </a>\n              <div class=\"dropdrop-menu\">" + photoPaperDropdown() + "</div>\n            </li>\n            <li class=\"wi dropdrop dropdrop-counter\">\n              <a class=\"dropdrop-btn\" href=\"#\" data-toggle=\"dropdrop\">\n                <span class=\"icons-photo-quantity icons\"></span>\n                <span class=\"caption js-caption\">%cnt%</span>\n              </a>\n              <div class=\"dropdrop-menu\">\n                <div class=\"dropdrop-item\">\n                  <span>\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C, \u0448\u0442.</span>\n                  <div class=\"box-counter\">\n                    <button class=\"box-counter-button\"\n                            data-toggle=\"counter\"\n                            data-type=\"decrement\">-</button>\n                    <input class=\"box-counter-field\" type=\"text\" value=\"%cnt%\" />\n                    <button class=\"box-counter-button\"\n                            data-toggle=\"counter\"\n                            data-type=\"increment\">+</button>\n                  </div>\n                </div>\n              </div>\n            </li>\n            <li class=\"card-foot-actions\">\n              <a class=\"item-link js-duplicate\" href=\"#\"><i class=\"ion ion-print-duplicate\"></i></a>\n              <a class=\"item-link js-remove\" href=\"#\"><i class=\"ion ion-print-remove\"></i></a>\n            </li>\n          </ul>\n        </div>\n      </div>\n    </div>\n  ",

  photoModalFolder: "\n    <a href=\"#\" class=\"tabbar-item js-photos-item js-aside-hide\"\n                data-type=\"folder\"\n                data-social=\"%social%\"\n                data-id=\"%id%\"\n                data-target=\"#tabbar-head\">\n      <div class=\"image\">\n        <img src=\"%img%\" alt=\"%name%\"/>\n      </div>\n      <div class=\"content\">\n        %name%\n      </div>\n    </a>\n  ",
  photoModalItem: "\n    <div class=\"row-item\">\n      <a href=\"#\"\n         class=\"js-photos-item%class%\"\n         data-type=\"image\"\n         data-social=\"%social%\"\n         data-wide=\"%wide%\"\n         data-id=\"%id%\"\n         data-image=\"%full%\">\n        <img data-wide=\"%wide%\" src=\"%img%\"/>\n      </a>\n    </div>\n  ",
  photoModalBack: "\n    <a href=\"#\"\n       class=\"js-photos-item\"\n       data-type=\"back\"\n       data-social=\"%social%\">\n      <- Back\n    </a>\n  ",
  photoModalSocial: "\n    <div id=\"js-photos-social-links\" class=\"hide\"></div>\n    <div class=\"box-full box-full-drag_drop hide\" id=\"js-photos-uploader-drop\">\n      <img class=\"image\" src=\"/images/no-photo.png\" alt=\"\">\n      <p class=\"describe\">\n      " + PhotoJSTrans.dropFiles + "\n      </p>\n    </div> \n    \n    <div id=\"js-photos-social-popup\" class=\"modal modal-social fade\" tabindex=\"-1\" >\n      <div class=\"modal-dialog\">\n        <div class=\"modal-content\">\n          <div class=\"modal-heading\">\n            <h2 class=\"modal-title\" id=\"js-photos-title\"></h2>\n            <button type=\"button\"\n                    class=\"modal-close close\"\n                    data-dismiss=\"modal\"\n                    aria-label=\"Close\">\n              <i class=\"ion ion-ios-close-empty hidden-xs-down\"></i>\n              <i class=\"ion ion-android-arrow-back hidden-sm-up\"></i>\n            </button>\n          </div>\n          <div class=\"modal-body\">\n            <div class=\"tabbar\">\n              <div class=\"tabbar-head\" id=\"tabbar-head\">\n                <div class=\"tabbar-folder\">\n                  <div class=\"scroll\">\n                    <div class=\"scroll-inner\" id=\"js-photos-albums\"></div>\n                  </div>\n                </div>\n                <div class=\"tabbar-banner\">\n                  <img class=\"image\" src=\"/images/no-photo.png\" alt=\"\" />\n                  <div class=\"content\">" + PhotoJSTrans.defaultFormat + "</div>\n                </div>\n              </div>\n              <div class=\"tabbar-body\">\n                <div class=\"tabbar-back js-aside-show\" data-target=\"#tabbar-head\">\n                  <div class=\"image\">\n                    <img id=\"jsActiveAlbumImage\" src=\"\" alt=\"\" />\n                  </div>\n                  <span id=\"jsActiveAlbumText\"></span>\n                </div>\n                <div class=\"tabbar-content\">\n                  <div class=\"scroll\">\n                    <div class=\"scroll-inner\">\n                      <div class=\"row-tabbar\" id=\"js-photos-list\"></div>\n                    </div>\n                  </div>\n\n                  <div class=\"box-full box-full-modal\" id=\"js-photos-loader\">\n                    <img class=\"image\" src=\"/images/loading.gif\" alt=\"\" />\n                  </div>\n                  <div class=\"box-full box-full-modal hide\" id=\"js-photos-connect\">\n                    <button class=\"btn btn-primary js-photos-connect\">" + PhotoJSTrans.login + "</button>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class=\"modal-footer\">\n\n            <div class=\"row\">\n              <div class=\"col-xs-6 col-sm-4\">\n                <span class=\"caption\">" + PhotoJSTrans.selectedPhoto + "</span>\n                <span class=\"value\" id=\"js-photos-selected-photos\"></span>\n              </div>\n              <div class=\"col-xs-6 col-sm-4\">\n                <span class=\"caption\">" + PhotoJSTrans.size + "</span>\n                <div class=\"wi dropdrop dropdrop-replace dropdrop-modal\" data-close=\"true\">\n                  <button type=\"button\"\n                          class=\"dropdrop-btn\"\n                          data-toggle=\"dropdrop\"\n                          data-id=\"" + PhotoSizes[0].id + "\"\n                          data-title=\"" + PhotoSizes[0].size + "\">\n                    <span class=\"caption js-caption\">" + PhotoSizes[0].size + "</span>\n                  </button>\n                  <div class=\"dropdrop-menu\">" + photoSizeDropdown() + "</div>\n                </div>\n              </div>\n              <div class=\"col-xs-12 col-sm-4 text-xs-center text-sm-right\">\n                <button type=\"button\" class=\"btn btn-primary js-photos-add-button\">" + PhotoJSTrans.append + "</button>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  ",

  orderTableRow: "\n    <tr><td>%size%</td><td class=\"text-xs-right\">%cnt% " + PhotoJSTrans.odv + "</td><td class=\"text-xs-right\">%price% " + PhotoJSTrans.currency + "</td></tr>\n  ",

  orderTableFoot: "\n    <tr><td class=\"text-xs-left\"><b>" + PhotoJSTrans.summary + "</b></td><td class=\"text-xs-right\">%cnt% " + PhotoJSTrans.odv + "</td><td class=\"text-xs-right\">%price% " + PhotoJSTrans.currency + "</td></tr>\n  ",

  userBlock: "\n              <li class=\"nav-item dropdown dropdown-profile\">\n                <a href=\"#\"\n                   class=\"dropdown-btn\"\n                   data-toggle=\"dropdown\">\n                    <span class=\"hidden-xs-down\">%name%</span>\n                    <img class=\"dropdown-image\" src=\"%img%\">\n                </a>\n                <div class=\"dropdown-menu\">\n                    <a class=\"dropdown-item\" href=\"/user/logout\" onclick=\"Photos.logout();return false\">" + PhotoJSTrans.logout + "</a>\n                </div>\n              </li>\n  ",
  userLoginBtn: "<button onclick=\"DrukPhoto.analytics('editor-Login')\" class=\"btn btn-outline-primary auth-btn\" data-toggle=\"modal\" data-target=\"#auth\">" + PhotoJSTrans.login + "</button>"
};

function photoTemplate(name, data) {
  if (data) {
    return DrukPhotoTemplates[name].replace(/%(\w*)%/g, function (m, key) {
      return data.hasOwnProperty(key) ? data[key] : "";
    });
  } else {
    return DrukPhotoTemplates[name];
  }
}

function photoSizeTitle() {
  var title = '';
  for (var i = 0; i < PhotoSizes.length; i++) {
    title += "<span data-id=\"" + PhotoSizes[i].id + "\"\n                    class=\"caption\">\n                    " + PhotoSizes[i].size + "\n             </span>";
  }
  return title;
}

function photoSizeDropdown() {
  var item = '';
  for (var i = 0; i < PhotoSizes.length; i++) {
    item += "<a href=\"#\"\n                 class=\"dropdrop-item\"\n                 data-id=\"" + PhotoSizes[i].id + "\"\n                 data-title=\"" + PhotoSizes[i].size + "\"\n                 data-type=\"size\">\n                 " + PhotoSizes[i].size + "\n             </a>";
  }
  return item;
}

function photoPaperTitle() {
  var title = '';
  for (var i = 0; i < PhotoPaperTypes.length; i++) {
    title += "<span data-id=\"" + PhotoPaperTypes[i].id + "\"\n                    class=\"caption\">\n                    " + PhotoPaperTypes[i].name + "\n             </span>";
  }
  return title;
}

function photoPaperDropdown() {
  var item = '';
  for (var i = 0; i < PhotoPaperTypes.length; i++) {
    item += "\n      <a class=\"dropdrop-item\"\n         data-id=\"" + PhotoPaperTypes[i].id + "\"\n         data-type=\"paper\"\n         data-title=\"" + PhotoPaperTypes[i].name + "\"\n         href=\"#\">\n      " + PhotoPaperTypes[i].name + "\n      </a>\n    ";
  }
  return item;
}

function photoBorderTitle() {
  var title = '';
  for (var i = 0; i < PhotoPrintTypes.length; i++) {
    title += "<span data-id=\"" + PhotoPrintTypes[i].id + "\"\n                    class=\"caption\">\n                    " + PhotoPrintTypes[i].name + "\n             </span>";
  }
  return title;
}

function photoBorderDropdown() {
  var item = '';
  for (var i = 0; i < PhotoPrintTypes.length; i++) {
    item += "\n      <a class=\"dropdrop-item\"\n         data-id=\"" + PhotoPrintTypes[i].id + "\"\n         data-type=\"border\"\n         data-title=\"" + PhotoPrintTypes[i].name + "\"\n         href=\"#\">\n      " + PhotoPrintTypes[i].name + "\n      </a>\n    ";
  }
  return item;
}

// <label class="checkbox">
//               <input type="checkbox" class="js-checked">
//               <span class="checkbox-icon"></span>
//             </label>


// <div class="dropdown dropdown-replace dropdown-modal">
//   <button type="button"
//           class="dropdown-btn"
//           data-toggle="dropdown"
//           data-id="`+ PhotoSizes[0].id +`"
//           data-title="`+ PhotoSizes[0].size +`">
//     <span class="caption js-caption">`+ PhotoSizes[0].size +`</span>
//   </button>
//   <div class="dropdrop-menu">`+ photoSizeDropdown() +`</div>
// </div>
(function () {
  var userBlock = jQuery("#js-user-info");

  function userLogin(info) {
    var inf = {
      "img": info.user.imgs[0],
      "name": info.user.name
    };
    userBlock.html(photoTemplate('userBlock', inf));
  }

  function userLogout() {
    userBlock.html(photoTemplate('userLoginBtn', {}));
  }

  DrukPhoto.userLogin = function (info) {
    if ((typeof info === "undefined" ? "undefined" : _typeof(info)) == 'object') {
      userLogin(info);
    } else {
      userLogout();
    }
  };
})();
//# sourceMappingURL=app.js.map