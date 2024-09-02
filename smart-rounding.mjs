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

function addNewCorner(corner, offsetX, offsetY) {
    return [corner[0] + offsetX, corner[1] + offsetY];
}

function addOffsetToRounding(rounding, offset) {
    return [
        addNewCorner(rounding[0], offset[3], offset[0]),
        addNewCorner(rounding[1], offset[1], offset[0]),
        addNewCorner(rounding[2], offset[3], offset[2]),
        addNewCorner(rounding[3], offset[1], offset[2]),
    ];
}

function subNewCorner(corner, offsetX, offsetY) {
    return [corner[0] - offsetX, corner[1] - offsetY];
}

function subOffsetFromRounding(rounding, offset) {
    return [
        subNewCorner(rounding[0], offset[3], offset[0]),
        subNewCorner(rounding[1], offset[1], offset[0]),
        subNewCorner(rounding[2], offset[3], offset[2]),
        subNewCorner(rounding[3], offset[1], offset[2]),
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
const getRounding = (elem) => fromCssProperties(elem, keyToCss.rounding, parseCssRoundingValue);
const getBorder = (elem) => fromCssProperties(elem, keyToCss.border, parseFloat);

function getOuterRounding(elem) {
    const rounding = getRounding(elem);
    const margins = getMargins(elem);
    return addOffsetToRounding(rounding, margins);
}

function getInnerRounding(elem) {
    const rounding = getRounding(elem);
    const paddings = getPaddings(elem);
    const border = getBorder(elem);
    const withoutPaddings = subOffsetFromRounding(rounding, paddings);
    return subOffsetFromRounding(withoutPaddings, border);
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

export function useInnerRounding(target, source) {
    const sourceRounding = getInnerRounding(source);
    const targetMargins = getMargins(target);
    const targetRounding = subOffsetFromRounding(sourceRounding, targetMargins);
    applyRounding(target, targetRounding);
}

export function useRoundingFromChild(elem, selector) {
    const source = elem.querySelector(selector);
    if (source === null) return false;
    useOuterRounding(elem, source);
    return true;
}

export function useRoundingFromParent(elem, selector) {
    const targets = elem.querySelectorAll(selector);
    if (targets.length === 0) return false;
    for (const target of targets) {
        useInnerRounding(target, elem);
    }
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