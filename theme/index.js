
const fs = require('fs');
const path = require('path');

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
    linkedin: readSVG('linkedin.svg')
};
const formatDate = (isoDate) => {
  if (!isoDate) return ''; // Handle empty or undefined dates
  const [year, month] = isoDate.split('-');
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

exports.render = ({ basics, work, skills, certificates, awards, languages, publications }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>${basics.name} - Resume</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
    <style>
      /* Base styles for desktop */
      body {
          font-family: 'Roboto', Arial, sans-serif;
          background: #fff;
          margin: 0;
          padding: 0;
      }

      .container {
          max-width: 800px;
          margin: 20px auto;
          padding: 0 20px;
      }

      h1, h2, h3 {
          margin: 0 0 10px;
      }

      h1 {
          font-size: 1.6rem;
          font-weight: bold;
          text-align: center;
      }

      h2 {
          font-size: 1.2rem;
          margin-top: 25px;
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

      .header, .footer {
          text-align: center;
          margin-bottom: 15px;
      }

      .header a {
          text-decoration: none;
          color: #007BFF;
      }

          /* Ensure contact details are displayed inline and wrap gracefully */
    .contact-details {
        font-size: 1em;
        display: flex; /* Use flexbox for alignment */
        flex-wrap: wrap; /* Allow wrapping when necessary */
        gap: 1em; /* Add spacing between items */
        align-items: center; /* Vertically align items */
        justify-content: center;
        text-align: center;
    }

    .contact-item {
        white-space: nowrap; /* Prevent breaking within a single item */
        display: flex; /* Keep the icon and text together */
        align-items: center; /* Align icon with text baseline */
    }

    .contact-item svg {
        height: 1em; /* Match text height */
        width: auto; /* Maintain aspect ratio */
        vertical-align: middle; /* Align with text */
        margin-right: 0.5em; /* Add space between icon and text */
    }


      .summary {
          text-align: left;
          font-size: 0.9em;
          margin-top: 15px;
      }

      .meta {
          font-style: italic;
          color: #555;
          font-size: 0.7em;
      }

      .job {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 15px;
      }

      .job-title {
          font-size: 1rem;
          font-weight: bold;
      }

      .job-dates {
          font-size: 0.8em;
          font-style: italic;
          color: #555;
      }

      /* Ensure consistent SVG icon height and alignment */
      .icon {
          height: 1em; /* Match the height of the text */
          width: auto; /* Maintain aspect ratio */
          vertical-align: middle; /* Align with text baseline */
          margin-right: 0.5em; /* Add space between the icon and text */
      }
      
      .icon svg {
        height: 1em; /* Match the height of the text */
        width: auto; /* Maintain aspect ratio */
        vertical-align: middle; /* Align with text baseline */
    }

    /* Optional: Add spacing between the icon and text */
    .icon + span, .icon + a {
        margin-left: 0.5em; /* Space between icon and text */
    }

    /* Reset SVG intrinsic dimensions */
    .icon svg {
        max-height: 1em; /* Ensure maximum height matches text */
        max-width: none; /* Prevent unintended width restriction */
        display: inline-block; /* Ensure inline alignment */
    }

      /* Print-specific styles */
      @media print {
          @page {
              margin: 1in 0.75in;
          }
      }
    </style>

</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <header class="header">
            <h1>${basics.name}</h1>
            <p class="job-title">${basics.label}</p>
            <div class="contact-details">
                <div class="contact-item">
                    ${svgIcons.location}
                    <span>${basics.location.city}, ${basics.location.region}, ${basics.location.countryCode}</span>
                </div>
                <div class="contact-item">
                    ${svgIcons.email}
                    <a href="mailto:${basics.email}" alt="Email Address">${basics.email}</a>
                </div>
                <div class="contact-item">
                    ${svgIcons.telephone}
                    <a href="tel:${basics.phone}" alt="Phone Number">${basics.phone}</a>
                </div>
                ${basics.profiles.map(profile => `
                    <div class="contact-item">
                        ${svgIcons.linkedin}
                        <a href="${profile.url}" target="_blank" alt="LinkedIn Profile">${profile.network}: ${profile.username}</a>
                    </div>
                `).join('')}
            </div>
            <p class="summary">${basics.summary}</p>
        </header>

        <!-- Work Experience Section -->
        <section>
            <h2>Experience</h2>
            ${work.map(job => `
                <div class="job">
                    <div class="job-title">${job.position} - ${job.name}</div>
                    <div class="job-dates">${formatDate(job.startDate)} — ${formatDate(job.endDate)}</div>
                </div>
                <p>${job.summary}</p>
                <ul>
                    ${job.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
            `).join('')}
        </section>

        <!-- Skills Section -->
        <section>
            <h2>Skills</h2>
            ${skills.map(skill => `
                <article>
                    <h3>${skill.name}</h3>
                    <ul>
                        ${skill.keywords.map(keyword => `<li>${keyword}</li>`).join('')}
                    </ul>
                </article>
            `).join('')}
        </section>

        <!-- Certificates Section -->
        <section>
            <h2>Certificates</h2>
            ${certificates.map(cert => `
                <article>
                    <h3>${cert.name}</h3>
                    <p class="meta">${cert.date} (${cert.issuer})</p>
                </article>
            `).join('')}
        </section>

        <!-- Awards Section -->
        <section>
            <h2>Awards</h2>
            ${awards.map(award => `
                <article>
                    <h3>${award.title}</h3>
                    <p class="meta">${award.date} (${award.awarder})</p>
                    <p>${award.summary}</p>
                </article>
            `).join('')}
        </section>

        <!-- Languages Section -->
        <section>
            <h2>Languages</h2>
            <ul>
                ${languages.map(lang => `<li>${lang.language} (${lang.fluency})</li>`).join('')}
            </ul>
        </section>

        <!-- Publications Section -->
        <section>
            <h2>Publications</h2>
            ${publications.map(pub => `
                <article>
                    <h3>${pub.name}</h3>
                    <p class="meta">${pub.releaseDate} (${pub.publisher})</p>
                    <p>${pub.summary}</p>
                    <a href="${pub.url}" target="_blank">Read more</a>
                </article>
            `).join('')}
        </section>
        
    </div>

    <!-- Print Footer -->
    <footer class="print-footer"></footer>
</body>
</html>
`;
