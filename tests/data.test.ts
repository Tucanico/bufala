import { expect, test } from "vitest";
import { ORGANISATIONS } from "../src/data/organisations";
import { PREMIUM_PREFIXES } from "../src/data/phone-prefixes";
import { classifyHost, isOfficialHost } from "../src/lib/check/links";

const byId = Object.fromEntries(ORGANISATIONS.map((organisation) => [organisation.id, organisation]));

test("every fact's source is on the organisation's own site", () => {
  for (const organisation of ORGANISATIONS) {
    const facts = [
      ...organisation.officialDomains,
      ...organisation.phones,
      ...organisation.smsSenders,
      ...organisation.rules,
      ...(organisation.requestsPaymentByMessage ? [organisation.requestsPaymentByMessage] : []),
    ];
    for (const fact of facts) {
      const host = new URL(fact.source).hostname;
      expect(isOfficialHost(host, organisation), `${organisation.id}: ${fact.source}`).toBe(true);
      expect(fact.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test("every entry has the basics, written the way the checks expect", () => {
  for (const organisation of ORGANISATIONS) {
    expect(organisation.officialDomains.length, organisation.id).toBeGreaterThan(0);
    for (const { domain } of organisation.officialDomains) {
      // A brand ending such as DHL's ".dhl" counts as a TLD.
      expect(domain, organisation.id).toMatch(/^(?!www\.)[a-z0-9.-]+\.[a-z]{2,}$/);
    }
    for (const word of [...organisation.names, ...organisation.brandWords]) {
      expect(word, organisation.id).toBe(word.toLowerCase());
    }
    // "What to do" has room for two numbers.
    expect(organisation.phones.filter((phone) => phone.shownAs).length, organisation.id).toBeLessThanOrEqual(2);
  }
  expect(new Set(ORGANISATIONS.map((organisation) => organisation.id)).size).toBe(ORGANISATIONS.length);
});

test("premium-rate prefixes come from AGCOM and never cover toll-free numbers", () => {
  for (const { prefix, source } of PREMIUM_PREFIXES) {
    expect(new URL(source).hostname).toBe("www.agcom.it");
    expect(prefix.startsWith("80")).toBe(false);
  }
});

test.each([
  ["poste-consegne.info", "poste"],
  ["postepay-verifica.top", "poste"],
  ["intesa-sicurezza-clienti.com", "intesa-sanpaolo"],
  ["unicredit-sicurezza.online", "unicredit"],
  ["telepass-rinnovo.co", "telepass"],
  ["inps-rimborsi.online", "inps"],
  ["agenzia-entrate-pagamenti.com", "agenzia-entrate"],
  ["enel-pagamenti-online.com", "enel-energia"],
  ["tim-premi.xyz", "tim"],
  ["vodafone-offerte.top", "vodafone"],
  ["brt-consegne.top", "brt"],
  ["dhl-dogana-pagamento.com", "dhl"],
  ["amaz0n-premi.top", "amazon"],
  ["gls-consegne.it", "gls"],
  ["gls-itali.com", "gls"],
  ["ups-consegna.top", "ups"],
  ["paypa1-secure.com", "paypal"],
  ["sda-ritiro.top", "poste"],
  ["windtre-rimborsi.com", "windtre"],
  ["iliad-offerta.top", "iliad"],
  ["fastweb-sicurezza.online", "fastweb"],
  ["nexi-verifica.com", "nexi"],
  ["bper-sicurezza.com", "bper"],
  ["bancobpm-verifica.it", "banco-bpm"],
  ["hera-bollette.top", "hera"],
  ["a2a-rimborsi.com", "a2a"],
])("%s is a look-alike of %s", (host, id) => {
  expect(classifyHost(host, ORGANISATIONS)).toEqual({ kind: "lookalike", host, organisation: byId[id] });
});

test.each([
  ["www.poste.it", "poste"],
  ["postepay.poste.it", "poste"],
  ["www.intesasanpaolo.com", "intesa-sanpaolo"],
  ["www.agenziaentrateriscossione.gov.it", "agenzia-entrate"],
  ["mytim.tim.it", "tim"],
  ["www.enel.it", "enel-energia"],
  ["privati.vodafone.it", "vodafone"],
  ["www.mybrt.it", "brt"],
  ["mydhl.express.dhl", "dhl"],
  ["account-status.amazon.it", "amazon"],
  ["www.gls-italy.com", "gls"],
  ["gls-group.com", "gls"],
  ["www.ups.com", "ups"],
  ["www.paypal.com", "paypal"],
  ["www.sda.it", "poste"],
  ["ac.windtre.it", "windtre"],
  ["assistenza.iliad.it", "iliad"],
  ["it.iliad.com", "iliad"],
  ["www.fastweb.it", "fastweb"],
  ["privati.nexi.it", "nexi"],
  ["homebanking.bpergroup.net", "bper"],
  ["youweb.bancobpm.it", "banco-bpm"],
  ["heracomm.gruppohera.it", "hera"],
  ["login.a2a.it", "a2a"],
])("%s is official for %s", (host, id) => {
  expect(classifyHost(host, ORGANISATIONS)).toEqual({ kind: "official", host, organisation: byId[id] });
});

test.each(["ultimate.com", "sentinel.it", "timeshare.it", "inpstudio.com", "repubblica.it", "backups.com", "groups.io", "annexion.fr", "windsurf.it", "iliade-libri.it", "chera.it", "sphera.com", "bpm-music.com"])(
  "%s is not taken for a known organisation",
  (host) => {
    expect(classifyHost(host, ORGANISATIONS).kind).toBe("unknown");
  },
);
