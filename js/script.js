!(function (){
  const cardname = document.querySelector("#cardname")
  const form = document.querySelector("#form")
  const list = document.querySelector("#list")
  const inValidSets = ["Age of Overlord", "25th Anniversary Tin: Dueling Heroes Mega Pack", "Phantom Nightmare", "Valiant Smashers"]

  function checkValid (card) {
    const sets = [...new Set(card.map(c => c.set_name))]
    let isInvalid = false

    sets.forEach(set => {
      isInvalid = inValidSets.includes(set) && sets.length === 1
    });
    return isInvalid
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    console.log(cardname.value)

    fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(cardname.value)}`)
      .then(res => res.json())
      .then(({ data }) => {
        const inside = `
<div class="relative overflow-x-auto w-full">
    <table class="w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    ID
                </th>
                <th scope="col" class="px-6 py-3">
                    Card Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Collection(s)
                </th>
                <th scope="col" class="px-6 py-3">
                    Is valid?
                </th>
                <th scope="col" class="px-6 py-3">
                    Prices
                </th>
            </tr>
        </thead>
        <tbody>
            ${data.map(({id, name, card_prices, card_sets}, i) => `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td class="px-6 py-4"><a href="https://yugipedia.com/wiki/${id}" target="_blank">${id}</a></td>
      <td class="px-6 py-4"><a href="https://yugipedia.com/wiki/${id}" target="_blank">${name}</a></td>
      <td class="px-6 py-4">${[...new Set(card_sets.map(set => `<p>${set.set_name}</p>`))].join("")}</td>
      <td class="px-6 py-4">${checkValid(card_sets) ? "No" : "Yes"}</td>
      <td class="px-6 py-4">
        <p>Card Market: $${card_prices[0].cardmarket_price}</p>
        <p>TCGPlayer: $${card_prices[0].tcgplayer_price}</p>
        <p>eBay: $${card_prices[0].ebay_price}</p>
        <p>Amazon: $${card_prices[0].amazon_price}</p>
        <p>CoolStuffInc: $${card_prices[0].coolstuffinc_price}</p>
      </td>
    </tr>`).join("")}
        </tbody>
    </table>
</div>`
        list.innerHTML = inside
      })
  })
})()