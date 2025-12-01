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
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;
  private readonly apiBaseUrl = "https://api.brevo.com/v3";

  constructor() {
    this.apiKey = import.meta.env.VITE_BREVO_API_KEY ?? "";
    this.fromEmail = import.meta.env.VITE_BREVO_FROM_EMAIL ?? "";
    this.fromName = import.meta.env.VITE_BREVO_FROM_NAME ?? "Publipack";
  }

  async sendEmail(data: EmailData): Promise<BrevoEmailResponse | null> {
    if (!this.apiKey) {
      console.error("❌ Brevo API key not configured");
      console.error("💡 Set VITE_BREVO_API_KEY in environment variables");
      return null;
    }

    const fromEmail = data.from || this.fromEmail;
    if (!fromEmail) {
      console.error("❌ Sender email not configured");
      console.error("💡 Set VITE_BREVO_FROM_EMAIL in environment variables");
      return null;
    }

    // Prepare recipient with optional name
    const toRecipient: { email: string; name?: string } = {
      email: data.to,
    };
    if (data.fullName) {
      toRecipient.name = data.fullName;
    }

    const payload = {
      sender: {
        name: data.fromName || this.fromName,
        email: fromEmail,
      },
      to: [toRecipient],
      subject: data.subject,
      htmlContent: data.htmlContent || "",
      textContent: data.textContent || data.htmlContent?.replace(/<[^>]*>/g, "").trim() || "",
    };

    console.log("📧 BrevoClient.sendEmail called", {
      to: data.to,
      from: fromEmail,
      fromName: data.fromName || this.fromName,
      subject: data.subject,
    });

    try {
      const response = await fetch(`${this.apiBaseUrl}/smtp/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Brevo response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = errorText;
        }
        console.error("❌ Email sending failed:", {
          status: response.status,
          statusText: response.statusText,
          error,
        });
        return null;
      }

      const result: BrevoEmailResponse = await response.json();
      console.log("✅ Email sent successfully via Brevo:", result);
      return result;
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      return null;
    }
  }
}

export const brevoClient = new BrevoClient();
export type { EmailData, BrevoEmailResponse };

