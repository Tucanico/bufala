import type { Organisation } from "../lib/check/organisations";

// Every fact comes from the organisation's own website, read on the date in
// `checked`. `names` and `brandWords` are our own choices, not facts.
// Nothing here is reviewed yet: see docs/data-review.md before setting `reviewed`.

const ON = "2026-11-07";

const POSTE_CALL = "https://www.poste.it/assistenza/chiamaci";
const POSTE_SECURITY = "https://www.poste.it/sicurezza-online";
const POSTE_SCAMS = "https://www.poste.it/sicurezza-online/guide-per-operare-in-sicurezza/come-difendersi-dalle-truffe";
const POSTE_VADEMECUM = "https://www.media.poste.it/4ab87274-0f92-4001-9092-2f0cb61662d4/file/vademecum-antifrode-clienti-poste-italiane-postepay";

const SDA_CHARTER = "https://www.sda.it/wps/wcm/connect/sda/3f9805ae-7f51-4fc0-9c7d-3e972381d5de/Carta+dei+Servizi+SDA+Express+Courier+maggio+2024.pdf?MOD=AJPERES&CVID=o.8KrmC";

const INTESA_CONTACTS = "https://www.intesasanpaolo.com/it/common/landing/sicurezza-online/contatti.html";
const INTESA_PHISHING = "https://www.intesasanpaolo.com/it/persone-e-famiglie/bisogni/sicurezza-digitale/phishing-bancario.html";
const INTESA_SECURITY = "https://www.intesasanpaolo.com/it/common/landing/sicurezza-online.html";

const UNICREDIT_CALL = "https://www.unicredit.it/it/contatti-e-agenzie/telefonaci.html";
const UNICREDIT_CARDS = "https://www.unicredit.it/it/contatti-e-agenzie/blocco-carte.html";
const UNICREDIT_SCAMS = "https://www.unicredit.it/it/info/sicurezza-banca/scopri/riconosci-e-difenditi-dalle-truffe/truffe-digitali.html";

const INPS_CONTACT = "https://www.inps.it/it/it/sedi-e-contatti/contatti/contact-center-multicanale.html";
const INPS_SMS_2025 = "https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2025.04.truffe-l-inps-invia-solo-sms-senza-link-cliccabili.html";
const INPS_SMISHING_2026 = "https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.08.smishing-con-ai-attacchi-e-truffe-diventano-sempre-pi-pericolosi.html";
const INPS_VADEMECUM = "https://www.inps.it/it/it/inps-comunica/dossier/vademecum-antitruffe/vademecum.html";

const ENTRATE_CALL = "https://www.agenziaentrate.gov.it/portale/contatta/assistenza-fiscale/con-una-chiamata";
const ENTRATE_PHISHING_OCT_2026 = "https://www.agenziaentrate.gov.it/portale/avviso-del-23-ottobre-2026-phishing-false-richieste-di-pagamento-relative-alla-dichiarazione-dei-redditi";
const ENTRATE_DEFEND = "https://www.agenziaentrate.gov.it/portale/focus-sul-phishing/come-difendersi";
const ENTRATE_SPOOFING = "https://www.agenziaentrate.gov.it/portale/avviso-del-1%C2%B0-aprile-2026-nuove-segnalazioni-di-smishing/sms-spoofing";

const ENEL_SCAMS = "https://www.enel.it/it-it/assistenza/luce-gas/truffe";
const ENEL_CONTACTS = "https://www.enel.it/it-it/assistenza/contatti";

const TIM_CONTACT = "https://www.tim.it/assistenza/per-la-tua-linea/come-contattare-tim";
const TIM_BESIDE_YOU = "https://www.tim.it/assistenza/per-la-tua-linea/tim-al-tuo-fianco";

const VODAFONE_CONTACT = "https://privati.vodafone.it/privati/area-supporto/contattaci";
const VODAFONE_GENUINE = "https://www.vodafone.it/privati/area-supporto/contratti-aggiornamenti/aggiornamenti-commerciali/riconoscere-comunicazioni-vodafone-autentiche-distinguerle-truffe.html";
const VODAFONE_DEFENCE = "https://www.vodafone.it/privati/area-supporto/assistenza-linea/spam-truffe-telefoniche/difesa-truffe-telefoniche.html";
const VODAFONE_COMMON = "https://www.vodafone.it/privati/area-supporto/assistenza-linea/spam-truffe-telefoniche/truffe-telefoniche-piu-diffuse.html";
const VODAFONE_NUMBERS = "https://www.vodafone.it/privati/area-supporto/numeri-utili.html";

const BRT_FAQ = "https://www.brt.it/it/servizio-clienti/faq/";
const BRT_ALERT_2026 = "https://www.brt.it/it/news/2026/04/16/alert-phishing-sms-email/";

const DHL_FRAUD = "https://www.dhl.com/it-it/home/footer/fraud-awareness.html";
const DHL_EXPRESS_CONTACT = "https://mydhl.express.dhl/it/it/help-and-support.html#/contact_us";

const AMAZON_FAKE_EMAIL = "https://www.amazon.it/gp/help/customer/display.html?nodeId=Teu845SZK0ApsIgmGC";
const AMAZON_SCAMS = "https://www.amazon.it/gp/help/customer/display.html?nodeId=TapjnwRvIRtlgyLPSl";
const AMAZON_SMS = "https://www.amazon.it/gp/help/customer/display.html?nodeId=T2W6VB0DExBF3oyVvx";
const AMAZON_PHONE = "https://www.amazon.it/gp/help/customer/display.html?nodeId=T3rnIphp327SSKYl8e";

const ON_11 = "2026-11-11";
const GLS_SECURITY = "https://gls-group.com/IT/it/gls-informa/sicurezza/";
const GLS_MISUSE = "https://gls-group.com/IT/it/misuse-gls-brand-fraud/";
const GLS_FAQ = "https://gls-group.com/IT/it/faq/";

const WINDTRE_CHARTER = "https://www.windtre.it/Document/footer/carta-servizi-obiettivi-qualita/2026/CdS-W3-marzo-2026.pdf";
const ILIAD_CONTACTS = "https://assistenza.iliad.it/privati/mobile/supporto/numero-servizio-clienti-e-contatti-ufficiali";
const FASTWEB_CHANNELS = "https://www.fastweb.it/adsl-fibra-ottica/info-canali-assistenza/";
const FASTWEB_HELP = "https://www.fastweb.it/myfastweb/assistenza/guide/come-richiedere-assistenza/";
const NEXI_SECURITY = "https://www.nexi.it/it/carte-di-pagamento/sicurezza";
const NEXI_CONTACT = "https://www.nexi.it/it/assistenza-clienti/carte/contattaci-carte";

const BPER_SECURITY = "https://www.bper.it/privati/servizi-digitali/sicurezza-online";
const BPER_NUMBERS = "https://www.bper.it/footer/numeri-utili";
const BPER_BROCHURE = "https://www.bper.it/documents/d/bper/brochurebper_sicurezza_informatica";
const BANCOBPM_SHEET = "https://www.bancobpm.it/DWN/trasparenza/Documenti/64243.pdf";
const BANCOBPM_ASSIST = "https://youweb.bancobpm.it/assistenza.html";
const BANCOBPM_CARDS = "https://www.bancobpm.it/blocco-carte/";
const BANCOBPM_STORNO = "https://www.bancobpm.it/magazine/privati/tutela-la-tua-sicurezza/come-riconoscere-proteggersi-truffa-storno/";
const HERA_CONTACTS = "https://heracomm.gruppohera.it/contatti";
const HERA_SAFE_NUMBERS = "https://heracomm.gruppohera.it/contatti/numeri-sicuri-hera";
const A2A_CONTACTS = "https://www.a2a.it/assistenza/contatti";
const A2A_SUSPICIOUS = "https://www.a2a.it/assistenza/chiamate-sospette";
const A2A_DIGITAL_REMINDERS = "https://www.a2a.it/assistenza/faq/bollette/solleciti-digitali";

