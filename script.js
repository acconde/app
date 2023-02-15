const searchInput = document.getElementById('search');
const row1 = document.getElementById('row1');
const row2 = document.getElementById('row2');
const row3 = document.getElementById('row3');
const icons = document.getElementById('icons');
const notification = document.getElementById('notification');

let page = 1;

async function getRates() {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Ccardano%2Cbinancecoin%2Cripple%2Csolana%2Cdogecoin%2Cpolkadot%2Cshiba-inu%2Cavalanche&vs_currencies=usd&include_24hr_change=true`);
    const data = await response.json();
    displayRates(data);
  } catch (error) {
    console.error(error);
  }
}

function displayRates(rates) {
  if (Object.keys(rates).length === 0) {
    notification.textContent = 'No more records to show';
  } else {
    for (let i = 0; i < Object.keys(rates).length; i++) {
      const card = document.createElement('div');
      card.classList.add('card');

      const icon = document.createElement('img');
      icon.src = `https://cryptoicons.org/api/color/${Object.keys(rates)[i]}/200`;

      const name = document.createElement('h2');
      name.textContent = Object.keys(rates)[i];

      const price = document.createElement('p');
      price.textContent = `Price: ${rates[Object.keys(rates)[i]].usd} USD`;

      const change = document.createElement('p');
      change.textContent = `24h Change: ${rates[Object.keys(rates)[i]].usd_24h_change.toFixed(2)}%`;

      card.appendChild(icon);
      card.appendChild(name);
      card.appendChild(price);
      card.appendChild(change);

      if (i < 3) {
        icons.appendChild(icon);
      }

      if (i >= 3 && i < 6) {
        row1.appendChild(card);
      } else if (i >= 6 && i < 9) {
        row2.appendChild(card);
      } else {
        row3.appendChild(card);
      }
    }
  }
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const name = card.querySelector('h2').textContent.toLowerCase();
    if (name.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});

window.addEventListener('load', () => {
  notification.textContent = 'Loading data...';
  getRates();
});

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    page++;
    notification.textContent = 'Loading more data...';
    getRates();
  }
});
