const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

function wrap(content: string, orgName = 'OpenGood'): string {
  return `
    <div style="${baseStyle}">
      ${content}
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center;">
        ${orgName} &mdash; Making a difference in our community
      </p>
    </div>
  `;
}

export function contactConfirmationEmail(name: string, orgName?: string): string {
  return wrap(`
    <h2 style="color: #0f172a;">Thank you for reaching out!</h2>
    <p>Hi ${name},</p>
    <p>We have received your message and will get back to you as soon as possible.</p>
    <p>Best regards,<br/>The ${orgName || 'OpenGood'} Team</p>
  `, orgName);
}

export function volunteerWelcomeEmail(
  name: string,
  interests: string[],
  orgName?: string,
): string {
  return wrap(`
    <h2 style="color: #0f172a;">Welcome aboard!</h2>
    <p>Hi ${name},</p>
    <p>Thank you for signing up as a volunteer! We've received your application and a member of our team will be in touch soon.</p>
    ${interests.length > 0 ? `<p><strong>Your interests:</strong> ${interests.join(', ')}</p>` : ''}
    <p>We're excited to have you on the team!</p>
    <p>Best regards,<br/>The ${orgName || 'OpenGood'} Team</p>
  `, orgName);
}

export function eventRegistrationEmail(
  name: string,
  eventTitle: string,
  eventDate: string,
  eventLocation: string,
  headcount: number,
  virtualLink?: string | null,
  orgName?: string,
): string {
  return wrap(`
    <h2 style="color: #0f172a;">You're registered!</h2>
    <p>Hi ${name},</p>
    <p>Your registration for <strong>${eventTitle}</strong> has been confirmed.</p>
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 100px;">Date:</td>
        <td style="padding: 8px 0;">${eventDate}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Location:</td>
        <td style="padding: 8px 0;">${eventLocation}</td>
      </tr>
      ${virtualLink ? `
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Join Online:</td>
        <td style="padding: 8px 0;"><a href="${virtualLink}">${virtualLink}</a></td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Guests:</td>
        <td style="padding: 8px 0;">${headcount}</td>
      </tr>
    </table>
    <p>We look forward to seeing you there!</p>
    <p>Best regards,<br/>The ${orgName || 'OpenGood'} Team</p>
  `, orgName);
}

export function donationReceiptEmail(
  donorName: string | null,
  amount: string,
  isRecurring: boolean,
  message?: string | null,
  orgName?: string,
): string {
  const name = donorName || 'Generous Donor';
  return wrap(`
    <h2 style="color: #0f172a;">Thank you for your donation!</h2>
    <p>Hi ${name},</p>
    <p>Your ${isRecurring ? 'monthly ' : ''}donation of <strong>${amount}</strong> has been received.</p>
    ${message ? `<p><em>"${message}"</em></p>` : ''}
    <p>Your generosity makes a real difference in our community. This email serves as your donation receipt.</p>
    <p>With gratitude,<br/>The ${orgName || 'OpenGood'} Team</p>
  `, orgName);
}
