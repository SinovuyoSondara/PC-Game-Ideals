// Part A — small, pure functions over a list of game deals.
// Works in the browser (as window.Deals) and in Node (module.exports).

(function (root) {
  "use strict";

  // A game is on sale when its sale price is lower than its normal price.
  function isOnSale(game) {
    return game.salePrice < game.normalPrice;
  }

  // Returns only the games that are on sale.
  function getOnSale(games) {
    return games.filter(isOnSale);
  }

  // Discount as a whole-number percentage, e.g. 14.99 -> 7.49 gives 50.
  // Returns 0 if the game is not discounted or the normal price is 0
  // (avoids dividing by zero).
  function discountPercent(game) {
    if (!game.normalPrice || game.normalPrice <= 0) return 0;
    if (!isOnSale(game)) return 0;
    const pct = ((game.normalPrice - game.salePrice) / game.normalPrice) * 100;
    return Math.round(pct);
  }

  // Cheapest game by sale price. Returns null for an empty list.
  // On a tie, the first game in the list wins.
  function findCheapest(games) {
    if (!games.length) return null;
    return games.reduce((best, g) => (g.salePrice < best.salePrice ? g : best));
  }

  // Case-insensitive "title contains query" search.
  // An empty/blank query returns everything.
  function searchTitles(games, query) {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => g.title.toLowerCase().includes(q));
  }

  const api = { isOnSale, getOnSale, discountPercent, findCheapest, searchTitles };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Deals = api;
})(typeof window !== "undefined" ? window : globalThis);
