# PC Game Deals

A small web page that lists PC game deals, plus the functions behind it.
Prices are in Rand (R), as per the brief.

## Setup

No install, no build step, no dependencies.

1. Put all files in one folder: `index.html`, `style.css`, `app.js`, `deals.js`, `data.js`.
2. Open `index.html` in any modern browser (double-click it).
3. Optional: run the Part A tests with Node: `node test.js`

## What's in each file

| File | Purpose |
| --- | --- |
| `deals.js` | **Part A.** `getOnSale`, `discountPercent`, `findCheapest`, `searchTitles` (plus a small `isOnSale` helper) |
| `data.js` | The 8 sample deals from the brief |
| `index.html`, `app.js`, `style.css` | **Part B + C.** The page: sale price, "ON SALE" tag only on discounted games |
| `test.js` | Checks the Part A functions against the sample data |

## Stretch goals done (Part C)

- Live search as you type (case-insensitive)
- "On sale only" filter
- "Load live deals" button using the CheapShark API (falls back to the sample data if the request fails)
- Styling: dark theme, responsive card grid, struck-through original price and a "-50%" badge

## Assumptions

- **On sale** means `salePrice < normalPrice`, exactly as in the brief. Stardew Valley and Terraria are therefore not on sale.
- **Discount percentage** is rounded to a whole number. A game that is not on sale returns 0, and a normal price of 0 also returns 0 (avoids dividing by zero).
- **Cheapest game** is judged by `salePrice`. If two are tied, the first in the list wins. An empty list returns `null`.
- **Search** matches anywhere in the title ("knight" finds "Hollow Knight"). A blank search shows everything.
- **Currency:** every price on the page is in Rand. The sample data is already in Rand. CheapShark prices are in US dollars, so the "Load live deals" button first fetches the current USD→ZAR rate (open.er-api.com) and converts both prices before showing them. If the rate can't be fetched, live data is not shown (the page keeps the Rand sample data) rather than showing dollars labelled as Rand.
- Page filters combine: the on-sale filter and search work together, and the "cheapest" line reflects whatever is currently shown.

## Choices

- Plain HTML, CSS and JavaScript: the brief said no framework is needed, and it keeps setup to "open the file".
- The Part A functions are pure (they take a list and return a result) and know nothing about the page. That is why the same file works in the browser and in Node tests.
- Cards are built with `textContent` rather than `innerHTML`, so titles coming from the live API can never inject markup.

## Obstacles

_(Fill in honestly: what you got stuck on and how you got unstuck.)_

## Resources used

_(List what you actually used: MDN pages, the CheapShark API docs, and any AI tools, and say how you used them.)_

## Time taken

_(Your real number.)_

## What I'd do differently

- Convert or clearly label currency for the live data
- Add a sort option (price, discount %) and a price range filter
- Add loading skeletons and a retry button for API errors
- Cache the API response so the page is usable offline
