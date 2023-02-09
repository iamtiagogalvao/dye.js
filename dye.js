/**
 * Check color balance
 */
const checkColor = (color, img = false, isBlackImg = false) => {
  let r = 0,
    g = 0,
    b = 0,
    result;

  if (color.startsWith("rgb(")) {
    // CHECK RGB COLORS
    splittedColor = color.substr(4, color.length - 5).split(", ");
    r = splittedColor[0];
    g = splittedColor[1];
    b = splittedColor[2];
    result = Math.round(
      (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000
    );
    if (img) {
      return isblackImg
        ? (imgFilter = result > 125 ? "" : "grayscale(1) invert(1)")
        : (imgFilter = result > 125 ? "grayscale(1) invert(1)" : "");
    } else {
      return (textColor = result > 125 ? "rgb(0,0,0)" : "rgb(255,255,255)");
    }
  } else if (color.startsWith("rgba(")) {
    // Check RGBA COLORS
    let rgb = color;
    let pattern = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*\d+\.*\d+)?\)$/;
    let matches = rgb.match(pattern);
    let colorValue = Math.round(
      (parseInt(matches[1]) * 299 +
        parseInt(matches[2]) * 587 +
        parseInt(matches[3]) * 114) /
        1000
    );

    var colorOpacity = "";
    if (matches[4]) {
      var colorOpacity = matches[4].replace(", ", "");
    }

    return colorValue > 125 || parseFloat(colorOpacity) < 0.5
      ? "rgb(0,0,0)"
      : "rgb(255,255,255)";
  }
};

/**
 * Fetches the bg color af parent element
 * @param parentEl - The element of which we want to get the background color
 */

const getParentBG = (parentEl, selector = false, gradient = false) => {
  let bg, bgColor;

  //Fetch the bg
  const fetchBG = (element, gradient = false) => {
    if (gradient) {
      bgColor = window.getComputedStyle
        ? window.getComputedStyle(element, null).getPropertyValue("background")
        : element.style.background;
    } else {
      bgColor = window.getComputedStyle
        ? window
            .getComputedStyle(element, null)
            .getPropertyValue("background-color")
        : element.style.backgroundColor;
    }

    return bgColor;
  };

  if (selector) {
    let selectedEl = document.querySelector(selector);
    //Check if is gradient
    if (gradient) {
      bg = fetchBG(selectedEl, true);
    } else {
      bg = fetchBG(selectedEl);
    }
  } else {
    //Check if is gradient
    if (gradient) {
      bg = fetchBG(parentEl, true);
    } else {
      bg = fetchBG(parentEl);
    }
  }

  /**
   * THIS NOW ALSO RETURNS GRADIENTS, NEED TO FIGURE OUT WHAT TO DO WITH THEM
   */
  return bg;
};

/**
 * Initializes dye.js library
 */
const dye = () => {
  document.querySelectorAll("[dye]").forEach((node) => {
    let parentNode = node.attributes.dye.value,
      dye,
      gradient = node.attributes.gradient,
      blackImg = node.attributes.blackimg;

    // If the node target is self or empty -> pass self
    if (parentNode === "self" || parentNode === "") {
      let bg;

      if (node.tagName !== "IMG") {
        bg = getParentBG(node);

        if (bg === "rgba(0, 0, 0, 0)") {
          //passes the node to getParentBG() to be able to get parent element bg color
          bg = gradient
            ? getParentBG(node.parentElement, null, true)
            : getParentBG(node.parentElement);

          dye = checkColor(bg);
        }

        dye = checkColor(bg);
      }

      if (node.tagName === "IMG") {
        dye = checkColor(
          getParentBG(node.parentElement),
          true,
          node.attributes
        );
        node.style.filter = dye;
        node.style.webkitFilter = dye;
      }
    } else {
      //If the "dye" property has an element to target

      if (node.tagName === "IMG") {
        dye = checkColor(getParentBG(null, parentNode), true);
        node.style.filter = dye;
        node.style.webkitFilter = dye;
      } else {
        //if is not an image
        bg = getParentBG(null, parentNode);
        dye = checkColor(bg);
      }
    }
    node.style.color = dye;
  });
};

//init
dye();
