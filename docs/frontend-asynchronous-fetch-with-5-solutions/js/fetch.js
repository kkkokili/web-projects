// 本地静态数据（Actions 会定时更新）
const ASTRO_LOCAL = './data/astros.json';
const WIKI_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

async function trigger() {
  btn.textContent = 'Loading...';
  try {
    const data = await fetch(ASTRO_LOCAL).then((r) => r.json());
    const results = await Promise.all(
      data.people.map(async (p) => {
        const res = await fetch(WIKI_SUMMARY + encodeURIComponent(p.name));
        const wiki = await res.json();
        return { wiki, craft: p.craft };
      }),
    );
    results.forEach(({ wiki, craft }) => generateHTML(wiki, craft));
  } catch (e) {
    peopleList.insertAdjacentHTML(
      'beforeend',
      `<p>Failed to load data: ${e}</p>`,
    );
  } finally {
    btn.remove();
  }
}
