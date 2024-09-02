function parseCssRoundingValue(value) {
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

function roundingValueToCssValue(value) {
    return `${value[0]}px ${value[1]}px`;
}

function calculateNewCorner(corner, offsetX, offsetY) {
    return [corner[0] + offsetX, corner[1] + offsetY];
}

function addOffsetToRounding(rounding, offset) {
    return [
        calculateNewCorner(rounding[0], offset[3], offset[0]),
        calculateNewCorner(rounding[1], offset[1], offset[0]),
        calculateNewCorner(rounding[2], offset[3], offset[2]),
        calculateNewCorner(rounding[3], offset[1], offset[2]),
    ];
}

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
    ]
}

const getPaddings = (elem) => fromCssProperties(elem, keyToCss.padding, parseFloat);
const getMargins = (elem) => fromCssProperties(elem, keyToCss.margin, parseFloat);
const getRounding = (elem) => fromCssProperties(elem, keyToCss.rounding, parseCssRoundingValue);

function getOuterRounding(elem) {
    const rounding = getRounding(elem);
    const margins = getMargins(elem);
    return addOffsetToRounding(rounding, margins);
}

function applyRounding(elem, rounding) {
    for (let i = 0; i < rounding.length; i++) {
        const cssKey = keyToCss.rounding[i];
        const cssValue = roundingValueToCssValue(rounding[i]);
        elem.style[cssKey] = cssValue;
    }
}

export function useOuterRounding(target, source) {
    const sourceRounding = getOuterRounding(source);
    const targetPaddings = getPaddings(target);
    const targetRounding = addOffsetToRounding(sourceRounding, targetPaddings);
    applyRounding(target, targetRounding);
}

export function useRoundingFromChild(elem, selector) {
    const source = elem.querySelector(selector);
    if (source === null) return false;
    useOuterRounding(elem, source);
    return true;
}

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