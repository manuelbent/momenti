import { writable } from 'svelte/store'

export interface MomentNode {
    id: string
    type: 'box'|'text'|'image'|'form'
    css?: string
    // text props
    tag?: string
    html?: string
    // image props
    src?: string
    alt?: string
    // form props
    placeholder?: string
    buttonLabel?: string
    // css
    inputCss?: string
    buttonCss?: string
    // tree
    children?: MomentNode[]
}

export interface Moment {
    slug: string
    root: MomentNode
}

export const moment = writable<Moment>({
    slug: 'sophie-marco-2026',
    root: {
        id: 'page',
        type: 'box',
        // Using a sophisticated off-white and serif stack
        css: 'background-color: #faf9f6; color: #1a1a1a; font-family: "Playfair Display", serif; line-height: 1.6;',
        children: [
            {
                id: 'hero-container',
                type: 'box',
                css: 'position: relative; padding: 60px 20px; max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; align-items: center;',
                children: [
                    {
                        id: 'hero-image',
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80',
                        alt: 'Wedding scenery',
                        css: 'width: 100%; height: 70vh; object-fit: cover; border-radius: 2px; filter: contrast(0.9) sepia(0.1);'
                    },
                    {
                        id: 'hero-card',
                        type: 'box',
                        // The "overlap" trick that makes it look custom
                        css: 'margin-top: -120px; background: white; padding: 60px 40px; text-align: center; width: 90%; max-width: 500px; box-shadow: 0 30px 60px rgba(0,0,0,0.05); z-index: 10;',
                        children: [
                            {
                                id: 'date-line',
                                type: 'text',
                                tag: 'span',
                                html: 'Saturday &bull; 12 July &bull; 2026',
                                css: 'display: block; text-transform: uppercase; letter-spacing: 3px; font-size: 0.75rem; color: #888; margin-bottom: 20px; font-family: sans-serif;'
                            },
                            {
                                id: 'main-title',
                                type: 'text',
                                tag: 'h1',
                                html: 'Sophie <br/> & Marco',
                                css: 'font-size: 3.5rem; font-weight: 400; line-height: 1.1; color: #2d2d2d; margin: 0;'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'story-section',
                type: 'box',
                css: 'padding: 100px 24px; max-width: 700px; margin: 0 auto; text-align: center;',
                children: [
                    {
                        id: 'story-text',
                        type: 'text',
                        tag: 'p',
                        html: 'From the cobbled streets of Rome to the rolling hills of Tuscany, our journey has been a beautiful whirlwind. We can&rsquo;t wait to start our next chapter with you.',
                        css: 'font-size: 1.4rem; font-style: italic; color: #4a4a4a; margin-bottom: 40px;'
                    }
                ]
            },
            {
                id: 'gallery-grid',
                type: 'box',
                css: 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 0 20px; max-width: 1000px; margin: 0 auto;',
                children: [
                    {
                        id: 'img-1',
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
                        css: 'width: 100%; aspect-ratio: 1; object-fit: cover;'
                    },
                    {
                        id: 'img-2',
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80',
                        css: 'width: 100%; aspect-ratio: 1; object-fit: cover; margin-top: 40px;' // Staggered grid effect
                    }
                ]
            },
            {
                id: 'rsvp-block',
                type: 'box',
                css: 'margin: 120px 0; padding: 100px 24px; background-color: #f4f2ee; text-align: center;',
                children: [
                    {
                        id: 'rsvp-header',
                        type: 'text',
                        tag: 'h2',
                        html: 'Will You Join Us?',
                        css: 'font-size: 2.5rem; margin-bottom: 12px;'
                    },
                    {
                        id: 'rsvp-sub',
                        type: 'text',
                        tag: 'p',
                        html: 'Please RSVP by June 1st',
                        css: 'color: #777; margin-bottom: 40px;'
                    },
                    {
                        id: 'rsvp-form',
                        type: 'form',
                        placeholder: 'Enter your name...',
                        buttonLabel: 'Confirm Attendance',
                        // Ensure the form itself is centered in the parent box
                        css: 'max-width: 400px; margin: 40px auto 0; display: flex; flex-direction: column; gap: 20px;',
                        // Adding text-align: center to the input helps if the placeholder is floating
                        inputCss: 'padding: 20px; border: 1px solid #e0e0e0; background-color: #ffffff; border-radius: 0; font-size: 1rem; color: #1a1a1a; text-align: center;',
                        buttonCss: 'padding: 20px; background-color: #1a1a1a; color: #ffffff; border: none; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem; cursor: pointer; transition: opacity 0.2s;'
                    }
                ]
            }
        ]
    }
})

export const moment2 = writable<Moment>({
        'slug': 'matrimonio-ciliegio-villa-camilla', 'root': {
            'id': 'root',
            'type': 'box',
            'tag': 'div',
            'css': 'min-height:100vh;background:#fbf6f4;color:#2f3a32;font-family:\'Inter\',\'Helvetica Neue\',Arial,sans-serif;overflow:hidden;',
            'children': [{
                'id': 'hero',
                'type': 'box',
                'tag': 'section',
                'css': 'position:relative;min-height:92vh;display:flex;align-items:flex-end;justify-content:center;padding:120px 24px 72px;background:linear-gradient(180deg,rgba(255,246,247,0.22),rgba(251,246,244,0.95));',
                'children': [{
                    'id': 'hero-image',
                    'type': 'image',
                    'src': 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=80',
                    'alt': '[Rami](https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1800&q=80%22,%22alt%22:%22Rami) di ciliegio in fiore per un matrimonio elegante',
                    'css': 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;filter:saturate(0.9) brightness(0.96);'
                }, {
                    'id': 'hero-overlay',
                    'type': 'box',
                    'tag': 'div',
                    'css': 'position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.12),rgba(251,246,244,0.92));z-index:1;'
                }, {
                    'id': 'hero-content',
                    'type': 'box',
                    'tag': 'div',
                    'css': 'position:relative;z-index:2;text-align:center;max-width:980px;margin:0 auto;',
                    'children': [{
                        'id': 'eyebrow',
                        'type': 'text',
                        'tag': 'p',
                        'html': '15 Agosto 2026 • Villa Camilla • Lago di Como',
                        'css': 'margin:0 0 28px;text-transform:uppercase;letter-spacing:0.28em;font-size:12px;font-weight:600;color:#6f8b78;'
                    }, {
                        'id': 'title',
                        'type': 'text',
                        'tag': 'h1',
                        'html': 'Un matrimonio tra ciliegi in fiore',
                        'css': 'margin:0;font-family:\'Playfair Display\',\'Ibarra Real Nova\',Georgia,serif;font-size:clamp(54px,9vw,132px);line-height:0.9;font-weight:400;color:#7d3851;letter-spacing:-0.06em;'
                    }, {
                        'id': 'subtitle',
                        'type': 'text',
                        'tag': 'p',
                        'html': 'Una giornata sul Lago di Como, avvolta da rosa cipria, salvia delicata e accenti d’azzurro.',
                        'css': 'max-width:640px;margin:34px auto 0;font-size:18px;line-height:1.8;color:#47584d;'
                    }]
                }]
            }, {
                'id': 'intro-card',
                'type': 'box',
                'tag': 'section',
                'css': 'position:relative;z-index:3;max-width:1120px;margin:-72px auto 0;background:#fffdfb;padding:92px 28px;box-shadow:0 28px 70px rgba(125,56,81,0.10);border-radius:34px;text-align:center;',
                'children': [{
                    'id': 'intro-label',
                    'type': 'text',
                    'tag': 'p',
                    'html': 'The Cherry Blossom Wedding',
                    'css': 'margin:0 0 22px;text-transform:uppercase;letter-spacing:0.24em;font-size:11px;font-weight:700;color:#9c5870;'
                }, {
                    'id': 'intro-title',
                    'type': 'text',
                    'tag': 'h2',
                    'html': 'Vi aspettiamo per celebrare l’inizio del nostro per sempre',
                    'css': 'max-width:790px;margin:0 auto;font-family:\'Playfair Display\',\'Ibarra Real Nova\',Georgia,serif;font-size:clamp(34px,5vw,68px);line-height:1.04;font-weight:400;color:#344439;'
                }, {
                    'id': 'intro-copy',
                    'type': 'text',
                    'tag': 'p',
                    'html': 'Abbiamo immaginato un ricevimento elegante ma naturale, ispirato alla delicatezza dei fiori di ciliegio e alla luce morbida del lago. Sarà una festa accogliente, romantica e piena di piccoli dettagli pensati per farvi sentire parte della nostra storia.',
                    'css': 'max-width:720px;margin:32px auto 0;font-size:17px;line-height:1.9;color:#5f6b62;'
                }]
            }, {
                'id': 'details', 'type': 'box', 'tag': 'section', 'css': 'padding:120px 24px 80px;', 'children': [{
                    'id': 'details-grid',
                    'type': 'box',
                    'tag': 'div',
                    'css': 'max-width:1180px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px;',
                    'children': [{
                        'id': 'date-card',
                        'type': 'box',
                        'tag': 'div',
                        'css': 'background:#f4d8de;padding:46px 34px;border-radius:30px;box-shadow:0 20px 40px rgba(0,0,0,0.05);',
                        'children': [{
                            'id': 'date-label',
                            'type': 'text',
                            'tag': 'p',
                            'html': 'Quando',
                            'css': 'margin:0 0 18px;text-transform:uppercase;letter-spacing:0.22em;font-size:11px;font-weight:700;color:#7d3851;'
                        }, {
                            'id': 'date-title',
                            'type': 'text',
                            'tag': 'h2',
                            'html': '15 Agosto 2026',
                            'css': 'margin:0;font-family:\'Playfair Display\',Georgia,serif;font-size:40px;line-height:1.05;font-weight:400;color:#7d3851;'
                        }, {
                            'id': 'date-copy',
                            'type': 'text',
                            'tag': 'p',
                            'html': 'La cerimonia inizierà alle ore 17:00. Vi consigliamo di arrivare con qualche minuto di anticipo per godervi il panorama e l’atmosfera.',
                            'css': 'margin:22px 0 0;font-size:15px;line-height:1.8;color:#573b45;'
                        }]
                    }, {
                        'id': 'location-card',
                        'type': 'box',
                        'tag': 'div',
                        'css': 'background:#dbe9e3;padding:46px 34px;border-radius:30px;box-shadow:0 20px 40px rgba(0,0,0,0.05);',
                        'children': [{
                            'id': 'location-label',
                            'type': 'text',
                            'tag': 'p',
                            'html': 'Dove',
                            'css': 'margin:0 0 18px;text-transform:uppercase;letter-spacing:0.22em;font-size:11px;font-weight:700;color:#577566;'
                        }, {
                            'id': 'location-title',
                            'type': 'text',
                            'tag': 'h2',
                            'html': 'Villa Camilla',
                            'css': 'margin:0;font-family:\'Playfair Display\',Georgia,serif;font-size:40px;line-height:1.05;font-weight:400;color:#314a3b;'
                        }, {
                            'id': 'location-copy',
                            'type': 'text',
                            'tag': 'p',
                            'html': 'Lago di Como — una cornice luminosa e senza tempo, tra acqua, giardini e scorci romantici.',
                            'css': 'margin:22px 0 0;font-size:15px;line-height:1.8;color:#45574d;'
                        }]
                    }, {
                        'id': 'mood-card',
                        'type': 'box',
                        'tag': 'div',
                        'css': 'background:#dcecf3;padding:46px 34px;border-radius:30px;box-shadow:0 20px 40px rgba(0,0,0,0.05);',
                        'children': [{
                            'id': 'mood-label',
                            'type': 'text',
                            'tag': 'p',
                            'html': 'Mood',
                            'css': 'margin:0 0 18px;text-transform:uppercase;letter-spacing:0.22em;font-size:11px;font-weight:700;color:#587787;'
                        }, {
                            'id': 'mood-title',
                            'type': 'text',
                            'tag': 'h2',
                            'html': 'Eleganza leggera',
                            'css': 'margin:0;font-family:\'Playfair Display\',Georgia,serif;font-size:40px;line-height:1.05;font-weight:400;color:#345363;'
                        }, {
                            'id': 'mood-copy',
                            'type': 'text',
                            'tag': 'p',
                            'html': 'Un equilibrio tra raffinatezza, naturalezza e colore: niente rigidità, solo armonia e bellezza condivisa.',
                            'css': 'margin:22px 0 0;font-size:15px;line-height:1.8;color:#465963;'
                        }]
                    }]
                }]
            }, {
                'id': 'story', 'type': 'box', 'tag': 'section', 'css': 'padding:90px 24px 130px;', 'children': [{
                    'id': 'story-wrap',
                    'type': 'box',
                    'tag': 'div',
                    'css': 'max-width:1180px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:0;align-items:center;',
                    'children': [{
                        'id': 'story-image',
                        'type': 'image',
                        'src': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80',
                        'alt': 'Tavola](https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80%22,%22alt%22:%22Tavola) elegante con fiori rosa per matrimonio',
                        'css': 'width:100%;height:680px;object-fit:cover;border-radius:34px;'
                    }, {
                        'id': 'story-panel',
                        'type': 'box',
                        'tag': 'div',
                        'css': 'background:#fffdfb;padding:76px 54px;margin-left:-80px;border-radius:34px;box-shadow:0 24px 54px rgba(47,58,50,0.08);position:relative;',
                        'children': [{
                            'id': 'story-label',
                            'type': 'text',
                            'tag': 'p',
                            'html': 'La nostra ispirazione',
                            'css': 'margin:0 0 20px;text-transform:uppercase;letter-spacing:0.24em;font-size:11px;font-weight:700;color:#9c5870;'
                        }, {
                            'id': 'story-title',
                            'type': 'text',
                            'tag': 'h2',
                            'html': 'Ciliegio, lago e luce di fine estate',
                            'css': 'margin:0;font-family:\'Playfair Display\',Georgia,serif;font-size:clamp(34px,4vw,58px);line-height:1.08;font-weight:400;color:#7d3851;'
                        }, {
                            'id': 'story-copy',
                            'type': 'text',
                            'tag': 'p',
                            'html': 'Il ciliegio è il nostro simbolo di delicatezza e rinascita: un fiore leggero, poetico, capace di rendere speciale anche il dettaglio più semplice. Da qui nasce la palette del matrimonio, fatta di rosa chiari, rosa più profondi, verde salvia e tocchi d’azzurro.',
                            'css': 'margin:28px 0 0;font-size:16px;line-height:1.9;color:#5f6b62;'
                        }]
                    }]
                }]
            }, {
                'id': 'dress-code',
                'type': 'box',
                'tag': 'section',
                'css': 'background:#7d3851;padding:120px 24px;color:#fffaf8;',
                'children': [{
                    'id': 'dress-inner',
                    'type': 'box',
                    'tag': 'div',
                    'css': 'max-width:1120px;margin:0 auto;text-align:center;',
                    'children': [{
                        'id': 'dress-label',
                        'type': 'text',
                        'tag': 'p',
                        'html': 'Dress code inspiration',
                        'css': 'margin:0 0 22px;text-transform:uppercase;letter-spacing:0.26em;font-size:11px;font-weight:700;color:#f4d8de;'
                    }, {
                        'id': 'dress-title',
                        'type': 'text',
                        'tag': 'h2',
                        'html': 'In palette, con libertà',
                        'css': 'margin:0 auto;max-width:760px;font-family:\'Playfair Display\',Georgia,serif;font-size:clamp(38px,5vw,72px);line-height:1.03;font-weight:400;color:#fffaf8;'
                    }, {
                        'id': 'dress-copy',
                        'type': 'text',
                        'tag': 'p',
                        'html': 'Non è richiesto un look rigidamente formale: scegliete qualcosa che vi faccia sentire bene, elegante o rilassato, purché dialoghi con i colori della giornata.',
                        'css': 'max-width:720px;margin:30px auto 56px;font-size:17px;line-height:1.9;color:#f8e8eb;'
                    }, {
                        'id': 'palette-row',
                        'type': 'box',
                        'tag': 'div',
                        'css': 'display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:18px;',
                        'children': [{
                            'id': 'color-1',
                            'type': 'box',
                            'tag': 'div',
                            'css': 'background:#f6d8de;color:#7d3851;border-radius:999px;padding:22px 18px;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;font-weight:700;',
                            'children': [{
                                'id': 'color-1-text',
                                'type': 'text',
                                'tag': 'span',
                                'html': 'Rosa cipria',
                                'css': 'display:block;'
                            }]
                        }, {
                            'id': 'color-2',
                            'type': 'box',
                            'tag': 'div',
                            'css': 'background:#c46f86;color:#fffaf8;border-radius:999px;padding:22px 18px;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;font-weight:700;',
                            'children': [{
                                'id': 'color-2-text',
                                'type': 'text',
                                'tag': 'span',
                                'html': 'Rosa ciliegia',
                                'css': 'display:block;'
                            }]
                        }, {
                            'id': 'color-3',
                            'type': 'box',
                            'tag': 'div',
                            'css': 'background:#dbe9e3;color:#314a3b;border-radius:999px;padding:22px 18px;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;font-weight:700;',
                            'children': [{
                                'id': 'color-3-text',
                                'type': 'text',
                                'tag': 'span',
                                'html': 'Verde salvia',
                                'css': 'display:block;'
                            }]
                        }, {
                            'id': 'color-4',
                            'type': 'box',
                            'tag': 'div',
                            'css': 'background:#dcecf3;color:#345363;border-radius:999px;padding:22px 18px;font-size:12px;text-transform:uppercase;letter-spacing:0.16em;font-weight:700;',
                            'children': [{
                                'id': 'color-4-text',
                                'type': 'text',
                                'tag': 'span',
                                'html': 'Azzurro lago',
                                'css': 'display:block;'
                            }]
                        }]
                    }]
                }]
            }, {
                'id': 'rsvp',
                'type': 'box',
                'tag': 'section',
                'css': 'padding:130px 24px;background:#fbf6f4;',
                'children': [{
                    'id': 'rsvp-card',
                    'type': 'box',
                    'tag': 'div',
                    'css': 'max-width:920px;margin:0 auto;background:#fffdfb;padding:86px 34px;border-radius:38px;box-shadow:0 28px 70px rgba(125,56,81,0.10);text-align:center;',
                    'children': [{
                        'id': 'rsvp-label',
                        'type': 'text',
                        'tag': 'p',
                        'html': 'RSVP',
                        'css': 'margin:0 0 20px;text-transform:uppercase;letter-spacing:0.26em;font-size:11px;font-weight:700;color:#6f8b78;'
                    }, {
                        'id': 'rsvp-title',
                        'type': 'text',
                        'tag': 'h2',
                        'html': 'Confermate la vostra presenza',
                        'css': 'margin:0 auto;max-width:680px;font-family:\'Playfair Display\',Georgia,serif;font-size:clamp(36px,5vw,66px);line-height:1.05;font-weight:400;color:#344439;'
                    }, {
                        'id': 'rsvp-copy',
                        'type': 'text',
                        'tag': 'p',
                        'html': 'Sarà prezioso sapere se sarete con noi in questa giornata speciale. Indicate il vostro nome e un recapito per eventuali comunicazioni.',
                        'css': 'max-width:620px;margin:26px auto 42px;font-size:16px;line-height:1.8;color:#5f6b62;'
                    }, {
                        'id': 'rsvp-form',
                        'type': 'form',
                        'placeholder': 'Nome, cognome e numero invitati',
                        'buttonLabel': 'Conferma presenza',
                        'css': 'max-width:620px;margin:0 auto;display:flex;gap:12px;flex-wrap:wrap;justify-content:center;',
                        'inputCss': 'flex:1 1 320px;background:#ffffff;border:1px solid #d7b5bf;border-radius:999px;padding:18px 22px;font-size:15px;color:#344439;outline:none;box-shadow:inset 0 0 0 1px rgba(125,56,81,0.02);',
                        'buttonCss': 'background:#7d3851;color:#fffaf8;border:1px solid #7d3851;border-radius:999px;padding:18px 28px;font-size:12px;text-transform:uppercase;letter-spacing:0.18em;font-weight:700;cursor:pointer;'
                    }]
                }]
            }, {
                'id': 'footer',
                'type': 'box',
                'tag': 'footer',
                'css': 'padding:70px 24px 90px;text-align:center;background:#344439;color:#fffaf8;',
                'children': [{
                    'id': 'footer-text',
                    'type': 'text',
                    'tag': 'p',
                    'html': '15 Agosto 2026 — Villa Camilla, Lago di Como',
                    'css': 'margin:0;font-family:\'Playfair Display\',Georgia,serif;font-size:28px;font-weight:400;color:#fffaf8;'
                }, {
                    'id': 'footer-note',
                    'type': 'text',
                    'tag': 'p',
                    'html': 'Con amore, tra ciliegi in fiore e riflessi sul lago.',
                    'css': 'margin:18px 0 0;font-size:13px;letter-spacing:0.16em;text-transform:uppercase;color:#dbe9e3;'
                }]
            }]
        }
    }
)
