(function() {
    'use strict';
    var bzSlider = function(selector, options) {
        if (!selector)
            return;
        options = options || {};
        this.selector = selector;
        this.slider = document.getElementById(selector);
        this.slideNo = 0;
        this.rotationKey = false;
        this.pauseState = true;
        this.o = this.mergeOptions(this.defOptions, options);
    };
    bzSlider.prototype.mergeOptions = function(defaultOptions, options) {
        var o = {};
        for (let k in defaultOptions) {
            if (defaultOptions.hasOwnProperty(k)) {
                if (options.hasOwnProperty(k)) o[k] = options[k];
                else o[k] = defaultOptions[k];
            }
        }
        return o;
    };
    bzSlider.prototype.getElemStyle = function (elem, property) {
        return window.getComputedStyle(elem, null).getPropertyValue(property);
    };
    bzSlider.prototype.animateIt = function (elem, prop, time) {
        time = time || 400;
        if (!elem || !prop)
            return;
        let start = Date.now();
        let propName = prop.name,
            propVal = prop.value;
        let tick = parseInt(propVal) / time;
        function draw(timePassed) {
            elem.style[propName] = timePassed * tick + 'px';
        }
        let timer = setInterval(function () {
            let timePassed = Date.now() - start;
            let setit = false;
            if (timePassed >= time) {
                clearInterval(timer);
                elem.style[propName] = propVal + 'px';
                return;
            }
            draw(timePassed, setit);
        }, 10);
    };
    bzSlider.prototype.removeClass = function(elem, classname) {
        //elem.className = elem.className.replace(/\bmystyle\b/g, '');
        elem.classList.remove(classname);
    };
    bzSlider.prototype.hlThumb = function(slideNo) {
        let SL = this;
        var _thmbs = SL.slider.getElementsByClassName('slider-thumb');
        for (let i = 0; i < SL.slideCount; i++) {
            SL.removeClass(_thmbs[i], 'active');
        }
        _thmbs[slideNo].classList.add('active');
    };
    bzSlider.prototype.moveLeft = function(speed) {
        let SL = this;
        if (SL.slideNo == 0)
            SL.slideNo = SL.sliders.length - 1;
        else
            SL.slideNo = SL.slideNo - 1;
        if (SL.o.thumbs)
            SL.hlThumb(SL.slideNo);
        SL.animateIt(SL.sliderUl, { name: 'left', value: SL.slideWidth }, speed);
        setTimeout(function () {
            SL.sliderUl.insertBefore(SL.sliders[SL.sliders.length - 1], SL.sliders[0]);
            SL.sliderUl.style.left = '';
            // call callback when slide stops moving
            if (SL.o.moveStop)
                SL.o.moveStop(SL.slideNo);
        }, speed);
    };
    bzSlider.prototype.moveRight = function(speed) {
        let SL = this;
        if (SL.slideNo == SL.sliders.length - 1)
            SL.slideNo = 0;
        else
            SL.slideNo = SL.slideNo + 1;
        if (SL.o.thumbs)
            SL.hlThumb(SL.slideNo);
        SL.animateIt(SL.sliderUl, { name: 'left', value: -SL.slideWidth }, speed);
        setTimeout(function () {
            SL.sliderUl.appendChild(SL.sliders[0]);
            SL.sliderUl.style.left = '';
            // call callback when slide stops moving
            if (SL.o.moveStop)
                SL.o.moveStop(SL.slideNo);
        }, speed);
    };
    bzSlider.prototype.moveToSlide = function(moveTo, side) {
        let SL = this;
        if (moveTo == SL.slideNo)
            return;
        if (moveTo < 0)
            moveTo = moveTo * -1;
        if (moveTo >= SL.slideCount)
            moveTo = SL.slideCount - 1;
        side = side || 'auto';
        if (side === 'auto') {
            if (moveTo > SL.slideNo)
                side = 'right';
            else
                side = 'left';
        }
        let moveToTick = setInterval(function () {
            if (SL.slideNo != moveTo) {
                if (side === 'right')
                    SL.moveRight(200);
                else if (side === 'left')
                    SL.moveLeft(200);
            }
            else
                clearInterval(moveToTick);
        }, 200);
    };
    bzSlider.prototype.thumbAct = function (elem) {
        let SL = this;
        elem.addEventListener('click', function (e) {
            var $th = this,
                slideNo = $th.getAttribute('data-slide');
            SL.moveToSlide(slideNo);
        })
    };
    bzSlider.prototype.autoRotate = function() {
        let SL = this;
        setInterval(function () {
            if (SL.rotationKey && SL.pauseState && SL.o.autoRotation)
                SL.moveRight(SL.o.moveSpeed);
        }, SL.o.rotSpeed);
    };
    bzSlider.prototype.clickOnSlider = function() {
        let SL = this;
        SL.sliderUl.addEventListener('click', function() {
            if (SL.o.moveOnClick)
                SL.moveRight(SL.o.moveSpeed);
            if (SL.o.slideCallback)
                SL.o.slideCallback(SL.slideNo);
        });
    };
    bzSlider.prototype.moveTo = function(slideNo) {
        let SL = this;
        SL.moveToSlide(slideNo);
    };
    bzSlider.prototype.pauseAct = function() {
        let SL = this;
        let pauseBtn = document.getElementById(SL.o.pauseBtn);
        if (SL.o.autoRotation) {
            pauseBtn.setAttribute('checked', 'checked');
        }
        pauseBtn.addEventListener('click', function () {
            let $th = this;
            if ($th.getAttribute('checked') === 'checked') {
                $th.removeAttribute('checked');
                SL.pauseState = false;
                SL.rotationKey = false;
                SL.o.autoRotation = false;
            }
            else {
                $th.setAttribute('checked', 'checked');
                SL.pauseState = true;
                SL.rotationKey = true;
                SL.o.autoRotation = true;
            }
        });
    };
    bzSlider.prototype.ctrl = function() {
        let SL = this;
        let _btn = document.createElement('div');
        if (!SL.o.customCtrls)
            _btn.classList.add('default-back');
        SL.prevBtn = _btn.cloneNode(true);
        SL.prevBtn.innerHTML = SL.o.prevKey;
        SL.prevBtn.classList.add('control-prev');
        SL.nextBtn = _btn.cloneNode(true);
        SL.nextBtn.innerHTML = SL.o.nextKey;
        SL.nextBtn.classList.add('control-next');
        SL.prevBtn.addEventListener('click', function () {
            SL.moveLeft(SL.o.moveSpeed);
        });
        SL.nextBtn.addEventListener('click', function () {
            SL.moveRight(SL.o.moveSpeed);
        });
        SL.slider.insertBefore(SL.nextBtn, SL.slider.firstChild);
        SL.slider.insertBefore(SL.prevBtn, SL.slider.firstChild);

    };
    bzSlider.prototype.init = function() {
        let SL = this;
        SL.sliderUl = SL.slider.getElementsByTagName('ul')[0];
        SL.sliders = SL.sliderUl.getElementsByTagName('li');
        SL.slideCount = SL.sliders.length;

        if (SL.o.fillParent) {
            let _parent = SL.slider.parentNode;
            SL.sliderWidth = parseInt(SL.getElemStyle(_parent, 'width'));
            SL.sliderHeight = parseInt(SL.getElemStyle(_parent, 'height'));
            SL.slider.style.width = SL.sliderWidth + 'px';
        } else {
            SL.sliderWidth = parseInt(SL.getElemStyle(SL.sliders[0], 'width'));
            SL.sliderHeight = parseInt(SL.getElemStyle(SL.sliders[0], 'height'));
            SL.slider.style.width = SL.sliderWidth * SL.o.slidesToShow + 'px';
        }

        if (SL.o.fillParent)
            SL.slideWidth = SL.sliderWidth / SL.o.slidesToShow;
        else
            SL.slideWidth = SL.sliderWidth;

        SL.slideHeight = SL.sliderHeight;

        for (let i = 0; i < SL.slideCount; i++) {
            let _slide = SL.sliders[i];
            _slide.style.width = SL.slideWidth + 'px';
            _slide.style.height = SL.sliderHeight + 'px';
        }

        SL.sliderUlWidth = SL.slideCount * SL.slideWidth;

        SL.slider.style.height = SL.sliderHeight + 'px';
        SL.sliderUl.style.width = SL.sliderUlWidth + 'px';
        SL.sliderUl.style.height = SL.sliderHeight + 'px';
        SL.sliderUl.style.marginLeft = -SL.slideWidth + 'px';

        SL.sliderUl.insertBefore(SL.sliders[SL.sliders.length - 1], SL.sliders[0]);

        if (SL.o.thumbs) {
            let thmbs = document.createElement('div');
            thmbs.classList.add('slider-thumbs');
            SL.slider.appendChild(thmbs);
            let thmb = document.createElement('div');
            thmb.classList.add('slider-thumb');
            for (let i = 0; i < SL.slideCount; i++) {
                var _thmb = thmb.cloneNode(true);
                _thmb.setAttribute('data-slide', i);
                thmbs.appendChild(_thmb);
            }
            let $thmbs = thmbs.getElementsByClassName('slider-thumb');
            let thmbW = $thmbs[0].offsetWidth + 4,
                thmbsW = thmbW * SL.slideCount;
            thmbs.style.width = thmbsW + 'px';
            for (let i = 0; i < SL.slideCount; i++) {
                SL.thumbAct($thmbs[i]);
            }
            SL.hlThumb(SL.slideNo);
        }

        if (SL.o.pauseBtn)
            SL.pauseAct();

        if (SL.o.autoRotation)
            SL.rotationKey = true;

        SL.autoRotate();

        if (SL.o.controls)
            SL.ctrl();

        if (SL.o.moveOnClick || SL.o.slideCallback)
            SL.clickOnSlider();

        SL.slider.addEventListener('mouseenter', function () {
            SL.rotationKey = false;
        });

        SL.slider.addEventListener('mouseleave', function () {
            SL.rotationKey = true;
        });


    };
    bzSlider.prototype.defOptions = {
        rotSpeed: 3000,
        moveSpeed: 500,
        autoRotation: false,
        moveStop: false,
        moveOnClick: true,
        slideCallback: false,
        pauseBtn: false,
        thumbs: true,
        controls: true,
        customCtrls: false,
        prevKey: '<',
        nextKey: '>',
        slidesToShow: 1,
        fillParent: false

    };
    window.bzSlider = bzSlider;
    //return bzSlider;
})();