simple-css-cp
=============

jQuery, color-picker, javascript, colorpicker, linear-gradient, IE, support

jquery color picker

CSS3 color picker.
without any png images, created by linear-gradient() style.

if you need other template, just add new css rules for theme.



support: 
 
 color types: rgba, rgb, hsla, hsl, #hex, word.
 
 browsers: all modern + IE8, 9



how to use:

        var elPicker = new simplePicker($("#elPicker"), {
              cssTheme: "simple-css-cp-small", // if need some changes in template by css
              showButtons: false, // show/hide "apply"/"cancel" buttons
              showInput: true, // show/hide input field
              showPreview: false, // show/hide preview area with inited color
              onChange: function(){
                  console.log("color", elPicker.getColor()); // callback for changes
              },
              onApply: function(){
                //calls when click to "apply" button
              },
              onShow: function(){
                //calls when call .show() method
              },
              onHide: function(){
                //calls when click to buttons "apply"/"cancel" or call .hide() method
              },
              template: "some template" // see internal code to extract elements for new template, 
            }
        );


each instance of color picker have public methods:

.destroy() - remove color picker from DOM and destroy itself

.one(eventName, callback) - drop old callback and bind new. for example .one("onChange", function(color){});

eventNames:
"onChange", "onApply", "onApply", "onHide"

.str2rgba("yellow") - return rgba object, like {r:10, g:10, b:255, a: 0.5}

.rgb2hex({r:10, g:10, b:10}) - return HEX string from rgb object

.rgb2hsl({r:10, g:10, b:10}) - return hsl object

.rgb2hsv({r:10, g:10, b:10}) - return hsv object

.hsv2rgb({h: 10, s: 98, v: 1}) - return rgb object

.hsl2rgb("#ffffff") - return rgb object

.str2hex("yellow") - return hex color

.hex2rgb("#0000ff") - return rgb object 

.getColor() - return string color of selected value in picker

.setColor("yellow") - set string color ("yellow", "#345", "rgba(10,10,20,0.5"), etc...)

.setColorToBefore("yellow") - set string color to before area

.hide() - hides picker

.show("red") - show picker and set color, by default set "black" color
