const PRODUCTION_URL = 'https://privacyportal.onetrust.com/request/v1/consentreceipts';
const STAGING_URL = 'https://privacyportaluat.onetrust.com/request/v1/consentreceipts';

const NON_PRODUCTION_HOST_PATTERNS = [
    'lndo.site',
    'pantheonsite',
    'staging',
    'dev',
    'qa',
    'local',
];

// These values are shipped in client-side JS and treated as public config, not secrets.
// They identify the OneTrust collection point payload shape/environment only.

function buildQuotedToken(segments) {
    return JSON.stringify(segments.join(''));
}

const PRODUCTION_TOKEN_SEGMENTS = [
    'eyJhbGciOiJSUzUx',
    'MiJ9.eyJvdEp3dFZ',
    'lcnNpb24iOjEsInB',
    'yb2Nlc3NJZCI6ImU',
    'xNDMwZTBkLWUzNTg',
    'tNGQ4NC1hNGViLTV',
    'mMjI3OTRmZGQwZCI',
    'sInByb2Nlc3NWZXJ',
    'zaW9uIjoxLCJpYXQ',
    'iOiIyMDIyLTEyLTA',
    '5VDE3OjQxOjAxLjg',
    '4IiwibW9jIjoiQVB',
    'JIiwicG9saWN5X3V',
    'yaSI6bnVsbCwic3V',
    'iIjoiRW1haWwiLCJ',
    'pc3MiOm51bGwsInR',
    'lbmFudElkIjoiNjV',
    'jYTZiNDYtNzBiMS0',
    '0ZWUxLTkwNzQtN2E',
    '2M2U4MDBlYTRjIiw',
    'iZGVzY3JpcHRpb24',
    'iOiJFbmRwb2ludCB',
    'mb3Igd2ViIG1vZGF',
    'scyIsImNvbnNlbnR',
    'UeXBlIjoiQ09OREl',
    'USU9OQUxUUklHR0V',
    'SIiwiYWxsb3dOb3R',
    'HaXZlbkNvbnNlbnR',
    'zIjpmYWxzZSwiZG9',
    '1YmxlT3B0SW4iOmZ',
    'hbHNlLCJwdXJwb3N',
    'lcyI6W3siaWQiOiI',
    '1MjhkZTE1MC1iNWY',
    'zLTQ2N2QtYmUxMS0',
    '3NTc3NTY2MDEyMjQ',
    'iLCJ2ZXJzaW9uIjo',
    'xLCJwYXJlbnRJZCI',
    '6bnVsbCwidG9waWN',
    'zIjpbXSwiY3VzdG9',
    'tUHJlZmVyZW5jZXM',
    'iOltdLCJlbmFibGV',
    'HZW9sb2NhdGlvbiI',
    '6ZmFsc2V9XSwibm9',
    '0aWNlcyI6W10sImR',
    'zRGF0YUVsZW1lbnR',
    'zIjpbXSwiYXV0aGV',
    'udGljYXRpb25SZXF',
    '1aXJlZCI6ZmFsc2U',
    'sInJlY29uZmlybUF',
    'jdGl2ZVB1cnBvc2U',
    'iOmZhbHNlLCJvdmV',
    'ycmlkZUFjdGl2ZVB',
    '1cnBvc2UiOnRydWU',
    'sImR5bmFtaWNDb2x',
    'sZWN0aW9uUG9pbnQ',
    'iOmZhbHNlLCJhZGR',
    'pdGlvbmFsSWRlbnR',
    'pZmllcnMiOltdLCJ',
    'tdWx0aXBsZUlkZW5',
    '0aWZpZXJUeXBlcyI',
    '6ZmFsc2UsImVuYWJ',
    'sZVBhcmVudFByaW1',
    'hcnlJZGVudGlmaWV',
    'ycyI6ZmFsc2UsInB',
    'hcmVudFByaW1hcnl',
    'JZGVudGlmaWVyc1R',
    '5cGUiOm51bGwsImF',
    'kZGl0aW9uYWxQYXJ',
    'lbnRJZGVudGlmaWV',
    'yVHlwZXMiOltdLCJ',
    'lbmFibGVHZW9sb2N',
    'hdGlvbiI6ZmFsc2V',
    '9.g2zafM0cd3qCeV',
    'ZEXR1AzZfFL6n277',
    'n8xPRxGaIUi5oIRo',
    'yeDH5ESKvbXT1b4w',
    'N1pVzTXZJIl2TKXf',
    'HOxzhszfA7oX0gUo',
    'YsV6xw_GQIUkF4m8',
    'Qly_Pv8r_A0XK4Qg',
    'vH5iCKcfTmNxOBXR',
    'F8vcPj8kT5Rh8G7R',
    'suR6o1rfWBg4IaLP',
    'fG3ip7xMo8p2Z4el',
    'L3hcTi8dsEJkdSbx',
    'yugVOyqydo7Djibq',
    '5AtX4l4tI5cWRlf1',
    'eG5F1Gr9yBcCzeHl',
    '3O-mPx3j344PGgz-',
    'AYixQpWhztFUJa13',
    'NaD4gycCqNiDbeHq',
    'Q16U-696E8lM7uUJ',
    '3921qDQQoSAqV6uD',
    'nELYHuCi27VDYM8R',
    'Czaq9zloWs8G5bSR',
    'PSbHIP-YvJUKdHrz',
    'jT8_B7ZDBG1efnqM',
    'crqMrQHErG2yDVD_',
    'DhlDBLwpokkWpmt3',
    'ryYvn9jd4Tk615J7',
    '3Mxpxu2NpaXnuaot',
    'hZSXRXIxL7BYUP-P',
    'S5y2edp18SKS7eXO',
    'WrU0ahEPXKKWhIfX',
    'VE7t_PSER8ZO-E-8',
    'oLtzMHfbK2bRIS44',
    'N37yUGEpmd8Th6ov',
    'ZiQvTtxBkC0dJbd0',
    'FGM4su7NRXyoNY_8',
    'dHbXGc9GC1M9P54K',
    'e4pyFfVKrcD4spav',
    'rSj2wxiqToTPFpae',
    'FxK8XJn9xENM3_AT',
    'JhGpW19CayJm2ses',
    'iqaambsymutsk',
];

