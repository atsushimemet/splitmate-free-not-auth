// GA4 Analytics Hook
export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }
  };

  const trackPageView = (pageTitle: string, pageLocation?: string) => {
    trackEvent('page_view', {
      page_title: pageTitle,
      page_location: pageLocation || window.location.href,
    });
  };

  const trackExpenseAdded = (amount: number, category: string) => {
    trackEvent('expense_added', {
      value: amount,
      currency: 'JPY',
      category: category,
    });
  };

  const trackSettlementCompleted = (totalAmount: number, participantCount: number) => {
    trackEvent('settlement_completed', {
      value: totalAmount,
      currency: 'JPY',
      participant_count: participantCount,
    });
  };

  const trackShareAction = (method: string) => {
    trackEvent('share_action', {
      method: method,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackExpenseAdded,
    trackSettlementCompleted,
    trackShareAction,
  };
}; 
