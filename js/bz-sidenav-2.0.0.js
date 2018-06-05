'use strict';
(function() {
    var Blues = Blues || {};
    var sidenav = {
        init: function(selector) {
            selector = selector || '.bz-sidenav-btn';
            var btns = bzDom(selector);
            if (btns.el.length < 1) return;
            var initNav = function(btn) {
                var $btn = bzDom(btn),
                    $cont = bzDom($btn.ondata('cont'));
                $btn.oncss('cursor', 'pointer');
                sidenav.setnav($btn, $cont);
            };
            btns.each(function(i, item) {
                initNav(item);
            });
        },
        setnav: function($btn, $cont) {
            var navElname = '#'+ $btn.ondata('nav'),
                $nav = bzDom(navElname);
            var openstart = $btn.ondata('openstart'),
                side = $btn.ondata('side'),
                menumode = $btn.ondata('mode') || 'mixed',
                // ToDo: rtl support
                rtl = $btn.ondata('rtl');
            if (side)
                $nav.onclass(side);
            sidenav.setSides(side, $btn, $nav, $cont, openstart);
            bzDom(window).on('resize', function() {
                var $_btns = bzDom('.bz-sidenav-btn');
                $_btns.each(function(i, item) {
                    var $_btn = bzDom(item),
                        side = $_btn.ondata('side'),
                        $_nav = bzDom('#' + $_btn.ondata('nav')),
                        $_cont = bzDom($_btn.ondata('cont'));
                    if (bz.scrWidth() > 768 && $_btn.ondata('openstart') === '1')
                        sidenav.opennavside($_btn, $_nav, $_cont);
                    if (bz.scrWidth() <= 768 && $_btn.ondata('open') === '1') {
                        sidenav.closenavside($_btn, $_nav, $_cont);
                        if (side === 'left')
                            if($_cont.ifclass('bz-shift-left'))
                                $_cont.offclass('bz-shift-left');
                        if (side === 'right')
                            if($_cont.ifclass('bz-shift-right'))
                                $_cont.offclass('bz-shift-right');
                    }
                });
            });

            $btn.on('click', function() {
                var $theBtn = bzDom(this);
                if ($theBtn.ondata('open') === '0') {
                    var $_btns = bzDom('.bz-sidenav-btn');
                    if ($_btns.el.length >= 1) {
                        if (menumode === 'single') {
                            $_btns.each(function(i, item) {
                                var $_btn = bzDom(item);
                                if ($_btn.ondata('open') === '1') {
                                    var $theNav = bzDom('#' + $_btn.ondata('nav'));
                                    sidenav.closenavside($_btn, $theNav, $cont);
                                }
                            });
                        } else if (bz.scrWidth() < 768 && menumode === 'mobile') {
                            $_btns.each(function(i, item) {
                                var $_btn = bzDom(item);
                                if ($_btn.ondata('open') === '1') {
                                    var $theNav = bzDom('#' + $_btn.ondata('nav'));
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
        setSides: function(side, $btn, $nav, $cont, open) {
            if (bz.scrWidth() > 768 && open === '1') {
                if (side === 'left') {
                    $nav.oncss('left', '0px');
                    if(!$cont.ifclass('bz-shift-left'))
                        $cont.onclass('bz-shift-left');
                }
                if (side === 'right') {
                    $nav.oncss('right', '0px');
                    if(!$cont.ifclass('bz-shift-right'))
                        $cont.onclass('bz-shift-right');
                }
                $btn.ondata('open', '1');
            } else {
                if (side === 'left')
                    $nav.oncss('left', '-240px');
                if (side === 'right')
                    $nav.oncss('right', '-240px');
                $btn.ondata('open', '0');
            }
        },
        opennavside: function($btn, $nav, $cont) {
            var _side = $btn.ondata('side');
            if (_side === 'left')
                $nav.oncss('left', '0px');
            if (_side === 'right')
                $nav.oncss('right', '0px');
            if (bz.scrWidth() > 768 && _side === 'right')
                if (!$cont.ifclass('bz-shift-right'))
                    $cont.onclass('bz-shift-right');
            if (bz.scrWidth() > 768 && _side === 'left')
                if (!$cont.ifclass('bz-shift-left'))
                    $cont.onclass('bz-shift-left');
            if (bz.scrWidth() < 768) {
                bz.showfader('.bz-content', 9900);
                    bzDom('.bz-fader').on('click', function() {
                        sidenav.closenavside($btn, $nav, $cont);
                    });
                bzDom('body').oncss({ overflow: 'hidden' });
            }
            $btn.ondata('open', '1');
        },
        closenavside: function($btn, $nav, $cont) {
            var _side = $btn.ondata('side');
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
            $btn.ondata('open', '0');
        }
    };
    Blues.sidenav = sidenav;
    return Blues.sidenav.init();
})();