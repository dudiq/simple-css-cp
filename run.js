define(function (require) {
    $(document).ready(function() {

        var simplePicker = require("simple-css-cp");

        var elPicker = new simplePicker($("#elPicker"), {
            //cssTheme: "simple-css-cp-small",
            //showButtons: false,
            showInput: true,
            //showPreview: false,
            onChange: function(){
                log("color", elPicker.getColor());
            }}
        );

        function log(){
            var output = "";
            for (var i = 0, l = arguments.length; i < l; i++){
                output += arguments[i];
            }
            console.log(output);
        }
        
        elPicker.show("hsl(10, 40%, 50%)");
        //hsl(10, 40%, 50%) = rgb(179, 94, 77)
        log("str2rgba red: ", elPicker.str2rgba("red"));
        log("str2rgba #fff:", elPicker.str2rgba("#fff"));
        log("hsv2rgb 10, 40, 20:", elPicker.hsv2rgb(10, 40, 20));
        log("hsl2rgb 10, 40, 20:", elPicker.hsl2rgb(10, 40, 20));
        log("rgb2hsv 10, 40, 20:", elPicker.rgb2hsv(10, 40, 20));
        log("rgb2hsl 10, 40, 20:", elPicker.rgb2hsl(10, 40, 20));
        log("rgb2hex 10, 40, 20:", elPicker.rgb2hex(10, 40, 20));
        log("str2hex yellow:", elPicker.str2hex("yellow"));
        log("str2hex rgb(10,20,30):", elPicker.str2hex("rgb(10,20,30)"));
        log("hex2rgb #fff:", elPicker.hex2rgb("#fff"));
        log("hex2rgb #00ff00:", elPicker.hex2rgb("#00ff00"));

//        elPicker.setColor("blue");
//        elPicker.setColor("black");
//        elPicker.setColor("white");
//        elPicker.setColor("rgba(127,127,127,0.3)");
    });
});