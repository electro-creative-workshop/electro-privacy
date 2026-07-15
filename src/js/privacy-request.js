import { validateEmail } from './validateEmail.js';

export function sanitizeEmailIdentifier(value) {
    return String(value).trim();
}

export function isValidEmailIdentifier(value) {
    const sanitizedEmail = sanitizeEmailIdentifier(value);
    return sanitizedEmail.length > 0 && validateEmail(sanitizedEmail);
}

export function buildConsentRequestBody(identifier, token, preferences) {
    const sanitizedEmail = sanitizeEmailIdentifier(identifier);

    if (!isValidEmailIdentifier(sanitizedEmail)) {
        return {
            ok: false,
            error: 'invalid-identifier',
        };
    }

    const body = `{"identifier":${JSON.stringify(sanitizedEmail)},"requestInformation":${token},${preferences}}`;

    try {
        JSON.parse(body);
    } catch {
        return {
            ok: false,
            error: 'invalid-json',
        };
    }

    return {
        ok: true,
        body,
        identifier: sanitizedEmail,
    };
}
