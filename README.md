## Simple color picker


javascript color picker. 


This color picker is based on css linear gradient style. 

without any images, png, div 1px, etc... 


jquery used for selectors and events.


### support
 
 - most of color types: rgba, rgb, hsla, hsl, #hex, word.
 
 - browsers: all modern + IE8, 9

if you need other template, just add new css rules for theme

### how to use:

just create new instance and use


```javascript
        var cppInstance = new simplePicker($("#elPicker"), {
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

```

or just

```javascript
        var cppInstance = new simplePicker($("#elPicker"));
```


#### .destroy()

Remove color picker from DOM and destroy itself


#### .one(eventName, callback)

drop old callback and set new. for example .one("onChange", function(color){});

eventNames:
   `onChange`, `onApply`, `onShow`, `onHide`


####.str2rgba("yellow") 

return rgb colorObject


####.rgb2hex({r:10, g:10, b:10})

return HEX string


####.rgb2hsl({r:10, g:10, b:10}) 

return hsl colorObject


####.rgb2hsv({r:10, g:10, b:10}) 

return hsv colorObject


####.hsv2rgb({h: 10, s: 98, v: 1}) 

return rgb colorObject


####.hsl2rgb("#ffffff") 

return rgb colorObject


####.str2hex("yellow") 

return hex color


####.hex2rgb("#0000ff")

return rgb colorObject 


####.getColor() 

return string color of selected value in picker


####.setColor("yellow") 

set string color ("yellow", "#345", "rgba(10,10,20,0.5"), etc...)


####.setColorToBefore("yellow") 

set string color to before area


####.hide() 

hide picker


####.show("red")

show picker and set color, if argument is not defined, set "black" color



### colorObject

this is simple javascript object with redefined `.toString()` method. for example

```javascript
var colorObject = cpp.hex2rgb("#0000ff");

colorObject.r; // return only red channel
colorObject.toString(); // return string like "rgb(0, 0, 255)"

var colorObject = cpp.str2rgba("red");
colorObject.toString(); // return string like "rgb(0, 0, 255)"
colorObject.a = 0.4;
colorObject.toString(); // return string like "rgba(0, 0, 255, 0.4)"
colorObject.a = undefined;
colorObject.toString(); // return string like "rgb(0, 0, 255)"

```

jQuery, color-picker, javascript, colorpicker, linear-gradient, IE

MIT idudiq 2014
