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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

