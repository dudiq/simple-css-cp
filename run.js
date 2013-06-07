define(function (require) {
    $(document).ready(function() {

        var simplePicker = require("simple-css-cp");

        var elPicker = new simplePicker($("#elPicker"), {
            //cssTheme: "simple-css-cp-small",
            //showButtons: false,
            showInput: true,
            //showPreview: false,
            onChange: function(){
                console.log("color", elPicker.getColor());
            }}
        );

        elPicker.show("hsla(10, 40%, 50%, 1)");
        console.log(elPicker.str2rgba("red"));
//        elPicker.setColor("blue");
//        elPicker.setColor("black");
//        elPicker.setColor("white");
//        elPicker.setColor("rgba(127,127,127,0.3)");
    });
});