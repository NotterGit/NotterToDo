export const links = {
  QUALSU: "https://qual.su",
  FEEDBACK: "https://feedback.qual.su",
  TELEGRAM: "https://t.me/qualsu",
  QUAL_ID: "https://id.qual.su",
  NOTTER: "https://notter.su",
  NOTTER_GEM: "https://gem.notter.su",
  NOTTER_PROFILE: (username: string) => `${links.NOTTER}/profile/${username}`
} as const;
