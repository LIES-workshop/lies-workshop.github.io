const ICONS = {
  'X':             `<i class="fa-brands fa-x-twitter" aria-label="X"></i>`,
  'Bluesky':       `<i class="fa-brands fa-bluesky" aria-label="Bluesky"></i>`,
  'Google Scholar':`<i class="ai ai-google-scholar-square" aria-label="Google Scholar"></i>`,
};

const EXT_LINK = 'target="_blank" rel="noopener noreferrer"';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

async function loadEditions() {
  const tbody = document.getElementById('editions-tbody');
  try {
    const { editions } = await fetchJSON('data/editions.json');
    tbody.innerHTML = editions.map(e => `
      <tr${e.url ? ` data-url="${e.url}" title="Go to ${e.year} edition"` : ''}>
        <td>${e.url ? `<a href="${e.url}" class="row-link" ${EXT_LINK} aria-label="Go to ${e.year} edition"></a>` : ''}${e.year}</td>
        <td>${e.conference}</td>
        <td>${e.location}</td>
      </tr>`).join('');
    tbody.querySelectorAll('tr[data-url]').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest('a')) return;
        window.open(row.dataset.url, '_blank', 'noopener,noreferrer');
      });
    });
  } catch {
    tbody.innerHTML = '<tr><td colspan="3" class="data-error">Could not load editions.</td></tr>';
  }
}

async function loadOrganizers() {
  const list = document.getElementById('org-list');
  try {
    const { organizers } = await fetchJSON('data/organizers.json');
    list.innerHTML = organizers.map(org => {
      const nameHtml = org.website
        ? `<a href="${org.website}" class="org-name" ${EXT_LINK}>${org.name}</a>`
        : `<span class="org-name">${org.name}</span>`;
      const iconsHtml = org.links
        .filter(l => ICONS[l.label] && l.url)
        .map(l => `<a href="${l.url}" class="org-icon" ${EXT_LINK} title="${l.label}">${ICONS[l.label]}</a>`)
        .join('');
      return `<li class="org-item">
        <div class="org-info">
          ${nameHtml}
          <span class="org-affil">${org.affiliation}</span>
        </div>
        ${iconsHtml ? `<span class="org-icons">${iconsHtml}</span>` : ''}
      </li>`;
    }).join('');
  } catch {
    list.innerHTML = '<li class="data-error">Could not load organizer data.</li>';
  }
}

Promise.all([loadEditions(), loadOrganizers()]).catch(console.error);
