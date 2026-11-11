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
const ENTRATE_FAKE_DOMAINS = "https://www.agenziaentrate.gov.it/portale/focus-sul-phishing/domini-estranei-all-agenzia-delle-entrate";
const ENTRATE_IRPEF_SEP_2026 = "https://www.agenziaentrate.gov.it/portale/avviso-del-30-settembre-2026-intensificazione-campagne-di-phishing-a-tema-falsi-rimborsi-irpef";
const ENTRATE_SPID_MAR_2026 = "https://www.agenziaentrate.gov.it/portale/avviso-del-30-marzo-2026-campagna-di-phishing-mirata-al-furto-di-credenziali-spid";
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

const MEDIOLANUM_CONTACTS = "https://www.bancamediolanum.it/contatti-sede-mediolanum";
const MEDIOLANUM_SMISHING = "https://www.bancamediolanum.it/sicurezza/smishing";

const FINECO_SECURITY = "https://it.finecobank.com/sicurezza/";
const FINECO_CARDS = "https://help.finecobank.com/it/conto-e-carte/le-carte-fineco.html";
const FINECO_HELP_CONTACTS = "https://help.finecobank.com/it/il-conto-fineco/contatti.html";

const SATISPAY_CONTACTS = "https://www.satispay.com/it-it/contatti/";
const SATISPAY_SUSPICIOUS = "https://satispaysupport.zendesk.com/hc/it/articles/39871210545053-Cosa-faccio-in-caso-di-comunicazioni-o-richieste-sospette";
const SATISPAY_THWART = "https://satispaysupport.zendesk.com/hc/it/articles/26178487839389-Come-posso-sventare-un-tentativo-di-frode";
const SATISPAY_CARD_LOST = "https://satispaysupport.zendesk.com/hc/it/articles/37333795016733-Carta-persa-o-rubata";

const IREN_CONTACTS = "https://www.irenlucegas.it/assistenza/contatti";
const IREN_COMPLAINTS = "https://www.irenlucegas.it/assistenza/gestisci-il-tuo-contratto/segnalazioni-e-reclami";
const IREN_FAQ = "https://www.irenlucegas.it/assistenza/faq";

const EDISON_CONTACTS = "https://www.edisonenergia.it/edison/assistenza/contatti";
const EDISON_FAQ = "https://www.edisonenergia.it/edison/assistenza/faq";
const EDISON_SMS = "https://www.edisonenergia.it/edison/servizi-sms";

const SORGENIA_CONTACTS = "https://www.sorgenia.it/contattaci";
const SORGENIA_CUSTOMER_SERVICE = "https://www.sorgenia.it/faq/come-contattare-servizio-clienti-per-utenze";
const SORGENIA_REPORT = "https://www.sorgenia.it/segnalazione";
const SORGENIA_CALLS = "https://www.sorgenia.it/partnership-consigli-pratici-telefonate-sospette";

