// utils/signBunnyEmbedUrl.js
const crypto = require("crypto");

function signBunnyEmbedUrl({ libraryId, videoId, tokenKey, ttlSeconds = 900 }) {
  const expires = Math.floor(Date.now() / 1000) + ttlSeconds;

  const token = crypto
    .createHash("sha256")
    .update(String(tokenKey) + String(videoId) + String(expires))
    .digest("hex");

  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expires}&autoplay=false&responsive=true`;
}

module.exports = signBunnyEmbedUrl;
