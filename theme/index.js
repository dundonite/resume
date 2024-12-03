const fs = require('fs');
const path = require('path');
const { marked } = require('marked'); // Correct import for marked

// Function to dynamically load SVGs from the theme directory
const readSVG = (fileName) => {
  const svgPath = path.join(__dirname, fileName);
  try {
    return fs.readFileSync(svgPath, 'utf8').trim();
  } catch (err) {
    console.error(`Error loading SVG "${fileName}":`, err);
    return '';
  }
};

// Load SVG icons
const svgIcons = {
  location: readSVG('location.svg'),
  email: readSVG('email.svg'),
  telephone: readSVG('telephone.svg'),
  linkedin: readSVG('linkedin.svg'),
  github: readSVG('github.svg'),
  chess: readSVG('chess.svg'),
};

// Format ISO date to "Month Year"
const formatDate = (isoDate) => {
  if (!isoDate) return '';
  const [year, month] = isoDate.split('-');
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Render markdown as HTML
const renderMarkdown = (markdown) => {
  if (!markdown) return '';
  return marked(markdown.trim());
};

exports.render = ({ basics, work, skills, certificates, awards, languages, publications, education }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>${basics.name} - Resume</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
        font-family: 'Roboto', Arial, sans-serif;
        background: #fff;
        margin: 0;
        padding: 0;
    }

    .container {
        max-width: 800px;
        margin: 2em auto;
        padding: 0 20px;
    }

    h1 {
        font-size: 1.6rem;
        font-weight: bold;
        text-align: center;
    }

    h2 {
        font-size: 1.2rem;
        margin-top: 0.5em;
        border-bottom: 2px solid #ddd;
        padding-bottom: 5px;
    }

    h3 {
        font-size: 1rem;
        font-weight: bold;
    }

    p, li {
        font-size: 0.9em;
        line-height: 1.2;
        margin: 0 0 2px;
    }

    ul {
        list-style: none;
        padding-left: 18px;
    }

    ul li::before {
        content: '•';
        margin-right: 6px;
        color: #555;
    }

    .header {
        text-align: center;
        margin-bottom: 0.5em;
    }

    .contact-details {
        font-size: 0.9em;
        display: flex;
        flex-wrap: wrap;
        gap: 0.9em;
        justify-content: center;
        text-align: center;
    }

    .contact-item {
        white-space: nowrap;
        display: flex;
        align-items: center;
    }

    .contact-item svg {
        height: 0.9em;
        width: auto;
        margin-right: 0.5em;
    }

    .meta {
        font-style: italic;
        color: #555;
        font-size: 0.8em;
    }

    .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0.2em;
    }

    .entry-title {
        font-size: 1rem;
        font-weight: bold;
    }

    .entry-dates {
        font-size: 0.8em;
        font-style: italic;
        color: #555;
    }

    .entry-details {
        font-size: 0.9em;
        color: #333;
    }

    /* Default link styling */
    a {
        text-decoration: none;
        color: #007BFF; /* Blue color for links */
    }

    /* Override link styling for header tags */
    h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {
        color: inherit; /* Inherit the color of the header */
    }

    @media print {
        @page {
        margin: 0.5in;
        }
        .container {
        margin: 0 auto;
        padding: 0;
        }
    }
    </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>${basics.name}</h1>
      <div class="contact-details">
        <div class="contact-item">
          ${svgIcons.location}<span>${basics.location.city}, ${basics.location.region}, ${basics.location.countryCode}</span>
        </div>
        <div class="contact-item">
          ${svgIcons.email}<a href="mailto:${basics.email}">${basics.email}</a>
        </div>
        <div class="contact-item">
          ${svgIcons.telephone}<a href="tel:${basics.phone}">${basics.phone}</a>
        </div>
        ${basics.profiles?.map(profile => `
          <div class="contact-item">
            ${svgIcons[profile.network.toLowerCase()] || ''}<a href="${profile.url}" target="_blank">${profile.username}</a>
          </div>
        `).join('') || ''}
      </div>
    </header>

    ${work?.length ? `
        <section>
          <h2>Experience</h2>
          ${work.map(job => `
            <div class="entry-header">
              <div class="entry-title">${job.position} - ${job.name}</div>
              <div class="entry-dates">${formatDate(job.startDate)} — ${formatDate(job.endDate)}</div>
            </div>
            <p>${renderMarkdown(job.summary)}</p>
            ${job.highlights?.length ? `
              <ul>
                ${job.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
              </ul>
            ` : ''}
          `).join('')}
        </section>
      ` : ''}
      

    ${education?.length ? `
      <section>
        <h2>Education</h2>
        ${education.map(edu => `
          <div class="entry-header">
            <div class="entry-title">${edu.description}</div>
            <div class="entry-dates">${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}</div>
          </div>
          <p class="entry-details">${edu.studyType} in ${edu.area}</p>
        `).join('')}
      </section>
    ` : ''}

    ${certificates?.length ? `
      <section>
        <h2>Certificates</h2>
        ${certificates.map(cert => `
          <article>
            <div class="entry-header">
              <div class="entry-title">${cert.name}</div>
              <div class="entry-dates">${formatDate(cert.date)}</div>
            </div>
            <p class="meta">${cert.issuer}</p>
          </article>
        `).join('')}
      </section>
    ` : ''}

    ${awards?.length ? `
      <section>
        <h2>Awards</h2>
        ${awards.map(award => `
          <article>
            <div class="entry-header">
              <div class="entry-title">${award.title}</div>
              <div class="entry-dates">${formatDate(award.date)}</div>
            </div>
            <p class="meta">${award.awarder}</p>
            <p>${renderMarkdown(award.summary)}</p>
          </article>
        `).join('')}
      </section>
    ` : ''}

    ${publications?.length ? `
      <section>
        <h2>Publications</h2>
        ${publications.map(pub => `
          <article>
            <div class="entry-header">
              <div class="entry-title">${pub.name}</div>
              <div class="entry-dates">${formatDate(pub.releaseDate)}</div>
            </div>
            <p class="meta">${pub.publisher}</p>
            <p>${renderMarkdown(pub.summary)}</p>
            <a href="${pub.url}" target="_blank">Read more</a>
          </article>
        `).join('')}
      </section>
    ` : ''}

    ${skills?.length ? `
      <section>
        <h2>Skills</h2>
        ${skills.map(skill => `
          <article>
            <h3>${skill.name}</h3>
            <ul>${skill.keywords.map(keyword => `<li>${keyword}</li>`).join('')}</ul>
          </article>
        `).join('')}
      </section>
    ` : ''}

    ${languages?.length ? `
      <section>
        <h2>Languages</h2>
        <ul>${languages.map(lang => `<li>${lang.language} (${lang.fluency})</li>`).join('')}</ul>
      </section>
    ` : ''}
  </div>
</body>
</html>
`;
