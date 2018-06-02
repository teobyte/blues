'use strict';
(function() {
    var Blues = Blues || {};
    var startnav = null,
        menumode = '0'; // 0 - mixed, 1 - single, 2 - mobsingle
    var sidenav = {
        init: function(selector) {
            var selector = selector || '.bz-sidenav-btn',
                btns = bzDom(selector);
            if (btns.el.length < 1) return;
            if (bzDom('#navset').exist()) {
                var $navset = bzDom('#navset');
                if ($navset.onbz('start'))
                    startnav = $navset.onbz('start');
                if ($navset.onbz('mode'))
                    menumode = $navset.onbz('mode');
            }
            var initNav = function(btn) {
                var $btn = bzDom(btn),
                    $cont = bzDom($btn.onbz('cont'));
                $btn.oncss('cursor', 'pointer');
                sidenav.setnav($btn, $cont);
            };
            btns.each(function(i, item) {
                initNav(item);
            });
        },
        setnav: function($btn, $cont) {
            var navElname = '#'+ $btn.onbz('nav'),
                $nav = bzDom(navElname);
            var mode = $btn.onbz('mode'),
                open = $btn.onbz('open'),
                side = $btn.onbz('side'),
                rtl = $btn.onbz('rtl');
            if (side)
                $nav.onclass(side);
            if (bz.scrWidth() > 768 && $btn.onattr('id') === startnav) {
                if (side === 'left') {
                    $nav.oncss('left', '0px');
                    $cont.onclass('bz-shift-left');
                }
                if (side === 'right') {
                    $nav.oncss('right', '0px');
                    $cont.onclass('bz-shift-right');
                }
                $btn.onbz('open', '1');
            } else {
                if (side === 'left')
                    $nav.oncss('left', '-240px');
                if (side === 'right')
                    $nav.oncss('right', '-240px');
                $btn.onbz('open', '0');
            }
            $btn.on('click', function() {
                var $theBtn = bzDom(this);
                if ($theBtn.onbz('open') === '0') {
                    var $_btns = bzDom('.bz-sidenav-btn');
                    if ($_btns.el.length >= 1) {
                        if (menumode === '1') {
                            $_btns.each(function(i, item) {
                                var $_btn = bzDom(item);
                                if ($_btn.onbz('open') === '1') {
                                    var $theNav = bzDom('#' + $_btn.onbz('nav'));
                                    sidenav.closenavside($_btn, $theNav, $cont);
                                }
                            });
                        } else if (bz.scrWidth() < 768 && menumode === '2') {
                            $_btns.each(function(i, item) {
                                var $_btn = bzDom(item);
                                if ($_btn.onbz('open') === '1') {
                                    var $theNav = bzDom('#' + $_btn.onbz('nav'));
                                    sidenav.closenavside($_btn, $theNav, $cont);
                                }
                            });
                        }
                    }
                    sidenav.opennavside($theBtn, $nav, $cont);
                }
                else
                    sidenav.closenavside($btn, $nav, $cont);
            });
        },
        opennavside: function($btn, $nav, $cont) {
            var _side = $btn.onbz('side');
            if (_side === 'left')
                $nav.oncss('left', '0px');
            if (_side === 'right')
                $nav.oncss('right', '0px');
            if (bz.scrWidth() > 768 && _side === 'right')
                if (!$nav.ifclass('bz-shift-right'))
                    $cont.onclass('bz-shift-right');
            if (bz.scrWidth() > 768 && _side === 'left')
                if (!$nav.ifclass('bz-shift-left'))
                    $cont.onclass('bz-shift-left');
            if (bz.scrWidth() < 768) {
                bz.showfader('.bz-content', 9900);
                    bzDom('.bz-fader').on('click', function() {
                        sidenav.closenavside($btn, $nav, $cont);
                    });
                bzDom('body').oncss({ overflow: 'hidden' });
            }
            $btn.onbz('open', '1');
        },
        closenavside: function($btn, $nav, $cont) {
            var _side = $btn.onbz('side');
            if (_side === 'left')
                $nav.oncss('left', '-240px');
            if (_side === 'right')
                $nav.oncss('right', '-240px');
            if (bz.scrWidth() > 768 && _side === 'right')
                $cont.offclass('bz-shift-right');
            if (bz.scrWidth() > 768 && _side === 'left')
                $cont.offclass('bz-shift-left');
            if (bz.scrWidth() < 768) {
                bz.hidefader();
                bzDom('body').oncss({ overflow: 'auto' });
            }
            $btn.onbz('open', '0');
        }
    };
    Blues.sidenav = sidenav;
    return Blues.sidenav.init();
})();