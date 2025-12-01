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
    // API key from env secret only (required)
    const envApiKey = import.meta.env.VITE_BREVO_API_KEY;
    if (!envApiKey) {
      throw new Error("VITE_BREVO_API_KEY is required but not set in environment variables");
    }
    this.apiKey = envApiKey;

    // Hardcoded values
    this.fromEmail = "publipack25@gmail.com";
    this.fromName = "El Pack";

    // Log configuration on initialization (without sensitive data)
    console.log("🔧 BrevoClient initialized", {
      hasApiKey: !!this.apiKey,
      fromEmail: this.fromEmail,
      fromName: this.fromName,
    });
  }

  async sendEmail(data: EmailData): Promise<BrevoEmailResponse | null> {
    if (!this.apiKey) {
      console.error("❌ Brevo API key not configured");
      console.error("💡 Set VITE_BREVO_API_KEY in environment variables");
      return null;
    }

    const fromEmail = (data.from || this.fromEmail)?.trim();

    if (!fromEmail) {
      console.error("❌ Sender email not configured");
      console.error("💡 Set VITE_BREVO_FROM_EMAIL in environment variables");
      console.error("Current fromEmail value:", this.fromEmail || "EMPTY");
      console.error("Data.from value:", data.from || "NOT PROVIDED");
      console.error("⚠️ IMPORTANT: After adding to .env, RESTART the dev server!");
      return null;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fromEmail)) {
      console.error("❌ Invalid sender email format:", fromEmail);
      return null;
    }

    // Prepare recipient with optional name
    const toRecipient: { email: string; name?: string } = {
      email: data.to,
    };
    if (data.fullName) {
      toRecipient.name = data.fullName;
    }

    // Ensure we have at least htmlContent or textContent
    const htmlContent = data.htmlContent || "";
    const textContent = data.textContent || (htmlContent ? htmlContent.replace(/<[^>]*>/g, "").trim() : "");

    if (!htmlContent && !textContent) {
      console.error("❌ Email content is empty. Provide htmlContent or textContent.");
      return null;
    }

    const payload: {
      sender: { name: string; email: string };
      to: Array<{ email: string; name?: string }>;
      subject: string;
      htmlContent?: string;
      textContent?: string;
    } = {
      sender: {
        name: data.fromName || this.fromName,
        email: fromEmail,
      },
      to: [toRecipient],
      subject: data.subject,
    };

    // Only include content fields if they have values
    if (htmlContent) {
      payload.htmlContent = htmlContent;
    }
    if (textContent) {
      payload.textContent = textContent;
    }

    // Final validation before sending
    if (!payload.sender.email || !payload.sender.email.includes("@")) {
      console.error("❌ Invalid sender email in payload:", payload.sender);
      return null;
    }

    console.log("📧 BrevoClient.sendEmail called", {
      to: data.to,
      fromEmail: fromEmail,
      fromName: data.fromName || this.fromName,
      subject: data.subject,
      hasApiKey: !!this.apiKey,
      apiKeyPrefix: this.apiKey ? `${this.apiKey.substring(0, 10)}...` : "missing",
    });
    console.log("📋 Full payload:", JSON.stringify(payload, null, 2));
    console.log("📋 Sender email in payload:", payload.sender.email);

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

