// Parts B & C — render the deals, live search, on-sale filter, CheapShark.

const listEl = document.getElementById("list");
const searchEl = document.getElementById("search");
const onlySaleEl = document.getElementById("onlySale");
const statusEl = document.getElementById("status");
const cheapestEl = document.getElementById("cheapest");
const loadLiveBtn = document.getElementById("loadLive");

let allGames = SAMPLE_DEALS; // swapped for live data if the user loads it

const rand = (n) => "R" + n.toFixed(2);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text; // textContent: safe for API data
  return node;
}

function renderCard(game) {
  const li = el("li", "card");
  const onSale = Deals.isOnSale(game);

  const top = el("div", "card-top");
  top.appendChild(el("h2", "", game.title));
  if (onSale) top.appendChild(el("span", "tag", "ON SALE"));
  li.appendChild(top);

  li.appendChild(el("p", "store", game.store));

  const prices = el("p", "prices");
  if (onSale) {
    prices.appendChild(el("span", "sale", rand(game.salePrice)));
    prices.appendChild(el("span", "was", rand(game.normalPrice)));
    prices.appendChild(el("span", "pct", "-" + Deals.discountPercent(game) + "%"));
  } else {
    prices.appendChild(el("span", "normal", rand(game.normalPrice)));
  }
  li.appendChild(prices);

  return li;
}

function render() {
  let games = allGames;
  if (onlySaleEl.checked) games = Deals.getOnSale(games);
  games = Deals.searchTitles(games, searchEl.value);

  listEl.replaceChildren(...games.map(renderCard));

  statusEl.textContent = games.length
    ? `Showing ${games.length} of ${allGames.length} games`
    : "No games match your search.";

  const cheapest = Deals.findCheapest(games);
  cheapestEl.textContent = cheapest
    ? `Cheapest right now: ${cheapest.title} at ${rand(cheapest.salePrice)}`
    : "";
}

// ---- Stretch: real data from the CheapShark API ----
// CheapShark prices are in USD (as strings). All prices on this page must be
// in Rand, so we fetch the current USD->ZAR rate and convert every price.
// If the rate can't be fetched we refuse to show live data rather than show
// dollars labelled as rand.
async function getUsdToZar() {
  const res = await fetch("https://open.er-api.com/v6/latest/USD");
  if (!res.ok) throw new Error("exchange rate unavailable");
  const data = await res.json();
  const rate = data && data.rates && data.rates.ZAR;
  if (typeof rate !== "number" || !(rate > 0)) throw new Error("no ZAR rate returned");
  return rate;
}

async function loadLive() {
  loadLiveBtn.disabled = true;
  statusEl.textContent = "Loading live deals…";
  try {
    const [dealsRes, storesRes, rate] = await Promise.all([
      fetch("https://www.cheapshark.com/api/1.0/deals?pageSize=24&upperPrice=40"),
      fetch("https://www.cheapshark.com/api/1.0/stores"),
      getUsdToZar(),
    ]);
    if (!dealsRes.ok || !storesRes.ok) throw new Error("API returned an error");

    const deals = await dealsRes.json();
    const stores = await storesRes.json();
    const storeNames = Object.fromEntries(stores.map((s) => [s.storeID, s.storeName]));

    // Convert USD -> ZAR, rounded to cents. Convert both prices with the same
    // rate so the discount percentage is unchanged by the conversion.
    const toRand = (usd) => Math.round(Number(usd) * rate * 100) / 100;

    allGames = deals.map((d, i) => ({
      id: d.dealID || i,
      title: d.title,
      normalPrice: toRand(d.normalPrice),
      salePrice: toRand(d.salePrice),
      store: storeNames[d.storeID] || "Store " + d.storeID,
    }));
    render();
    statusEl.textContent += ` (live prices converted from USD at R${rate.toFixed(2)} per $1)`;
  } catch (err) {
    allGames = SAMPLE_DEALS;
    render();
    statusEl.textContent = "Couldn't load live deals (" + err.message + "). Showing sample data.";
  } finally {
    loadLiveBtn.disabled = false;
  }
}

searchEl.addEventListener("input", render); // live search
onlySaleEl.addEventListener("change", render);
loadLiveBtn.addEventListener("click", loadLive);

render();
