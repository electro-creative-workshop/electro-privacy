// Pure email validation (no DOM or side effects). Used by ot-dns-script-2 and tests.
const MAX_EMAIL_LENGTH = 254; // RFC 5321

const re =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0 || trimmedEmail.length > MAX_EMAIL_LENGTH) {
    return false;
  }
  return re.test(trimmedEmail.toLowerCase());
}

export { MAX_EMAIL_LENGTH, re };
