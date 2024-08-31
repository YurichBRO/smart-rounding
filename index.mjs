import { selectorPairs, useRoundingOnAll } from "./smart-rounding.mjs";

selectorPairs.clear();
selectorPairs['#outer'] = '.inner'

document.addEventListener("DOMContentLoaded", useRoundingOnAll);