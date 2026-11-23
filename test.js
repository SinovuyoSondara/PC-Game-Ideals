// Run with: node test.js
const assert = require("assert");
const D = require("./deals.js");
const games = require("./data.js");

// getOnSale: Stardew Valley and Terraria are NOT discounted
const onSale = D.getOnSale(games);
assert.strictEqual(onSale.length, 6);
assert.ok(!onSale.some((g) => g.title === "Stardew Valley" || g.title === "Terraria"));

// discountPercent
assert.strictEqual(D.discountPercent(games[0]), 50); // Hollow Knight
assert.strictEqual(D.discountPercent(games[1]), 0); // Stardew (no discount)
assert.strictEqual(D.discountPercent(games[2]), 75); // Celeste
assert.strictEqual(D.discountPercent(games[4]), 90); // Portal 2
assert.strictEqual(D.discountPercent({ normalPrice: 0, salePrice: 0 }), 0); // no divide-by-zero

// findCheapest
assert.strictEqual(D.findCheapest(games).title, "Portal 2");
assert.strictEqual(D.findCheapest([]), null);

// searchTitles: case-insensitive, partial, blank returns all
assert.deepStrictEqual(D.searchTitles(games, "HOLLOW").map((g) => g.id), [1]);
assert.deepStrictEqual(D.searchTitles(games, "e").length > 1, true);
assert.strictEqual(D.searchTitles(games, "   ").length, games.length);
assert.strictEqual(D.searchTitles(games, "zzz").length, 0);

console.log("All tests passed ✔");
