export function formatJoinDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getSocialTypeLabel(socialType: string): string {
  const normalized = socialType.trim().toLowerCase();

  if (normalized === 'google') return '구글 로그인';
  if (normalized === 'kakao') return '카카오 로그인';
  if (normalized === 'apple') return '애플 로그인';

  return `${socialType} 로그인`;
}

export function getNicknameFallback(nickname: string): string {
  return nickname.trim().charAt(0).toUpperCase() || 'U';
}
