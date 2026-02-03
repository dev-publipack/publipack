import ReactGA from 'react-ga4';

export function getUtmParams(): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} {
  if (typeof window === 'undefined') {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }

  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: urlParams.get('utm_source'),
    utm_medium: urlParams.get('utm_medium'),
    utm_campaign: urlParams.get('utm_campaign'),
  };
}


export function initializeUtmTracking() {
  const utmParams = getUtmParams();
  
  // Send to Google Analytics as event with UTM parameters
  if (utmParams.utm_source || utmParams.utm_medium || utmParams.utm_campaign) {
    ReactGA.event('utm_tracking', {
      utm_source: utmParams.utm_source || 'none',
      utm_medium: utmParams.utm_medium || 'none',
      utm_campaign: utmParams.utm_campaign || 'none',
    });
  }

  // Send to Clarity for filtering (wait for Clarity to initialize)
  if (typeof window !== 'undefined') {
    const setClarityUtm = () => {
      const clarity = (window as any).clarity;
      if (clarity && typeof clarity === 'function') {
        if (utmParams.utm_source) {
          clarity('set', 'utm_source', utmParams.utm_source);
        }
        if (utmParams.utm_medium) {
          clarity('set', 'utm_medium', utmParams.utm_medium);
        }
        if (utmParams.utm_campaign) {
          clarity('set', 'utm_campaign', utmParams.utm_campaign);
        }
      } else {
        // Retry after a short delay if Clarity is not ready
        setTimeout(setClarityUtm, 100);
      }
    };
    
    setClarityUtm();
  }
}

export function trackButtonClick(buttonName: string, additionalData?: Record<string, string | number>) {
  ReactGA.event({
    category: 'Button',
    action: 'Click',
    label: buttonName,
    ...additionalData,
  });
}

export function trackFormFieldInteraction(
  fieldName: string,
  action: 'focus' | 'blur' | 'change',
  additionalData?: Record<string, string | number>
) {
  ReactGA.event({
    category: 'Form',
    action: action === 'focus' ? 'Field Focus' : action === 'blur' ? 'Field Blur' : 'Field Change',
    label: fieldName,
    ...additionalData,
  });
}

/**
 * Track form submission
 */
export function trackFormSubmit(formName: string, additionalData?: Record<string, string | number>) {
  ReactGA.event({
    category: 'Form',
    action: 'Submit',
    label: formName,
    ...additionalData,
  });
}
