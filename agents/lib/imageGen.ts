export function buildImageUrl(prompt: string, width = 1024, height = 1024): string {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
}
