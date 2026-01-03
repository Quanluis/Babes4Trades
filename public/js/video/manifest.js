// public/js/video/manifest.js
// -----------------------------------------------------------------------------
// Global Course Manifest (Temporary Solution)
// TODO: Move this to a secure /api endpoint after launch
// -----------------------------------------------------------------------------
//
// IMPORTANT: Do NOT store Bunny embedUrl here anymore if token auth is enabled.
// Store only videoId + options, then fetch a signed embed URL from your server.
// -----------------------------------------------------------------------------

window.__COURSES__ = {
  // 101 - Introduction to Finance
  "course-101": {
    id: "course-101",
    title: "Introduction to Finance",
    videos: [
      {
        id: "v1",
        title: "Welcome & What You'll Learn",
        videoId: "c48dffe6-62c0-4d0b-813b-b2095905fa03",
        loop: true,
        muted: false,
        preload: true,
      },
      {
        id: "v2",
        title: "Balance Sheet Basics",
        videoId: "cf2a66c4-28bc-424f-afc4-c296aa7b5afe",
        loop: false,
        muted: false,
        preload: true,
      },
      {
        id: "v3",
        title: "Income Statement Walkthrough",
        videoId: "2dcf1cc3-763e-4290-8c77-f08a57e46491",
        loop: true,
        muted: false,
        preload: true,
      },
      {
        id: "v4",
        title: "Cash Flow",
        videoId: "1832c605-3282-41e5-bd52-c3ee18b24d52",
        loop: true,
        muted: false,
        preload: true,
      },
      {
        id: "v5",
        title: "Assets & Liabilities",
        videoId: "76f5a287-e02d-44c5-b5b1-f2069cf61ed8",
        loop: true,
        muted: false,
        preload: true,
      },
    ],
  },

  // 102 - Crypto & Blockchain
  "course-102": {
    id: "course-102",
    title: "Crypto & Blockchain",
    videos: [
      { id: "v1", title: "Crypto 1", videoId: "70fb39db-51e6-49b0-8567-ab2cccb65b4f", loop: true,  muted: false, preload: true },
      { id: "v2", title: "Crypto 2", videoId: "c83dfe75-3ca9-4534-9daa-52c986adf889", loop: false, muted: false, preload: true },
      { id: "v3", title: "Crypto 3", videoId: "70fb39db-51e6-49b0-8567-ab2cccb65b4f", loop: true,  muted: false, preload: true },
      { id: "v4", title: "Crypto 4", videoId: "baa3b6e5-0a68-475c-a2b5-bd34beb3eb0a", loop: true,  muted: false, preload: true },
      { id: "v5", title: "Crypto 5", videoId: "baa3b6e5-0a68-475c-a2b5-bd34beb3eb0a", loop: true,  muted: false, preload: true },
    ],
  },

  // 103 - History of Finance
  "course-103": {
    id: "course-103",
    title: "History of Finance",
    videos: [
      { id: "v1", title: "History 1", videoId: "70fb39db-51e6-49b0-8567-ab2cccb65b4f", loop: true,  muted: false, preload: true },
      { id: "v2", title: "History 2", videoId: "c83dfe75-3ca9-4534-9daa-52c986adf889", loop: false, muted: false, preload: true },
      { id: "v3", title: "History 3", videoId: "70fb39db-51e6-49b0-8567-ab2cccb65b4f", loop: true,  muted: false, preload: true },
      { id: "v4", title: "History 4", videoId: "baa3b6e5-0a68-475c-a2b5-bd34beb3eb0a", loop: true,  muted: false, preload: true },
      { id: "v5", title: "History 5", videoId: "70fb39db-51e6-49b0-8567-ab2cccb65b4f", loop: true,  muted: false, preload: true },
    ],
  },
};
