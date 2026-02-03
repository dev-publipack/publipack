import ReactGA from 'react-ga4';


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
