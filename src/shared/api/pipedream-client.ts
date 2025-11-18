interface LeadData {
  fullName: string;
  phone: string;
  email: string;
  sponsorName: string;
  sponsorReward?: string;
  campaignId?: string;
}

class PipedreamClient {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = import.meta.env.VITE_PIPEDREAM_WEBHOOK || "";

    if (!this.webhookUrl) {
      console.warn("⚠️ Pipedream webhook not configured");
      console.warn("💡 Add VITE_PIPEDREAM_WEBHOOK to your .env file");
      console.warn("📖 See PIPEDREAM_SETUP.md for setup instructions");
    } else {
      console.log("✅ Pipedream webhook configured");
    }
  }

  async submitLead(data: LeadData): Promise<boolean> {
    console.log("🔍 PipedreamClient.submitLead called", {
      hasWebhook: !!this.webhookUrl,
      webhookUrl: this.webhookUrl ? `${this.webhookUrl.substring(0, 30)}...` : "missing",
      data,
    });

    if (!this.webhookUrl) {
      console.error("❌ Pipedream webhook not configured - VITE_PIPEDREAM_WEBHOOK is missing");
      console.error("💡 See PIPEDREAM_SETUP.md for setup instructions");
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
    };

    console.log("📋 Prepared payload:", payload);
    console.log("🌐 Sending POST request to Pipedream");
    console.log("📤 Request URL:", this.webhookUrl);

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
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = errorText;
        }
        console.error("❌ Pipedream error:", {
          status: response.status,
          statusText: response.statusText,
          error,
        });
        return false;
      }

      const result = await response.json();
      console.log("✅ Lead submitted successfully via Pipedream:", result);
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

