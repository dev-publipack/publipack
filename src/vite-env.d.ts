/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Pipedream Webhook (RECOMMENDED - production-ready, zero CORS issues)
  readonly VITE_PIPEDREAM_WEBHOOK?: string;
  
  // Google Sheets Integration (Secure via Google Apps Script)
  readonly VITE_GOOGLE_SCRIPT_URL?: string;
  
  // Legacy: Direct SheetDB (not recommended for production)
  readonly VITE_SHEETDB_API_URL?: string;
  
  // Airtable Integration (alternative)
  readonly VITE_AIRTABLE_API_KEY?: string;
  readonly VITE_AIRTABLE_BASE_ID?: string;
  readonly VITE_AIRTABLE_TABLE_NAME?: string;
  
  // Common
  readonly VITE_CAMPAIGN_ID?: string;
  
  // Brevo Email - Direct API (API key stored in git secrets)
  readonly VITE_BREVO_API_KEY?: string;
  readonly VITE_BREVO_FROM_EMAIL?: string;
  readonly VITE_BREVO_FROM_NAME?: string;
  
  // Legacy: Brevo Email via Pipedream (deprecated)
  readonly VITE_PIPEDREAM_EMAIL_WEBHOOK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

