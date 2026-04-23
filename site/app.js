const [meta, chapters, progressLog] = await Promise.all([
  fetch('./data/site-metadata.json').then((r) => r.json()),
  fetch('./data/chapters.json').then((r) => r.json()),
  fetch('./data/progress-log.json').then((r) => r.json()),
]);

const byNewest = [...chapters].sort((a, b) => b.date.localeCompare(a.date));
const latest = byNewest[0];
const progressEntries = [...(progressLog.entries || [])].sort((a, b) => b.date.localeCompare(a.date));
const latestProgress = progressEntries[0];

document.getElementById('site-title').textContent = meta.title;
document.getElementById('site-subtitle').textContent = meta.description;
document.getElementById('hero-quote').textContent = meta.heroQuote;
document.getElementById('chapter-count').textContent = `${meta.chapterCount} 篇章节`;
document.getElementById('updated-at').textContent = `最后更新：${meta.updatedAt}`;
document.getElementById('progress-count').textContent = `${meta.progressLogCount || progressEntries.length} 条真实选择记录`;

document.getElementById('review-prompts').innerHTML = `
  <h4>${latest.review.question}</h4>
  <ul>${latest.review.prompts.map((item) => `<li>${item}</li>`).join('')}</ul>
`;

const list = document.getElementById('chapter-list');
const dialog = document.getElementById('chapter-dialog');
const dialogContent = document.getElementById('dialog-content');
const progressTimeline = document.getElementById('progress-timeline');
const latestProgressPanel = document.getElementById('latest-progress');

function renderChoice(choice) {
  return `
    <div class="choice">
      <div><span class="choice-label">${choice.label}.</span><span class="choice-title">${choice.title}</span></div>
      <div class="choice-action">${choice.action}</div>
      <div class="choice-details">details：${choice.details}</div>
    </div>
  `;
}

function renderCard(chapter) {
  const article = document.createElement('article');
  article.className = 'chapter-card';
  article.innerHTML = `
    <div class="chapter-meta"><span>${chapter.date}</span><span>${chapter.scene}</span></div>
    <h3>${chapter.title}</h3>
    <p>${chapter.summary}</p>
    <div class="choice-grid">${chapter.choices.map(renderChoice).join('')}</div>
    <button class="primary-button read-more">查看剧情与复盘</button>
  `;
  article.querySelector('.read-more').addEventListener('click', () => openDialog(chapter));
  return article;
}

function openDialog(chapter) {
  dialogContent.innerHTML = `
    <header class="dialog-header">
      <div class="chapter-meta"><span>${chapter.date}</span><span>${chapter.scene}</span></div>
      <h2>${chapter.title}</h2>
      <p class="scene-copy">${chapter.summary}</p>
    </header>
    <section>
      <p class="body-copy">${chapter.body}</p>
      <div class="choice-grid">${chapter.choices.map(renderChoice).join('')}</div>
      <div class="review-box">
        <p class="section-kicker">复盘</p>
        <h3>${chapter.review.question}</h3>
        <ul>${chapter.review.prompts.map((item) => `<li>${item}</li>`).join('')}</ul>
      </div>
    </section>
  `;
  dialog.showModal();
}

function renderProgressEntry(entry, prominent = false) {
  const article = document.createElement('article');
  article.className = prominent ? 'progress-entry progress-entry-prominent' : 'progress-entry';
  article.innerHTML = `
    <div class="chapter-meta"><span>${entry.date}</span><span class="progress-badge">实际选择 ${entry.choice}</span><span>${entry.choiceTitle}</span></div>
    <h3>${entry.actualAction}</h3>
    <p class="progress-details">${entry.details}</p>
    <p class="body-copy">${entry.narration}</p>
    <div class="review-box">
      <p class="section-kicker">今晚复盘</p>
      <ul>${entry.review.map((item) => `<li>${item}</li>`).join('')}</ul>
    </div>
  `;
  return article;
}

if (latestProgress) {
  latestProgressPanel.appendChild(renderProgressEntry(latestProgress, true));
}

progressEntries.forEach((entry) => progressTimeline.appendChild(renderProgressEntry(entry)));

dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const inside = rect.top <= event.clientY && event.clientY <= rect.bottom && rect.left <= event.clientX && event.clientX <= rect.right;
  if (!inside) dialog.close();
});

document.getElementById('latest-button').addEventListener('click', () => openDialog(latest));
byNewest.forEach((chapter) => list.appendChild(renderCard(chapter)));
