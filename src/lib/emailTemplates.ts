export function getEmailWrapper(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | Zain's Serenity</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          margin: 0; padding: 0; background-color: #f8fafc;
          -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;
        }
        table { border-collapse: collapse; }
        img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        a { color: #0f766e; text-decoration: none; }
        body, table, td, p, a, h1, h2, h3, span, div {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        
        .email-wrapper {
          max-width: 580px;
          margin: 30px auto;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03);
        }

        .email-header {
          background-image: url('https://odtdyudkgkwcruoseujv.supabase.co/storage/v1/object/sign/gallery/email-header.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82ZTVkNjVjNi1lYWMwLTRiNWQtYTc0MS04NjNhNWVkODRkZGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnYWxsZXJ5L2VtYWlsLWhlYWRlci5qcGciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg2ODIzNDU0LCJleHAiOjIxMDIxODM0NTR9.2-E31J79mukxPuXBvxJrfpnMnEKs9rGx3h1vljpl5bo');
          background-size: cover;
          background-position: center;
          padding: 60px 36px 50px;
          text-align: center;
          position: relative;
          border-bottom: 4px solid #f0fdfa;
        }
        .email-header::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 118, 110, 0.4);
          z-index: 0;
        }
        .email-header h1,
        .email-header p {
          position: relative;
          z-index: 1;
          color: #ffffff;
        }
        .email-header h1 {
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.8px;
          line-height: 1.1;
          margin: 0;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .email-header p {
          margin: 10px 0 0;
          font-size: 17px;
          font-weight: 500;
          opacity: 0.95;
          text-shadow: 0 1px 4px rgba(0,0,0,0.2);
        }

        .email-body {
          padding: 50px 40px;
          background-color: #ffffff;
        }
        .email-body h2 {
          color: #1e293b;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
          margin: 0 0 20px;
          line-height: 1.25;
        }
        .email-body p {
          color: #475569;
          font-size: 17px;
          line-height: 1.75;
          margin: 0 0 24px;
        }
        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, #e2e8f0 0%, #cbd5e1 50%, #e2e8f0 100%);
          margin: 36px 0 32px;
        }
        .highlight-box {
          background: #f0fdfa;
          border-left: 4px solid #0d9488;
          border-radius: 0 12px 12px 0;
          padding: 20px 24px;
          margin: 24px 0;
        }
        .highlight-box p {
          margin: 0;
          color: #0f766e;
          font-weight: 500;
        }

        .email-button {
          display: inline-block;
          background: #0d9488;
          color: #ffffff !important;
          text-decoration: none;
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 0.3px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(13, 148, 136, 0.35);
          margin: 12px 0 28px;
          transition: all 0.2s ease;
          border: none;
        }
        .email-button:hover {
          background: #0f766e;
          box-shadow: 0 14px 32px rgba(13, 148, 136, 0.45);
          transform: translateY(-1px);
        }
        .email-button-outline {
          display: inline-block;
          background: transparent;
          color: #0f766e !important;
          text-decoration: none;
          padding: 14px 36px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 16px;
          border: 2px solid #0d9488;
          margin: 8px 8px 24px 0;
          transition: all 0.2s ease;
        }
        .email-button-outline:hover {
          background: #0d9488;
          color: #ffffff !important;
        }

        .email-footer {
          background-color: #1e293b;
          padding: 36px 40px;
          text-align: center;
          color: #cbd5e1;
          border-top: 1px solid #334155;
        }
        .email-footer p {
          font-size: 14px;
          line-height: 1.7;
          margin: 0 0 8px;
          color: #94a3b8;
        }
        .email-footer a {
          color: #5eead4;
          font-weight: 600;
          text-decoration: none;
        }
        .footer-copyright {
          font-size: 13px;
          color: #64748b;
          margin-top: 20px;
        }

        @media only screen and (max-width: 600px) {
          .email-wrapper {
            margin: 12px auto;
            border-radius: 18px;
          }
          .email-header {
            padding: 40px 24px 36px;
          }
          .email-header h1 {
            font-size: 32px;
          }
          .email-header p {
            font-size: 15px;
          }
          .email-body {
            padding: 36px 24px;
          }
          .email-body h2 {
            font-size: 24px;
          }
          .email-body p {
            font-size: 16px;
          }
          .email-button {
            padding: 14px 32px;
            font-size: 16px;
          }
          .email-footer {
            padding: 28px 24px;
          }
        }
      </style>
    </head>
    <body style="margin:0; padding:0; background-color:#f8fafc;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding: 30px 20px 50px;">
            <div class="email-wrapper">
              <div class="email-header">
                <h1>Zain's Serenity</h1>
                <p>Your Coastal Sanctuary</p>
              </div>
              <div class="email-body">
                <h2>${title}</h2>
                <div>
                  ${content}
                </div>
              </div>
              <div class="email-footer">
                <p style="font-size:16px; font-weight:600; color:#e2e8f0; margin-bottom:8px;">Zain's Serenity</p>
                <p>
                  Coastal Road, Crystal Cove<br>
                  Grand Gaube, Mauritius<br>
                  <a href="mailto:reservations@zainsserenity.com">reservations@zainsserenity.com</a>
                </p>
                <p class="footer-copyright">
                  &copy; ${new Date().getFullYear()} Zain's Serenity. All rights reserved.
                </p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function styledButton(href: string, text: string): string {
  return `<a href="${href}" class="email-button">${text}</a>`;
}

export function styledOutlineButton(href: string, text: string): string {
  return `<a href="${href}" class="email-button-outline">${text}</a>`;
}

export function styledHighlightBox(text: string): string {
  return `<div class="highlight-box"><p>${text}</p></div>`;
}

export function styledDivider(): string {
  return `<div class="divider"></div>`;
}

// ✅ New: Welcome email for newly created/verified accounts
export function welcomeNewAccountEmail(name: string, loginUrl: string) {
  return getEmailWrapper(
    "Your Account is Ready!",
    `
      <p>Hi ${name},</p>
      <p>Thank you for joining <strong>Zain’s Serenity</strong>. Your account has been successfully created and verified. You are now ready to explore our peaceful retreat and make bookings.</p>
      ${styledHighlightBox("Start your journey with us – book your first stay today!")}
      ${styledButton(loginUrl, "Go to Your Account")}
      ${styledDivider()}
      <p style="font-size:14px; color:#64748b;">If you have any questions, feel free to reach out to our support team.</p>
    `
  );
}

// ✅ New: Welcome back email for returning logins
export function welcomeBackEmail(name: string, loginUrl: string) {
  return getEmailWrapper(
    "Welcome Back!",
    `
      <p>Hi ${name},</p>
      <p>We noticed a new sign‑in to your <strong>Zain’s Serenity</strong> account. If this was you, you're all set – enjoy exploring our latest offers and managing your bookings.</p>
      ${styledHighlightBox("Glad to have you back!")}
      ${styledButton(loginUrl, "View My Bookings")}
      ${styledDivider()}
      <p style="font-size:14px; color:#64748b;">If this wasn't you, please reset your password immediately or contact our support.</p>
    `
  );
}