import ReactGA from 'react-ga4';

const UTM_STORAGE_KEY = 'utm_params';
const UTM_EXPIRY_KEY = 'utm_expiry';
const UTM_EXPIRY_DAYS = 30;

export interface UtmParams {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
}

export function getUtmParamsFromUrl(): UtmParams {
  if (typeof window === 'undefined') {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }

  const urlParams = new URLSearchParams(window.location.search);

  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
    utm_term: urlParams.get('utm_term'),
    utm_content: urlParams.get('utm_content'),
  };
}

function saveUtmParams(utmParams: UtmParams): void {
  if (typeof window === 'undefined') return;

  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + UTM_EXPIRY_DAYS);

    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    localStorage.setItem(UTM_EXPIRY_KEY, expiryDate.toISOString());
  } catch (error) {
    console.error('Error saving UTM params to localStorage:', error);
  }
}

function getSavedUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const expiryStr = localStorage.getItem(UTM_EXPIRY_KEY);

    if (expiryStr) {
      const expiryDate = new Date(expiryStr);
      if (expiryDate < new Date()) {
        localStorage.removeItem(UTM_STORAGE_KEY);
        localStorage.removeItem(UTM_EXPIRY_KEY);
        return null;
      }
    }

    const savedParams = localStorage.getItem(UTM_STORAGE_KEY);
    if (savedParams) {
      return JSON.parse(savedParams);
    }
  } catch (error) {
    console.error('Error retrieving UTM params from localStorage:', error);
  }

  return null;
}

export function getUtmParams(): UtmParams {
  const urlParams = getUtmParamsFromUrl();

  const hasUtmInUrl = Object.values(urlParams).some(value => value !== null);

  if (hasUtmInUrl) {
    saveUtmParams(urlParams);
    return urlParams;
  }

  const savedParams = getSavedUtmParams();
  if (savedParams) {
    return savedParams;
  }

  return { utm_source: null, utm_medium: null, utm_campaign: null };
}

export function clearUtmParams(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(UTM_STORAGE_KEY);
    localStorage.removeItem(UTM_EXPIRY_KEY);
  } catch (error) {
    console.error('Error clearing UTM params:', error);
  }
}

export function initializeUtmTracking(): void {
  const utmParams = getUtmParams();

  const hasAnyUtm = Object.values(utmParams).some(value => value !== null);

  if (hasAnyUtm) {
    ReactGA.event('page_view_with_utm', {
      utm_source: utmParams.utm_source || 'direct',
      utm_medium: utmParams.utm_medium || 'none',
      utm_campaign: utmParams.utm_campaign || 'none',
      ...(utmParams.utm_term && { utm_term: utmParams.utm_term }),
      ...(utmParams.utm_content && { utm_content: utmParams.utm_content }),
    });

    ReactGA.gtag('set', 'campaign', {
      campaign_source: utmParams.utm_source || undefined,
      campaign_medium: utmParams.utm_medium || undefined,
      campaign_name: utmParams.utm_campaign || undefined,
      campaign_term: utmParams.utm_term || undefined,
      campaign_content: utmParams.utm_content || undefined,
    });

    const clarityFn = (window as any).clarity;
    if (clarityFn && typeof clarityFn === 'function') {
      clarityFn('set', 'utm_source', utmParams.utm_source || 'direct');
      clarityFn('set', 'utm_medium', utmParams.utm_medium || 'none');
      clarityFn('set', 'utm_campaign', utmParams.utm_campaign || 'none');

      if (utmParams.utm_term) {
        clarityFn('set', 'utm_term', utmParams.utm_term);
      }
      if (utmParams.utm_content) {
        clarityFn('set', 'utm_content', utmParams.utm_content);
      }
    }

    console.log('UTM tracking initialized:', utmParams);
  }
}

export function trackButtonClick(buttonName: string, additionalData?: Record<string, string | number>): void {
  const utmParams = getUtmParams();

  ReactGA.event({
    category: 'Button',
    action: 'Click',
    label: buttonName,
    ...additionalData,
    ...(utmParams.utm_source && { utm_source: utmParams.utm_source }),
    ...(utmParams.utm_medium && { utm_medium: utmParams.utm_medium }),
    ...(utmParams.utm_campaign && { utm_campaign: utmParams.utm_campaign }),
  });
}

export function trackFormFieldInteraction(
  fieldName: string,
  action: 'focus' | 'blur' | 'change',
  additionalData?: Record<string, string | number>
): void {
  const utmParams = getUtmParams();

  ReactGA.event({
    category: 'Form',
    action: action === 'focus' ? 'Field Focus' : action === 'blur' ? 'Field Blur' : 'Field Change',
    label: fieldName,
    ...additionalData,
    ...(utmParams.utm_source && { utm_source: utmParams.utm_source }),
    ...(utmParams.utm_medium && { utm_medium: utmParams.utm_medium }),
    ...(utmParams.utm_campaign && { utm_campaign: utmParams.utm_campaign }),
  });
}

/**
 * Отслеживает отправку формы с UTM-метками
 */
export function trackFormSubmit(formName: string, additionalData?: Record<string, string | number>): void {
  const utmParams = getUtmParams();

  ReactGA.event({
    category: 'Form',
    action: 'Submit',
    label: formName,
    ...additionalData,
    ...(utmParams.utm_source && { utm_source: utmParams.utm_source }),
    ...(utmParams.utm_medium && { utm_medium: utmParams.utm_medium }),
    ...(utmParams.utm_campaign && { utm_campaign: utmParams.utm_campaign }),
  });
}

export function trackConversion(conversionName: string, value?: number, additionalData?: Record<string, string | number>): void {
  const utmParams = getUtmParams();

  ReactGA.event({
    category: 'Conversion',
    action: conversionName,
    value,
    ...additionalData,
    ...(utmParams.utm_source && { utm_source: utmParams.utm_source }),
    ...(utmParams.utm_medium && { utm_medium: utmParams.utm_medium }),
    ...(utmParams.utm_campaign && { utm_campaign: utmParams.utm_campaign }),
  });
}