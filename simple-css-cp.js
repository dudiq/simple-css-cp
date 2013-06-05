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

define(function (require) {

    var $ = require('jquery');

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
                    "<div class='slider-hue-chooser'/>" +
                "</div>" +
            "</div>" +
            "<div class='slider-alpha'>" +
                "<div class='slider-alpha-chooser'/>" +
            "</div>" +
            "<div>" +
                "<input class='color-input'>" +
            "</div>" +
            "<div class='area-buttons'><span data-action='apply'>Apply</span><span data-action='apply'>Cancel</span></div>" +
        "</div>";


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

        return {r: Math.floor(r*255), g: Math.floor(g*255), b: Math.floor(b*255)};
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
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
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
        return {h: Math.round(h), s: Math.round(s), l: Math.round(l)};
    }

    function rgb2hex(r, g, b){
        function hex(x) {
            return ("0" + parseInt(x, 10).toString(16)).slice(-2);
        }
        return "#" + hex(r) + hex(g) + hex(b);
    }

    function getColorFromHSL(hsl){
        return "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)";
    }

    function getColorFromHSLA(hsla){
        if (isNaN(hsla.a)){
            return getColorFromHSL(hsla);
        } else {
            return "hsla(" + hsla.h + ", " + hsla.s + "%, " + hsla.l + "%, " + hsla.a+ ")";
        }
    }

    function getColorFromRGB(rgb){
        return "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
    }

    function getColorFromRGBA(rgba){
        if (isNaN(rgba.a)){
            return getColorFromRGB(rgba);
        } else {
            return "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a +")";
        }
    }
    
    function setColorToElement(el, color){
        el.css("background-color", "none");
        el.css("background-color", color);
    }


    function init(){
        var opt = this.options;
        var element = this.element = $(template) || $(opt.template);
        element.hide();
        var self = this;

        (opt.showButtons !== false) && bindButtons.call(this, element.find(".area-buttons"));

        bindValueChoose.call(this, element.find(".choose-color"), onColorChoose);
        bindValueChoose.call(this, element.find(".slider-alpha"), onAlphaChoose);
        bindValueChoose.call(this, element.find(".slider-hue"), onHueChoose, 360);

        this.helper = $("<div class='simple-css-helper'/>");
        this.helperDOM = this.helper.get(0);

        this.input = element.find(".color-input");
        this.workareaColor = element.find(".workarea-color");
        this.previewAfter = element.find(".area-preview-after-select");
        this.previewBefore = element.find(".area-preview-before-select");
        this.previewBefore.on("click", function(){
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
        val ? preview.show() : preview.hide();
    }

    function theme(css){
        this.element.addClass(css);
    }

    function bindButtons(buttons){
        var self = this;
        buttons.show();
        buttons.off("click").on("click", function(ev){
            var action = $(ev.target).data("action");
            if (action){
                (action == "apply") && (self.options.onApply && self.options.onApply());
                self.hide();
            }
        });
    }

    function setPositionByColor(rgba){
        if (rgba){
            var hsv = rgb2hsv(rgba.r, rgba.g, rgba.b);

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
            var alpha = rgba.a || 1;
            onAlphaChoose.call(this, {left: alpha * alphaParentHeight}, rgba.a * 100, 0, true);
        }
    }

    function onHueChoose(pos, x, val, drop){
        this.hue = val;
        var rgb = hsv2rgb(val, 100, 100);
        var color = getColorFromRGB(rgb);

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

    function onMouseSelect(offset, ev, width, height, dx, callback){
        if (offset){
            var left = ev.clientX - offset.left;
            var top = ev.clientY - offset.top;

            var pos = {
                left: (left <= 0) ? 0 : (left >= width) ? width : left,
                top: (top <= 0) ? 0 : (top >= height) ? height : top
            };

            var wx = Math.floor(((pos.left) * dx) / width);
            var hy = Math.floor(((pos.top) * dx) / height);

            callback.call(this, pos, wx, hy);
        }
    }

    function bindValueChoose(el, callback, dx){
        var offset,
            self = this,
            height,
            $body = $(document.body),
            canMove = false,
            $doc = $(document),
            width;

        dx = dx || 100;

        this.documentMouseUp = function(){
            canMove = false;
        };

        this.documentMouseMove = function(ev){
            if (canMove){
                onMouseSelect.call(self, offset, ev, width, height, dx, callback);
                ev.preventDefault();
            }
        };

        $doc.on("mouseup", this.documentMouseUp);

        el.mousedown(function(ev){
            canMove = true;
            offset = el.offset();
            width = el.width();
            height = el.height();
            self.element.focus();
            onMouseSelect.call(self, offset, ev, width, height, dx, callback);
            ev.preventDefault();
        });
        $doc.on("mousemove", self.documentMouseMove);
    }

    function getType(color){
        var matches = (/rgba|hsla|rgb|hsl|#/).exec(color);
        var type = (matches && matches[0]) || "word";
        return type;
    }

    function getColorByMatch(reg, str){
        var res = reg.exec(str);
        var ret = null;
        if (res){
            ret = {
                r: res[2] - 0,
                g: res[3] - 0,
                b: res[4] - 0
            }; 
            (res[5] !== undefined) && (ret.a = ("0." + res[5]) - 0); 
        }
        return ret;
    }

    function str2rgba(color){
        color = (color + "").toLowerCase();
        $(document.body).append(this.helper);
        setColorToElement(this.helper, color);

        var checkValue = window.getComputedStyle(this.helperDOM)['backgroundColor'];

        var ret = null;
        if (!checkValue || checkValue == "initial" || (checkValue == "transparent" && color != checkValue) || checkValue == "none"){

        } else {
            ret = getColorByMatch((/(rgba)\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*0?\.(\d+)\)/ig), checkValue);
            if (!ret){
                ret = getColorByMatch((/(rgb)\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/ig), checkValue);
            }
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
            setColorToElement(this.previewAfter, getColorFromRGBA(col));

            setPositionByColor.call(this, col);

            onChange.call(this, callEv);
        }
    };

    p.getColor = function(){
        var color;

        var rgb = hsv2rgb(this.hue, this.saturation, this.value);
        var alpha = this.alpha / 100;
        rgb.a = alpha;

        var hasAlpha = (!isNaN(alpha) && (alpha != 1)) ? true : false;

        switch (this.type){
            case "word" :
            case "#":
                color = (hasAlpha) ? getColorFromRGBA(rgb) : rgb2hex(rgb.r, rgb.g, rgb.b);
                break;

            case "hsl":
            case "hsla":
                var hsl = rgb2hsl(rgb.r, rgb.g, rgb.b);
                hsl.a = alpha;
                color = (hasAlpha) ? getColorFromHSLA(hsl) : getColorFromHSL(hsl);
                break;
            case "rgb":
            case "rgba":
                color = (hasAlpha) ? getColorFromRGBA(rgb) : getColorFromRGB(rgb);
                break;
        }
        return color;
    };

    p.hsv2rgb = hsv2rgb;

    p.rgb2hsv = rgb2hsv;

    p.rgb2hsl = rgb2hsl;

    p.rgb2hex = rgb2hex;

    p.str2rgba = function(val){
        return str2rgba.call(this, val);
    };

    p.one = function(ev, callback){
        this.options[ev] = callback;
    };

    p.destroy = function(){
        $(document).off("mouseup", this.documentMouseUp);
        $(document).off("mousemove", this.documentMouseMove);

        this.helper.remove();
        this.element.remove();
        this.helper = null;
        this.helperDOM = null;
        this.parent = null;
        this.element = null;
        this.options = null;
        this.canvas = null;
    };

    return picker;
});