// jshint esversion:8
const astrosUrl = './data/astros.json'; // ← 本地静态文件
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

async function decode() {
  try {
    const resp = await fetch(astrosUrl);
    if (!resp.ok) throw new Error(`fetch ${astrosUrl} ${resp.status}`);
    const data = await resp.json();

    await Promise.all(
      (data.people || []).map(async (item) => {
        const res = await fetch(wikiUrl + encodeURIComponent(item.name));
        const wiki = await res.json();
        generateHTML(wiki, item.craft);
      }),
    );
  } catch (error) {
    console.error(error);
    peopleList.insertAdjacentHTML(
      'beforeend',
      `<p>Failed to load: ${error}</p>`,
    );
  }
}

function generateHTML(data, craft) {
  const section = document.createElement('section');
  peopleList.appendChild(section);
  const thumb =
    (data && data.thumbnail && data.thumbnail.source) || 'img/profile.jpg';
  if (data.type === 'standard') {
    section.innerHTML = `
      <img src="${thumb}" alt="${data.title}">
      <span>${craft || ''}</span>
      <h2>${data.title || ''}</h2>
      <p>${data.description || ''}</p>
      <p>${data.extract || ''}</p>
    `;
  } else {
    section.innerHTML = `
      <img src="img/profile.jpg" alt="fallback">
      <h2>${data?.title || ''}</h2>
      <p>Results unavailable for ${data?.title || ''}</p>
      ${data?.extract_html || ''}
    `;
  }
}

btn.addEventListener('click', (e) => {
  e.target.textContent = 'Loading...';
  decode().finally(() => btn.remove());
});
