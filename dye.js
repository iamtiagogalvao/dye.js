/**
 * Check color balance
 */
const checkColor = (color, img = false, data = {}) => {
  let r = 0,
    g = 0,
    b = 0,
    result;

  if (color.startsWith("rgb(")) {
    splittedColor = color.substr(4, color.length - 5).split(", ");
    r = splittedColor[0];
    g = splittedColor[1];
    b = splittedColor[2];
    result = Math.round(
      (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000
    );
    if (img) {
      return data.blackimg
        ? (imgFilter = result > 125 ? "" : "grayscale(1) invert(1)")
        : (imgFilter = result > 125 ? "grayscale(1) invert(1)" : "");
    } else {
      return (textColor = result > 125 ? "rgb(0,0,0)" : "rgb(255,255,255)");
    }
  } else if (color.includes("rgba(0, 0, 0, 0)")) {
    console.log("Element does not have a background color.");
  }
};

/**
 * Fetches the bg color af parent element
 * @param parentEl - The element of which we want to get the background color
 */

const getParentBG = (parentEl, selector = false) => {
  let bg;

  //Fetch the bg
  const fetchBG = (element) => {
    let bgColor = window.getComputedStyle
      ? window
          .getComputedStyle(element, null)
          .getPropertyValue("background-color")
      : element.style.backgroundColor;

    return bgColor;
  };

  if (selector) {
    let selectedEl = document.querySelector(selector);
    bg = fetchBG(selectedEl);
  } else {
    bg = fetchBG(parentEl);
  }

  return bg;
};

/**
 * Initializes dye.js library
 */
const dye = () => {
  document.querySelectorAll("[dye]").forEach((node) => {
    let parentNode = node.attributes.dye.value,
      dye;

    // If the node target is self or empty -> pass self
    if (parentNode === "self" || parentNode === "") {
      let bg;

      if (node.tagName !== "IMG") {
        bg = getParentBG(node);
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

      if (bg === "rgba(0, 0, 0, 0)") {
        //passes the node to getParentBG() to be able to get parent element bg color
        bg = getParentBG(node.parentElement);
        dye = checkColor(bg);
      }
    } else {
      if (node.tagName === "IMG") {
        dye = checkColor(getParentBG(null, parentNode), true);
        node.style.filter = dye;
        node.style.webkitFilter = dye;
      } else {
        bg = getParentBG(null, parentNode);
        dye = checkColor(bg);
      }
    }
    node.style.color = dye;
  });
};

//init
dye();