const MOONEY_GROUP = "https://mooneygroup.it/";

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
    knownFakeDomains: [
      { domain: "agenziaentrate.digital", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.org", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziantrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenzia.it", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziadellentrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agntrate.app", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenzlaentrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate-mod730.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate-dichiarazione.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate-rimborsi.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate-criptovalute.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate-criptovalute.net", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "criptovalute-agenziaentrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate-dichiarazione.it", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agentrate.org", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrategov.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.rest", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.top", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.id", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.cam", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.lat", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate-gov-it.justns.rugentrate.org", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agentragenziaentrate.my", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.work", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.sbs", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.life", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.cfd", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.xyz", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.buzz", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.onl", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.cc", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.help", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.pics", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "avenzstr.click", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.bid", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.icu", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenentrate.cam", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentra.im", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.link", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.live", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.me", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.online", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.hiv.it", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.site", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziadelleentrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziadelleentrate.it", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenzia-entrate.info", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenzia-entrate.org", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenzia-entrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziaentrate-siatel.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "noreply-agenziaentrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "app-agenziaentrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "pceagenziaentrate.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "agenziadelleentrate13281-it.com", source: ENTRATE_FAKE_DOMAINS, checked: ON_11 },
      { domain: "gov.irpeff.it.com", source: ENTRATE_IRPEF_SEP_2026, checked: ON_11 },
      { domain: "gov.agenzia.us.cc", source: ENTRATE_IRPEF_SEP_2026, checked: ON_11 },
      { domain: "gov.rimborso.us.cc", source: ENTRATE_IRPEF_SEP_2026, checked: ON_11 },
      { domain: "agenziaentratel.shop", source: ENTRATE_IRPEF_SEP_2026, checked: ON_11 },
      { domain: "fiscale-gov.us.cc", source: ENTRATE_IRPEF_SEP_2026, checked: ON_11 },
      { domain: "agenziaentratea.net", source: ENTRATE_IRPEF_SEP_2026, checked: ON_11 },
      { domain: "gov.agenz.it.com", source: ENTRATE_IRPEF_SEP_2026, checked: ON_11 },
      { domain: "agenziadelleentrate.live", source: ENTRATE_SPID_MAR_2026, checked: ON_11 },
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
      "knownFakeDomains (2026-11-11): the 38 \"già utilizzati per campagne di phishing\" and 17 \"comunque estranei\" on the domini-estranei page (written there with [.] for dots), plus names in the text of the 30 Sep and 30 Mar 2026 notices. Copied by a research agent: check against the pages. The page has no dates and is not kept in step with the notices, most of which show domains only in screenshots.",
      "\"agenziaentrate-gov-it.justns.rugentrate.org\" is printed like that on the page; it may be two entries run together (…justns.ru and …gentrate.org). Kept as printed.",
      "Left out: wp-dev.typhur.com (a lure path on someone else's site, 30 Mar 2026) and the sender domain bsp.mi.it (12 Jun 2026), both probably hijacked third parties. agenzia.it is on the page's list, so its subdomains count too.",
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
  {
    id: "mediolanum",
    name: "Banca Mediolanum",
    type: "bank",
    names: ["banca mediolanum", "mediolanum", "bancamediolanum"],
    brandWords: ["mediolanum", "bancamediolanum", "bmedonline"],
    officialDomains: [
      { domain: "bancamediolanum.it", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
      { domain: "bmedonline.it", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
      { domain: "mediolanum.it", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
      { domain: "mediolanumplay.it", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
      { domain: "consulentimediolanum.it", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
      { domain: "mediolanumprivatebanking.it", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
      { domain: "familybanker.it", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
      { domain: "fondazionemediolanum.it", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
    ],
    phones: [
      { number: "800 107 107", purpose: "Servizio clienti per i clienti (numero verde, Banking Center), dall'Italia", source: MEDIOLANUM_CONTACTS, checked: ON_11, shownAs: "toll_free" },
      { number: "+39 02 9045 1625", purpose: "Servizio clienti per i clienti, dall'estero", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
      { number: "800 60 70 80", purpose: "Linea dedicata a chi non è ancora cliente", source: MEDIOLANUM_CONTACTS, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [
      { quote: "Non ti chiederemo mai telefonicamente o via SMS i tuoi codici segreti per intero e il codice B.med oppure i dati della carta di pagamento, diffida da ogni richiesta di questo genere.", source: MEDIOLANUM_SMISHING, checked: ON_11 },
      { quote: "Banca Mediolanum non ti chiederà mai di inserire i codici segreti attraverso l’apertura di un link contenuto in un SMS.", source: MEDIOLANUM_SMISHING, checked: ON_11 },
      { quote: "Non ti chiederemo mai di effettuare un trasferimento di denaro dal tuo conto corrente o dalle tue carte per bloccare un pagamento sospetto o per verifiche di sicurezza.", source: MEDIOLANUM_SMISHING, checked: ON_11 },
      { quote: "Non ti chiederemo mai di attivare sul tuo cellulare il trasferimento di chiamata o di concedere l’accesso remoto al tuo dispositivo.", source: MEDIOLANUM_SMISHING, checked: ON_11 },
      { quote: "I numeri 800.107.107 e 02.9045.1625 sono attivi solo per chiamate in entrata, Banca Mediolanum non ti contatterà MAI da questi numeri, solo tu potrai farlo.", source: MEDIOLANUM_SMISHING, checked: ON_11 },
      { quote: "Ricordati che Banca Mediolanum non ti chiederà mai di inserire i tuoi dati via e-mail o SMS.", source: "https://www.bancamediolanum.it/sicurezza", checked: ON_11 },
    ],
    reviewNotes: [
      "The card-block page (https://www.bancamediolanum.it/informazioni-al-cliente/blocco-strumenti-di-pagamento) and the anti-phishing vademecum PDF refused automated reading (bot protection, redirect loop). So no card-block numbers are listed. Please read them in a browser.",
      "Domains: bmedonline.it is where the site's \"Accesso clienti\" link goes (https://www.bmedonline.it/v3/app/ib_flutter_app_banca/index.html#/auth). mediolanum.it comes from the contact emails on the contacts page (info@mediolanum.it, bancamediolanum@pec.mediolanum.it). mediolanumplay.it (\"Premi Play\") and consulentimediolanum.it (\"Trova un Family Banker\") are linked in the header. mediolanumprivatebanking.it, familybanker.it and fondazionemediolanum.it are linked in the footer under \"Altri siti banca mediolanum\". They are listed so the group's own sites aren't flagged as look-alikes of \"mediolanum\". fondazionemediolanum.it belongs to the foundation, not the bank: delete it if unwanted. The footer's \"Tutti i siti del Gruppo\" list loads by script and wasn't read.",
      "\"mediolanum\" is the Latin name of Milan and is used by unrelated businesses (hotels, shops), so any such site will be flagged as a look-alike. brandWholeOnly is not set: it doesn't help here, because the word isn't the start of an ordinary Italian word. \"bmed\" is not a brand word: 4 letters and too generic.",
      "\"per intero\": the bank says it never asks for secret codes in full by phone or SMS. It may ask for part of a code, for example when identifying a caller.",
      "800.107.107 and 02.9045.1625 are for incoming calls only: the bank never calls from them. The spoofing page (https://www.bancamediolanum.it/sicurezza/spoofing) warns that scammers fake these numbers, and that fake SMS can land in the same thread as the bank's real messages.",
      "No page names the bank's SMS sender or says whether its own SMS contain links. Not verified: whether the 800 numbers are free from mobiles, and what the asterisk on the abroad number means.",
      "Left out: fax 02 9049 2550.",
    ],
    reviewed: null,
  },
  {
    id: "fineco",
    name: "Fineco",
    type: "bank",
    names: ["fineco", "finecobank", "fineco bank"],
    brandWords: ["fineco", "finecobank"],
    brandWholeOnly: true,
    officialDomains: [
      { domain: "finecobank.com", source: FINECO_SECURITY, checked: ON_11 },
      { domain: "fineco.mobi", source: FINECO_SECURITY, checked: ON_11 },
      { domain: "fineco.it", source: "https://it.finecobank.com/", checked: ON_11 },
    ],
    phones: [
      { number: "800.52.52.52", purpose: "Servizio Clienti e blocco carte, 24 ore su 24; numero verde, solo dall'Italia e da telefono fisso", source: FINECO_CARDS, checked: ON_11, shownAs: "from_landline" },
      { number: "02.2899.2899", purpose: "Customer Care e blocco carte, 24 ore su 24, da cellulare o dall'estero", source: "https://it.finecobank.com/contattaci/blocco-carta/", checked: ON_11, shownAs: "from_mobile" },
      { number: "02 30575859", purpose: "Voice Portal, servizi automatici per i titolari di conto Trading", source: FINECO_HELP_CONTACTS, checked: ON_11 },
      { number: "339.994.1888", purpose: "Info SMS: i clienti scrivono a questo numero per informazioni e assistenza sul conto (non per Conto Fineco One e Conto Trading)", source: FINECO_HELP_CONTACTS, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [
      { quote: "Ricordati che Fineco non ti contatterà mai per chiederti: / Codice Utente e Password; / i dati della carta di credito o debito; / PIN Dispositivo e SMS PIN; / di confermare le operazioni con Mobile Code;", source: FINECO_SECURITY, checked: ON_11 },
      { quote: "I link che trovi nei nostri SMS iniziano sempre per «Fineco.mobi/», ogni altro indirizzo potrebbe essere fraudolento.", source: FINECO_SECURITY, checked: ON_11 },
      { quote: "Ricorda: non ti verranno mai chiesti codici o dati personali via email o telefono.", source: "https://help.finecobank.com/it/corsi-e-education/impara-con-fineco.html", checked: ON_11 },
      { quote: "Ricorda di non comunicare i tuoi codici (es. password, PIN) ad altre persone, inclusi amici, conoscenti, il tuo promotore finanziario o gli operatori di customer care", source: "https://help.finecobank.com/it/il-conto-fineco/sicurezza-privacy.html", checked: ON_11 },
    ],
    reviewNotes: [
      "Fineco's own SMS do contain links, always starting \"Fineco.mobi/\" (security page), so fineco.mobi is listed. https://fineco.mobi/ redirects to it.finecobank.com. Once reviewed, a link to fineco.mobi no longer counts as \"asks you to open a link\". Please decide whether that's wanted.",
      "fineco.it: no page text names it. The homepage links a results PDF on images.fineco.it, and www.fineco.it redirects to it.finecobank.com. Please confirm.",
      "Fineco does call customers from 02 2899 2899 (\"Verrai contattato dal numero 02 2899 2899\", help contacts page) when they ask for a callback (\"Ti telefoniamo\") in the reserved area. A call from that number can be genuine, and it can also be faked.",
      "When the customer calls the Voice Portal, Fineco asks for \"due cifre casuali del tuo Codice PIN\" for transfers, and for the full Codice Utente and Password telefonica when no voice password is set. \"Never asks for codes\" only holds when Fineco makes the contact.",
      "800.52.52.52 is called \"numero verde valido dall'Italia e da telefono fisso\" on the cards help page; that's the basis for shownAs from_landline (\"gratis da telefono fisso\"). The card-block page only says \"da telefono fisso in italia\". The cost of 02.2899.2899 is not stated.",
      "02.3057.5859 (code help, Trading accounts, in the contacts-page FAQ data) and 02 30575859 are the same number written two ways; listed once.",
      "Left out: 800.92.92.92 (mortgage and loan information). It only appears in the contacts page's FAQ structured data and wasn't seen in the page's visible text.",
      "brandWholeOnly: \"fineco\" is the start of the ordinary word \"finecorsa\", and turns up inside joined site names such as \"finecostruzioni\". With brandWholeOnly, fineco-sicurezza.com and finecobank-verifica.com are caught, but a one-word look-alike such as finecosicurezza.com is missed. Fineco's other sites linked from its homepage (finecodays.it, consulentefinecobank.com, fineconomy.it) aren't listed; brandWholeOnly keeps them from being flagged.",
      "No page names Fineco's SMS sender.",
    ],
    reviewed: null,
  },
  {
    id: "satispay",
    name: "Satispay",
    type: "bank",
    names: ["satispay"],
    brandWords: ["satispay"],
    officialDomains: [
      { domain: "satispay.com", source: SATISPAY_CONTACTS, checked: ON_11 },
      { domain: "satispaysupport.zendesk.com", source: SATISPAY_CONTACTS, checked: ON_11 },
      { domain: "satispay.onelink.me", source: "https://www.satispay.com/it-it/privati/", checked: ON_11 },
    ],
    phones: [
      { number: "+39 800 826 533", purpose: "Blocco d'emergenza della carta con risponditore automatico, se si perdono sia la carta sia il telefono, chiamando dall'Italia (in italiano)", source: SATISPAY_CARD_LOST, checked: ON_11, shownAs: "card_block" },
      { number: "+352 27 647 687", purpose: "Blocco d'emergenza della carta con risponditore automatico, chiamando dall'estero (in inglese)", source: SATISPAY_CARD_LOST, checked: ON_11 },
      { number: "+352 27 648 540", purpose: "Blocco d'emergenza della carta con risponditore automatico, valido da ovunque (in italiano o in inglese)", source: SATISPAY_CARD_LOST, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [
      { quote: "Satispay può chiedermi PIN della carta, password o codici di sicurezza? / Satispay non ti chiederà mai di comunicare a qualcuno questi dati tramite telefono, SMS, email, chat o altri canali", source: SATISPAY_SUSPICIOUS, checked: ON_11 },
      { quote: "Nessuna banca, autorità o operatore Satispay ti chiederà mai di trasferire i tuoi soldi su un altro conto per proteggerli da una frode", source: SATISPAY_SUSPICIOUS, checked: ON_11 },
      { quote: "Satispay non ti chiamerà mai per chiederti di: / Condividere PIN, codici temporanei (OTP) o risposte a notifiche di sicurezza;", source: SATISPAY_THWART, checked: ON_11 },
      { quote: "Satispay non ti chiamerà mai per chiederti di: / … / Acquistare Gift Card o codici acquisto;", source: SATISPAY_THWART, checked: ON_11 },
      { quote: "Satispay non richiede mai pagamenti per sbloccare transazioni o inviare rimborsi.", source: "https://satispaysupport.zendesk.com/hc/it/articles/26177653816733-Quali-sono-le-truffe-pi%C3%B9-comuni", checked: ON_11 },
      { quote: "Questi numeri sono dedicati esclusivamente alla ricezione delle tue segnalazioni. Nessun operatore Satispay ti contatterà mai da questi recapiti.", source: SATISPAY_CARD_LOST, checked: ON_11 },
      { quote: "accedi al tuo account Satispay solo attraverso l'App installata sul tuo smartphone.", source: "https://satispaysupport.zendesk.com/hc/it/articles/18372748033821-Come-posso-proteggermi-dai-tentativi-di-frode", checked: ON_11 },
    ],
    reviewNotes: [
      "Typed \"bank\": Satispay is an e-money institution (Satispay Europe S.A., supervised by the CSSF) with an IBAN, a card and an app, and the bank advice (\"open the app yourself\") fits. Use \"other\" if preferred (as for PayPal).",
      "Satispay has no customer phone line: help is only through the in-app chat or support@satispay.com (https://satispaysupport.zendesk.com/hc/it/articles/18373121111197-Come-posso-contattare-l-assistenza-di-Satispay). The three numbers are only an automated emergency card block for when the card and the phone are both lost. +39 800 826 533 is printed with +39; the page doesn't say it is free.",
      "The help centre is on satispaysupport.zendesk.com, linked as \"Centro Assistenza\" from satispay.com/it-it/contatti. The old support.satispay.com/it/articles/... addresses now redirect to that contacts page. The articles' text was read through the help centre's own JSON API, and their pages were checked to show the same text.",
      "satispay.onelink.me is the app link behind the card QR codes on https://www.satispay.com/it-it/privati/ (page data, not a visible link). It is listed so genuine app links aren't flagged as look-alikes. Please confirm.",
      "Left out: satispaylogout-ita.paperform.co, the lost-phone form linked from https://satispaysupport.zendesk.com/hc/it/articles/18372437539101. It's on a third-party form host and will be flagged as a look-alike.",
      "requestsPaymentByMessage is not set. Two genuine features could look like payment requests, but neither is Satispay itself asking for payment: requests between users (a friend asks for money in the app), and links sent to people without an account who received money or a payment request (https://satispaysupport.zendesk.com/hc/it/articles/18397383422109).",
      "Satispay does send genuine emails and in-app notices asking people to reconfirm their personal data and upload a new ID (https://satispaysupport.zendesk.com/hc/it/articles/24779162641053, which also says \"Non ti chiederemo mai di condividere il tuo PIN o i codici di verifica.\"). It also says it may ask for documents \"solo tramite indirizzi email verificati\"; which addresses those are isn't stated.",
      "Satispay warns that phone spoofing can show its name or logo on the caller's screen. No page names an SMS sender. Verification codes arrive by SMS and by email.",
      "brandWholeOnly is not set: \"satispay\" isn't the start of any ordinary Italian word.",
    ],
    reviewed: null,
  },
  {
    id: "iren",
    name: "Iren",
    type: "utility",
    names: ["iren", "iren luce gas", "iren mercato", "gruppo iren", "irenyou"],
    // "iren" is under 5 letters, so it already only matches a whole part of a
    // site name: "irene" or "sirena" don't count. brandWholeOnly isn't needed.
    brandWords: ["iren", "irenlucegas", "gruppoiren", "irenyou", "irenmercato"],
    officialDomains: [
      { domain: "irenlucegas.it", source: IREN_COMPLAINTS, checked: ON_11 },
      { domain: "gruppoiren.it", source: IREN_COMPLAINTS, checked: ON_11 },
      { domain: "beiren.it", source: IREN_COMPLAINTS, checked: ON_11 },
      { domain: "irenlucegaseservizi.it", source: IREN_COMPLAINTS, checked: ON_11 },
      { domain: "irenmercato.it", source: IREN_FAQ, checked: ON_11 },
    ],
    phones: [
      { number: "800 969 696", purpose: "Servizio clienti luce e gas, numero verde da rete fissa, lunedì-venerdì 8-20, sabato 8-13", source: IREN_CONTACTS, checked: ON_11, shownAs: "from_landline" },
      { number: "011 022 033", purpose: "Servizio clienti da cellulare o dall'estero, costo secondo il proprio piano tariffario", source: IREN_CONTACTS, checked: ON_11, shownAs: "from_mobile" },
      { number: "800 909 668", purpose: "Connettività internet, numero verde: assistenza amministrativa lunedì-venerdì 8-20, tecnica lunedì-sabato 8-20", source: IREN_CONTACTS, checked: ON_11 },
      { number: "800 255 533", purpose: "Guasti del teleriscaldamento, numero verde, tutti i giorni 24 ore su 24", source: IREN_CONTACTS, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [
      { quote: "Diffida dalle truffe e accedi al nostro sito e alle nostre app solo dai canali ufficiali Iren.", source: IREN_COMPLAINTS, checked: ON_11 },
    ],
    reviewNotes: [
      "Domains come from Iren's own list on the complaints page (\"Ricordiamo che i domini ufficiali di Iren sono:\"): irenlucegas.it, clienti.irenyou.gruppoiren.it, beiren.it, mobile-irengo.gruppoiren.it, gruppoiren.it, plus the email addresses IrenLuceGas@clienti.gruppoiren.it and irengo.emobility@irenlucegaseservizi.it. irenmercato.it is not on that list: it comes from FAQ email addresses (info.casaonline@irenmercato.it, clienti.nuoviprodotti@irenmercato.it).",
      "beiren.it returned an empty page (script only), so what it is couldn't be confirmed.",
      "No Iren page on SMS or email phishing, or saying \"we never ask for codes\", was found. The only anti-scam line is the general \"Diffida dalle truffe\" sentence.",
      "Third-party sites (Segugio and others) give 800 608 047 as an Iren line for reporting fake agents. It is on no Iren page that was read, so it is not listed.",
      "https://www.gruppoiren.it/it/assistenza.html lists many local numbers for Iren Ambiente (waste, TARI), water and network faults. They aren't listed. TARI SMS scams are common, so they may be worth adding.",
      "No SMS sender name is stated. The FAQ only says \"IREN le invierà un sms e una email di remind dell'appuntamento\" (fibre installation).",
      "requestsPaymentByMessage is not set: the bill-payment page lists direct debit, card in the customer area or app, post offices and bank transfer, and no payment links by message.",
      "\"irenyou\" (7 letters) matches anywhere in a site name, so a name like \"sirenyoung\" would count. That seems unlikely to matter.",
    ],
    reviewed: null,
  },
  {
    id: "edison",
    name: "Edison Energia",
    type: "utility",
    names: ["edison energia", "edison"],
    brandWords: ["edison", "edisonenergia"],
    officialDomains: [
      { domain: "edisonenergia.it", source: EDISON_CONTACTS, checked: ON_11 },
      { domain: "edison.it", source: EDISON_CONTACTS, checked: ON_11 },
      { domain: "servizioclientiedison.it", source: EDISON_CONTACTS, checked: ON_11 },
    ],
    phones: [
      { number: "800.031.141", purpose: "Servizio clienti per chi è già cliente (la pagina non dice se è gratuito né da quali telefoni si chiama)", source: EDISON_FAQ, checked: ON_11, shownAs: "customer_service" },
      { number: "800.14.14.14", purpose: "Numero verde per chi non è ancora cliente: offerte e nuovi contratti", source: EDISON_FAQ, checked: ON_11 },
      { number: "800.441.999", purpose: "Accanto al servizio \"Intervento tecnico 24/7\" per la casa, scopo non indicato", source: EDISON_CONTACTS, checked: ON_11 },
      { number: "800 608 331", purpose: "\"Per informazioni\", lunedì-venerdì 8-20, a quanto pare nel riquadro dei servizi assicurativi", source: EDISON_CONTACTS, checked: ON_11 },
      { number: "800 608 325", purpose: "\"Per interventi\", tutti i giorni 24 ore su 24, a quanto pare nel riquadro dei servizi assicurativi", source: EDISON_CONTACTS, checked: ON_11 },
      { number: "+39 339 9942842", purpose: "Numero a cui i clienti domestici inviano per SMS l'autolettura (luce e gas)", source: EDISON_SMS, checked: ON_11 },
      { number: "+39 3202041114", purpose: "Numero a cui i clienti business inviano per SMS l'autolettura (luce e gas)", source: EDISON_SMS, checked: ON_11 },
      { number: "+39 320 2041553", purpose: "Numero a cui i clienti scrivono per SMS per copia della bolletta, attivazione del contratto, bolletta web o saldo", source: EDISON_SMS, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [],
    reviewNotes: [
      "No Edison page on SMS or email phishing, or on what Edison never asks for, was found. https://www.edisonenergia.it/edison/informazioni-e-moduli-utili/tutela-del-cliente only says \"Alcuni operatori si fingono Agenti Edison.\" and links a report form. That is a warning, not a rule, so it is not quoted.",
      "Edison's \"Guida Digital\" PDF (https://documenti.edisonenergia.it/getbusinessdoc.ashx?id=CONDECO_guidadigital) reportedly has anti-scam advice, but it is over 10 MB and couldn't be read.",
      "800.031.141: the FAQ says it is for existing customers but not whether it is free. No customer number for mobiles was found on an official page (third-party sites give one), hence shownAs \"customer_service\" rather than a free or landline label.",
      "The contacts page is partly drawn by script and came back truncated. 800 608 331 and 800 608 325 sit near serviziassicurativi@edisonenergia.it, so they look like insurance-services lines rather than energy customer care. Please check.",
      "Left out: 02 82 518 078, printed under \"Numeri di telefono\" with no purpose. Also 800.166.654 on the Tutela del cliente page, which looks like ARERA's consumer helpline rather than Edison's.",
      "The three mobile numbers are numbers customers send SMS to, not numbers Edison sends from. They are listed only so a message quoting them isn't counted as \"call this number\" after review.",
      "edison.it comes from the PEC address assicurativiedisonenergia@pec.edison.it on the contacts page. servizioclientiedison.it comes from condomini@servizioclientiedison.it on the same page and may belong to an outsourced contact centre.",
      "\"edison\" (6 letters) matches anywhere in a site name. No ordinary Italian word starts with it, so brandWholeOnly is not set. But it is a common name abroad (Thomas Edison, Edison Research, Samsung Medison), so unrelated sites such as \"medison\" would count as look-alikes. brandWholeOnly would avoid that but miss one-word look-alikes like edisonbollette.com.",
    ],
    reviewed: null,
  },
  {
    id: "sorgenia",
    name: "Sorgenia",
    type: "utility",
    names: ["sorgenia", "mysorgenia"],
    brandWords: ["sorgenia"],
    officialDomains: [
      { domain: "sorgenia.it", source: SORGENIA_CONTACTS, checked: ON_11 },
    ],
    phones: [
      { number: "800.294.333", purpose: "Servizio clienti per chi è già cliente, numero verde da rete fissa, lunedì-venerdì 8-20, sabato 8-15 (festivi esclusi)", source: SORGENIA_CUSTOMER_SERVICE, checked: ON_11, shownAs: "from_landline" },
      { number: "02.44.388.001", purpose: "Servizio clienti da cellulare, costo secondo l'operatore", source: SORGENIA_CUSTOMER_SERVICE, checked: ON_11, shownAs: "from_mobile" },
      { number: "800.140.084", purpose: "Clienti del Servizio a Tutele Graduali, da rete fissa, lunedì-venerdì 9-18", source: SORGENIA_CONTACTS, checked: ON_11 },
      { number: "02.44.388.084", purpose: "Clienti del Servizio a Tutele Graduali, lunedì-venerdì 9-18", source: SORGENIA_CONTACTS, checked: ON_11 },
      { number: "800 920 960", purpose: "Numero gratuito per chi non è ancora cliente (offerte)", source: SORGENIA_CONTACTS, checked: ON_11 },
      { number: "800 920 920", purpose: "Numero gratuito indicato per le offerte business (il suo link chiama 800 920 960)", source: SORGENIA_CONTACTS, checked: ON_11 },
      { number: "800 979 800", purpose: "Numero gratuito mostrato nella finestra delle offerte", source: SORGENIA_CONTACTS, checked: ON_11 },
    ],
    smsSenders: [],
    rules: [
      { quote: "Non ti chiediamo mai dati della fornitura.", source: SORGENIA_REPORT, checked: ON_11 },
      { quote: "chiamiamo sempre da un numero fisso con prefisso 02, mai da cellulare.", source: SORGENIA_CALLS, checked: ON_11 },
    ],
    reviewNotes: [
      "Both rules are about phone calls (\"Cosa Sorgenia non fa al telefono\"). No Sorgenia page on SMS or email phishing, or on codes and passwords, was found.",
      "The report page has a tool to check whether a number that called you is Sorgenia's (\"Verifica qui se il numero di telefono che ti ha chiamato appartiene a Sorgenia\"). It could be pointed to in the advice.",
      "800 920 920 is printed as \"Chiamaci gratis 800 920 920\", but its link dials 800920960. It is listed as printed.",
      "In the fibre section of the contacts page, 800.294.333 and 02.44.388.001 have different hours (Monday-Friday until 21:00).",
      "No SMS sender name is stated. requestsPaymentByMessage is not set: the FAQ https://www.sorgenia.it/faq/cosa-succede-se-dimentico-di-pagare-bolletta lists postal slip c/c 46436317 and bank transfer to IBAN IT36W0306901626100000123342, with proof sent to edp@sorgenia.it. That IBAN could be useful later, since a message giving a different IBAN is suspect.",
      "Not used: a 2021 press release on gruppo.sorgenia.it saying \"Sorgenia non chiede mai i dati al telefono\" (older), and third-party reports of a September 2025 data breach at a Sorgenia supplier (no Sorgenia notice found).",
      "\"sorgenia\" matches anywhere in a site name. No ordinary word starts with it (\"sorgente\" differs), so brandWholeOnly is not set.",
    ],
    reviewed: null,
  },
  {
    id: "mooney",
    name: "Mooney",
    type: "bank",
    names: ["mooney", "mooneygo"],
    brandWords: ["mooney"],
    officialDomains: [
      { domain: "mooneygroup.it", source: MOONEY_GROUP, checked: ON_11 },
      { domain: "mooney.it", source: MOONEY_GROUP, checked: ON_11 },
      { domain: "mymooney.it", source: MOONEY_GROUP, checked: ON_11 },
      { domain: "mooneygo.it", source: MOONEY_GROUP, checked: ON_11 },
    ],
    phones: [],
    smsSenders: [],
    rules: [],
    reviewNotes: [
      "www.mooney.it, mooney.it, its documents under mooney.it/cms, www.mymooney.it and www.mooneygo.it all answered HTTP 403 to automated reading on 2026-11-11. So no phone numbers, SMS senders, rules or payment-by-message statement could be collected. Only the group site mooneygroup.it could be read.",
      "Third-party sites give 800 005 005 (from abroad +39 02 30458205) as Mooney's customer service. It is not verified and not listed: please check it on mooney.it.",
      "Domains come from the \"I siti del gruppo\" footer of mooneygroup.it (\"© Mooney S.p.A.\"). easycassa.it and pluservice.net (business services) are left out. A whistleblowing pop-up on the same site lists sisalpay.it labelled \"MOONEY\", bill.it and rivenditorisisalpay.it: also left out. sisalpay.it was the earlier brand, so it may be worth adding.",
      "mooneygo.it is MooneyGo (tolls, parking, mobility), a group brand. It is included so its links count as official. Drop it if this entry should cover only payments and cards.",
      "The contacts page (https://mooneygroup.it/contatti/) gives only email addresses: media@mooney.it, richiestaautorita@mooney.it and richiesteautorita@pec.mooney.it. All are under mooney.it.",
      "type \"bank\": Mooney issues prepaid cards, and the model's prompt files card companies under bank, as Nexi is. \"other\", as for PayPal, would also fit.",
      "\"mooney\" (6 letters) matches anywhere in a site name, which also catches mooneygo and mymooney look-alikes. It isn't an Italian word, so brandWholeOnly is not set, but unrelated sites with the surname in them (e.g. mooneyaircraft) would count as look-alikes.",
    ],
    reviewed: null,
  },
];
