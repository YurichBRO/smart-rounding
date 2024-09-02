import { useRoundingFromChildOnAll } from "./smart-rounding.mjs";

const selectorPairs = {"#outer": ".inner"};
document.addEventListener("DOMContentLoaded", () => useRoundingFromChildOnAll(selectorPairs));