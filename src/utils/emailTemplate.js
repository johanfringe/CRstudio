// 📁 src/utils/emailTemplate.js
export const emailTemplate = ({ logoSrc, logoAlt, title, intro, ctaUrl, ctaLabel, footer }) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${title}</title>

      <!-- ✅ Inter font (werkt in sommige clients) -->
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: white;">
      <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; padding: 32px;">

        <img src="${logoSrc}" alt="${logoAlt}" style="height: 30px; display: block; margin: 0 auto 48px;" />

        <h1 style="text-align: center; color: #111827; font-size: 20px; font-weight: 600; margin-bottom: 16px;">
          ${title}
        </h1>

        <p style="text-align: center; color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 32px;">
          ${intro}
        </p>

        <div style="text-align: center; margin-bottom: 32px;">
          <a href="${ctaUrl}" style="
            display: inline-block;
            padding: 10px 48px;
            border-radius: 9999px;
            background-color: #1D4ED8;
            color: white;
            font-weight: 500;
            text-decoration: none;
            font-size: 16px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          ">
            ${ctaLabel}
          </a>
        </div>

        <p style="text-align: center; color: #6B7280; font-size: 14px;">
          ${footer}
        </p>

      </div>
    </body>
    </html>
  `;
};
