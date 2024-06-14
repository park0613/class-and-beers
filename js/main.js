(() => {
  navigator.serviceWorker.register('../sw.js');
  getData();
  addListeners();
  document.body.style.userSelect = 'none';
  document.body.style.msUserSelect = 'none';
  document.body.style.mozUserSelect = 'none';
  document.body.oncopy = (e) => {
      e.preventDefault();
  };
})();

function getData() {
  //fetch some data then add it to #datalist on the page.
  let url = 'https://random-data-api.com/api/v2/beers?size=6';
  fetch(url)
    .then((resp) => {
      if (!resp.ok) throw new Error('Failed to fetch data');
      return resp.json();
    })
    .then((data) => {
      let html = data
        .map(({ uid, name, style, alcohol }) => {
          return `<li data-ref="${uid}">
          <h3>${name} <br> ${style}</h3>
          <p>${alcohol}</p>
        </li>`;
        })
        .join('');
      document.getElementById('datalist').innerHTML = html;
    });
}

function addListeners() {
  document.querySelector('main h2').addEventListener('click', (ev) => {
    getData();
  });
}

const dateElement = document.getElementById('date');
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const today = new Date().toLocaleDateString('en-US', options);
dateElement.textContent = today;