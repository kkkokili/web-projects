// jshint esversion:6
// ✅ 用 HTTPS 代理避免 mixed content（任选其一）
const astroUrl =
  'https://api.allorigins.win/raw?url=http://api.open-notify.org/astros.json';
// 备选：const astroUrl = 'https://cors.isomorphic-git.org/http://api.open-notify.org/astros.json';

const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// ------------------------------------------
//  Event LISTENER
// ------------------------------------------
btn.addEventListener('click', trigger);

// ------------------------------------------
//  Fetch FUNCTIONS
// ------------------------------------------
async function trigger() {
  btn.textContent = 'Loading...';
  try {
    const data = await fetchData(astroUrl); // { number, people: [...] }
    const results = await Promise.all(
      data.people.map(async (item) => {
        const res = await fetch(wikiUrl + encodeURIComponent(item.name));
        const wiki = await res.json();
        return { wiki, craft: item.craft };
      }),
    );
    results.forEach(({ wiki, craft }) => generateHTML(wiki, craft));
  } catch (e) {
    console.error(e);
    peopleList.insertAdjacentHTML(
      'beforeend',
      `<p>Failed to load data: ${e}</p>`,
    );
  } finally {
    btn.remove();
  }
}

function fetchData(url) {
  return fetch(url).then((response) => {
    if (!response.ok) throw Error(response.status);
    return response.json();
  });
}

function generateHTML(data, craft) {
  const section = document.createElement('section');
  peopleList.appendChild(section);

  // 一些条目可能没有 thumbnail，做个兜底
  const thumb =
    data.thumbnail && data.thumbnail.source
      ? data.thumbnail.source
      : 'img/profile.jpg';

  if (data.type === 'standard') {
    section.innerHTML = `
      <img src="${thumb}" alt="${data.title}">
      <span>${craft}</span>
      <h2>${data.title}</h2>
      <p>${data.description || ''}</p>
      <p>${data.extract || ''}</p>
    `;
  } else {
    section.innerHTML = `
      <img src="img/profile.jpg" alt="fallback">
      <h2>${data.title}</h2>
      <p>Results unavailable for ${data.title}</p>
      ${data.extract_html || ''}
    `;
  }
}
