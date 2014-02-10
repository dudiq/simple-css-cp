define(function (require) {
    $(document).ready(function() {

        var simplePicker = require("simple-css-cp");
        var logger = $("#logs");

        var pickerInstance = new simplePicker($("#elPicker"), {
            //cssTheme: "simple-css-cp-small",
            //showButtons: false,
            showInput: true,
            //showPreview: false,
            onChange: function(){
                log("color", pickerInstance.getColor());
            }}
        );

        function log(){
            var output = "";
            for (var i = 0, l = arguments.length; i < l; i++){
                output += arguments[i];
            }
            console.log(output);
//            logger.text(output);
        }
        
        pickerInstance.show("hsl(10, 40%, 50%)");
        //hsl(10, 40%, 50%) = rgb(179, 94, 77)
        log("str2rgba red: ", pickerInstance.str2rgba("red"));
        log("str2rgba #fff:", pickerInstance.str2rgba("#fff"));
        log("hsv2rgb 10, 40, 20:", pickerInstance.hsv2rgb(10, 40, 20));
        log("hsl2rgb 10, 40, 20:", pickerInstance.hsl2rgb(10, 40, 20));
        log("rgb2hsv 10, 40, 20:", pickerInstance.rgb2hsv(10, 40, 20));
        log("rgb2hsl 10, 40, 20:", pickerInstance.rgb2hsl(10, 40, 20));
        log("rgb2hex 10, 40, 20:", pickerInstance.rgb2hex(10, 40, 20));
        log("str2hex yellow:", pickerInstance.str2hex("yellow"));
        log("str2hex rgb(10,20,30):", pickerInstance.str2hex("rgb(10,20,30)"));
        log("hex2rgb #fff:", pickerInstance.hex2rgb("#fff"));
        log("hex2rgb #00ff00:", pickerInstance.hex2rgb("#00ff00"));

//        pickerInstance.setColor("blue");
//        pickerInstance.setColor("black");
//        pickerInstance.setColor("white");
//        pickerInstance.setColor("rgba(127,127,127,0.3)");
    });
});