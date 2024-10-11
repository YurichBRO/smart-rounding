/**
 * Automatically use CSS rounding from parent or child. For more info, see README.md
 * 
 * Terminology:
 * rounding - list of 4 rounding values that represent the 4 corners of an element
 * rounding value - a list of 2 numbers that represent the rounding of a single corner
 * CSS value - a string that represents the rounding of a single corner using CSS
 * offset - list of 4 numbers that represent top, right, bottom, left offsets or a list of 2 numbers that apply to a single corner
 */

/**
 * Convert CSS value to rounding value.
 * @param {string} value CSS value
 * @returns {Array} rounding value
 */
function parseCssValue(value) {
    if (!value.includes(" ")) {
        const singleValue = parseFloat(value);
        return isNaN(singleValue) ? [0, 0] : [singleValue, singleValue];
    }

    const parts = value.split(" ");
    const firstValue = parseFloat(parts[0]);
    const secondValue = parseFloat(parts[1]);

    return [
        isNaN(firstValue) ? 0 : firstValue,
        isNaN(secondValue) ? firstValue : secondValue
    ];
}

/**
 * Convert rounding value to CSS value
 * @param {Array} value rounding value
 * @returns {string} CSS value
 */
function roundingValueToCssValue(value) {
    return `${value[0]}px ${value[1]}px`;
}

/**
 * Add an offset to a rounding value
 * @param {Array} corner rounding value
 * @param {number} offsetX x offset to be added to rounding value
 * @param {number} offsetY y offset to be added to rounding value
 * @returns {Array} new rounding value
 */
function addNewCorner(corner, offsetX, offsetY) {
    return [corner[0] + offsetX, corner[1] + offsetY];
}

/**
 * Add offset to rounding
 * @param {Array} rounding the rounding to which the offset is added
 * @param {Array} offset the offset to be applied to the rounding
 * @returns {Array} new rounding
 */
function addOffsetToRounding(rounding, offset) {
    return [
        addNewCorner(rounding[0], offset[3], offset[0]),
        addNewCorner(rounding[1], offset[1], offset[0]),
        addNewCorner(rounding[2], offset[3], offset[2]),
        addNewCorner(rounding[3], offset[1], offset[2]),
    ];
}

/**
 * Subtract an offset from a rounding value
 * @param {Array} corner rounding value
 * @param {number} offsetX x offset to be subtracted from rounding value
 * @param {number} offsetY y offset to be subtracted from rounding value
 * @returns {Array} new rounding value
 */
function subNewCorner(corner, offsetX, offsetY) {
    return [corner[0] - offsetX, corner[1] - offsetY];
}

/**
 * Subtract offset from rounding
 * @param {Array} rounding the rounding from which the offset is subtracted
 * @param {Array} offset the offset to be subtracted from the rounding
 * @returns {Array} new rounding
 */
function subOffsetFromRounding(rounding, offset) {
    return [
        subNewCorner(rounding[0], offset[3], offset[0]),
        subNewCorner(rounding[1], offset[1], offset[0]),
        subNewCorner(rounding[2], offset[3], offset[2]),
        subNewCorner(rounding[3], offset[1], offset[2]),
    ];
}

/**
 * Extract styles from an HTML element and apply a conversion function to the result
 * @param {HTMLElement} elem element from which the style values are taken
 * @param {Array} properties properties to be extracted from styles
 * @param {Function} valueFunction conversion function for convenience
 * @returns {Array} list of styles, converted with the conversion function
 */
function fromCssProperties(elem, properties, valueFunction) {
    const styles = getComputedStyle(elem);
    const values = [];
    for (let i = 0; i < properties.length; i++) {
        const cssValue = styles[properties[i]];
        values[i] = valueFunction(cssValue);
    }
    return values;
}

const keyToCss = {
    rounding: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
    ],
    margin: [
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
    ],
    padding: [
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
    ],
    border: [
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
    ]
}

const getPaddings = (elem) => fromCssProperties(elem, keyToCss.padding, parseFloat);
const getMargins = (elem) => fromCssProperties(elem, keyToCss.margin, parseFloat);
const getRounding = (elem) => fromCssProperties(elem, keyToCss.rounding, parseCssValue);
const getBorder = (elem) => fromCssProperties(elem, keyToCss.border, parseFloat);

