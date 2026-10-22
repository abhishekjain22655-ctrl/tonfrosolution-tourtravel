import nodemailer from 'nodemailer';
import { CustomerEnquiry } from '@/types/travel';
import { agencyConfig } from '@/config/agency';

/**
 * Configure Nodemailer transport
 * Supports Gmail SMTP (App Password) or custom SMTP host/port
 */
function getEmailTransporter() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  // If host is explicitly provided, use custom SMTP server
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });
  }

  // Default to standard Gmail service
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

/**
 * Send an instant email notification to the Admin when a customer submits an enquiry
 */
export async function sendAdminEnquiryNotification(enquiry: CustomerEnquiry | any): Promise<{ sent: boolean; message: string }> {
  try {
    const transporter = getEmailTransporter();
    const adminEmail = process.env.NOTIFICATION_EMAIL || agencyConfig.contact.email;

    if (!transporter) {
      console.log('ℹ️ [EMAIL] SMTP credentials (SMTP_USER, SMTP_PASS) not configured in .env.local. Skipping email dispatch.');
      return {
        sent: false,
        message: 'SMTP credentials not configured in environment variables.',
      };
    }

    const cleanPhoneDigits = (enquiry.phone || '').replace(/\D/g, '');
    const whatsappLink = cleanPhoneDigits ? `https://wa.me/${cleanPhoneDigits.length === 10 ? '91' + cleanPhoneDigits : cleanPhoneDigits}` : '';
    const phoneCallLink = enquiry.phone ? `tel:${enquiry.phone.replace(/\s+/g, '')}` : '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Travel Enquiry</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #1E293B; }
          .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
          .header { background: linear-gradient(135deg, #0F1E20 0%, #154D4F 100%); color: #ffffff; padding: 32px 28px; text-align: center; }
          .header h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(197, 139, 62, 0.25); border: 1px solid #C58B3E; color: #F8E3C2; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
          .content { padding: 32px 28px; }
          .lead-box { background: #FAF8F5; border: 1px solid #E8E3DA; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #EFEAE1; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .label { color: #64748B; font-weight: 600; width: 40%; }
          .value { color: #0F172A; font-weight: 700; width: 60%; text-align: right; word-break: break-word; }
          .actions { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
          .btn-wa { display: inline-block; flex: 1; min-width: 140px; padding: 12px 18px; background-color: #059669; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; text-align: center; }
          .btn-call { display: inline-block; flex: 1; min-width: 140px; padding: 12px 18px; background-color: #C25E34; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 13px; text-align: center; }
          .footer { background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 28px; text-align: center; font-size: 12px; color: #94A3B8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">🔔 New Enquiry Alert</span>
            <h1 style="margin-top: 12px;">${agencyConfig.companyName}</h1>
            <p style="margin: 0; font-size: 13px; color: #CBD5E1;">A customer has submitted a new holiday enquiry</p>
          </div>

          <div class="content">
            <div class="lead-box">
              <div class="row">
                <span class="label">Customer Name</span>
                <span class="value">${enquiry.fullName}</span>
              </div>
              <div class="row">
                <span class="label">Phone Number</span>
                <span class="value">${enquiry.phone}</span>
              </div>
              ${enquiry.email ? `
              <div class="row">
                <span class="label">Email Address</span>
                <span class="value"><a href="mailto:${enquiry.email}" style="color: #154D4F;">${enquiry.email}</a></span>
              </div>` : ''}
              <div class="row">
                <span class="label">Destination</span>
                <span class="value" style="color: #C25E34;">${enquiry.destinationPreference}</span>
              </div>
              <div class="row">
                <span class="label">Trip Region</span>
                <span class="value" style="text-transform: capitalize;">${enquiry.tripType || 'Domestic'}</span>
              </div>
              ${enquiry.departureCity ? `
              <div class="row">
                <span class="label">Departure City</span>
                <span class="value">${enquiry.departureCity}</span>
              </div>` : ''}
              ${enquiry.travelDateApprox ? `
              <div class="row">
                <span class="label">Travel Dates</span>
                <span class="value">${enquiry.travelDateApprox}</span>
              </div>` : ''}
              <div class="row">
                <span class="label">Guests</span>
                <span class="value">${enquiry.adultsCount || 2} Adults ${enquiry.childrenCount ? `, ${enquiry.childrenCount} Children` : ''}</span>
              </div>
              ${enquiry.approxBudgetINR ? `
              <div class="row">
                <span class="label">Approx Budget</span>
                <span class="value">${enquiry.approxBudgetINR}</span>
              </div>` : ''}
              ${enquiry.originPackageTitle ? `
              <div class="row">
                <span class="label">Selected Package</span>
                <span class="value">${enquiry.originPackageTitle}</span>
              </div>` : ''}
            </div>

            ${enquiry.additionalNotes ? `
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; padding: 14px 18px; border-radius: 10px; margin-bottom: 24px;">
              <strong style="display: block; font-size: 12px; color: #92400E; margin-bottom: 4px; text-transform: uppercase;">Customer Special Requests:</strong>
              <p style="margin: 0; font-size: 13px; color: #78350F; line-height: 1.5;">${enquiry.additionalNotes}</p>
            </div>` : ''}

            <div class="actions">
              ${whatsappLink ? `<a href="${whatsappLink}" class="btn-wa">Chat on WhatsApp</a>` : ''}
              ${phoneCallLink ? `<a href="${phoneCallLink}" class="btn-call">Call Customer</a>` : ''}
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0;">Sent automatically from your website booking engine.</p>
            <p style="margin: 4px 0 0 0;">${agencyConfig.companyName} • ${agencyConfig.contact.officeAddress.city}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"${agencyConfig.companyName}" <${process.env.SMTP_USER || agencyConfig.contact.email}>`,
      to: adminEmail,
      subject: `🛎️ New Travel Enquiry: ${enquiry.fullName} (${enquiry.destinationPreference})`,
      html: htmlContent,
      replyTo: enquiry.email || undefined,
    });

    console.log('✅ [EMAIL] Admin notification sent successfully:', info.messageId);
    return { sent: true, message: `Notification sent to ${adminEmail}` };
  } catch (err: any) {
    console.error('❌ [EMAIL] Failed to send admin email notification:', err?.message || err);
    return { sent: false, message: err?.message || 'Email delivery failed' };
  }
}
