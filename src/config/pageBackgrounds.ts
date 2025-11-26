// Configuration for page background videos/gifs
// Add your video URLs from Supabase storage or local files here

export const pageBackgrounds: Record<string, { video?: string; gif?: string; overlayOpacity?: number }> = {
  '/pricing': {
    video: '/videos/landing-01.mp4',
    overlayOpacity: 0.6,
  },
  '/team': {
    video: '/videos/landing-02.mp4',
    overlayOpacity: 0.6,
  },
  '/hipaa': {
    video: '/videos/landing-03.mp4',
    overlayOpacity: 0.6,
  },
  '/demo': {
    video: '/videos/landing-04.mp4',
    overlayOpacity: 0.6,
  },
  '/about': {
    video: '/videos/landing-05.mp4',
    overlayOpacity: 0.6,
  },
  '/story': {
    video: '/videos/landing-06.mp4',
    overlayOpacity: 0.6,
  },
  '/research': {
    video: '/videos/landing-07.mp4',
    overlayOpacity: 0.6,
  },
  '/evidence': {
    video: '/videos/landing-08.mp4',
    overlayOpacity: 0.6,
  },
  '/faq': {
    video: '/videos/landing-09.mp4',
    overlayOpacity: 0.6,
  },
  '/careers': {
    video: '/videos/landing-10.mp4',
    overlayOpacity: 0.6,
  },
  '/press': {
    video: '/videos/landing-11.mp4',
    overlayOpacity: 0.6,
  },
  '/products/environmental': {
    video: '/videos/landing-12.mp4',
    overlayOpacity: 0.6,
  },
  '/consumer-pricing': {
    video: '/videos/landing-13.mp4',
    overlayOpacity: 0.6,
  },
  '/clinical-pricing': {
    video: '/videos/landing-14.mp4',
    overlayOpacity: 0.6,
  },
  '/products/enterprise-wellness': {
    video: '/videos/landing-15.mp4',
    overlayOpacity: 0.6,
  },
  '/privacy': {
    video: '/videos/landing-16.mp4',
    overlayOpacity: 0.6,
  },
  '/legal': {
    video: '/videos/landing-17.mp4',
    overlayOpacity: 0.6,
  },
  '/cookies': {
    video: '/videos/landing-18.mp4',
    overlayOpacity: 0.6,
  },
  '/white-papers': {
    video: '/videos/landing-19.mp4',
    overlayOpacity: 0.6,
  },
  '/black-friday': {
    video: '/videos/landing-20.mp4',
    overlayOpacity: 0.7,
  },
  // Add more pages as needed
  'default': {
    video: '/videos/landing-01.mp4',
    overlayOpacity: 0.6,
  }
};
