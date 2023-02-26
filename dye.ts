/** Dye.js - © 2023 - Tiago M. Galvão - https://deviago.me */

//TYPES AND MODULES DEFINITIONS
module CustomTypes {
  export type attribute = "dye" | "gradient" | "blackimg";
  export type format = "rgb" | "rgba";
}

class Color {
  /**
   * Will check color format and distribute it to the right check color function
   * @param bgColor | string | - Color to be type checked
   * @returns - The new color for the element
   */
  static checkFormat(bgColor: string) {
    if (bgColor.startsWith("rgb(")) return this.checkColor(bgColor, "rgb");
    else if (bgColor.startsWith("rgba("))
      return this.checkColor(bgColor, "rgba");
    else if (bgColor.startsWith("linear-gradient("))
      return this.checkGradient(bgColor);
  }

  /**
   * Will check RGB / RGBA balance
   * @param color | string | - Color to check
   * @param format | string | - Color format, can be rgb or rgba
   * @returns | string | - The new color for the element
   */
  static checkColor(color: string, format: string) {
    let pattern, matches, colorValue, colorOpacity;

    format === "rgb"
      ? (pattern = /^rgb?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/)
      : (pattern = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/);

    (matches = color.match(pattern)),
      (colorValue = Math.round(
        (parseInt(matches[1]) * 299 +
          parseInt(matches[2]) * 587 +
          parseInt(matches[3]) * 114) /
          1000
      ));

    colorOpacity = "";
    if (matches[4]) colorOpacity = matches[4].replace(", ", "");

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
  static checkGradient(color: string) {
    /**
     * Will extract all colors from a gradient string (HEX, RGB OR RGBA) and push them to an array
     * @param gradient | string | Receives the gradient string
     * @returns | array | An array with all extracted colors
     */
    const getGradientColors = (gradient: string): string[] => {
      const colors = gradient.match(/#[0-9a-f]{3,6}|rgba?\([\d\s,./]+\)/gi);
      return colors || [];
    };

    /**
     * Will iterate every color present in the color array to find it's luminance
     * @param color | string |
     * @returns
     */
    const getColorLuminance = (color: string): number => {
      let r, g, b, a;
      if (color.startsWith("#")) {
        // HEX
        r = parseInt(color.substring(1, 3), 16);
        g = parseInt(color.substring(3, 5), 16);
        b = parseInt(color.substring(5, 7), 16);
        a = 1;
      } else if (color.startsWith("rgb")) {
        // RGB or RGBA
        const rgba = color
          .substring(color.indexOf("(") + 1, color.lastIndexOf(")"))
          .split(",")
          .map((c) => parseFloat(c.trim()));
        r = rgba[0];
        g = rgba[1];
        b = rgba[2];
        a = rgba.length > 3 ? rgba[3] : 1;
      } else {
        // Unsupported color format
        return 0;
      }

      // Blend color with white background based on alpha value
      r = Math.round((1 - a) * 255 + a * r);
      g = Math.round((1 - a) * 255 + a * g);
      b = Math.round((1 - a) * 255 + a * b);

      // Calculate luminance from final RGB values
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    //Check the color received
    const gradientMatch = color.match(/^linear-gradient\((.+)\)$/);
    if (!gradientMatch) {
      return;
    }

    const gradientArguments = gradientMatch[1].split(",");

    const gradientColors = getGradientColors(gradientArguments.join(","));

    if (gradientColors.length > 1) {
      //Set defaults if gradient actually qualifies as a gradient.
      const luminances = gradientColors.map(getColorLuminance);

      const minLuminance = Math.min(...luminances);
      // const maxLuminance = Math.max(...luminances);
      let textColor = "#ffffff";

      if (gradientColors.length === 2) {
        textColor = minLuminance > 0.5 ? "#000000" : "#ffffff";
      } else if (gradientColors.length === 3) {
        const middleIndex = Math.floor(gradientColors.length / 2);

        if (middleIndex !== -1) {
          const threshold = minLuminance > 0.9 ? 0.8 : 0.5;
          textColor =
            luminances[middleIndex] > threshold ? "#000000" : "#ffffff";
        }
      }

      return textColor;
    }
  }
}

class Dye {
  //Class Properties
  public bg: string;
  public imgFilter: string;

  constructor(htmlEntity: any) {
    //Elements and Props to work with
    let selector = Dye.getProp(htmlEntity, "dye"),
      self = htmlEntity,
      parent = htmlEntity.parentElement,
      isGradient = Dye.getProp(htmlEntity, "gradient"),
      isBlackImg = Dye.getProp(htmlEntity, "blackimg") ? true : false,
      isImg = htmlEntity.tagName === "IMG" ? true : false;

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

  /**
   * *Gets Static BG Colors
   * @param element | any | - The element to target or the selector to an element
   * @param selector | boolean - default false | - true if the element is a selector.
   * @returns | string | CSS RGB or RGBA info.
   */
  static getBgColor(element: any) {
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
  static getBgGradient(element: any) {
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

  static getProp(element: any, attribute: CustomTypes.attribute) {
    let attrs = element.attributes;

    return attribute === "dye"
      ? attrs.getNamedItem(attribute).value
      : attrs.getNamedItem(attribute);
  }

  /**
   * *Will set filter of non img element
   * @param node | any | - The node which color will be changed
   * @param bgColor | string | - The Color to change the element to
   */
  static setColor(node: any, bgColor: string) {
    node.style.color = Color.checkFormat(bgColor);
  }

  /**
   * will set the css filter to change color of Image elements
   * @param img | any | - The image to be targeted
   * @param bgColor | string | - The checked color (not the bg color)
   * @param blackImg | boolean | Returns true if Image is a black image
   */

  static setImgFilter(img: any, bgColor: string, blackImg: boolean) {
    let checkedBg = Color.checkFormat(bgColor),
      filter;
    if (checkedBg === "rgb(0,0,0)") {
      filter = blackImg ? "" : "grayscale(1) invert(1)";
    } else if (checkedBg === "rgb(255,255,255)") {
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
