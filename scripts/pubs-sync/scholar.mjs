// @ts-check
/**
 * Google Scholar fetching and parsing.
 *
 * Two-stage by necessity: the profile listing is the only place the stable entry
 * id appears, but it truncates both the author list and the venue with an ellipsis.
 * The detail page carries the full author names, full venue, year and link.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  PROFILE_ID, SCHOLAR_ORIGIN, USER_AGENT, PATHS, decodeHtml, politeDelay,
} from './config.mjs';

export class ScholarBlockedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScholarBlockedError';
  }
}

export class ScholarParseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ScholarParseError';
  }
}

const HEADERS = {
  'User-Agent': USER_AGENT,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: `${SCHOLAR_ORIGIN}/`,
  'Upgrade-Insecure-Requests': '1',
};

/**
 * Markers that mean Scholar served an interstitial rather than the page.
 * Deliberately does NOT include the bare word "captcha" — the normal profile
 * page contains it harmlessly in inline script, so matching it would make every
 * successful run look blocked.
 */
const BLOCK_MARKERS = [
  'id="gs_captcha_ccl"',
  'id="captcha-form"',
  'g-recaptcha',
  "Please show you're not a robot",
  'unusual traffic from your computer network',
];

function assertNotBlocked(res, html) {
  if (res.status === 429 || res.status === 503) {
    throw new ScholarBlockedError(`Scholar returned HTTP ${res.status}.`);
  }
  let pathname = '';
  try { pathname = new URL(res.url).pathname; } catch { /* ignore */ }
  if (pathname.startsWith('/sorry')) {
    throw new ScholarBlockedError('Scholar redirected to its "/sorry" CAPTCHA page.');
  }
  if (html.length < 2000) {
    throw new ScholarBlockedError(`Scholar returned a suspiciously small body (${html.length} bytes).`);
  }
  for (const marker of BLOCK_MARKERS) {
    if (html.includes(marker)) {
      throw new ScholarBlockedError(`Scholar served a CAPTCHA page (matched "${marker}").`);
    }
  }
  if (!res.ok) {
    throw new ScholarBlockedError(`Scholar returned HTTP ${res.status}.`);
  }
}

export const listingUrl = (cstart = 0, pagesize = 100) =>
  `${SCHOLAR_ORIGIN}/citations?hl=en&user=${PROFILE_ID}` +
  `&view_op=list_works&sortby=pubdate&cstart=${cstart}&pagesize=${pagesize}`;

export const detailUrl = (citationId) =>
  `${SCHOLAR_ORIGIN}/citations?view_op=view_citation&hl=en&user=${PROFILE_ID}` +
  `&citation_for_view=${encodeURIComponent(citationId)}`;

/**
 * @typedef {object} Fetcher
 * @property {(cstart: number) => Promise<string>} listing
 * @property {(citationId: string) => Promise<string>} detail
 */

/** Live fetcher, rate limited, optionally saving what it downloads as fixtures. */
export function liveFetcher({ saveFixtures = false } = {}) {
  let first = true;
  const get = async (url, fixtureName) => {
    if (!first) await politeDelay();
    first = false;
    const res = await fetch(url, { headers: HEADERS, redirect: 'follow' });
    const html = await res.text();
    assertNotBlocked(res, html);
    if (saveFixtures) {
      fs.mkdirSync(PATHS.fixtures, { recursive: true });
      fs.writeFileSync(path.join(PATHS.fixtures, fixtureName), html);
    }
    return html;
  };
  return {
    listing: (cstart) => get(listingUrl(cstart), `listing-${cstart}.html`),
    detail: (id) => get(detailUrl(id), `detail-${id.split(':').pop()}.html`),
  };
}

/** Offline fetcher that reads previously saved fixtures. */
export function fixtureFetcher(dir = PATHS.fixtures) {
  const read = (file) => {
    const full = path.join(dir, file);
    if (!fs.existsSync(full)) {
      throw new ScholarParseError(
        `Fixture missing: ${full}\nRecord one with: npm run pubs:sync -- --save-fixtures`
      );
    }
    return fs.readFileSync(full, 'utf8');
  };
  return {
    listing: async (cstart) => read(`listing-${cstart}.html`),
    detail: async (id) => read(`detail-${id.split(':').pop()}.html`),
  };
}

/**
 * @typedef {object} ListingEntry
 * @property {string} scholarId  e.g. "dvqkwFYAAAAJ:eQOLeE2rZwMC"
 * @property {string} title
 * @property {string} authorsShort  Scholar's initials form, possibly truncated
 * @property {string} venueShort    possibly truncated
 * @property {string} year
 */

/**
 * @param {string} html
 * @returns {ListingEntry[]}
 */