const TELEPASS_SUPPORT = "https://www.telepass.com/it/privati/supporto";
const TELEPASS_FRAUD = "https://www.telepass.com/it/gruppo/news-eventi/attenzione-alle-truffe-e-ai-tentativi-di-frode";
const TELEPASS_SCAM_2026 = "https://www.telepass.com/it/gruppo/news-eventi/attenzione-tentativi-truffa-online-nome-telepass";
const TELEPASS_PHISHING = "https://www.telepass.com/it/sicurezza/phishing";

export const ORGANISATIONS: Organisation[] = [
  {
    id: "poste",
    name: "Poste Italiane",
    type: "poste",
    names: ["poste italiane", "poste", "posteinfo", "bancoposta", "postepay", "postemobile", "sda", "sda express courier"],
    brandWords: ["poste", "posteitaliane", "postepay", "bancoposta", "postemobile", "posteid", "sda"],
    officialDomains: [
      { domain: "poste.it", source: POSTE_SCAMS, checked: ON },
      { domain: "posteitaliane.it", source: POSTE_SCAMS, checked: ON },
      { domain: "postepay.it", source: "https://www.poste.it/assistenza/faq-sicurezza-online", checked: ON },
      { domain: "postemobile.it", source: POSTE_CALL, checked: ON },
      { domain: "sda.it", source: SDA_CHARTER, checked: "2026-11-11" },
    ],
    phones: [
      { number: "+39 06 4526 3322", purpose: "Servizi finanziari, Internet Banking, App Poste Italiane, BancoPosta e Postepay (da cellulare e fisso, dall'Italia e dall'estero)", source: POSTE_CALL, checked: ON, shownAs: "accounts_cards" },
      { number: "803 160", purpose: "Corrispondenza e pacchi, da rete fissa (gratuito)", source: POSTE_CALL, checked: ON, shownAs: "parcels_landline" },
      { number: "+39 06 4526 3160", purpose: "Corrispondenza e pacchi, da cellulare e fisso, dall'Italia e dall'estero", source: POSTE_CALL, checked: ON },
      { number: "800 003 322", purpose: "Blocco carte, codice dispositivo, Postepay smarrita o rubata (gratuito)", source: POSTE_CALL, checked: ON },
      { number: "800 851 166", purpose: "Blocco Carta BancoPosta Classica, Oro, CREDit-easy (dall'Italia)", source: POSTE_CALL, checked: ON },
      { number: "+39 0432 74 41 09", purpose: "Blocco Carta BancoPosta Classica, Oro, CREDit-easy (dall'estero)", source: POSTE_CALL, checked: ON },
      { number: "800 822 056", purpose: "Blocco Carta BancoPosta Ricaricabile e Più (dall'Italia)", source: POSTE_CALL, checked: ON },
      { number: "+39 02 60 84 37 68", purpose: "Blocco Carta BancoPosta Ricaricabile e Più (dall'estero)", source: POSTE_CALL, checked: ON },
      { number: "+39 06 4526 3893", purpose: "Reset password SPID Poste", source: POSTE_CALL, checked: ON },
      { number: "+39 06 977 977 77", purpose: "Assistenza SPID Poste", source: POSTE_CALL, checked: ON },
      { number: "160", purpose: "PosteMobile e PosteCasa Ultraveloce (gratuito)", source: POSTE_CALL, checked: ON },
      { number: "+39 371 1000 160", purpose: "PosteMobile dall'estero", source: POSTE_CALL, checked: ON },
      { number: "800 316 181", purpose: "Poste Vita (gratuito)", source: POSTE_CALL, checked: ON },
      { number: "800 131 811", purpose: "Poste Assicura (gratuito)", source: POSTE_CALL, checked: ON },
    ],
    smsSenders: [{ name: "PosteInfo", source: POSTE_VADEMECUM, checked: ON }],
    rules: [
      { quote: "Poste Italiane e PostePay non chiedono mai di fornire credenziali di accesso, codici di sicurezza, dati personali e dati delle carte di pagamento", source: POSTE_SECURITY, checked: ON },
      { quote: "non chiedono mai di installare app come strumento per la sicurezza.", source: POSTE_SECURITY, checked: ON },
      { quote: "Poste Italiane o le Autorità non ti chiederanno mai […] di trasferire denaro o di fornire dati della tua carta, codici OTP", source: POSTE_SCAMS, checked: ON },
      { quote: "il Numero Verde di Poste Italiane dedicato all'Assistenza Clienti è abilitato esclusivamente a ricevere le chiamate.", source: POSTE_VADEMECUM, checked: ON },
    ],
    reviewNotes: [
      "Shown (decided 2026-11-07: show both): +39 06 4526 3322 for accounts, cards and the app (any phone), and 803 160 for parcels and letters (free, landline only). Poste has no free financial line from a landline in this list.",
      "PosteInfo is named in the anti-fraud guide (PDF, October 2024) as a sender scammers imitate. poste.it says fake SMS can land inside the real Poste thread, so the sender name proves nothing on its own.",
      "800 003 322: the same page gives 'lunedì al sabato 8:00-20:00' in one place and '24 ore su 24' for card loss.",
      "In the BancoPosta card-loss block, the printed +39 06 4526 33 22 links to a different number (+390282443332). The printed number matches the rest of the page.",
      "\"poste\" in names also matches \"vai alle poste\", which means the post office: that is Poste Italiane too.",
      "SDA Express Courier is listed here, not on its own: since 1/11/2019 its consumer courier services are part of Poste Italiane, and sda.it sends private customers to poste.it (https://www.sda.it/wps/portal/SDAit/Assistenza, read 2026-11-11). So an \"SDA\" message gets Poste's numbers, including the parcels line. SDA's 800.210.170 is only for banks, insurers and public bodies: not listed.",
    ],
    reviewed: null,
  },
  {
    id: "intesa-sanpaolo",
    name: "Intesa Sanpaolo",
    type: "bank",
    names: ["intesa sanpaolo", "intesa san paolo", "intesasanpaolo", "intesasp"],
    brandWords: ["intesa", "intesasanpaolo", "sanpaolo"],
    officialDomains: [{ domain: "intesasanpaolo.com", source: "https://www.intesasanpaolo.com/it/persone-e-famiglie/login-page.html", checked: ON }],
    phones: [
      { number: "800.303.303", purpose: "Assistenza privati e banca online, blocco carte (numero verde, da fisso e cellulare)", source: INTESA_CONTACTS, checked: ON, shownAs: "free_any" },
      { number: "+39.011.8019.200", purpose: "Assistenza privati e blocco carte, dall'estero", source: INTESA_CONTACTS, checked: ON },
      { number: "800.312.316", purpose: "Assistenza clienti Inbiz (imprese)", source: INTESA_CONTACTS, checked: ON },
      { number: "00.800.100.20.200", purpose: "Inbiz dall'estero (numero verde internazionale)", source: INTESA_CONTACTS, checked: ON },
      { number: "+39.011.6286640", purpose: "Inbiz da altri Paesi", source: INTESA_CONTACTS, checked: ON },
    ],
    smsSenders: [],
    rules: [
      { quote: "Intesa Sanpaolo non ti chiederà mai di comunicare, inserire o confermare dati personali, password o numeri di carta di credito via email, SMS, telefono…", source: INTESA_PHISHING, checked: ON },
      { quote: "Non sarà mai Intesa Sanpaolo a contattarti per chiederti codici personali", source: INTESA_SECURITY, checked: ON },
      { quote: "I Numeri Verdi (800.303.303 - 800.312.316 e 00.800.100.20.200) sono abilitati solo a ricevere le chiamate. Non riceverai mai una chiamata da questo numero.", source: INTESA_CONTACTS, checked: ON },
    ],
    reviewNotes: [
      "No page names the domain in its text: intesasanpaolo.com comes from the address of the homepage and login page. No other domain was found.",
      "The FAQ gives different card-loss numbers (800.444.223, +39 0287109001) from the card-block page; deleted as probably outdated (decided 2026-11-07).",
      "Its pages warn that fake SMS can land inside the bank's real SMS thread.",
      "The card-block page (https://www.intesasanpaolo.com/it/common/footer/emergenza-carte.html) lists the same two numbers as the contacts page: 800.303.303 and +39 011.80.19.200.",
    ],
    reviewed: null,
  },
  {
    id: "unicredit",
    name: "UniCredit",
    type: "bank",
    names: ["unicredit"],
    brandWords: ["unicredit"],
    officialDomains: [{ domain: "unicredit.it", source: "https://www.unicredit.it/it/contatti-e-agenzie.html", checked: ON }],
    phones: [
      { number: "800.57.57.57", purpose: "Servizio Clienti Privati e Famiglie, blocco carte di debito (numero verde)", source: UNICREDIT_CALL, checked: ON, shownAs: "toll_free" },
      { number: "+39.02.33408973", purpose: "Servizio Clienti e blocco carte di debito, dall'estero", source: UNICREDIT_CALL, checked: ON },
      { number: "800.32.32.85", purpose: "Chi non è ancora cliente", source: UNICREDIT_CALL, checked: ON },
      { number: "800.710.710", purpose: "Private Banking", source: UNICREDIT_CALL, checked: ON },
      { number: "848.88.00.88", purpose: "Imprese, Banca via Internet (tariffa ripartita)", source: UNICREDIT_CALL, checked: ON },
      { number: "+39.02.33408967", purpose: "Imprese, dall'estero e dai cellulari", source: UNICREDIT_CALL, checked: ON },
      { number: "800.078777", purpose: "Blocco carte di credito e prepagate", source: UNICREDIT_CARDS, checked: ON },
      { number: "+39.045.8064686", purpose: "Blocco carte di credito e prepagate, dall'estero", source: UNICREDIT_CARDS, checked: ON },
      { number: "800.290915", purpose: "Blocco carte buddy", source: UNICREDIT_CARDS, checked: ON },
      { number: "800.044662", purpose: "Blocco Apple Pay, Google Pay, Samsung Pay", source: UNICREDIT_CARDS, checked: ON },
    ],
    smsSenders: [],
    rules: [
      { quote: "Ricorda, UniCredit non ti chiederà mai: / password o codici dispositivi / PIN o codici di sicurezza della carta", source: UNICREDIT_SCAMS, checked: ON },
      { quote: "Un SMS della banca: / non contiene mai link alla pagina di accesso alla Banca via Internet / non chiede mai dati o operazioni urgenti", source: UNICREDIT_SCAMS, checked: ON },
      { quote: "non riporta mai un numero di cellulare da contattare", source: UNICREDIT_SCAMS, checked: ON },
    ],
    reviewNotes: [
      "800.57.57.57 (customer service) and 800.575757 (debit-card block) are the same number written two ways; listed once.",
    ],
    reviewed: null,
  },
  {
    id: "telepass",
    name: "Telepass",
    type: "other",
    names: ["telepass"],
    brandWords: ["telepass"],
    officialDomains: [{ domain: "telepass.com", source: "https://www.telepass.com/it/gruppo/news-eventi/attenzione-ai-tentativi-di-phishing", checked: ON }],
    phones: [
      { number: "069 71 666 71", purpose: "Assistenza Clienti (lunedì-venerdì 9:00-17:30), anche furto o smarrimento del dispositivo", source: TELEPASS_SUPPORT, checked: ON, shownAs: "plain" },
      { number: "800 713 670", purpose: "Assistenza tecnica TBusiness", source: TELEPASS_FRAUD, checked: ON },
      { number: "068 941 63 60", purpose: "Assistenza Clienti Telepass Assicura", source: TELEPASS_FRAUD, checked: ON },
    ],
    smsSenders: [],
    requestsPaymentByMessage: {
      quote: "Fanno eccezione eventuali comunicazioni inviate nell'ambito di attività di gestione e recupero crediti su posizioni insolute",
      source: TELEPASS_SCAM_2026,
      checked: ON,
    },
    rules: [
      { quote: "Gli operatori Telepass non chiedono mai ai propri clienti di fornire alcun dato di questo tipo.", source: TELEPASS_FRAUD, checked: ON },
      { quote: "Telepass non richiede password, PIN, dati bancari o informazioni riservate tramite link contenuti in messaggi non richiesti o sondaggi online.", source: TELEPASS_SCAM_2026, checked: ON },
      { quote: "Non condividere la tua password o il tuo PIN con nessuno. Queste informazioni sono riservate e non ti chiederemo mai di rivelare questi dettagli.", source: TELEPASS_PHISHING, checked: ON },
    ],
    reviewNotes: [
      "A May 2026 article says Telepass may send real payment links for unpaid amounts (requestsPaymentByMessage), and may phone in some cases. Once reviewed, a Telepass payment request whose links all go to telepass.com gets 🟠 with a \"check on its site yourself\" line instead of 🔴.",
      "069 71 666 71 is printed that way; it dials 06 9716 6671.",
    ],
    reviewed: null,
  },
  {
    id: "inps",
    name: "INPS",
    type: "public_body",
    names: ["inps", "istituto nazionale della previdenza sociale"],
    brandWords: ["inps"],
    officialDomains: [{ domain: "inps.it", source: INPS_SMISHING_2026, checked: ON }],
    phones: [
      { number: "803 164", purpose: "Contact Center, gratuito da telefono fisso", source: INPS_CONTACT, checked: ON, shownAs: "from_landline" },
      { number: "06 164 164", purpose: "Contact Center da cellulare (a pagamento secondo il gestore)", source: INPS_CONTACT, checked: ON, shownAs: "from_mobile" },
      { number: "800 434 320", purpose: "Numero verde per la Certificazione Unica, solo durante la campagna", source: INPS_CONTACT, checked: ON },
    ],
    smsSenders: [],
    rules: [
      { quote: "le notifiche ufficiali dell'Istituto inviate tramite SMS, relative agli esiti di lavorazione delle pratiche o ai pagamenti, non contengono mai link cliccabili.", source: INPS_SMS_2025, checked: ON },
      { quote: "L'Istituto ricorda che non invia mai e-mail o SMS con link per confermare dati o ricevere rimborsi", source: INPS_SMISHING_2026, checked: ON },
      { quote: "non chiede dati bancari via email o SMS;", source: INPS_VADEMECUM, checked: ON },
      { quote: "L'INPS non manda mai personale presso le abitazioni.", source: INPS_VADEMECUM, checked: ON },
    ],
    reviewNotes: [
      "Shown (decided 2026-11-07: show both): 803 164, free from a landline, and 06 164 164 from a mobile.",
      "INPS states \"L'unico sito ufficiale è www.inps.it\", so inps.gov.it (it redirects to inps.it) is not listed.",
      "The contact page also lists free numbers for calling from 11 European countries; left out, as they are foreign numbers.",
      "Hours: Monday to Friday 8:00-20:00, Saturday 8:00-14:00.",
    ],
    reviewed: null,
  },
  {
    id: "agenzia-entrate",
    name: "Agenzia delle Entrate",
    type: "public_body",
    names: ["agenzia delle entrate", "agenzia entrate", "agenziaentrate"],
    brandWords: ["agenziaentrate"],
    officialDomains: [
      { domain: "agenziaentrate.gov.it", source: ENTRATE_PHISHING_OCT_2026, checked: ON },
      { domain: "agenziaentrateriscossione.gov.it", source: "https://www.agenziaentrate.gov.it/portale/web/guest/", checked: ON },
    ],
    phones: [
      { number: "800.90.96.96", purpose: "Call center, numero verde da rete fissa (operatore lunedì-venerdì 9-17)", source: ENTRATE_CALL, checked: ON, shownAs: "from_landline" },
      { number: "06.97617689", purpose: "Call center da cellulare (a carico del chiamante)", source: ENTRATE_CALL, checked: ON, shownAs: "from_mobile" },
      { number: "0039 06.45470468", purpose: "Call center dall'estero", source: ENTRATE_CALL, checked: ON },
      { number: "800.89.41.41", purpose: "Centro Operativo di Pescara, numero verde da rete fissa", source: ENTRATE_CALL, checked: ON },
      { number: "800.89.35.35", purpose: "Centro Operativo di Pescara, numero verde da rete fissa", source: ENTRATE_CALL, checked: ON },
      { number: "+39 0697619750", purpose: "Centro Operativo di Pescara da cellulare e dall'estero", source: ENTRATE_CALL, checked: ON },
    ],
    smsSenders: [],
    rules: [
      { quote: "L'Agenzia delle Entrate non invia mai per posta elettronica comunicazioni contenenti dati personali dei contribuenti.", source: ENTRATE_DEFEND, checked: ON },
      { quote: "Il mittente di questi messaggi è contraffatto tramite la tecnica cosiddetta di \"sms spoofing\"", source: ENTRATE_SPOOFING, checked: ON },
    ],
    reviewNotes: [
      "Shown (decided 2026-11-07: show both): 800.90.96.96, free from a landline, and 06.97617689 from a mobile.",
      "agenziaentrateriscossione.gov.it belongs to Agenzia delle Entrate-Riscossione, a separate body linked from the homepage. It is listed so that its real links don't count as a fake of Agenzia delle Entrate.",
      "A regional page from 2020 still shows old numbers (06.96668907, 0039.06.96668933): not used.",
      "No page states \"we never ask for X by SMS\"; the notices disown each campaign instead.",
      "The site lists fake domains already used in phishing (https://www.agenziaentrate.gov.it/portale/focus-sul-phishing/domini-estranei-all-agenzia-delle-entrate): useful later as a blocklist.",
    ],
    reviewed: null,
  },
  {
    id: "enel-energia",
    name: "Enel Energia",
    type: "utility",
    names: ["enel energia", "enel"],
    brandWords: ["enel", "enelenergia"],
    officialDomains: [
      { domain: "enel.it", source: ENEL_SCAMS, checked: ON },
      { domain: "enel.com", source: ENEL_SCAMS, checked: ON },
    ],
    phones: [
      { number: "140", purpose: "Servizio clienti, gratuito da fisso e cellulare (tutti i giorni 7:00-22:00, festività escluse)", source: ENEL_CONTACTS, checked: ON, shownAs: "free_any" },
      { number: "+390664511012", purpose: "Servizio clienti dall'estero", source: ENEL_CONTACTS, checked: ON },
    ],
    smsSenders: [{ name: "Enel Energia", source: ENEL_SCAMS, checked: ON }],
    rules: [
      { quote: "Enel Energia non richiede mai password, PIN, OTP o codici di accesso tramite SMS o chat, a meno che non sia tu a contattarci.", source: ENEL_SCAMS, checked: ON },
      { quote: "Invitiamo a non effettuare alcun pagamento su IBAN o QR code forniti via mail/messaggio/telefono.", source: ENEL_SCAMS, checked: ON },
      { quote: "Il numero gratuito 140 è l'unico canale telefonico ufficiale per ricevere assistenza sui servizi Enel.", source: ENEL_SCAMS, checked: ON },
    ],
    reviewNotes: [
      "The old number 800.900.860 is no longer active (https://www.enel.it/it-it/blog/guide/numero-140-enel) but still appears in some boxes on the scams page: not listed.",
      "800.069.850 on the contacts page is for Enel X Way (electric mobility), not Enel Energia: not listed.",
      "\"Enel Energia\" as SMS sender: sender names can be faked, so it proves nothing on its own.",
    ],
    reviewed: null,
  },
  {
    id: "tim",
    name: "TIM",
    type: "phone_operator",
    names: ["tim", "telecom italia"],
    brandWords: ["tim", "telecomitalia", "mytim"],
    officialDomains: [
      { domain: "tim.it", source: "https://www.tim.it/", checked: ON },
      { domain: "gruppotim.it", source: TIM_BESIDE_YOU, checked: ON },
    ],
    phones: [
      { number: "119", purpose: "Servizio Clienti linea mobile, gratuito, 24 ore su 24", source: TIM_CONTACT, checked: ON, shownAs: "mobile_line" },
      { number: "187", purpose: "Servizio Clienti linea fissa, gratuito, 24 ore su 24", source: TIM_CONTACT, checked: ON, shownAs: "fixed_line" },
      { number: "+390285951", purpose: "Dall'estero, linea fissa (centralino che passa il 187)", source: TIM_CONTACT, checked: ON },
      { number: "+390636881", purpose: "Dall'estero, linea fissa (centralino che passa il 187)", source: TIM_CONTACT, checked: ON },
      { number: "+393399119", purpose: "Dall'estero, linea mobile, al posto del 119", source: TIM_CONTACT, checked: ON },
      { number: "+393346846826", purpose: "WhatsApp con cui TIM scrive ai clienti con una richiesta di assistenza aperta; non riceve messaggi", source: TIM_BESIDE_YOU, checked: ON },
    ],
    smsSenders: [],
    rules: [
      { quote: "Gli operatori del Servizio Clienti TIM e gli operatori partner di TIM chiamano sempre da un numero in chiaro (non usano numeri anonimi) e ricontattabile", source: TIM_BESIDE_YOU, checked: ON },
    ],
    reviewNotes: [
      "Shown (decided 2026-11-07: show both): 119 for the mobile line and 187 for the landline, both free.",
      "tim.it comes from the address of the homepage and contacts page, not from a sentence naming it. The MyTIM login is on mytim.tim.it.",
      "No page states \"TIM never asks for password/PIN/OTP\".",
      "\"tim\" is short: it only matches a whole part of a site name (tim-premi.xyz yes, ultimate.com no) and a whole word in a message.",
    ],
    reviewed: null,
  },
  {
    id: "vodafone",
    name: "Vodafone",
    type: "phone_operator",
    names: ["vodafone"],
    brandWords: ["vodafone"],
    officialDomains: [
      { domain: "vodafone.it", source: "https://www.vodafone.it/privati/area-supporto/contratti-aggiornamenti/privacy/comandamenti-privacy-vodafone.html", checked: ON },
      { domain: "vodafone.pec.it", source: VODAFONE_DEFENCE, checked: ON },
      { domain: "fastwebvodafone.it", source: VODAFONE_GENUINE, checked: ON },
    ],
    phones: [
      { number: "190", purpose: "Servizio Clienti, gratuito dai numeri Vodafone (tutti i giorni 8-22; di notte solo per bloccare la SIM)", source: VODAFONE_CONTACT, checked: ON, shownAs: "free_customers" },
      { number: "800 100 195", purpose: "Servizio Clienti, gratuito da rete fissa e da cellulari di altri operatori (8:00-22:00)", source: VODAFONE_CONTACT, checked: ON, shownAs: "free_others" },
      { number: "+39 349 2000190", purpose: "Servizio Clienti dall'estero, gratuito (8:00-22:00 ora italiana)", source: VODAFONE_CONTACT, checked: ON },
      { number: "3499190190", purpose: "TOBi su WhatsApp (assistente digitale, non una linea vocale)", source: VODAFONE_NUMBERS, checked: ON },
    ],
    smsSenders: [],
    rules: [
      { quote: "Vodafone non ti chiederà mai di inviare il tuo documento di identità o i tuoi dati personali su canali non ufficiali", source: VODAFONE_GENUINE, checked: ON },
      { quote: "Vodafone non comunica mai con una telefonata aumenti o variazioni nei piani tariffari.", source: VODAFONE_COMMON, checked: ON },
      { quote: "Vodafone non ti chiama da numerazioni anonime o numerazioni cellulari generiche", source: VODAFONE_DEFENCE, checked: ON },
    ],
    reviewNotes: [
      "Vodafone in Italy is now a brand licensed to Fastweb S.p.A. fastwebvodafone.it is only a footer link to the parent company's careers pages; it is listed so that it isn't taken for a fake Vodafone site.",
      "Suspicious SMS can be forwarded for free to 40214 (an SMS-only reporting number, not listed as a phone).",
      "A real Vodafone SMS can contain a link (order status on landing.vodafone.it), so a link alone proves nothing.",
    ],
    reviewed: null,
  },
  {
    id: "brt",
    name: "BRT",
    type: "courier",
    names: ["brt", "bartolini"],
    brandWords: ["brt", "mybrt", "bartolini"],
    officialDomains: [
      { domain: "brt.it", source: BRT_FAQ, checked: ON },
      { domain: "mybrt.it", source: BRT_FAQ, checked: ON },
    ],
    phones: [],
    smsSenders: [],
    rules: [
      { quote: "Invitiamo a leggere con attenzione il mittente delle email e, nel dubbio, a non cliccare su eventuali link o scaricare allegati", source: BRT_ALERT_2026, checked: ON },
      { quote: "I nostri operatori addetti al ritiro utilizzano mezzi e abbigliamento completo con logo BRT.", source: "https://www.brt.it/it/news/2024/12/11/alert-truffa-in-fase-di-ritiro/", checked: ON },
    ],
    reviewNotes: [
      "BRT has no national phone line for consumers: \"Il servizio clienti BRT è fornito localmente\" (https://services.brt.it/it/assistenza). So \"What to do\" keeps the general courier advice.",
      "Real BRT emails and SMS do contain links, for tracking and for releasing a held parcel (FAQ). Safer advice is to type the BRTcode on brt.it.",
    ],
    reviewed: null,
  },
  {
    id: "dhl",
    name: "DHL",
    type: "courier",
    names: ["dhl", "dhl express"],
    brandWords: ["dhl", "mydhl"],
    officialDomains: [
      { domain: "dhl.com", source: DHL_FRAUD, checked: ON },
      { domain: "dpdhl.com", source: DHL_FRAUD, checked: ON },
      { domain: "dhl-news.com", source: DHL_FRAUD, checked: ON },
      { domain: "express.dhl", source: "https://mydhl.express.dhl/content/dam/downloads/it/it/footer/express_code_of_quality_it_it.pdf", checked: ON },
      { domain: "dhl.it", source: DHL_FRAUD, checked: ON },
      { domain: "dhl.de", source: DHL_FRAUD, checked: ON },
      { domain: "dhl.fr", source: DHL_FRAUD, checked: ON },
    ],
    phones: [
      { number: "199.199.345", purpose: "Servizio Clienti DHL Express (lunedì-venerdì 8.00-18.30). A pagamento: fino a 14,49 cent/min da fisso, 48,8 cent/min da cellulare, più 15,75 cent alla risposta", source: DHL_EXPRESS_CONTACT, checked: ON, shownAs: "paid_call" },
      { number: "+39 0230453420", purpose: "Assistenza DHL Express su WhatsApp, 24 ore su 24 (non una linea vocale)", source: "https://mydhl.express.dhl/it/it/ship/solutions/tracking-tools.html", checked: ON },
    ],
    smsSenders: [],
    requestsPaymentByMessage: {
      quote: "Gli unici pagamenti che DHL richiede via e-mail o SMS sono i pagamenti di dazi doganali e tasse.",
      source: DHL_FRAUD,
      checked: ON,
    },
    rules: [
      { quote: "Gli unici pagamenti che DHL richiede via e-mail o SMS sono i pagamenti di dazi doganali e tasse.", source: DHL_FRAUD, checked: ON },
      { quote: "Per inviare le e-mail non utilizziamo mai @gmail, @yahoo o altri servizi di posta elettronica gratuiti.", source: DHL_FRAUD, checked: ON },
      { quote: "Non aggiungiamo mai link di altri siti web diversi dai nostri", source: DHL_FRAUD, checked: ON },
    ],
    reviewNotes: [
      "199.199.345 is DHL's only phone line and a paid \"numero unico\" (up to 48.8 cents a minute from a mobile). Shown with the label \"a pagamento\" (decided 2026-11-07).",
      "DHL really does ask for customs duties by email and SMS, after sending the recipient an OTP (requestsPaymentByMessage). Once reviewed, a DHL payment request whose links all go to DHL's own sites gets 🟠 with a \"check on its site yourself\" line instead of 🔴.",
      "dhl.it, dhl.de and dhl.fr: the page says mail can come from \"indirizzi con domini nazionali dopo @dhl (ad es. @dhl.de, @dhl.fr, @dhl.ae)\". dhl.it isn't named on the page; kept as covered by that rule (decided 2026-11-07).",
      "express.dhl: DHL owns the .dhl ending; the page names the site mydhl.express.dhl.",
      "\"dhl\" is short: it only matches a whole part of a site name and a whole word in a message.",
    ],
    reviewed: null,
  },
  {
    id: "amazon",
    name: "Amazon",
    type: "courier",
    names: ["amazon"],
    brandWords: ["amazon"],
    officialDomains: [
      { domain: "amazon.it", source: AMAZON_SCAMS, checked: ON },
      { domain: "amazon.com", source: AMAZON_FAKE_EMAIL, checked: ON },
      { domain: "amazon.jobs", source: AMAZON_SCAMS, checked: ON },
    ],
    phones: [],
    smsSenders: [],
    rules: [
      { quote: "Amazon non ti chiederà mai tramite messaggio di testo di fornire informazioni personali, dettagli di pagamento, codici di buoni regalo […]", source: AMAZON_SMS, checked: ON },
      { quote: "Amazon non ti chiederà mai tramite messaggio di testo […] di chiamare un numero di telefono.", source: AMAZON_SMS, checked: ON },
      { quote: "i rappresentanti legittimi di Amazon non chiederanno mai le password monouso al telefono.", source: AMAZON_PHONE, checked: ON },
      { quote: "Se l'email non appare nel Centro Messaggi, significa che non è stata inviata da Amazon.", source: AMAZON_FAKE_EMAIL, checked: ON },
    ],
    reviewNotes: [
      "Amazon prints no customer-service phone number; it is reached through the Servizio clienti hub on amazon.it. So \"What to do\" keeps the general advice.",
      "Typed as \"courier\", because Amazon messages are about orders and deliveries and that advice (check on the shop's site yourself) fits.",
      "Amazon offers a check of its own: \"Verifica una chiamata o un messaggio\" on account-status.amazon.it, and forwarding to verify@amazon.it. Could be added to the advice later.",
    ],
    reviewed: null,
  },
  {
    id: "gls",
    name: "GLS",
    type: "courier",
    names: ["gls", "gls italy"],
    brandWords: ["gls", "glsitaly"],
    officialDomains: [
      { domain: "gls-italy.com", source: GLS_SECURITY, checked: ON_11 },
      { domain: "gls-group.com", source: GLS_FAQ, checked: ON_11 },
    ],
    phones: [
      { number: "800184726", purpose: "Customer Care centralizzato (numero verde)", source: GLS_FAQ, checked: ON_11, shownAs: "toll_free" },
      { number: "02.98.03.55.56", purpose: "Stato della spedizione, con risponditore automatico", source: GLS_FAQ, checked: ON_11 },
    ],
    smsSenders: [],
    requestsPaymentByMessage: {
      quote: "potreste essere contattati per il pagamento di dazi e tasse tramite e-mail, SMS o lettera da GLS o da un agente autorizzato.",
      source: GLS_MISUSE,
      checked: ON_11,
    },
    rules: [
      { quote: "GLS non richiede mai pagamenti con carta di credito attraverso SMS, WhatsApp o e-mail.", source: GLS_SECURITY, checked: ON_11 },
      { quote: "GLS non richiede la scansione di QR code per effettuare pagamenti finalizzati allo sblocco della spedizione.", source: GLS_SECURITY, checked: ON_11 },
      { quote: "(es. \"Il tuo pacco verrà rispedito al mittente se non paghi entro 24 ore\"). GLS non ti metterà mai fretta in questo modo.", source: GLS_SECURITY, checked: ON_11 },
    ],
    reviewNotes: [
      "The customs-duty request (requestsPaymentByMessage) applies only to parcels from outside the EU or to recipients outside the EU, says the same page. The security page also says GLS never asks for card payments by SMS, WhatsApp or email. Both pages are undated; the misuse page reads like a translated group template.",
      "800184726 is called \"numero verde\"; the page doesn't say whether it works from mobiles.",
      "GLS itself names gls-itali.com and gls-consegne.it as fake look-alike domains: both are caught by our look-alike check.",
      "The contact form runs on glsitaly.service-now.com: service-now.com is not a GLS domain and is not listed.",
    ],
    reviewed: null,
  },
  {
    id: "ups",
    name: "UPS",
    type: "courier",
    names: ["ups"],
    brandWords: ["ups"],
    officialDomains: [{ domain: "ups.com", source: "https://www.ups.com/it/it/Home.page", checked: ON_11 }],
    phones: [],
    smsSenders: [],
    rules: [],
    reviewNotes: [
      "UPS's site refused automated reading (\"Access Denied\" on every page). The only evidence for ups.com is that www.ups.it redirects to https://www.ups.com/it/it/Home.page. Please confirm in a normal browser, and look for phone numbers and an anti-fraud page there: https://www.ups.com/it/it/support/contact-us.page and https://www.ups.com/it/it/support/shipping-support/legal-terms-conditions/fight-fraud",
      "Listed mainly so real UPS tracking links on ups.com aren't taken for fakes (after review they also stop counting as \"open a link\"), and so look-alikes such as ups-consegna.top are caught.",
      "\"ups\" is short: it only matches a whole part of a site name (backups.com doesn't count) and a whole word in a message.",
    ],
    reviewed: null,
  },
  {
    id: "paypal",
    name: "PayPal",
    type: "other",
    names: ["paypal"],
    brandWords: ["paypal"],
    officialDomains: [{ domain: "paypal.com", source: "https://www.paypal.com/it/home/", checked: ON_11 }],
    phones: [],
    smsSenders: [],
    rules: [],
    reviewNotes: [
      "PayPal's site refused automated reading (HTTP 403 on every page). The only evidence for paypal.com is that www.paypal.it redirects to https://www.paypal.com/it/home/. Please confirm in a normal browser: https://www.paypal.com/it/security/learn-about-fake-messages and https://www.paypal.com/it/smarthelp/contact-us",
      "Leads to verify, not facts: an article on PayPal's Italian newsroom (newsroom.it.paypal-corp.com/blog?item=12, dated 9 April 2020) says \"PayPal non ti chiederà mai di fornire la tua password, i numeri di carta di credito, i numeri di conto bancario, … tramite SMS o e-mail\" and that its emails always use your name and surname. It isn't on paypal.com and may be outdated, so it isn't used.",
      "Look-alikes such as paypa1-secure.com are caught (1 is read as l).",
    ],
    reviewed: null,
  },
  {
    id: "windtre",
    name: "WindTre",
    type: "phone_operator",
    names: ["windtre", "wind tre", "wind3"],
    brandWords: ["windtre", "wind3"],
    officialDomains: [
      { domain: "windtre.it", source: WINDTRE_CHARTER, checked: ON_11 },
      { domain: "windtrebusiness.it", source: WINDTRE_CHARTER, checked: ON_11 },
    ],
    phones: [
      { number: "159", purpose: "Customer Care clienti Consumer e Professional, operatore tutti i giorni 8.00-22.00, gratuito per tutti", source: WINDTRE_CHARTER, checked: ON_11, shownAs: "free" },
    ],
    smsSenders: [],
    rules: [
      { quote: "manterranno i contatti con i Clienti attraverso diverse modalità: chiamata telefonica APP WINDTRE e WINDTRE BUSINESS comunicazioni via mail o PEC.", source: WINDTRE_CHARTER, checked: ON_11 },
    ],
    reviewNotes: [
      "WindTre's web pages block automated visitors (they redirect to a bot check on validate.perfdrive.com, not followed). Only the service charter PDF (March 2026) could be read. Please check its anti-scam pages in a browser, for example https://www.windtre.it/chiamate-sms-indesiderati and https://www.windtre.it/windtre-informa, for SMS sender names and \"we never ask\" statements.",
      "159 is free \"per tutti, Clienti e non\", except from abroad. The charter doesn't say mobile or landline; labelled just \"gratis\".",
      "\"wind\" alone is not in names: it is an ordinary English word.",
    ],
    reviewed: null,
  },
  {
    id: "iliad",
    name: "Iliad",
    type: "phone_operator",
    names: ["iliad"],
    brandWords: ["iliad"],
    // "iliad" is also the start of "iliade" (the Iliad), as in a bookshop's site.
    brandWholeOnly: true,
    officialDomains: [
      { domain: "iliad.it", source: ILIAD_CONTACTS, checked: ON_11 },
      { domain: "it.iliad.com", source: ILIAD_CONTACTS, checked: ON_11 },
    ],
    phones: [
      { number: "177", purpose: "Servizio clienti, tutti i giorni 8:00-22:00; incluso nell'offerta dalla linea iliad, da altri operatori secondo la loro tariffa", source: ILIAD_CONTACTS, checked: ON_11, shownAs: "free_customers" },
      { number: "+39 3518995177", purpose: "Servizio clienti dall'estero", source: ILIAD_CONTACTS, checked: ON_11 },
    ],
    smsSenders: [{ name: "2030", source: ILIAD_CONTACTS, checked: ON_11 }],
    rules: [
      { quote: "iliad ti contatta solo attraverso i canali ufficiali (servizio Utenti 177, contatti social ufficiali Facebook, Instagram e Twitter, indirizzi e-mail a dominio iliad.it , it.iliad.com )", source: ILIAD_CONTACTS, checked: ON_11 },
      { quote: "non svolge attività di telemarketing né svolge la propria attività su siti diversi da quello ufficiale.", source: ILIAD_CONTACTS, checked: ON_11 },
    ],
    reviewNotes: [
      "SMS sender \"2030\": from a 2022 statement that iliad offers some users a plan change by SMS \"con il numero 2030\". It may be outdated, and it doesn't say whether 2030 is the sender or the number to reply to.",
      "No \"iliad never asks for PIN, OTP or passwords\" statement was found.",
      "brandWholeOnly: \"iliad\" must be a whole part of a site name (iliad-offerta.top counts, iliade-libri.it doesn't). A look-alike written as one word, such as iliadsupporto.com, is missed.",
    ],
    reviewed: null,
  },
  {
    id: "fastweb",
    name: "Fastweb",
    type: "phone_operator",
    names: ["fastweb"],
    brandWords: ["fastweb", "myfastweb"],
    officialDomains: [{ domain: "fastweb.it", source: FASTWEB_HELP, checked: ON_11 }],
    phones: [
      { number: "192.193", purpose: "Servizio clienti amministrativo e tecnico per i clienti Fastweb di rete fissa e mobile, 7 giorni su 7 8.00-24.00, gratuito", source: FASTWEB_CHANNELS, checked: ON_11, shownAs: "free_customers" },
      { number: "+39 3756004193", purpose: "Servizio clienti dall'estero, gratuito dai cellulari Fastweb", source: FASTWEB_CHANNELS, checked: ON_11 },
      { number: "146", purpose: "Informazioni su nuove offerte (commerciale)", source: "https://www.fastweb.it/assistenza/", checked: ON_11 },
      { number: "+393757836519", purpose: "Assistenza su WhatsApp, 24 ore su 24 (solo messaggi)", source: FASTWEB_CHANNELS, checked: ON_11 },
      { number: "3756352311", purpose: "Solo WhatsApp: inviare la prova di un pagamento in ritardo", source: FASTWEB_HELP, checked: ON_11 },
      { number: "02/454445", purpose: "Solo in uscita: il numero da cui il Servizio Clienti richiama chi ha prenotato una chiamata", source: FASTWEB_HELP, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [
      { quote: "Per malfunzionamenti, non ti verrà mai richiesto di fornire documenti o effettuare pagamenti agli incaricati.", source: FASTWEB_HELP, checked: ON_11 },
      { quote: "Dopo l'attivazione, non dovrai più inviare documenti di identità a Fastweb, né gli operatori te li richiederanno per l'assistenza.", source: FASTWEB_HELP, checked: ON_11 },
      { quote: "Al momento del contatto telefonico ti verrà comunicato il codice dell'operatore che gestirà la chiamata.", source: FASTWEB_CHANNELS, checked: ON_11 },
    ],
    reviewNotes: [
      "At activation of a contract or a new SIM, Fastweb may ask for documents and bank details \"anche tramite WhatsApp\". So a document request over WhatsApp isn't proof of a scam then.",
      "192.193: one page says free from the Fastweb network (fixed and mobile), another just \"gratuito\". Labelled \"gratis per i suoi clienti\".",
      "gofw.it is a short-link domain Fastweb uses on its own pages but never calls official: not listed. fastwebvodafone.it is listed under Vodafone.",
      "Suspicious SMS can be forwarded for free to 40214 (SMS only, not listed as a phone).",
    ],
    reviewed: null,
  },
  {
    id: "nexi",
    name: "Nexi",
    type: "bank",
    names: ["nexi"],
    brandWords: ["nexi", "nexipay"],
    officialDomains: [
      { domain: "nexi.it", source: NEXI_SECURITY, checked: ON_11 },
      { domain: "nexigroup.com", source: NEXI_SECURITY, checked: ON_11 },
    ],
    phones: [
      { number: "800 15 16 16", purpose: "Blocco carta dall'Italia, 24 ore su 24, 365 giorni l'anno", source: NEXI_CONTACT, checked: ON_11, shownAs: "card_block" },
      { number: "+39 02 345 444", purpose: "Servizio clienti carte di credito, debito, prepagate e business dall'Italia (tariffa urbana); operatore lunedì-venerdì 9-18", source: NEXI_CONTACT, checked: ON_11, shownAs: "customer_service" },
      { number: "+39 02 3498 0020", purpose: "Blocco carta e servizio clienti dall'estero", source: NEXI_CONTACT, checked: ON_11 },
      { number: "800 55 66 77", purpose: "Carte Excellence (Platinum), Prestige (Gold) e Debit Premium, 24 ore su 24", source: NEXI_CONTACT, checked: ON_11 },
      { number: "800 77 66 44", purpose: "Carta Black (Personal Planner), 24 ore su 24", source: NEXI_CONTACT, checked: ON_11 },
      { number: "800 99 34 00", purpose: "Attivazione carta per telefono, 24 ore su 24", source: NEXI_CONTACT, checked: ON_11 },
      { number: "800 02 48 22", purpose: "Richiesta nuova carta, lunedì-venerdì 9-18", source: NEXI_CONTACT, checked: ON_11 },
      { number: "800 02 01 69", purpose: "Assicurazione, lunedì-venerdì 8-20", source: NEXI_CONTACT, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [
      { quote: "Nexi non chiederà mai i dati della tua Carta, i tuoi PIN o codici di accesso, via telefono, mail o SMS", source: NEXI_SECURITY, checked: ON_11 },
      { quote: "Nexi non ti contatterà mai telefonicamente per richiedere dati personali o codici identificativi, per richiederti di cambiare PIN o password", source: NEXI_SECURITY, checked: ON_11 },
      { quote: "ancor meno per richiederti i codici che ricevi tramite SMS (OTP) per confermare un pagamento.", source: NEXI_SECURITY, checked: ON_11 },
      { quote: "se devi chiamare Nexi usa solo i numeri di telefono che trovi sul sito Nexi", source: NEXI_SECURITY, checked: ON_11 },
    ],
    reviewNotes: [
      "When the customer calls Nexi's own numbers, Nexi does ask for an OTP to identify them (\"durante la chiamata ti verrà richiesto di identificarti tramite codice OTP\", contact page). \"Never asks for an OTP\" only holds for calls and messages coming from Nexi.",
      "Typed as \"bank\": Nexi issues the cards, and the bank advice (call the number on the back of the card) fits.",
      "The 800 numbers aren't labelled \"numero verde\" on the page, though 800 is the toll-free range in AGCOM's plan. Labels say what each is for instead.",
      "Left out: 1 800 473 6896 (USA only), +39 02 345 441 (non-customers), 800 15 11 11 (its heading on the page is garbled).",
      "nexigroup.com appears on the security page as the phishing-report mailbox (segnalazioni.phishing@nexigroup.com).",
    ],
    reviewed: null,
  },
  {
    id: "bper",
    name: "BPER Banca",
    type: "bank",
    names: ["bper banca", "bper", "gruppo bper", "bperbanca"],
    brandWords: ["bper", "bperbanca", "gruppobper"],
    officialDomains: [
      { domain: "bper.it", source: BPER_BROCHURE, checked: ON_11 },
      { domain: "bpergroup.net", source: "https://www.bper.it/", checked: ON_11 },
      { domain: "gruppobper.it", source: BPER_SECURITY, checked: ON_11 },
      { domain: "gruppobper.com", source: BPER_SECURITY, checked: ON_11 },
      { domain: "bperbanca.it", source: BPER_SECURITY, checked: ON_11 },
      { domain: "divisioneconsumer.it", source: "https://www.bper.it/", checked: ON_11 },
    ],
    phones: [
      { number: "059 42 42", purpose: "Servizio Clienti e blocco Internet Banking o carte, 24 ore su 24, dall'Italia e dall'estero; anche il numero da cui chiama la banca", source: BPER_NUMBERS, checked: ON_11, shownAs: "customer_service" },
      { number: "800 15 16 16", purpose: "Assistenza e blocco carte Nexi/CartaSi dall'Italia", source: BPER_NUMBERS, checked: ON_11 },
      { number: "( +39) 02 34 98 00 20", purpose: "Assistenza e blocco carte Nexi/CartaSi dall'estero", source: BPER_NUMBERS, checked: ON_11 },
      { number: "+39 3351707442", purpose: "Solo WhatsApp: l'unico numero WhatsApp ufficiale della banca", source: BPER_BROCHURE, checked: ON_11 },
    ],
    smsSenders: [
      { name: "GRUPPO BPER", source: BPER_SECURITY, checked: ON_11 },
      { name: "BPERBanca", source: BPER_SECURITY, checked: ON_11 },
    ],
    rules: [
      { quote: "La Banca può contattarti telefonicamente o via email, ma non ti chiederà mai di fornire credenziali, dati sensibili o codici usa e getta (OTP).", source: BPER_SECURITY, checked: ON_11 },
      { quote: "La Banca può contattarti telefonicamente o via email, ma non ti chiederà mai di effettuare bonifici o ricariche dal tuo conto.", source: BPER_SECURITY, checked: ON_11 },
      { quote: "Il nome mittente presente nelle comunicazioni (sms o email) ed il numero chiamante, sono falsificabili.", source: BPER_SECURITY, checked: ON_11 },
      { quote: "La Banca non invia sms con link che rimandano alla pagina di accesso", source: BPER_BROCHURE, checked: ON_11 },
    ],
    reviewNotes: [
      "The SMS sender names are stated on the security page, which also warns they can be faked; the brochure shows a scam SMS sent as \"GRUPPOBPER\".",
      "gruppobper.it, gruppobper.com and bperbanca.it come from the official email addresses listed on the security page; bpergroup.net from the homepage's Internet Banking links; divisioneconsumer.it from the homepage's \"Area Riservata Carte\" link.",
      "059 42 42 is also the number BPER calls customers from (\"ti contatteremo dal numero 059 42 42\"). The page doesn't say whether it costs anything or works from mobiles.",
      "The WhatsApp number is only in the brochure (undated), not on the web pages.",
    ],
    reviewed: null,
  },
  {
    id: "banco-bpm",
    name: "Banco BPM",
    type: "bank",
    names: ["banco bpm", "bancobpm"],
    brandWords: ["bancobpm"],
    officialDomains: [{ domain: "bancobpm.it", source: "https://www.bancobpm.it/", checked: ON_11 }],
    phones: [
      { number: "800 024 024", purpose: "Assistenza clienti e YouCall per clienti privati, da fisso o cellulare; operatore lunedì-venerdì 8-22, sabato 9-17", source: BANCOBPM_SHEET, checked: ON_11, shownAs: "customer_service" },
      { number: "+39 02 43 37 12 34", purpose: "Assistenza clienti dall'estero", source: BANCOBPM_ASSIST, checked: ON_11 },
      { number: "800 607 227", purpose: "Assistenza clienti \"non consumatori\" (imprese), lunedì-venerdì 8:30-21:00 (vedi note)", source: BANCOBPM_SHEET, checked: ON_11 },
      { number: "800 822 056", purpose: "Blocco carte di debito e prepagate dall'Italia", source: BANCOBPM_CARDS, checked: ON_11 },
      { number: "+39 0260843768", purpose: "Blocco carte di debito e prepagate dall'estero", source: BANCOBPM_CARDS, checked: ON_11 },
      { number: "800 991 256", purpose: "Blocco carte NUMIA dall'Italia", source: BANCOBPM_CARDS, checked: ON_11 },
      { number: "800 207 167", purpose: "Blocco MASTERCARD DEBIT e CARTIMPRONTA dall'Italia", source: BANCOBPM_CARDS, checked: ON_11 },
      { number: "800 151 616", purpose: "Blocco carte di credito NEXI dall'Italia", source: BANCOBPM_CARDS, checked: ON_11 },
      { number: "06 72900347", purpose: "Blocco carte AMEX dall'Italia", source: BANCOBPM_CARDS, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [
      { quote: "Banco BPM non invia mai SMS con link per l'accesso al servizio online, né inserisce link a pagine o applicazioni esterne nelle proprie comunicazioni.", source: BANCOBPM_STORNO, checked: ON_11 },
      { quote: "La banca non ti contatterà mai telefonicamente o via SMS per chiederti di fornire le tue credenziali o di effettuare operazioni di pagamento", source: BANCOBPM_STORNO, checked: ON_11 },
      { quote: "Banco BPM non ti chiederà MAI via SMS o per telefono i tuoi codici di accesso, i codici OTP ricevuti via SMS", source: "https://www.bancobpm.it/magazine/privati/tutela-la-tua-sicurezza/attacco-combinato-sms-telefonata/", checked: ON_11 },
    ],
    reviewNotes: [
      "Numbers conflict: the information sheet (updated 18/05/2026) and YouWeb give 800 024 024 for private customers and 800 607 227 for businesses, but an article of 22/07/2026 calls 800.607.227 \"il numero verde del Servizio Clienti\". 800 024 024 is shown; please confirm.",
      "800 822 056 (debit-card block) is the same number Poste lists for blocking BancoPosta Ricaricabile cards: probably a shared card processor.",
      "\"bpm\" alone is not a brand word: it would also match unrelated sites (beats per minute).",
    ],
    reviewed: null,
  },
  {
    id: "hera",
    name: "Hera",
    type: "utility",
    names: ["hera", "hera comm", "gruppo hera", "heracomm"],
    brandWords: ["hera", "heracomm", "gruppohera"],
    officialDomains: [
      { domain: "gruppohera.it", source: HERA_CONTACTS, checked: ON_11 },
      { domain: "heracomm.it", source: "https://heracomm.it/", checked: ON_11 },
    ],
    phones: [
      { number: "800.999.500", purpose: "Servizio Clienti Famiglie, lunedì-venerdì 8:00-22:00, sabato 8:00-18:00, gratuito da fisso e cellulare", source: HERA_CONTACTS, checked: ON_11, shownAs: "free_any" },
      { number: "051-19933415", purpose: "Servizio Clienti Famiglie dall'estero", source: HERA_CONTACTS, checked: ON_11 },
      { number: "800.554.000", purpose: "Servizio a Tutele Graduali domestico, gratuito da fisso e cellulare", source: HERA_CONTACTS, checked: ON_11 },
      { number: "800.999.700", purpose: "Servizio Clienti Business, gratuito da fisso e cellulare", source: HERA_CONTACTS, checked: ON_11 },
      { number: "800.087.858", purpose: "\"Numeri sicuri Hera\": cessazione contrattuale luce/gas", source: HERA_SAFE_NUMBERS, checked: ON_11 },
      { number: "800.087.592", purpose: "\"Numeri sicuri Hera\": contrattuale luce/gas stgd", source: HERA_SAFE_NUMBERS, checked: ON_11 },
      { number: "800.087.874", purpose: "\"Numeri sicuri Hera\": iniziative aggiornamento informazioni", source: HERA_SAFE_NUMBERS, checked: ON_11 },
      { number: "800.333.822", purpose: "\"Numeri sicuri Hera\": iniziative commerciali digitali", source: HERA_SAFE_NUMBERS, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [
      { quote: "Utilizza solo ed esclusivamente l'Iban Unicredit SpA stampato nella tua fattura Hera", source: "https://heracomm.gruppohera.it/w/casa/assistenza/bolletta/pagamento-bolletta", checked: ON_11 },
      { quote: "a contattarti potrà essere soltanto il fornitore energetico con cui hai un contratto attivo, e non altri soggetti o intermediari, anche per suo conto.", source: "https://heracomm.gruppohera.it/info-utili/decreto-bollette-21-2026", checked: ON_11 },
    ],
    reviewNotes: [
      "heracomm.it: no page text, only a redirect (https://heracomm.it/ to heracomm.gruppohera.it). Please confirm.",
      "The four \"Numeri sicuri Hera\" don't say whether they are for calling Hera or numbers Hera calls from. Listed so a message quoting them isn't counted as \"call this number\" after review.",
      "Unlike A2A, Hera does sell door to door and by phone through authorised agencies. Its site has a tool to check whether a number that called you is authorised.",
      "Hera's scam-warning news pages on gruppohera.it showed a human-verification page, so nothing from them is used. No Hera page on SMS or email phishing was found.",
    ],
    reviewed: null,
  },
  {
    id: "a2a",
    name: "A2A Energia",
    type: "utility",
    names: ["a2a energia", "a2a"],
    brandWords: ["a2a", "a2aenergia"],
    officialDomains: [
      { domain: "a2a.it", source: A2A_CONTACTS, checked: ON_11 },
      { domain: "gruppoa2a.it", source: A2A_CONTACTS, checked: ON_11 },
      { domain: "a2aenergia.eu", source: "https://www.a2aenergia.eu/", checked: ON_11 },
    ],
    phones: [
      { number: "800 199 955", purpose: "Clienti domestici Mercato Libero, numero verde gratuito da rete fissa (lunedì-venerdì 8.30-17.00)", source: A2A_CONTACTS, checked: ON_11, shownAs: "from_landline" },
      { number: "02 82 841 510", purpose: "Clienti domestici Mercato Libero, da cellulare o estero (costo secondo l'operatore)", source: A2A_CONTACTS, checked: ON_11, shownAs: "from_mobile" },
      { number: "800 012 012", purpose: "Servizio a Tutele Graduali domestici, gratuito da rete fissa", source: A2A_CONTACTS, checked: ON_11 },
      { number: "02 82 841 520", purpose: "Servizio a Tutele Graduali domestici, da cellulare o estero", source: A2A_CONTACTS, checked: ON_11 },
      { number: "800 178 580", purpose: "Clienti business Mercato Libero, gratuito da fisso e cellulare", source: A2A_CONTACTS, checked: ON_11 },
      { number: "02 40707331", purpose: "Servizio contro le truffe: chiamate sospette o sospetto di frode", source: A2A_CONTACTS, checked: ON_11 },
    ],
    smsSenders: [],
    requestsPaymentByMessage: {
      quote: "Clicca sul link per accedere alla piattaforma che ti permette di consultare e scaricare il pdf delle tue bollette ed effettuare il pagamento online.",
      source: A2A_DIGITAL_REMINDERS,
      checked: ON_11,
    },
    rules: [
      { quote: "Il nostro servizio Clienti è gestito dall'Italia. Non riceverai mai chiamate dall'estero o visite porta a porta.", source: A2A_SUSPICIOUS, checked: ON_11 },
      { quote: "Gli unici dati che ti chiediamo di inserire per accedere sono il tuo codice fiscale o la partita iva (non verranno richiesti dati bancari come il codice IBAN).", source: A2A_DIGITAL_REMINDERS, checked: ON_11 },
    ],
    reviewNotes: [
      "A2A sends payment links itself, by PEC, email or SMS, for bills due or overdue (requestsPaymentByMessage). The payment platform's domain isn't on any fetched page, so such a message only gets 🟠 if its link is on one of the listed domains; otherwise it stays 🔴. Finding that domain would complete this.",
      "02 40707331 is A2A's own anti-scam line; its hours differ between two pages (8.30-17.00 or 9.00-15.00). Could be worth showing for A2A messages instead of, or next to, the customer line.",
      "a2aenergia.eu: only a redirect to a2a.it. Please confirm.",
      "Left out: the Tutela Gas number, whose printed digits (02 82 841 575) and link (02 82 841 545) differ.",
    ],
    reviewed: null,
  },
];
