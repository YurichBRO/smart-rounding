# Smart rounding
Smart rounding for nested rounded with CSS HTML elements.
Works with any value of border radius, including asymmetrical rounding.
## Comparison
using same border-radius for both parent and child:

![using same border-radius for both parent and child](./readme/image.png)

using `smart-rounding.mjs`:

![using `smart-rounding.mjs`](./readme/image-1.png)
## Usage
```js
import { useRoundingFromChildOnAll } from "./smart-rounding.mjs";

// creating pairs of selectors for the code to use
const selectorPairsFromChild = {"#outer1": ".inner1"};
// for each parent with selector from keys of `selectorPairsFromChild` we apply
// the rounding from child with selector from value of `selectorPairsFromChild`
// of the corresponding key.
// we do that when contents of page loaded, although its not mandatory
document.addEventListener("DOMContentLoaded", () => useRoundingFromChildOnAll(selectorPairsFromChild));
// quite the opposite logic is used when using `useRoundingFromParentOnAll` but
// still, parent is the key, child is the value
```
## Version syntax
"[major].[minor (feature update)].[patch (bug fix, documentation update)]"

example: "1.0.1" - major version 1, no feature updates, 1 bug fix or/and 1 documentation update.
if two git branches are in work, each branch tracks version separately, when they are merged, the version is updated to a max of the two versions.
## Notes
- This program is not finished yet, there may be bugs we don't yet know about.
- If you plan to use this code, do not use it in production. A better solution is to use it only while developing, then copying generated `border-radius` values to your CSS.
- Remember to use `smart-rounding.mjs` instead of `smart-rounding.js` and to add `type="module"` to your script tag(s).