(function () {

    var compute = (typeof window !== undefined) ? window.getComputedStyle : null;

    function defineObj(obj, methods) {
        for (var key in methods) {
            obj[key] = methods[key];
        }
    }

    // Color object for using
    // {r: r, g: g, b: b, a: a}. when call toString() -> returns correct structure
    function ColorObject(obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
    }

    defineObj(ColorObject.prototype, {
        toString: function () {
            var hasAlpha = !isNaN(this.a);
            var isRgb = (this.r !== undefined);
            var isHsv = (this.v !== undefined);
            var output = isRgb ?
                (this.r + ", " + this.g + ", " + this.b) : // rgb
                (this.h + ", " + this.s + "%, " + (isHsv ? this.v : this.l) + "%"); // hsl/hsv

            hasAlpha && (output += ", " + this.a);

            var prefix = isHsv ? "hsv(" :
                isRgb ? ((hasAlpha) ? "rgba(" : "rgb(") :
                    ((hasAlpha) ? "hsla(" : "hsl(");

            output = prefix + output + ")";

            return output;
        }
    });

    function dublicate(res) {
        return res + "" + res;
    }

    function diffc(c, v, diff) {
        return (v - c) / 6 / diff + 1 / 2;
    }

    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }

    function rToHex(x) {
        return ("0" + parseInt(x, 10).toString(16)).slice(-2);
    }


    function getColorByMatch(reg, str) {
        var res = reg.exec(str);
        var ret = null;
        if (res) {
            ret = {
                a: res[2] - 0,
                b: res[3] - 0,
                c: res[4] - 0
            };
            (res[5] !== undefined) && (ret.d = ("0." + res[5]) - 0);
        }
        return ret;
    }

    function processRules(rules, color) {
        var match;
        var res;
        for (var i = 0, l = rules.length; i < l; i++) {
            match = getColorByMatch(rules[i], color);
            if (match) {
                res = match;
                break;
            }
        }
        return res;
    }

    function getRGBA_byRules(color) {
        var res,
            rgbRules = [
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
                res = utils.hsl2rgb(match.a, match.b, match.c);
                res.a = match.d;
            }
        }

        return res;
    }

    var converts = {};
    defineObj(converts, {
        getType: function (color) {
            var matches = (/rgba|hsla|rgb|hsl|#/).exec(color);
            return (matches && matches[0]) || "word";
        },
        str2rgba: function (color) {
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

            if (!checkValue || checkValue == "initial" || (checkValue == "transparent" && color != checkValue) || checkValue == "none") {
                //try to detect by self
                ret = getRGBA_byRules(color);
            } else {
                ret = getRGBA_byRules(checkValue);
            }

            this.helper.detach();
            return ret;
        },
        str2hex: function (color) {
            if (compute) {
                var rgba = this.str2rgba(color);
                return this.rgb2hex(rgba.r, rgba.g, rgba.b);
            } else {
                try {
                    var body = createPopup().document.body,
                        range = body.createTextRange();
                    body.style.color = color;
                    var value = range.queryCommandValue("ForeColor");
                    value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
                    value = value.toString(16);
                    return "#000000".slice(0, 7 - value.length) + value;
                } catch (e) {

                }
            }
        },
        hex2rgb: function (hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) {
                (result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex));
                if (result) {
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
        },
        hsv2rgb: function (h, s, v) {
            h /= 60;
            s /= 100;
            v /= 100;
            var r, g, b,
                floor = Math.floor(h),
                sector = h - floor,
                i1 = v * (1 - s),
                i2 = v * (1 - sector * s),
                i3 = v * (1 - (1 - sector) * s);

            switch (floor % 6) {
                case 0:
                    r = v;
                    g = i3;
                    b = i1;
                    break;
                case 1:
                    r = i2;
                    g = v;
                    b = i1;
                    break;
                case 2:
                    r = i1;
                    g = v;
                    b = i3;
                    break;
                case 3:
                    r = i1;
                    g = i2;
                    b = v;
                    break;
                case 4:
                    r = i3;
                    g = i1;
                    b = v;
                    break;
                case 5:
                    r = v;
                    g = i1;
                    b = i2;
                    break;
            }

            return new ColorObject({r: Math.floor(r * 255), g: Math.floor(g * 255), b: Math.floor(b * 255)});
        },
        rgb2hsv: function (r, g, b) {
            r = r / 255;
            g = g / 255;
            b = b / 255;
            var rr, gg, bb,
                h, s,
                v = Math.max(r, g, b),
                diff = v - Math.min(r, g, b);

            if (diff == 0) {
                h = s = 0;
            } else {
                s = diff / v;
                rr = diffc(r, v, diff);
                gg = diffc(g, v, diff);
                bb = diffc(b, v, diff);

                if (r === v) {
                    h = bb - gg;
                } else if (g === v) {
                    h = (1 / 3) + rr - bb;
                } else if (b === v) {
                    h = (2 / 3) + gg - rr;
                }
                if (h < 0) {
                    h += 1;
                } else if (h > 1) {
                    h -= 1;
                }
            }
            return new ColorObject({
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                v: Math.round(v * 100)
            });
        },
        hsl2rgb: function (h, s, l) {

            var r, g, b;

            s = s / 100;
            l = l / 100;
            h = h / 360;

            if (s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return new ColorObject({r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)});
        },
        rgb2hsl: function (r, g, b) {
            var r1 = r / 255;
            var g1 = g / 255;
            var b1 = b / 255;

            var maxColor = Math.max(r1, g1, b1);
            var minColor = Math.min(r1, g1, b1);
            //Calculate L:
            var l = (maxColor + minColor) / 2;
            var s = 0;
            var h = 0;
            if (maxColor != minColor) {
                //Calculate S:
                if (l < 0.5) {
                    s = (maxColor - minColor) / (maxColor + minColor);
                } else {
                    s = (maxColor - minColor) / (2.0 - maxColor - minColor);
                }
                //Calculate H:
                if (r1 == maxColor) {
                    h = (g1 - b1) / (maxColor - minColor);
                } else if (g1 == maxColor) {
                    h = 2.0 + (b1 - r1) / (maxColor - minColor);
                } else {
                    h = 4.0 + (r1 - g1) / (maxColor - minColor);
                }
            }

            l = l * 100;
            s = s * 100;
            h = h * 60;
            if (h < 0) {
                h += 360;
            }
            return new ColorObject({h: Math.round(h), s: Math.round(s), l: Math.round(l)});
        },

        rgb2hex: function (r, g, b) {
            return "#" + rToHex(r) + rToHex(g) + rToHex(b);
        }

    });

    return {
        converts: converts,
        ColorObject: ColorObject
    };
})();