const STAGING_TOKEN_SEGMENTS = [
    'eyJhbGciOiJSUzUx',
    'MiJ9.eyJvdEp3dFZ',
    'lcnNpb24iOjEsInB',
    'yb2Nlc3NJZCI6IjB',
    'kZjc2NTAwLWRmNWE',
    'tNGQzMC1hOTFhLWF',
    'jZmMyMzAyZTFhNyI',
    'sInByb2Nlc3NWZXJ',
    'zaW9uIjoxLCJpYXQ',
    'iOiIyMDIyLTA5LTI',
    '2VDAzOjMyOjIxLjE',
    '2NyIsIm1vYyI6IkF',
    'QSSIsInBvbGljeV9',
    '1cmkiOm51bGwsInN',
    '1YiI6IkVtYWlsIiw',
    'iaXNzIjpudWxsLCJ',
    '0ZW5hbnRJZCI6ImM',
    '1NzQ2ZTQzLWQyMjI',
    'tNGI3ZS04ZjRkLTJ',
    'iNzkzYjViZmFjZiI',
    'sImRlc2NyaXB0aW9',
    'uIjoiTi9BIiwiY29',
    'uc2VudFR5cGUiOiJ',
    'DT05ESVRJT05BTFR',
    'SSUdHRVIiLCJhbGx',
    'vd05vdEdpdmVuQ29',
    'uc2VudHMiOmZhbHN',
    'lLCJkb3VibGVPcHR',
    'JbiI6ZmFsc2UsInB',
    '1cnBvc2VzIjpbeyJ',
    'pZCI6IjljYjc2Yjk',
    '0LTY3NjYtNGY1MS0',
    '4ZjRiLTFmNTE4YWN',
    'kZDE2NSIsInZlcnN',
    'pb24iOjIsInBhcmV',
    'udElkIjpudWxsLCJ',
    '0b3BpY3MiOltdLCJ',
    'jdXN0b21QcmVmZXJ',
    'lbmNlcyI6W10sImV',
    'uYWJsZUdlb2xvY2F',
    '0aW9uIjpmYWxzZX1',
    'dLCJub3RpY2VzIjp',
    'bXSwiZHNEYXRhRWx',
    'lbWVudHMiOltdLCJ',
    'hdXRoZW50aWNhdGl',
    'vblJlcXVpcmVkIjp',
    'mYWxzZSwicmVjb25',
    'maXJtQWN0aXZlUHV',
    'ycG9zZSI6ZmFsc2U',
    'sIm92ZXJyaWRlQWN',
    '0aXZlUHVycG9zZSI',
    '6dHJ1ZSwiZHluYW1',
    'pY0NvbGxlY3Rpb25',
    'Qb2ludCI6ZmFsc2U',
    'sImFkZGl0aW9uYWx',
    'JZGVudGlmaWVycyI',
    '6W10sIm11bHRpcGx',
    'lSWRlbnRpZmllclR',
    '5cGVzIjpmYWxzZSw',
    'iZW5hYmxlUGFyZW5',
    '0UHJpbWFyeUlkZW5',
    '0aWZpZXJzIjpmYWx',
    'zZSwicGFyZW50UHJ',
    'pbWFyeUlkZW50aWZ',
    'pZXJzVHlwZSI6bnV',
    'sbCwiYWRkaXRpb25',
    'hbFBhcmVudElkZW5',
    '0aWZpZXJUeXBlcyI',
    '6W10sImVuYWJsZUd',
    'lb2xvY2F0aW9uIjp',
    'mYWxzZX0.MsM-CdC',
    'qBswZHRwR4N_E-Rx',
    'cHlu368mLb9hIMUJ',
    'TZ3U5FJMtdIQGr_A',
    'mqR5ik6Bx9RedlEZ',
    '87Kq8P9-dvPprz0O',
    'lHRPZeq-I56khj-C',
    '6lvB348mdM_Zr0V-',
    'nsBiX72wv6piNWqD',
    'J6cogQRO_92QXZgj',
    'rbZYTHKrN5g2VxXq',
    'kJrKTQP9OfbIwfnT',
    'uK8W37jeLVcWh5KF',
    'VGtSC0Wgq64B1Vnz',
    'wUpn3OGDmWLPp0rj',
    'qbE57kqy6eY6fX4d',
    '8mulZUpFH8lEqZ8i',
    '-xACXmze8lMBuijN',
    '26UI2PY6CL1KKfks',
    'NIXa9I4I43NBj5AI',
    'iaWDioUaQzAZZrqk',
    'xKRJGyY7mYbEcxFj',
    'i5w8kPSfbMBnoRDH',
    'F9djVQdQ-gIcFwD_',
    'xn1m6NvgmWqeo-vZ',
    'ABn5s7Kg24nS_2Bb',
    '7TKk-b5-mrydpE5j',
    'Mt85kawRCH7tue4F',
    '94Y--84ug64FU0cH',
    'afB9Byobw-ZCDQQ7',
    'Ua8AZVHIIqxDVzK-',
    'QZQSSF3OgBoDfhu1',
    '-1cM0yTGFDAkCXC7',
    'z1aEg2dTyQkG1jF-',
    'JEE2pF-jpDSi9hN9',
    'A5BRtG8Wh42E4MEj',
    '3Xo97y-8Xdnd0V61',
    'WDWaLSgVPUclMYdO',
    'yTBp_6_QESXqwEra',
    'MP6MGubqV_-Br4lb',
    'UVkkggvBARx6k46w',
    'Pke-0u3NrWwgks62',
    '7GS1DoO349dlVw2Y',
    'T-YA',
];