/**
 * Get outer rounding of an HTML element. This rounding includes padding, border, and margin.
 * @param {HTMLElement} elem element from which the rounding is extracted
 * @returns {Array} outer rounding
 */
function getOuterRounding(elem) {
    const rounding = getRounding(elem);
    const margins = getMargins(elem);
    return addOffsetToRounding(rounding, margins);
}

/**
 * Get inner rounding of an HTML element. This rounding includes padding, but does not include border and margin.
 * @param {HTMLElement} elem element from which the rounding is extracted
 * @returns {Array} inner rounding
 */
function getInnerRounding(elem) {
    const rounding = getRounding(elem);
    const paddings = getPaddings(elem);
    const border = getBorder(elem);
    const withoutPaddings = subOffsetFromRounding(rounding, paddings);
    return subOffsetFromRounding(withoutPaddings, border);
}

/**
 * Apply rounding to an HTML element
 * @param {HTMLElement} elem element to which rounding is applied
 * @param {Array} rounding the rounding to be applied to the element
 */
function applyRounding(elem, rounding) {
    for (let i = 0; i < rounding.length; i++) {
        const cssKey = keyToCss.rounding[i];
        const cssValue = roundingValueToCssValue(rounding[i]);
        elem.style[cssKey] = cssValue;
    }
}

/**
 * Extract outer rounding from a source element and apply it to a target element
 * @param {HTMLElement} target element to which the rounding is applied
 * @param {HTMLElement} source element from which rounding is extracted
 */
export function useOuterRounding(target, source) {
    const sourceRounding = getOuterRounding(source);
    const targetPaddings = getPaddings(target);
    const targetRounding = addOffsetToRounding(sourceRounding, targetPaddings);
    applyRounding(target, targetRounding);
}

/**
 * Extract inner rounding from a source element and apply it to a target element
 * @param {HTMLElement} target element to which the rounding is applied
 * @param {HTMLElement} source element from which rounding is extracted
 */
export function useInnerRounding(target, source) {
    const sourceRounding = getInnerRounding(source);
    const targetMargins = getMargins(target);
    const targetRounding = subOffsetFromRounding(sourceRounding, targetMargins);
    applyRounding(target, targetRounding);
}

/**
 * Get outer rounding from a child that matches the given selector and apply it to the given parent element
 * @param {HTMLElement} elem parent element to which rounding of a child is applied
 * @param {string} selector the first child that matches this selector is used
 * @returns {boolean} true if a matching child is found, otherwise false
 */
export function useRoundingFromChild(elem, selector) {
    const source = elem.querySelector(selector);
    if (source === null) return false;
    useOuterRounding(elem, source);
    return true;
}

/**
 * Get inner rounding from a parent element and apply it to each child that matches the given selector
 * @param {HTMLElement} elem parent element from which rounding is extracted
 * @param {string} selector all children that match this selector are used
 * @returns {boolean} true if at least one matching child is found, otherwise false
 */
export function useRoundingFromParent(elem, selector) {
    const targets = elem.querySelectorAll(selector);
    if (targets.length === 0) return false;
    for (const target of targets) {
        useInnerRounding(target, elem);
    }
    return true;
}

/**
 * Use rounding from child for multiple selectors represented with an object
 * @param {Object} selectorPairs an object containing parent selectors as keys and child selectors as values
 */
export function useRoundingFromChildOnAll(selectorPairs) {
    for (const targetSelector in selectorPairs) {
        const targets = document.querySelectorAll(targetSelector);
        for (const target of targets) {
            const result = useRoundingFromChild(target, selectorPairs[targetSelector]);
            if (result) {
                console.log(`Applied rounding on '${targetSelector}' using '${selectorPairs[targetSelector]}'`);
            }
            else {
                console.warn("Could not find source element for", target);
            }
        }
    }
}

/**
 * Use rounding from parent for multiple selectors represented with an object
 * @param {Object} selectorPairs an object containing parent selectors as keys and child selectors as values
 */
export function useRoundingFromParentOnAll(selectorPairs) {
    for (const sourceSelector in selectorPairs) {
        const sources = document.querySelectorAll(sourceSelector);
        for (const source of sources) {
            const result = useRoundingFromParent(source, selectorPairs[sourceSelector]);
            if (result) {
                console.log(`Applied rounding on '${selectorPairs[sourceSelector]}' using '${sourceSelector}'`);
            }
            else {
                console.warn("Could not find target elements for", source);
            }
        }
    }
}