const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';

let page = 1;
let loading = false;
let end = false;
let searchQuery = '';

const cardContainer = document.getElementById('card-container');
const loadingIndicator = document.getElementById('loading');
const endIndicator = document.getElementById('end');
const errorIndicator = document.getElementById('error');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const image = document.createElement('img');



async function loadMore() {
  if (loading || end) {
    return;
  }

  loading = true;
  loadingIndicator.style.display = 'block';

  let url = `${apiUrl}&page=${page}`;

  if (searchQuery) {
    const searchUrl = `https://api.coingecko.com/api/v3/coins/list?include_platform=false`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    const filteredData = data.filter(coin => coin.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filteredData.length === 0) {
      loadingIndicator.style.display = 'none';
      errorIndicator.style.display = 'block';
      return;
    }

    url += `&ids=${filteredData.map(coin => coin.id).join(',')}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      loading = false;
      loadingIndicator.style.display = 'none';

      if (data.length === 0) {
        if (searchQuery) {
          errorIndicator.style.display = 'block';
        } else {
          end = true;
          endIndicator.style.display = 'block';
        }
        return;
      }

      for (const item of data) {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3');
        card.style.maxWidth = '540px';
        const row = document.createElement('div');
        row.classList.add('row', 'g-0');
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('col-md-4');
        const image = document.createElement('img');
        image.src = item.image;
        image.classList.add('img-fluid', 'rounded-start', 'card-image');
        image.alt = `${item.name} logo`;
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('col-md-8');
        const content = document.createElement('div');
        content.classList.add('card-body');
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = `Crypto Title: ${item.name}`;
        const rate = document.createElement('div');
        rate.classList.add('card-rate-label');
        rate.textContent = `Rate: ${item.current_price} USD`;
        const unit = document.createElement('div');
        unit.classList.add('card-unit');
        unit.textContent = `Crypto Unit: ${item.symbol.toUpperCase()}`;

        imageWrapper.appendChild(image);
        content.appendChild(rate);
        content.appendChild(title);
        content.appendChild(unit);
        contentWrapper.appendChild(content);
        row.appendChild(imageWrapper);
        row.appendChild(contentWrapper);
        card.appendChild(row);
        cardContainer.appendChild(card);
      }

      page++;
    })
    .catch(() => {
      loading = false;
      loadingIndicator.style.display = 'none';
      errorIndicator.style.display = 'block';
    });
}


function search() {
  page = 1;
  end = false;
  errorIndicator.style.display = 'none';
  cardContainer.innerHTML = '';
  searchQuery = searchInput.value.trim();
  loadMore();
}


searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    search();
  }
});

searchButton.addEventListener('click', search);

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    loadMore();
  }
});

loadMore();


