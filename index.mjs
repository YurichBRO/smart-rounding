import { useRoundingFromChildOnAll, useRoundingFromParentOnAll } from "./smart-rounding.mjs";

const selectorPairsFromChild = {"#outer1": ".inner1"};
document.addEventListener("DOMContentLoaded", () => useRoundingFromChildOnAll(selectorPairsFromChild));

const selectorPairsFromParent = {"#outer2": ".inner2"};
document.addEventListener("DOMContentLoaded", () => useRoundingFromParentOnAll(selectorPairsFromParent));