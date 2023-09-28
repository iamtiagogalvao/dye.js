/** Dye.js - © 2023 - Tiago M. Galvão - https://tiagogalvao.com */
class Color {
    /**
     * *Will check color format and distribute it to the right check color function
     * @param bgColor | string | - Color to be type checked
     * @returns - The new color for the element
     */
    static checkFormat(bgColor) {
        if (bgColor.startsWith("rgb("))
            return this.checkColor(bgColor, "rgb");
        else if (bgColor.startsWith("rgba("))
            return this.checkColor(bgColor, "rgba");
        else if (bgColor.startsWith("linear-gradient("))
            return this.checkGradient(bgColor);
    }
    /**
     * *Will check RGB / RGBA balance
     * @param color | string | - Color to check
     * @param format | string | - Color format, can be rgb or rgba
     * @returns | string | - The new color for the element
     */
    static checkColor(color, format) {
        let pattern, matches, colorValue, colorOpacity;
        format === "rgb"
            ? (pattern = /^rgb?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/)
            : (pattern = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/);
        (matches = color.match(pattern)),
            (colorValue = Math.round((parseInt(matches[1]) * 299 +
                parseInt(matches[2]) * 587 +
                parseInt(matches[3]) * 114) /
                1000));
        colorOpacity = "";
        if (matches[4])
            colorOpacity = matches[4].replace(", ", "");
        if (format === "rgb")
            return colorValue > 125 ? "rgb(0,0,0)" : "rgb(255,255,255)";
        else if (format === "rgba")
            return colorValue > 125 || parseFloat(colorOpacity) < 0.5
                ? "rgb(0,0,0)"
                : "rgb(255,255,255)";
    }
    /**
     * Will check gradient brightness
     */
    static checkGradient(color) { }
}
class Dye extends Color {
    constructor(htmlEntity) {
        super();
        //Elements and Props to work with
        let selector = Dye.getProp(htmlEntity, "dye"), self = htmlEntity, parent = htmlEntity.parentElement, isGradient = Dye.getProp(htmlEntity, "gradient"), isBlackImg = Dye.getProp(htmlEntity, "blackimg") ? true : false, isImg = htmlEntity.tagName === "IMG" ? true : false;
        if (selector === "")
            //Get self bg or in case it's an img, get parent bg
            isGradient
                ? (this.bg = isImg
                    ? Dye.getBgGradient(parent)
                    : Dye.getBgGradient(self))
                : (this.bg = isImg ? Dye.getBgColor(parent) : Dye.getBgColor(self));
        //If there is indeed a selector passed in the dye parameter, then fetch either bg or gradient bg
        if (typeof selector === "string" && selector !== "")
            isGradient
                ? (this.bg = Dye.getBgGradient(selector))
                : (this.bg = Dye.getBgColor(selector));
        /**
         * Define HTML Element Color
         */
        isImg
            ? Dye.setImgFilter(self, this.bg, isBlackImg)
            : Dye.setColor(self, this.bg);
    }
    //GET FUNCTIONS
    /**
     * *Gets Static BG Colors
     * @param element | any | - The element to target or the selector to an element
     * @param selector | boolean - default false | - true if the element is a selector.
     * @returns | string | CSS RGB or RGBA info.
     */
    static getBgColor(element) {
        //If receives a selector to query instead of an element
        if (typeof element === "string" && element !== "")
            element = document.querySelector(element);
        //Then get the actual bg color of whatever element was received
        return window.getComputedStyle
            ? window
                .getComputedStyle(element, null)
                .getPropertyValue("background-color")
            : element.style.backgroundColor;
    }
    /**
     * *Get Gradient Backgrounds
     * @param element | any | - The element to target or the selector to an element
     * @param selector | boolean - default false | - true if the element is a selector.
     * @returns | string | CSS Linear Gradient info.
     */
    static getBgGradient(element) {
        //If receives a selector to query instead of an element
        if (typeof element === "string" && element !== "")
            element = document.querySelector(element);
        //Then get the actual bg color of whatever element was received
        return window.getComputedStyle
            ? window.getComputedStyle(element, null).getPropertyValue("background")
            : element.style.background;
    }
    /**
     * * Get Props from the Element's attributes object
     * @param element | any | - the element to target
     * @param attribute | atttribute | string | - accepts "dye", "gradient", "blackimg"
     * @returns | string | The attribute value
     */
    static getProp(element, attribute) {
        let attrs = element.attributes;
        return attribute === "dye"
            ? attrs.getNamedItem(attribute).value
            : attrs.getNamedItem(attribute);
    }
    //SET FUNCTIONS
    /**
     * *Will set filter of non img element
     * @param node | any | - The node which color will be changed
     * @param bgColor | string | - The Color to change the element to
     */
    static setColor(node, bgColor) {
        node.style.color = Color.checkFormat(bgColor);
    }
    /**
     * will set the css filter to change color of Image elements
     * @param img | any | - The image to be targeted
     * @param bgColor | string | - The checked color (not the bg color)
     * @param blackImg | boolean | Returns true if Image is a black image
     */
    static setImgFilter(img, bgColor, blackImg) {
        let checkedBg = Color.checkFormat(bgColor), filter;
        if (checkedBg === "rgb(0,0,0)") {
            filter = blackImg ? "" : "grayscale(1) invert(1)";
        }
        else if (checkedBg === "rgb(255,255,255)") {
            filter = blackImg ? "grayscale(1) invert(1)" : "";
        }
        img.style.filter = filter;
        img.style.webkitFilter = filter;
    }
}
//INIT
document.querySelectorAll("[dye]").forEach((htmlEntity) => {
    new Dye(htmlEntity);
});
