export function isTransferClaimSpam(message: string): boolean {
  const text = message.normalize("NFKC");
  return /https?:\/\/|www\./iu.test(text)
    && /(?:вам|для вас)\s+(?:денежный\s+)?перевод/iu.test(text)
    && /(?:получить|получите|забрать|заберите)\s+(?:тут|здесь|по ссылке)/iu.test(text);
}
