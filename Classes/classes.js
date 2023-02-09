var Dye = /** @class */ (function () {
    function Dye() {
    }
    /**
     * * Gets Static BG Colors
     * @param element | any | - The element to target or the selector to an element
     * @param selector | boolean - default false | - true if the element is a selector.
     * @returns | string | CSS RGB or RGBA info.
     */
    Dye.getColor = function (element) {
        //If receives a selector to query instead of an element
        if (typeof element === "string")
            element = document.querySelector(element);
        //Then get the actual bg color of whatever element was received
        return window.getComputedStyle
            ? window
                .getComputedStyle(element, null)
                .getPropertyValue("background-color")
            : element.style.backgroundColor;
    };
    /**
     * *Get Gradient Backgrounds
     * @param element | any | - The element to target or the selector to an element
     * @param selector | boolean - default false | - true if the element is a selector.
     * @returns | string | CSS Linear Gradient info.
     */
    Dye.getGradient = function (element) {
        //If receives a selector to query instead of an element
        if (typeof element === "string")
            element = document.querySelector(element);
        //Then get the actual bg color of whatever element was received
        return window.getComputedStyle
            ? window.getComputedStyle(element, null).getPropertyValue("background")
            : element.style.background;
    };
    return Dye;
}());
var Color = /** @class */ (function () {
    function Color() {
    }
    /**
     * will check RGB balance
     */
    Color.checkRGB = function () { };
    /**
     * will check RGBA balance
     */
    Color.checkRGBA = function () { };
    /**
     * Will check gradient brightness
     */
    Color.checkGradient = function () { };
    /**
     * Will set color of non img element
     */
    Color.set = function () { };
    /**
     * will set the color of img elements
     */
    Color.imgSet = function () { };
    return Color;
}());
