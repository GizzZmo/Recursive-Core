/*
 * Project: Recursive Core
 * Filename: script.js
 * Description: All application logic, including state management, API calls, event handling, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {

    const app = {
        state: { appSettings: {}, lastAiResponse: "", currentIntent: 'neutral', hoverContext: 'default', frameCount: 0, realMouse: { x: 0, y: 0 }, smoothedMouse: { x: 0, y: 0 }, lastMousePos: { x: 0, y: 0 } },
        defaultSettings: { colors: { '--neon-cyan': '#00ffff', '--neon-magenta': '#ff00ff', '--dark-bg': '#0b0c10', '--dark-card': '#1f2833', '--light-text': '#c5c6c7' }, hologram: { size: 25, offset: 30 }, api: { key: '' } },
        elements: {},
        holograms: {},
        icons: {
            document: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "1.5"); const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("d", "M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM9 7h6M9 11h6M9 15h4"); svg.appendChild(path); return svg; },
            wing: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "1.5"); const path = document.createElementNS("http://www.w3.org/2000/svg", "path"); path.setAttribute("d", "M22 12c-3-2-6-3-9-3s-6 1-9 3c3 2 6 3 9 3s6-1 9-3zM3 12v0c0 2.5 4 4.5 9 4.5s9-2 9-4.5v0"); svg.appendChild(path); return svg; },
            code: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "1.5"); const p1 = document.createElementNS("http://www.w3.org/2000/svg", "polyline"); p1.setAttribute("points", "16 18 22 12 16 6"); svg.appendChild(p1); const p2 = document.createElementNS("http://www.w3.org/2000/svg", "polyline"); p2.setAttribute("points", "8 6 2 12 8 18"); svg.appendChild(p2); return svg; },
            send: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); const p = document.createElementNS("http://www.w3.org/2000/svg", "path"); p.setAttribute("d", "M13 5l7 7-7 7M5 12h14"); svg.appendChild(p); return svg; },
            deepDive: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M12 5v14m-7-7h14"/><path d="M12 5a7 7 0 00-7 7"/>'; return svg; },
            analyze: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M18 13v6M6 11v8M12 8v11"/><circle cx="12" cy="4" r="2"/>'; return svg; },
            decompile: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M4 14a2 2 0 01-2-2V6a2 2 0 012-2h1m6 0h2m6 0h1a2 2 0 012 2v6a2 2 0 01-2 2h-1m-6 0h-2m-6 0H4m12 0h-2"/><path d="M8 18v2m4-2v2m4-2v2"/>'; return svg; },
            lore: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M4 19.5A2.5 2.5 0 016.5 17H20v-5H4v7.5zM4 12V6a2 2 0 012-2h12a2 2 0 012 2v6"/>'; return svg; },
            design: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>'; return svg; },
            bounty: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'; return svg; },
            ghost: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M9 10h.01M15 10h.01"/><path d="M12 2a8 8 0 00-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 00-8-8z"/>'; return svg; },
            subroutine: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M8 6h12M4 6h1v1M8 12h12M4 12h1v1M8 18h12M4 18h1v1"/>'; return svg; },
            netrunner: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>'; return svg; },
            corpo: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>'; return svg; },
            verify: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M21.218 12.782c.154.583.154 1.204 0 1.786-.154.583-1.043 2.87-4.478 5.421-2.073 1.54-4.524 2.29-6.74 2.29s-4.667-.75-6.74-2.29C-.218 17.432-.989 15.15 0 12c.99-3.15 3.268-5.433 6.702-6.974 2.074-1.54 4.525-2.29 6.74-2.29s4.666.75 6.74 2.29c3.435 2.548 4.324 4.838 4.478 5.421z"/><circle cx="12" cy="12" r="3"/>'; return svg; },
            subvert: () => { const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 24 24"); svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor"); svg.setAttribute("stroke-width", "2"); svg.innerHTML = '<path d="M3.27 3.27a14.01 14.01 0 0017.46 17.46M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h10"/>'; return svg; }
        },

        init() {
            Object.assign(this, this.methods);
            this.cacheDomElements();
            this.setupButtonIcons();
            this.setupEventListeners();
            this.loadSettings();
            this.setupAgentHolograms();
            this.animate();
        },

        methods: {
            cacheDomElements() {
                this.elements = {
                    queryForm: document.getElementById('query-form'), promptInput: document.getElementById('prompt-input'), responseContainer: document.getElementById('response-container'), loadingIndicator: document.getElementById('loading-indicator'), cursorContainer: document.getElementById('cursor-container'),
                    gabrielContainer: document.getElementById('gabriel-ui-container'), raphaelContainer: document.getElementById('raphael-ui-container'),
                    settingsModal: document.getElementById('settings-modal'), sourceCodeModal: document.getElementById('source-code-modal'), verificationModal: document.getElementById('verification-modal'), howtoModal: document.getElementById('howto-modal'),
                    buttons: {
                        send: document.getElementById('send-button'), deepDive: document.getElementById('deep-dive-button'), analyze: document.getElementById('analyze-button'), decompile: document.getElementById('decompile-memory-button'),
                        lore: document.getElementById('lore-weaver-button'), design: document.getElementById('cyberware-design-button'), bounty: document.getElementById('generate-bounty-button'), ghost: document.getElementById('contact-ghost-button'),
                        subroutine: document.getElementById('subroutine-button'), netrunner: document.getElementById('netrunner-trace-button'), corpo: document.getElementById('corpo-speak-button'), subvert: document.getElementById('subvert-propaganda-button'),
                        verify: document.getElementById('verify-identity-button'), viewSource: document.getElementById('view-source-button'), settings: document.getElementById('settings-button'), howto: document.getElementById('howto-button'),
                    },
                    settings: {
                        save: document.getElementById('save-settings-button'), reset: document.getElementById('reset-settings-button'),
                        colorPickers: { '--neon-cyan': document.getElementById('neon-cyan-picker'), '--neon-magenta': document.getElementById('neon-magenta-picker'), '--dark-bg': document.getElementById('dark-bg-picker'), '--dark-card': document.getElementById('dark-card-picker'), '--light-text': document.getElementById('light-text-picker') },
                        hologramSizeSlider: document.getElementById('hologram-size-slider'), hologramOffsetSlider: document.getElementById('hologram-offset-slider'), apiKeyInput: document.getElementById('api-key-input')
                    },
                    systemStatusText: document.getElementById('system-status-text')
                };
            },
            
            setupButtonIcons() {
                const buttonMap = { send: 'send', deepDive: 'deepDive', analyze: 'analyze', decompile: 'decompile', lore: 'lore', design: 'design', bounty: 'bounty', ghost: 'ghost', subroutine: 'subroutine', netrunner: 'netrunner', corpo: 'corpo', verify: 'verify', viewSource: 'code', subvert: 'subvert' };
                 for (const [key, iconName] of Object.entries(buttonMap)) {
                    const button = this.elements.buttons[key];
                    if (button) {
                        const icon = this.icons[iconName]();
                        button.prepend(icon);
                    }
                }
            },
            
            setupEventListeners() {
                this.elements.queryForm.addEventListener('submit', (e) => { e.preventDefault(); const p = this.elements.promptInput.value.trim(); if(p){ this.addResponseToContainer(p, "USER"); this.elements.promptInput.value = ""; this.askGemini(p, 'data', this.elements.buttons.send); }});
                
                const actionButtonHandler = (button, promptTemplate, intent, errorMsg, userMsg) => {
                    button.addEventListener('click', () => {
                        const concept = this.elements.promptInput.value.trim();
                        if(concept) {
                            const p = promptTemplate.replace('%CONCEPT%', concept);
                            this.addResponseToContainer(`Kommando: ${userMsg} for "${concept}"`, "USER");
                            this.elements.promptInput.value = "";
                            this.askGemini(p, intent, button);
                        } else {
                            this.addResponseToContainer(`SYSTEM_VARSEL //: Vennligst skriv inn ${errorMsg}.`, "ERROR", true);
                        }
                    });
                };

                this.elements.buttons.deepDive.addEventListener('click', () => { if(this.state.lastAiResponse){ const p = `Ta følgende tekst og dykk dypere: "${this.state.lastAiResponse.split(/\nTags:/)[0]}"`; this.addResponseToContainer("Kommando: Dypdykk", "USER"); this.askGemini(p, 'data', this.elements.buttons.deepDive); }});
                this.elements.buttons.analyze.addEventListener('click', () => { if(this.state.lastAiResponse){ const p = `Utfør en metakognitiv analyse av: "${this.state.lastAiResponse.split(/\nTags:/)[0]}"`; this.addResponseToContainer("Kommando: Analyser", "USER"); this.askGemini(p, 'data', this.elements.buttons.analyze); }});
                actionButtonHandler(this.elements.buttons.decompile, 'Du er en "Memory Ripper". Dekompiler følgende tekstfragment. Tekst: "%CONCEPT%"', 'data', 'et minnefragment', 'Dekompiler minne');
                actionButtonHandler(this.elements.buttons.lore, 'Jeg trenger bakgrunnsinformasjon ("lore") for et konsept i en mørk cyberpunk-verden: "%CONCEPT%".', 'action', 'et konsept', 'Vev historie');
                actionButtonHandler(this.elements.buttons.design, 'Design et stykke cyberware basert på ønsket funksjon: "%CONCEPT%".', 'action', 'en funksjon', 'Design cyberware');
                actionButtonHandler(this.elements.buttons.bounty, 'Du er en "Bounty Board Administrator". Generer en dusørjeger-kontrakt for følgende måltype: "%CONCEPT%".', 'action', 'en måltype', 'Generer dusør');
                actionButtonHandler(this.elements.buttons.ghost, 'Du er en "Ghost in the Machine". Svar på følgende bruker-input fra dette perspektivet: "%CONCEPT%"', 'data', 'et spørsmål til tomrommet', 'Kontakt en "Ghost"');
                actionButtonHandler(this.elements.buttons.subroutine, 'Bryt ned dette målet i en cyberpunk-verden til en liste over sub-rutiner: "%CONCEPT%".', 'action', 'et oppdrag', 'Generer sub-rutiner');
                actionButtonHandler(this.elements.buttons.netrunner, 'Du er en Netrunner-KI. Generer en fiktiv, trinnvis sporing gjennom nettet til målet: "%CONCEPT%".', 'data', 'et mål', 'Start sporing');
                actionButtonHandler(this.elements.buttons.corpo, 'Oversett følgende tekst til ugjennomtrengelig bedriftssjargong: "%CONCEPT%".', 'action', 'tekst for oversettelse', 'Oversett melding');
                actionButtonHandler(this.elements.buttons.subvert, 'Du er en "propaganda-subverter". Ta følgende tekst og omskriv den for å avsløre den skjulte sannheten. Tekst: "%CONCEPT%"', 'action', 'propaganda-tekst', 'Subverter');

                this.setupModalTriggers();
            },
            
            setupModalTriggers() {
                this.elements.buttons.settings.addEventListener('click', () => this.elements.settingsModal.classList.remove('hidden'));
                this.elements.buttons.howto.addEventListener('click', () => this.elements.howtoModal.classList.remove('hidden'));
                this.elements.buttons.viewSource.addEventListener('click', () => {
                    const source = document.documentElement.outerHTML;
                    const formattedSource = source.replace(/></g, '>\n<').replace(/ {2,}/g, ' ');
                    document.getElementById('source-code-content').textContent = formattedSource;
                    this.elements.sourceCodeModal.classList.remove('hidden');
                });
                this.elements.buttons.verify.addEventListener('click', () => this.startVerification());
                document.querySelectorAll('[data-close-button]').forEach(button => {
                    button.addEventListener('click', () => {
                        button.closest('.modal').classList.add('hidden');
                    });
                });
            },
            
            loadSettings() {
                 const savedSettings = localStorage.getItem('coreSettings'); 
                 if (savedSettings) { 
                    this.applySettings(JSON.parse(savedSettings)); 
                 } else { 
                    this.applySettings(this.defaultSettings); 
                 } 
                 this.updateInputsFromSettings(this.state.appSettings); 
            },
            
            applySettings(settings) { 
                for (const [key, value] of Object.entries(settings.colors)) { 
                    document.documentElement.style.setProperty(key, value); 
                } 
                this.state.appSettings = JSON.parse(JSON.stringify(settings)); 
            },

            updateInputsFromSettings(settings) {
                for (const [key, picker] of Object.entries(this.elements.settings.colorPickers)) { picker.value = settings.colors[key]; }
                this.elements.settings.hologramSizeSlider.value = settings.hologram.size;
                this.elements.settings.hologramOffsetSlider.value = settings.hologram.offset;
                this.elements.settings.apiKeyInput.value = settings.api.key;
            },

            collectAndSaveSettings() {
                const currentSettings = { 
                    colors: {}, 
                    hologram: { size: parseInt(this.elements.settings.hologramSizeSlider.value, 10), offset: parseInt(this.elements.settings.hologramOffsetSlider.value, 10) }, 
                    api: { key: this.elements.settings.apiKeyInput.value.trim() } 
                };
                for (const [key, picker] of Object.entries(this.elements.settings.colorPickers)) { currentSettings.colors[key] = picker.value; }
                localStorage.setItem('coreSettings', JSON.stringify(currentSettings));
                this.applySettings(currentSettings);
            },
            
            startVerification() {
                // ... (implementation from previous turn)
            },
            
            animate() {
                // ... (implementation from previous turn)
            },

            async askGemini(prompt, intent = 'neutral', buttonEl = null) {
                // ... (implementation from previous turn)
            },
            
            addResponseToContainer(text, sender, isError = false) {
               //... (implementation from previous turn)
            },

            copyTextToClipboard(text, button) {
                // ... (implementation from previous turn)
            },
            
            startSystemStatus() {
                // ... (implementation from previous turn)
            },
             handleGlyphClick(glyph) {
                //...
            },
            checkVerification() {
                //...
            },
            setupAgentHolograms() {
                this.holograms.gabriel = this.createAgent('gabriel');
                this.holograms.raphael = this.createAgent('raphael');
                this.elements.gabrielContainer.appendChild(this.holograms.gabriel.el);
                this.elements.raphaelContainer.appendChild(this.holograms.raphael.el);
            },

            createAgent(type) {
                const agentEl = document.createElement('div'); 
                agentEl.className = 'hologram'; 
                const agentObj = { el: agentEl, size: 25, opacity: 0.8, currentIcon: '' }; 
                if (type === 'gabriel') { agentEl.style.color = 'var(--neon-cyan)'; } 
                else { agentEl.style.color = 'var(--neon-magenta)'; } 
                return agentObj;
            }
            };
            app.init();
        });
    </script>
</body>
</html>
