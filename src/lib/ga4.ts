// src/lib/ga4.ts
type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
};




export const trackLogin = (method: string) => {
  trackEvent('login', { method });
};

// Ecommerce specific
export const trackViewItemList = (items: any[]) => {
  trackEvent('view_item_list', { items });
};

export const trackViewItem = (item: any) => {
  trackEvent('view_item', item);
};

export const trackSelectItem = (item: any) => {
  trackEvent('select_item', item);
};

export const trackBeginCheckout = (params: any) => {
  trackEvent('begin_checkout', params);
};

export const trackGenerateLead = (params: any) => {
  trackEvent('generate_lead', params);
};

export const trackClickToCall = (params: any) => {
  trackEvent('click_to_call', params);
};

export const trackClickEmail = (params: any) => {
  trackEvent('click_email', params);
};

export const trackClickMap = (params: any) => {
  trackEvent('click_map', params);
};

export const trackViewGallery = (params: any) => {
  trackEvent('view_gallery', params);
};

export const trackSearchAvailability = (params: any) => {
  trackEvent('search_availability', params);
};

export const trackSelectDate = (params: any) => {
  trackEvent('select_date', params);
};

export const trackAddGuest = (params: any) => {
  trackEvent('add_guest', params);
};

export const trackViewReviews = (params: any) => {
  trackEvent('view_reviews', params);
};

// Video engagement (if video is used)
export const trackVideoEngagement = (params: any) => {
  trackEvent('video_engagement', params);
};