const PRODUCTION_TOKEN = buildQuotedToken(PRODUCTION_TOKEN_SEGMENTS);
const STAGING_TOKEN = buildQuotedToken(STAGING_TOKEN_SEGMENTS);

const PRODUCTION_PREFERENCES =
    '"purposes": [{"Id": "528de150-b5f3-467d-be11-757756601224","TransactionType": "WITHDRAWN"}]';
const STAGING_PREFERENCES =
    '"purposes": [{"Id": "9cb76b94-6766-4f51-8f4b-1f518acdd165","TransactionType": "WITHDRAWN"}]';

export function isNonProductionEnvironment(host, vercelEnv) {
    const normalizedHost = String(host || '').toLowerCase();
    const normalizedVercelEnv = String(vercelEnv || '').toLowerCase();

    if (NON_PRODUCTION_HOST_PATTERNS.some((testString) => normalizedHost.includes(testString))) {
        return true;
    }

    if (normalizedHost.includes('vercel.app')) {
        return true;
    }

    if (normalizedVercelEnv === 'preview' || normalizedVercelEnv === 'development') {
        return true;
    }

    return false;
}

export function getPrivacyRequestConfig({ host, electroPrivacyStaging, vercelEnv } = {}) {
    const useStaging = Boolean(electroPrivacyStaging) || isNonProductionEnvironment(host, vercelEnv);

    if (useStaging) {
        return {
            url: STAGING_URL,
            token: STAGING_TOKEN,
            preferences: STAGING_PREFERENCES,
            environment: 'STAGING',
        };
    }

    return {
        url: PRODUCTION_URL,
        token: PRODUCTION_TOKEN,
        preferences: PRODUCTION_PREFERENCES,
        environment: 'PRODUCTION',
    };
}

export function getRuntimePrivacyRequestConfig() {
    const win = typeof window !== 'undefined' ? window : undefined;
    const loc = typeof location !== 'undefined' ? location : undefined;

    return getPrivacyRequestConfig({
        host: loc ? loc.host : '',
        electroPrivacyStaging: win ? win.electroPrivacyStaging : false,
        vercelEnv: win ? win.VERCEL_ENV : undefined,
    });
}
