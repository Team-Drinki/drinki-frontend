export const AGE_VERIFICATION_KEY = 'drinki-age-verified-v2';

export function hasVerifiedAge(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  if (localStorage.getItem(AGE_VERIFICATION_KEY) === 'true') {
    return true;
  }

  return false;
}

export function saveAgeVerification(): void {
  localStorage.setItem(AGE_VERIFICATION_KEY, 'true');
}
