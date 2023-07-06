/**
 * support for handling langs
 *   English & Spanish by default
 *   Others need to be setup by client in window.ElectroPrivacyLanguageMap
 */

const englishMap = require('../../dist/lang/en-US.json');
const spanishMap = require('../../dist/lang/es-US.json');

window.ElectroPrivacyLanguageMap = {
    ...window.ElectroPrivacyLanguageMap,
    en: englishMap,
    es: spanishMap,
};

// console.log('languageMap keys', Object.keys(window.ElectroPrivacyLanguageMap));

let stringMap = window.ElectroPrivacyLanguageMap['en'];

// use html lang attribute to determine strings to use
const languageAttribute = document.documentElement.getAttribute('lang');
if (languageAttribute) {
    if (window.ElectroPrivacyLanguageMap[languageAttribute]) {
        stringMap = window.ElectroPrivacyLanguageMap[languageAttribute];
    } else {
        const language = languageAttribute.split('-')[0];
        if (window.ElectroPrivacyLanguageMap[language]) {
            stringMap = window.ElectroPrivacyLanguageMap[language];
        }
    }
}

export function getLanguageString(strName)
{
    if (stringMap[strName]) {
        return stringMap[strName];
    }
    return strName;
}
