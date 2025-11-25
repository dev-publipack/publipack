interface EmailData {
  to: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  from?: string;
  fromName?: string;
  fullName?: string;
}

interface BrevoEmailResponse {
  messageId: string;
}

class BrevoClient {
  private webhookUrl: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.webhookUrl = import.meta.env.VITE_PIPEDREAM_EMAIL_WEBHOOK ?? "";
    this.fromEmail = import.meta.env.VITE_BREVO_FROM_EMAIL ?? "";
    this.fromName = import.meta.env.VITE_BREVO_FROM_NAME ?? "Publipack";
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    if (!this.webhookUrl) {
      console.error("❌ Pipedream email webhook not configured");
      return false;
    }

    const fromEmail = data.from || this.fromEmail;
    if (!fromEmail) {
      console.error("❌ Sender email not configured");
      return false;
    }

    const payload = {
      to: data.to,
      subject: data.subject,
      ...(data.htmlContent && { htmlContent: data.htmlContent }),
      ...(data.textContent && { textContent: data.textContent }),
      ...(data.fullName && { fullName: data.fullName }),
      from: fromEmail,
      fromName: data.fromName || this.fromName,
    };

    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = errorText;
        }
        console.error("❌ Email sending failed:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      return false;
    }
  }

}
export const brevoClient = new BrevoClient();
export type { EmailData, BrevoEmailResponse };