export function parseListing(html) {
  const chunks = html.split('<tr class="gsc_a_tr">').slice(1);

  if (chunks.length === 0) {
    // Distinguish "no publications" from "markup changed" — the latter is a bug
    // we must fail on rather than silently reporting nothing to sync.
    if (html.includes('gsc_a_t')) {
      throw new ScholarParseError(
        'Scholar returned a profile page but no publication rows parsed — ' +
        'its markup has probably changed. Re-record fixtures and update parseListing().'
      );
    }
    return [];
  }

  /** @type {ListingEntry[]} */
  const out = [];
  for (const chunk of chunks) {
    const idM = chunk.match(/citation_for_view=([^"&]+)/);
    const titleM = chunk.match(/class="gsc_a_at"[^>]*>([\s\S]*?)<\/a>/);
    const grays = [...chunk.matchAll(/<div class="gs_gray">([\s\S]*?)<\/div>/g)];
    const yearM = chunk.match(/class="gsc_a_y"[\s\S]*?>((?:19|20)\d{2})</);
    if (!idM || !titleM) continue;

    // The venue div carries a trailing <span class="gs_oph">, 2022</span> that
    // duplicates the year column; drop it so the venue string stays clean.
    const rawVenue = grays[1]?.[1] ?? '';
    const venueShort = decodeHtml(rawVenue.replace(/<span class="gs_oph">[\s\S]*?<\/span>/g, ''));

    out.push({
      scholarId: decodeHtml(idM[1]),
      title: decodeHtml(titleM[1]),
      authorsShort: decodeHtml(grays[0]?.[1] ?? ''),
      venueShort,
      year: yearM ? yearM[1] : '',
    });
  }
  return out;
}

/**
 * @typedef {object} DetailEntry
 * @property {string} authorsFull  full names, comma separated
 * @property {string} venue        untruncated
 * @property {string} year
 * @property {string} link
 * @property {string} venueLabel   "Journal" | "Conference" | "Book" | "Source" | ""
 * @property {string} publisher
 */

const VENUE_LABELS = ['Journal', 'Conference', 'Book', 'Source', 'Report number', 'Institution'];

/**
 * @param {string} html
 * @returns {DetailEntry}
 */
export function parseDetail(html) {
  /** @type {Map<string,string>} */
  const fields = new Map();
  for (const block of html.split('<div class="gs_scl">').slice(1)) {
    const k = block.match(/class="gsc_oci_field"[^>]*>([\s\S]*?)<\/div>/);
    const v = block.match(/class="gsc_oci_value"[^>]*>([\s\S]*?)<\/div>/);
    if (k && v) fields.set(decodeHtml(k[1]), decodeHtml(v[1]));
  }

  if (fields.size === 0) {
    throw new ScholarParseError(
      'No fields parsed from a Scholar detail page — markup has probably changed.'
    );
  }

  const linkM = html.match(/class="gsc_oci_title_link"[^>]*href="([^"]+)"/);

  let venue = '';
  let venueLabel = '';
  for (const label of VENUE_LABELS) {
    if (fields.has(label)) {
      venue = fields.get(label) ?? '';
      venueLabel = label;
      break;
    }
  }

  const date = fields.get('Publication date') ?? '';
  const yearM = date.match(/((?:19|20)\d{2})/);

  return {
    authorsFull: fields.get('Authors') ?? '',
    venue,
    venueLabel,
    year: yearM ? yearM[1] : '',
    link: linkM ? decodeHtml(linkM[1]) : '',
    publisher: fields.get('Publisher') ?? '',
  };
}

/**
 * Fetches every page of the profile listing.
 * @param {Fetcher} fetcher
 * @returns {Promise<ListingEntry[]>}
 */
export async function fetchAllListings(fetcher) {
  const pageSize = 100;
  /** @type {ListingEntry[]} */
  const all = [];
  for (let cstart = 0; ; cstart += pageSize) {
    let html;
    try {
      html = await fetcher.listing(cstart);
    } catch (err) {
      // Offline runs only have page 0; that is not an error once we have rows.
      if (cstart > 0 && err instanceof ScholarParseError) break;
      throw err;
    }
    const page = parseListing(html);
    all.push(...page);
    if (page.length < pageSize) break;
  }
  return all;
}

/**
 * Guesses the category from the detail page's field label plus the venue text.
 * The label alone is not enough — the HRI Pioneers workshop paper is labelled "Book".
 * @returns {'journal'|'conference'|'workshop'}
 */
export function guessCategory(venue, venueLabel) {
  const v = `${venue}`.toLowerCase();
  if (/workshop|pioneers|late.?breaking|companion|symposium on |doctoral consortium/.test(v)) {
    return 'workshop';
  }
  if (venueLabel === 'Journal') return 'journal';
  if (/journal|transactions|letters\b|\bral\b|\bras\b|ijrr|\btro\b/.test(v)) return 'journal';
  if (venueLabel === 'Conference') return 'conference';
  return 'conference';
}
