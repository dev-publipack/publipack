interface LeadData {
  fullName: string;
  phone: string;
  email: string;
  sponsorName: string;
  sponsorReward?: string;
  campaignId?: string;
  /** Email content for Resend step in Pipedream */
  emailSubject?: string;
  emailHtml?: string;
  emailText?: string;
  brandUrl?: string;
}

class PipedreamClient {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = import.meta.env.VITE_PIPEDREAM_WEBHOOK || "";

    if (!this.webhookUrl) {
      console.warn("⚠️ Pipedream webhook not configured");
      console.warn("💡 Add VITE_PIPEDREAM_WEBHOOK to your .env file");
    } else {
      console.log("✅ Pipedream webhook configured");
    }
  }

  async submitLead(data: LeadData): Promise<boolean> {
    console.log("🔍 PipedreamClient.submitLead called", {
      hasWebhook: !!this.webhookUrl,
      webhookUrl: this.webhookUrl ? `${this.webhookUrl.substring(0, 30)}...` : "missing",
      email: data.email,
      hasEmailHtml: !!data.emailHtml,
    });

    if (!this.webhookUrl) {
      console.error("❌ Pipedream webhook not configured - VITE_PIPEDREAM_WEBHOOK is missing");
      return false;
    }

    const payload = {
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      sponsor: data.sponsorName,
      reward: data.sponsorReward || "",
      campaignId: data.campaignId || import.meta.env.VITE_CAMPAIGN_ID || "",
      timestamp: new Date().toISOString(),
      // Consumed by Resend Send Email step in Pipedream
      emailSubject: data.emailSubject || "",
      emailHtml: data.emailHtml || "",
      emailText: data.emailText || "",
      brandUrl: data.brandUrl || "",
    };

    console.log("🌐 Sending POST request to Pipedream (lead + email payload)");

    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        let error: unknown = errorText;
        try {
          error = JSON.parse(errorText);
        } catch {
          // keep raw text
        }
        console.error("❌ Pipedream error:", {
          status: response.status,
          statusText: response.statusText,
          error,
        });
        return false;
      }

      const raw = await response.text();
      if (raw) {
        try {
          console.log("✅ Lead submitted successfully via Pipedream:", JSON.parse(raw));
        } catch {
          console.log("✅ Lead submitted successfully via Pipedream:", raw);
        }
      } else {
        console.log("✅ Lead submitted successfully via Pipedream (empty body)");
      }
      return true;
    } catch (error) {
      console.error("❌ Failed to submit via Pipedream:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      return false;
    }
  }
}

export const pipedreamClient = new PipedreamClient();
export type { LeadData };
