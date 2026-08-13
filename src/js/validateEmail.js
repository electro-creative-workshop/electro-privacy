// Pure email validation (no DOM or side effects). Used by ot-dns-script-2 and tests.
const MAX_EMAIL_LENGTH = 254; // RFC 5321

// Source string form of the address pattern, kept safe for the HTML `pattern` attribute:
// the parentheses and opening bracket inside the character classes are escaped so the value
// also compiles when the browser applies the `v` flag. `re` is built from it so the field
// constraint and the JS validation can never drift apart.
const EMAIL_PATTERN =
    '^(([^<>\\(\\)\\[\\]\\\\.,;:\\s@"]+(\\.[^<>\\(\\)\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))' +
    '@((\\[\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\])|(([a-zA-Z\\-\\d]+\\.)+[a-zA-Z]{2,}))$';

const re = new RegExp(EMAIL_PATTERN);

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

export { EMAIL_PATTERN, MAX_EMAIL_LENGTH, re };
