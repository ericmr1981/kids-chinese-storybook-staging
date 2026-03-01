export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (!text?.trim()) return;

  if (!('speechSynthesis' in window)) {
    alert('当前浏览器不支持语音朗读（speechSynthesis）。');
    return;
  }

  const rate = opts?.rate ?? 0.9;
  const pitch = opts?.pitch ?? 1.0;

  try {
    // Cancel any ongoing speech to make taps feel responsive
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Try pick a Chinese voice if available
    const voices = window.speechSynthesis.getVoices?.() ?? [];
    const zhVoice = voices.find((v) => v.lang?.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('speechSynthesis error:', e);
  }
}
