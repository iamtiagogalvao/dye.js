class Dye {
  /**
   * * Gets Static BG Colors
   * @param element | any | - The element to target or the selector to an element
   * @param selector | boolean - default false | - true if the element is a selector.
   * @returns | string | CSS RGB or RGBA info.
   */
  static getColor(element: any) {
    //If receives a selector to query instead of an element
    if (typeof element === "string") element = document.querySelector(element);

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
  static getGradient(element: any) {
    //If receives a selector to query instead of an element
    if (typeof element === "string") element = document.querySelector(element);

    //Then get the actual bg color of whatever element was received
    return window.getComputedStyle
      ? window.getComputedStyle(element, null).getPropertyValue("background")
      : element.style.background;
  }
}

class Color {
  /**
   * will check RGB balance
   */
  static checkRGB() {}

  /**
   * will check RGBA balance
   */
  static checkRGBA() {}

  /**
   * Will check gradient brightness
   */
  static checkGradient() {}

  /**
   * Will set color of non img element
   */
  static set() {}

  /**
   * will set the color of img elements
   */

  static imgSet() {}
}
