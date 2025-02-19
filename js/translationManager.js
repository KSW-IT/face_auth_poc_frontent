layui.define((exports)=> {
    const {layer} = layui;
    
    const translationManager ={

        printTestMsg(){
            layer.msg('Hi, this is testing', {icon: 6});
        },
        loadTranslations() {
            const storedTranslations = localStorage.getItem('translations');
            if (storedTranslations) {
                // Use cached translations from localStorage
                translations = JSON.parse(storedTranslations);
                console.log('Translations loaded from localStorage:', translations);
            } else {
                try {
                    // Fetch translations from local JSON file
                    const response = await fetch('../locale/translation.json'); // Local JSON file in the project directory
                    if (!response.ok) throw new Error('Failed to fetch translations.');
                    translations = await response.json();
                    localStorage.setItem('translations', JSON.stringify(translations)); // Cache translations in localStorage
                    console.log('Translations loaded from local JSON file:', translations);
                } catch (error) {
                    console.error('Error loading translations:', error);
        
                }
            }
        },

        applyTranslations(language) {
            const elements = document.querySelectorAll('[data-key]');
            elements.forEach((element) => {
                const key = element.getAttribute('data-key');
                if (translations[key] && translations[key][language]) {
                    element.textContent = translations[key][language];
                }
            });
        }
        ,

        initializePage() {
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

    };
    exports("translationManager",translationManager);
});



 