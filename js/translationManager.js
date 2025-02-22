
 export var savedLanguage = null;
 export var translations = {}; //
export function printTestMsg(){
    layui.use(['layer'],function(){
        const layer = layui.layer;
        layer.msg("Hi buddy");
    });
   console.log('testing........');
}
export async function loadTranslations() {
    const storedTranslations = localStorage.getItem('translations');
    if (storedTranslations) {
        // Use cached translations from localStorage
        translations = JSON.parse(storedTranslations);
        console.log('Translations loaded from localStorage:', translations);
        return translations;
    } else {
        try {
            // Fetch translations from local JSON file
            const response = await fetch('/locale/translation.json'); // Local JSON file in the project directory
            if (!response.ok) throw new Error('Failed to fetch translations.');
            translations = await response.json();
            localStorage.setItem('translations', JSON.stringify(translations)); // Cache translations in localStorage
            console.log('Translations loaded from local JSON file:', translations);
            return translations;
        } catch (error) {
            console.error('Error loading translations:', error);
            return translations;

        }
    }
}


export function applyTranslations(language) {
    const elements = document.querySelectorAll('[data-key]');
    elements.forEach((element) => {
        const key = element.getAttribute('data-key');
        if (translations[key] && translations[key][language]) {
            element.textContent = translations[key][language];
        }
    });
}


export async function initializePage() {
    await loadTranslations(); // Load translations from local JSON file or localStorage

    // Load saved language from localStorage or default to 'en'
    savedLanguage = localStorage.getItem('selectedLanguage') || 'en';

    // Pre-select the radio button based on the saved language
    const radio = document.querySelector(`input[name="language"][value="${savedLanguage}"]`);
    if (radio) {
        radio.checked = true;
    }

    // Apply translations for the saved language
    applyTranslations(savedLanguage);
}

export async function getCurrentLanguage(){
    return localStorage.getItem('selectedLanguage') || 'en';
}
export function updateLanguage(newLanguage) {
    savedLanguage = newLanguage; // Update global variable
    localStorage.setItem('selectedLanguage', newLanguage); // Persist to localStorage
    applyTranslations(savedLanguage); // Apply updated translations
}

 