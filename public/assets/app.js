document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('randomBtn');
  const article = document.getElementById('article');
  const overlay = document.querySelector('.page__overlay');

  const templates = {
    skeleton: `
      <div class="skeleton">
        <div class="skeleton__title"></div>
        <div class="skeleton__text"></div>
        <div class="skeleton__text"></div>
      </div>
    `,
    error: (msg) => `<p class="error">Error: ${msg}</p>`,
    article: (data) => `
      <h1 class="article__title">${data.title}</h2>
      <p class="article__extract">${data.extract}</p>
      <a class="article__link" href="${
        data.content_urls?.desktop?.page || '#'
      }" target="_blank">
        Read full article →
      </a>
    `,
  };

  const renderSkeleton = () => {
    article.innerHTML = templates.skeleton;
  };

  const renderArticle = (data) => {
    article.innerHTML = templates.article(data);
  };

  const renderError = (msg = 'Unknown error') => {
    article.innerHTML = templates.error(msg);
  };

  const updateOverlay = (thumbnail) => {
    overlay.style.opacity = '0';

    setTimeout(() => {
      overlay.style.backgroundImage = thumbnail?.source
        ? `url(${thumbnail.source})`
        : '';
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });
    }, 300);
  };

  const loadArticle = async () => {
    btn.disabled = true;
    renderSkeleton();

    try {
      const res = await fetch('api.php');

      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      updateOverlay(data.thumbnail);
      renderArticle(data);
    } catch (e) {
      renderError(e.message);
    } finally {
      btn.disabled = false;
    }
  };

  loadArticle();

  btn.addEventListener('click', loadArticle);
});
