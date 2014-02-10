/**
* jQuery Simple CSS Color Picker
*
* Support : rgba, rgb, hsla, hsl, #hex, word
*
* @version: 0.1
* @author: dudiq
* @licence: MIT http://www.opensource.org/licenses/mit-license.php
*
**/

(function(){
    var pDefine;
    if ( typeof define !== "function"){
        // just a wrapper
        pDefine = function(callback){
            callback(function(name){
                return jQuery;
            });
        };
    } else {
        pDefine = define;
    }

    pDefine(function (require) {

        var $ = require('jquery');

        var isMobile = new RegExp("mobile", "i").test(navigator.userAgent);

        var start_ev = ((isMobile) ? "touchstart" : "mousedown");
        var move_ev = ((isMobile) ? "touchmove" : "mousemove");
        var end_ev = ((isMobile) ? "touchend" : "mouseup");


        var template = "<div class='simple-css-color-picker' tabIndex='-1'>" +
            "<div class='area-preview'>" +
            "<div class='area-preview-before'><div class='area-preview-before-select'/></div>" +
            "<div class='area-preview-after'><div class='area-preview-after-select'/></div>" +
            "</div>" +
            "<div>" +
            "<div class='choose-color'>" +
            "<div class='workarea-color'/>" +
            "<div class='workarea-wt'/>" +
            "<div class='workarea-bt'/>" +
            "<div class='workarea-chooser'/>" +
            "</div>" +
            "<div class='slider-hue'>" +
            "<div class='slider-hue-ie'>" +
            "<div class='slider-hue-ie-17'/>" +
            "<div class='slider-hue-ie-33'/>" +
            "<div class='slider-hue-ie-50'/>" +
            "<div class='slider-hue-ie-67'/>" +
            "<div class='slider-hue-ie-83'/>" +
            "<div class='slider-hue-ie-100'/>" +
            "</div>" +
            "<div class='slider-hue-chooser'/>" +
            "</div>" +
            "</div>" +
            "<div class='slider-alpha-wrap'>" +
            "<div class='slider-alpha'/>" +
            "<div class='slider-alpha-chooser'/>" +
            "</div>" +
            "<div>" +
            "<input class='color-input'>" +
            "</div>" +
            "<div class='area-buttons'><span data-action='apply'>Apply</span><span data-action='apply'>Cancel</span></div>" +
            "</div>";

        var compute = window.getComputedStyle;
        var $doc;
        var $body;


        // Color object for using
        // {r: r, g: g, b: b, a: a}. when call toString() -> returns correct structure
        function ColorObject (obj) {
            for (var key in obj) {
                this[key] = obj[key];
            }
        }

        ColorObject.prototype.toString = function(){
            var hasAlpha = !isNaN(this.a);
            var isRgb = (this.r !== undefined);
            var isHsv = (this.v !== undefined);
            var pertange = isRgb ? "" : "%";
            var prefix = isRgb ? ((hasAlpha) ? "rgba(" : "rgb(") :
                ((hasAlpha) ? "hsla(" : "hsl(");

            isHsv && (prefix = "hsv(");

            var output = isRgb ? this.r + ", " + this.g + ", " + this.b :
                this.h + ", " + this.s + "%, " + (isHsv ? this.v : this.l) + "%";

            hasAlpha && (output += ", " + this.a);

            output = prefix + output + ")";

            return output;
        };

        // Private methods

        function str2hex(color) {
            if (compute){
                var rgba = this.str2rgba(color);
                return this.rgb2hex(rgba.r, rgba.g, rgba.b);
            } else {
                try {
                    var body  = createPopup().document.body,
                        range = body.createTextRange();
                    body.style.color = color;
                    var value = range.queryCommandValue("ForeColor");
                    value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
                    value = value.toString(16);
                    return "#000000".slice(0, 7 - value.length) + value;
                }catch(e){

                }
            }
        }

        function hex2rgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) {
                (result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex));
                if (result) {
                    function dublicate(res){
                        return res + "" + res;
                    }
                    result[1] = dublicate(result[1]);
                    result[2] = dublicate(result[2]);
                    result[3] = dublicate(result[3]);
                }
            }
            return result ? new ColorObject({
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            }) : null;
        }

        function hsv2rgb(h, s, v){
            h /= 60;
            s /= 100;
            v /= 100;
            var r, g, b,
                floor = Math.floor(h),
                sector = h - floor,
                i1 = v * (1 - s),
                i2 = v * (1 - sector * s),
                i3 = v * (1 - (1 - sector) * s);

            switch (floor % 6){
                case 0: r = v; g = i3; b = i1; break;
                case 1: r = i2; g = v; b = i1; break;
                case 2: r = i1; g = v; b = i3; break;
                case 3: r = i1; g = i2; b = v; break;
                case 4: r = i3; g = i1; b = v; break;
                case 5: r = v; g = i1; b = i2; break;
            }

            return new ColorObject({r: Math.floor(r*255), g: Math.floor(g*255), b: Math.floor(b*255)});
        }

        function rgb2hsv(r, g, b) {
            r = r / 255;
            g = g / 255;
            b = b / 255;
            var rr, gg, bb,
                h, s,
                v = Math.max(r, g, b),
                diff = v - Math.min(r, g, b);

            function diffc(c){
                return (v - c) / 6 / diff + 1 / 2;
            }

            if (diff == 0) {
                h = s = 0;
            } else {
                s = diff / v;
                rr = diffc(r);
                gg = diffc(g);
                bb = diffc(b);

                if (r === v) {
                    h = bb - gg;
                }else if (g === v) {
                    h = (1 / 3) + rr - bb;
                }else if (b === v) {
                    h = (2 / 3) + gg - rr;
                }
                if (h < 0) {
                    h += 1;
                }else if (h > 1) {
                    h -= 1;
                }
            }
            return new ColorObject({
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                v: Math.round(v * 100)
            });
        }


        function hsl2rgb(h, s, l){

            var r, g, b;

            s = s/100;
            l = l/100;
            h = h/360;

            function hue2rgb(p, q, t) {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            if(s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return new ColorObject({ r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) });
        }

        function rgb2hsl(r, g, b) {
            var r1 = r / 255;
            var g1 = g / 255;
            var b1 = b / 255;

            var maxColor = Math.max(r1,g1,b1);
            var minColor = Math.min(r1,g1,b1);
            //Calculate L:
            var l = (maxColor + minColor) / 2 ;
            var s = 0;
            var h = 0;
            if(maxColor != minColor){
                //Calculate S:
                if(l < 0.5){
                    s = (maxColor - minColor) / (maxColor + minColor);
                }else{
                    s = (maxColor - minColor) / (2.0 - maxColor - minColor);
                }
                //Calculate H:
                if(r1 == maxColor){
                    h = (g1-b1) / (maxColor - minColor);
                }else if(g1 == maxColor){
                    h = 2.0 + (b1 - r1) / (maxColor - minColor);
                }else{
                    h = 4.0 + (r1 - g1) / (maxColor - minColor);
                }
            }

            l = l * 100;
            s = s * 100;
            h = h * 60;
            if(h<0){
                h += 360;
            }
            return new ColorObject({h: Math.round(h), s: Math.round(s), l: Math.round(l)});
        }

        function rgb2hex(r, g, b){
            function hex(x) {
                return ("0" + parseInt(x, 10).toString(16)).slice(-2);
            }
            return "#" + hex(r) + hex(g) + hex(b);
        }

        // methods for convert colors to string for dom elements
        //



        function setColorToElement(el, color){
            if (!compute){
                setColorToElement = function (el, color){
                    // need support for alpha channel
                    el.css({"background-color": "none", "opacity": "auto"});
                    var ret = getRGBA_byRules(color);
                    if (ret){
                        var newColor = ret.toString();
                        el.css({"background-color": newColor, "opacity": ret.a});
                    } else {
                        el.css("background-color", color);
                    }
                }
            } else {
                setColorToElement = function (el, color){
                    el.css("background-color", "none");
                    el.css("background-color", color);
                };
                setColorToElement(el, color);
            }
        }


        function init(){
            !$doc && ($doc = $(document));
            !$body && ($body = $(document.body));

            var opt = this.options;
            var element = this.element = $(template) || $(opt.template);
            element.hide();
            var self = this;

            (opt.showButtons !== false) && bindButtons.call(this, element.find(".area-buttons"));

            bindDocumentEvents.call(this);

            bindValueChoose.call(this, element.find(".choose-color"), onColorChoose);
            bindValueChoose.call(this, element.find(".slider-alpha-wrap"), onAlphaChoose);
            bindValueChoose.call(this, element.find(".slider-hue"), onHueChoose, 360);

            this.helper = $("<div class='simple-css-helper'/>");
            this.helperDOM = this.helper.get(0);

            this.input = element.find(".color-input");
            this.workareaColor = element.find(".workarea-color");
            this.previewAfter = element.find(".area-preview-after-select");
            this.previewBefore = element.find(".area-preview-before-select");
            this.previewBefore.on(start_ev, function(){
                self.setColor($(this).data("color"));
            });

            this.chooser = element.find(".workarea-chooser");

            this.hueChooser = element.find(".slider-hue-chooser");

            this.alphaChooser = element.find(".slider-alpha-chooser");

            this.alpha = 0;
            this.hue = 0;
            this.saturation = 0;
            this.value = 0;

            this.type = "#";

            (opt.showInput !== false) && bindInput.call(this, this.input);
            showPreview.call(this, opt.showPreview !== false);

            (opt.cssTheme) && (theme.call(this, opt.cssTheme));

            this.parent.append(this.element);
        }

        function showPreview(val){
            var preview = this.element.find(".area-preview");
            val ? preview.css('display', 'inline-block') : preview.hide();
        }

        function theme(css){
            this.element.addClass(css);
        }

        function bindButtons(buttons){
            var self = this;
            buttons.show();
            buttons.off(end_ev).on(end_ev, function(ev){
                var action = $(ev.target).data("action");
                if (action){
                    (action == "apply") && (self.options.onApply && self.options.onApply());
                    self.hide();
                }
            });
        }

        function setPositionByColor(rgba){
            if (rgba){
                var hsv = this.rgb2hsv(rgba.r, rgba.g, rgba.b);

                //set chooser position
                var chooserParent = this.chooser.parent();
                var chooserPos = {
                    left: (hsv.s) * chooserParent.width() / 100,
                    top: (100 - hsv.v) * chooserParent.height() / 100
                };
                onColorChoose.call(this, chooserPos, hsv.s, hsv.v, true);

                //set hue position
                var hueParentHeight = this.hueChooser.parent().height();
                onHueChoose.call(this, {top: hsv.h * hueParentHeight / 360}, 0, hsv.h, true);

                //set alpha position
                var alphaParentHeight = this.alphaChooser.parent().width();
                var alpha = !isNaN(rgba.a) ? rgba.a : 1;
                onAlphaChoose.call(this, {left: alpha * alphaParentHeight}, rgba.a * 100, 0, true);
            }
        }

        function onHueChoose(pos, x, val, drop){
            this.hue = val;
            var rgb = this.hsv2rgb(val, 100, 100);
            var color = rgb.toString();

            setColorToElement(this.workareaColor, color);

            this.hueChooser.css("top", pos.top);

            if (!drop){
                onChange.call(this);
            }
        }

        function onAlphaChoose(pos, val, y, drop){
            (isNaN(val)) && (val = 100);

            this.alpha = Math.round(val);

            this.alphaChooser.css("left", pos.left);

            if (!drop){
                onChange.call(this);
            }
        }

        function onColorChoose(pos, x, y, drop){

            this.saturation = x;
            this.value = ((drop === undefined) ? 100 - y: y);

            this.chooser.css(pos);

            if (!drop){
                onChange.call(this);
            }
        }

        function onChange(callEv){
            var newColor = this.getColor();

            setColorToElement(this.previewAfter, newColor);

            if (this.oldColor != newColor){
                (callEv !== false) && this.options.onChange && this.options.onChange(newColor);
                if (!this.input.is(":focus")){
                    this.input.val(newColor);
                }

            }
            this.oldColor = newColor;
        }

        function onMouseSelect(ev, object){
            if (!object) {
                return;
            }

            var offset = object.offset;
            if (offset){
                var parent = this.parent;

                var clientX = isMobile ? ev.originalEvent.touches[0].pageX : ev.clientX + object.scrollLeft,
                    clientY = isMobile ? ev.originalEvent.touches[0].pageY : ev.clientY + object.scrollTop,
                    width = object.width,
                    height = object.height,
                    dx = object.dx,
                    callback = object.callback,
                    left = clientX - offset.left,
                    top = clientY - offset.top;

                var pos = {
                    left: (left <= 0) ? 0 : (left >= width) ? width : left,
                    top: (top <= 0) ? 0 : (top >= height) ? height : top
                };

                var wx = Math.floor(((pos.left) * dx) / width);
                var hy = Math.floor(((pos.top) * dx) / height);

                callback.call(this, pos, wx, hy);
            }
        }

        function bindDocumentEvents() {
            var self = this;

            if (!this.documentMouseUp) {
                this.documentMouseUp = function(){
                    self._activeElement = null;
                };

                this.documentMouseMove = function(ev){
                    if (self._activeElement){
                        onMouseSelect.call(self, ev, self._activeElement);
                        ev.preventDefault();
                        return false;
                    }
                };

                $body.on(end_ev, this.documentMouseUp);
                $body.on(move_ev, this.documentMouseMove);
            }
        }

        function bindValueChoose(el, callback, dx){
            var obj = {callback: callback},
                self = this;

            self._activeElement = null;
            obj.dx = dx || 100;

            el.on(start_ev, function(ev){
                obj.active = true;
                obj.offset = el.offset();
                obj.width = el.width();
                obj.height = el.height();
                obj.scrollTop = $doc.scrollTop();
                obj.scrollLeft = $doc.scrollLeft();
                self._activeElement = obj;
                self.element.focus();
                onMouseSelect.call(self, ev, obj);
                ev.preventDefault();
                return false;
            });

//        el.on(move_ev, this.documentMouseMove);
        }

        function getType(color){
            var matches = (/rgba|hsla|rgb|hsl|#/).exec(color);
            return (matches && matches[0]) || "word";
        }

        function getColorByMatch(reg, str){
            var res = reg.exec(str);
            var ret = null;
            if (res){
                ret = {
                    a: res[2] - 0,
                    b: res[3] - 0,
                    c: res[4] - 0
                };
                (res[5] !== undefined) && (ret.d = ("0." + res[5]) - 0);
            }
            return ret;
        }

        function processRules(rules, color){
            var match;
            var res;
            for (var i = 0, l = rules.length; i < l; i++){
                match = getColorByMatch(rules[i], color);
                if (match){
                    res = match;
                    break;
                }
            }
            return res;
        }

        function getRGBA_byRules(color) {
            var res,
                rgbRules =[
                    /(rgba)\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*0?\.(\d+)\)/ig,
                    /(rgba)\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([0-1])+\)/ig,
                    /(rgb)\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/ig
                ],
                hslRules = [
                    /(hsla)\((\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*0?\.(\d+)\)/ig,
                    /(hsla)\((\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*,\s*([0-1])\)/ig,
                    /(hsl)\((\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)/ig
                ],
                match;

            match = processRules(rgbRules, color);
            if (match) {
                res = new ColorObject({
                    r: match.a,
                    g: match.b,
                    b: match.c,
                    a: match.d
                });
            } else {
                match = processRules(hslRules, color);
                if (match) {
                    res = hsl2rgb(match.a, match.b, match.c);
                    res.a = match.d;
                }
            }

            return res;
        }

        function str2rgba(color){
            color = (color + "").toLowerCase();
            var checkValue;

            $body.append(this.helper);
            setColorToElement(this.helper, color);

            if (compute) {
                checkValue = compute(this.helperDOM)['backgroundColor'];
            } else {
                var hexColor = this.str2hex(color);
                var rgbFromHex = this.hex2rgb(hexColor);
                checkValue = rgbFromHex && rgbFromHex.toString();
            }

            var ret = null;

            if (!checkValue || checkValue == "initial" || (checkValue == "transparent" && color != checkValue) || checkValue == "none"){
                //try to detect by self
                ret = getRGBA_byRules(color);
            } else {
                ret = getRGBA_byRules(checkValue);
            }

            this.helper.detach();
            return ret;
        }

        function bindInput(input){
            input.show();
            var self = this;
            input.on("change paste cut keyup", function(){
                if (input.is(":focus")){
                    var color = input.val();
                    var rgba = self.str2rgba(color);
                    if (rgba){
                        self.setColor(color);
                    }
                }
            });
        }

        // Constructor

        var picker = function(el, opt){
            this.parent = $(el);
            this.options = opt || {};

            init.call(this);
        };

        var p = picker.prototype;

        p.show = function(color){
            this.element.show();
            (!color) && (color = "#000");
            this.setColor(color, false);
            this.setColorToBefore(color);
            this.options.onShow && this.options.onShow();
        };

        p.hide = function(){
            this.element.hide();
            this.options.onHide && this.options.onHide();
        };

        p.setColorToBefore = function(color){
            var col = this.str2rgba(color);
            if (col){
                this.previewBefore.data("color", color);
                setColorToElement(this.previewBefore, color);
            }

        };

        p.setColor = function(color, callEv){

            //rgba, rgb, hsla, hsl, #hex, word - types of color
            this.type = getType(color);

            var col = this.str2rgba(color);

            if (col){
                setColorToElement(this.previewAfter, col.toString());

                setPositionByColor.call(this, col);

                onChange.call(this, callEv);
            }
        };

        p.getColor = function(){
            var color;

            var rgb = this.hsv2rgb(this.hue, this.saturation, this.value);
            var alpha = this.alpha / 100;
            rgb.a = alpha;

            var hasAlpha = (!isNaN(alpha) && (alpha != 1)) ? true : false;

            switch (this.type){
                case "word" :
                case "#":
                    color = (hasAlpha) ? rgb.toString() : this.rgb2hex(rgb.r, rgb.g, rgb.b);
                    break;

                case "hsl":
                case "hsla":
                    var hsla = this.rgb2hsl(rgb.r, rgb.g, rgb.b);
                    hasAlpha && (hsla.a = alpha);
                    color = hsla.toString();
                    break;
                case "rgb":
                case "rgba":
                    !hasAlpha && (rgb.a = undefined);
                    color = rgb.toString();
                    break;
            }
            return color;
        };

        p.hsv2rgb = hsv2rgb;

        p.hsl2rgb = hsl2rgb;

        p.rgb2hsv = rgb2hsv;

        p.rgb2hsl = rgb2hsl;

        p.rgb2hex = rgb2hex;

        p.str2rgba = str2rgba;

        p.str2hex = str2hex;

        p.hex2rgb = hex2rgb;


        p.one = function(ev, callback){
            this.options[ev] = callback;
        };

        p.destroy = function(){
            this.documentMouseUp && $body && $body.off(end_ev, this.documentMouseUp);
            this.documentMouseMove && $body && $body.off(move_ev, this.documentMouseMove);

            this.helper.remove();
            this.element.remove();
            this.helper = null;
            this.helperDOM = null;
            this.parent = null;
            this.element = null;
            this.options = null;
            this.canvas = null;
        };

        window.jqSimpleCp = picker;

        return picker;
    });

})();
