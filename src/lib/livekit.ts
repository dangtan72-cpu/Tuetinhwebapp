export function getLiveKitConfig() {
  const url = process.env.LIVEKIT_URL?.trim() || "";
  const apiKey = process.env.LIVEKIT_API_KEY?.trim() || "";
  const apiSecret = process.env.LIVEKIT_API_SECRET?.trim() || "";
  const configured = Boolean(url && apiKey && apiSecret);
  return { url, apiKey, apiSecret, configured };
}

export function isLiveKitConfigured() {
  return getLiveKitConfig().configured;
}
