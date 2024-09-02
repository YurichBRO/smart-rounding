import { useRoundingFromChildOnAll, useRoundingFromParentOnAll } from "./smart-rounding.mjs";

const selectorPairsFromChild = {"#outer": ".inner"};
document.addEventListener("DOMContentLoaded", () => useRoundingFromChildOnAll(selectorPairsFromChild));

const selectorPairsFromParent = {"#outer1": ".rounded"};
document.addEventListener("DOMContentLoaded", () => useRoundingFromParentOnAll(selectorPairsFromParent));