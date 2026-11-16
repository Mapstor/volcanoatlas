import Link from 'next/link';
import { preload } from 'react-dom';
import './record.css';
import JsonLd, { breadcrumbLd } from '@/components/JsonLd';
import LazyMap from '@/components/record/LazyMap';
import { SectionDrawing, Timeline } from '@/components/record/figures';
import { getAllVolcanoes } from '@/lib/data';
import { endLabel, isoToYmd, longDate, METHOD_LABEL, MONTHS, shortDate, startLabel } from '@/lib/eruptions';
import { buildRecordData, noaaDate, plain, rich, type RecordProfile, type RecordSection } from '@/lib/recordProfile';
import { countryHref, resolveInternalPath } from '@/lib/routes';
import { AUTHOR, SITE_URL, gvpVolcanoUrl } from '@/lib/site';
import { getWeeklyEntry } from '@/lib/weekly';

/**
 * A rebuilt volcano profile ("record page"). Text comes from data/profiles/<slug>.json, every number from
 * data/sources/ through lib/recordProfile.ts. Look: DESIGN.md.
 */

const NOAA_EVENT = 'https://www.ngdc.noaa.gov/hazel/view/hazards/volcano/event-more-info/';
const WEEKLY_HOME = 'https://volcano.si.edu/reports_weekly.cfm';

function Html({ html, as: Tag = 'p', className }: { html: string; as?: 'p' | 'span' | 'li' | 'figcaption'; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default async function RecordPage({ profile }: { profile: RecordProfile }) {
  const data = buildRecordData(profile);
  const { volcano, stats, noaa, ctx, retrieved } = data;
  const weekly = await getWeeklyEntry(profile.volcano_number);

  // Sources are numbered in the order of the profile's list. The weekly report is listed only when it is cited.
  const sources = profile.sources.filter((source) => source.id !== 'weekly' || weekly);
  const ids = sources.map((source) => source.id);
  const r = (text: string) => rich(text, ctx, ids);
  const refNumber = (id: string) => ids.indexOf(id) + 1;
  const ref = (id: string) => (ids.includes(id) ? `<sup class="va-ref"><a href="#va-src-${refNumber(id)}" aria-label="Source ${refNumber(id)}">${refNumber(id)}</a></sup>` : '');

  preload('/fonts/archivo-latin-wght-normal.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  preload('/fonts/caveat-700-basic.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

  const path = `/volcano/${profile.slug}`;
  const name = profile.name;
  const countryLink = countryHref(volcano.country);
  const gvpUrl = gvpVolcanoUrl(profile.volcano_number);
  const retrievedMonth = `${MONTHS[retrieved[1]]} ${retrieved[0]}`;
  const gvpLine = `Source: Global Volcanism Program, Volcanoes of the World v. ${ctx.gvp_version}, retrieved ${retrievedMonth}.${ref('gvp')}`;
  const vei = resolveInternalPath('/volcanic-explosivity-index');

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Countries', path: '/countries' },
    ...(countryLink ? [{ name: volcano.country, path: countryLink }] : []),
    { name, path },
  ];

  const keyFacts: [string, string][] = [];
  const fact = (label: string, value: string | undefined | false) => {
    if (value) keyFacts.push([label, value]);
  };
  fact('Type', ctx.type);
  fact('Summit', ctx.summit_ft && `${ctx.summit_ft} ft (${ctx.summit_m} m)`);
  fact('Base', ctx.base_ft && `about ${ctx.base_ft} ft (${ctx.base_m} m) below sea level`);
  fact('Current eruption', ctx.cur_start && `since ${ctx.cur_start}`);
  fact('Recorded eruptions', ctx.n_all);
  fact('Largest recorded', ctx.max_vei && `VEI ${ctx.max_vei}`);
  fact('Main rock', ctx.rock);
  fact('Coordinates', ctx.coords);
  fact('Smithsonian no.', String(profile.volcano_number));

  const others = (await getAllVolcanoes())
    .filter((v) => v.hero.country === volcano.country && v.slug !== profile.slug)
    .sort((a, b) => a.hero.name.localeCompare(b.hero.name));
  const explore = [
    { href: '/latest-eruptions', text: 'Latest weekly eruption reports' },
    { href: '/most-active-volcanoes', text: 'Most active volcanoes' },
    { href: '/types-of-volcanoes', text: 'Types of volcanoes' },
    { href: '/map', text: 'World volcano map' },
  ]
    .map((link) => ({ ...link, href: resolveInternalPath(link.href) }))
    .filter((link): link is { href: string; text: string } => link.href !== null);

  const placeLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': `${SITE_URL}${path}#place`,
    name,
    description: plain(profile.description, ctx),
    url: `${SITE_URL}${path}`,
    additionalType: 'https://schema.org/Volcano',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: volcano.lat,
      longitude: volcano.lon,
      ...(volcano.elevation !== null ? { elevation: volcano.elevation } : {}),
    },
    containedInPlace: { '@type': 'Country', name: volcano.country },
    sameAs: [gvpUrl],
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: profile.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: plain(answer, ctx) },
    })),
  };

  const periodsTable = stats.periods.length > 0 && (
    <>
      <p className="va-tcap" id="va-t-periods">
        {name}’s eruptions since {ctx.open_before ?? stats.periods[0].start[0]}
      </p>
      <div className="va-scroll" role="region" aria-labelledby="va-t-periods" tabIndex={0}>
        <table className="va-table" aria-labelledby="va-t-periods">
          <thead>
            <tr>
              <th scope="col">Started</th>
              <th scope="col">Ended</th>
              <th scope="col">Lasted</th>
              <th scope="col">Pause that followed</th>
              <th scope="col" className="va-num">Largest VEI</th>
            </tr>
          </thead>
          <tbody>
            {stats.periods.map((row) => (
              <tr key={row.eruption.n}>
                <td>{row.openStart ? `before ${row.start[0]}` : shortDate(row.start)}</td>
                <td>{row.continuing ? 'continuing' : shortDate(row.end)}</td>
                <td>{row.length}</td>
                <td>{row.continuing ? '' : (row.pauseAfter ?? 'none')}</td>
                <td className="va-num">{row.eruption.vei ?? 'not given'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Html
        className="va-srcline"
        html={`${gvpLine} Lengths, pauses and the ${ctx.share}% figure are calculated from its dates. VEI is the ${vei ? `<a href="${vei}">Volcanic Explosivity Index</a>` : 'Volcanic Explosivity Index'}.`}
      />
    </>
  );

  const noaaTable = noaa.length > 0 && (
    <>
      <p className="va-tcap" id="va-t-noaa">
        Significant events at {name} in NOAA’s database, {ctx.noaa_first}–{ctx.noaa_last}
      </p>
      <div className="va-scroll" role="region" aria-labelledby="va-t-noaa" tabIndex={0}>
        <table className="va-table" aria-labelledby="va-t-noaa">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col" className="va-num">VEI</th>
              <th scope="col" className="va-num">Deaths</th>
              <th scope="col">Tsunami recorded</th>
            </tr>
          </thead>
          <tbody>
            {noaa.map((event) => (
              <tr key={event.id}>
                <td>
                  <a href={`${NOAA_EVENT}${event.id}`} rel="noopener">{noaaDate(event)}</a>
                </td>
                <td className="va-num">{event.vei ?? 'not given'}</td>
                <td className="va-num">{event.deaths}</td>
                <td>{event.tsunami ? 'yes' : 'no'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Html
        className="va-srcline"
        html={`Source: NOAA NCEI/WDS Global Significant Volcanic Eruptions Database, retrieved ${retrievedMonth}.${ref('noaa')} NOAA counts an eruption as significant if it killed someone, did about $1 million or more in damage, reached VEI 6, caused a tsunami or came with a significant earthquake. Each date opens NOAA’s page for that event.`}
      />
    </>
  );

  const recordTable = (
    <details className="va-details">
      <summary>Show all {stats.all.length} eruptions</summary>
      <p className="va-tcap" id="va-t-record">
        Every eruption of {name} in the Smithsonian’s record
      </p>
      <div className="va-scroll" role="region" aria-labelledby="va-t-record" tabIndex={0}>
        <table className="va-table" aria-labelledby="va-t-record">
          <thead>
            <tr>
              <th scope="col">Started</th>
              <th scope="col">Ended</th>
              <th scope="col" className="va-num">VEI</th>
              <th scope="col">How it was dated</th>
            </tr>
          </thead>
          <tbody>
            {stats.all.map((eruption) => (
              <tr key={eruption.n}>
                <td>{startLabel(eruption)}</td>
                <td>{endLabel(eruption)}</td>
                <td className="va-num">
                  {eruption.vei ?? 'not given'}
                  {eruption.veiq === '?' ? '?' : ''}
                </td>
                <td>{eruption.method ? (METHOD_LABEL[eruption.method] ?? eruption.method.toLowerCase()) : 'not given'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Html className="va-srcline" html={`${gvpLine} A question mark means the Smithsonian marks the value as uncertain.`} />
    </details>
  );

  const tables: Record<NonNullable<RecordSection['table']>, React.ReactNode> = { periods: periodsTable, noaa: noaaTable, record: recordTable };

  const callouts = (
    <div className="va-aside">
      {stats.pauses.length > 0 && (
        <p className="va-hand va-note2">
          {ctx.n_pauses_word} pauses in {ctx.span_years} years
        </p>
      )}
      {profile.callouts.map((callout) => (
        <aside className="va-callout" key={callout.unit}>
          <p className="va-cnum">
            {plain(callout.number, ctx)} <span>{callout.unit}</span>
          </p>
          <p className="va-ctxt">{plain(callout.text, ctx)}</p>
          <Html className="va-csrc" html={`Source: Global Volcanism Program, Smithsonian Institution.${ref('gvp')} Calculated.`} />
        </aside>
      ))}
    </div>
  );

  return (
    <>
      <JsonLd data={placeLd} />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd} />

      <article className="va-page">
        <header className="va-hero">
          <nav className="va-crumbs" aria-label="Breadcrumb">
            <ol>
              {crumbs.map((crumb, i) => (
                <li key={crumb.path} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                  {i === crumbs.length - 1 ? crumb.name : <Link href={crumb.path}>{crumb.name}</Link>}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="va-h1">{profile.h1}</h1>
          <p className="va-dataline">
            {profile.reviewed && (
              <>
                By <Link href={AUTHOR.page}>{AUTHOR.name}</Link>, {AUTHOR.credential}
                <span className="va-dot"> · </span>Reviewed {longDate(isoToYmd(profile.reviewed))}
                <span className="va-dot"> · </span>
              </>
            )}
            Data retrieved {longDate(retrieved)}
            <span className="va-dot"> · </span>
            <a href="#va-sources">Sources</a>
          </p>

          <div className="va-big">
            <p className="va-since">{plain(profile.big.line, ctx)}</p>
            <p className="va-years">
              <span className="va-yearsnum" style={{ ['--va-digits' as string]: plain(profile.big.number, ctx).length }}>
                {plain(profile.big.number, ctx)}
                <svg className="va-ring" viewBox="0 0 220 150" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    className="va-ringpath"
                    pathLength={1}
                    d="M24 82 C14 34 78 8 128 12 C182 16 212 48 204 86 C196 126 138 144 92 140 C50 136 22 118 26 76 C30 44 60 26 96 22"
                    fill="none"
                    stroke="#c21f1f"
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              {profile.big.unit}
            </p>
            <p className="va-hand va-note1">{weekly ? `still going in the ${weekly.periodShort} report` : profile.big.note}</p>
          </div>

          <Html className="va-answer" html={r(profile.answer)} />

          <figure className="va-strip">
            <div className="va-perf" aria-hidden="true" />
            <div className="va-stripin">
              <Timeline data={data} />
              <Timeline data={data} small />
            </div>
            <div className="va-perf" aria-hidden="true" />
          </figure>
          <Html className="va-figcap" html={r(profile.timeline.caption)} />
        </header>

        <div className="va-band">
          <div className="va-bandtext">
            {weekly && (
              <div className="va-weekly">
                <p>
                  <strong>Latest weekly report: {weekly.period}.</strong> {name} is in the Smithsonian / USGS Weekly Volcanic Activity Report for
                  that week{weekly.section ? `, listed as “${weekly.section}”` : ''}.
                  <span dangerouslySetInnerHTML={{ __html: ref('weekly') }} />
                  {weekly.stale && ` That is the newest report in the Smithsonian’s feed, which was last updated on ${weekly.published}.`}
                </p>
                <p className="va-weeklylinks">
                  <a href={weekly.link} rel="noopener">
                    Read the {name} entry
                  </a>
                  <Link href="/latest-eruptions">All volcanoes in that report</Link>
                </p>
              </div>
            )}
            <Html className="va-lede" html={r(profile.lede)} />
            <section className="va-factbox" aria-labelledby="va-facts-h">
              <h2 id="va-facts-h">{name} key facts</h2>
              <dl className="va-facts">
                {keyFacts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <Html className="va-csrc" html={`Sources: Smithsonian Global Volcanism Program;${ref('gvp')} INGV for the base.${ref('ingv')}`} />
            </section>
          </div>
          <figure className="va-fig va-bandfig">
            <SectionDrawing data={data} />
            <SectionDrawing data={data} compact />
            <Html as="figcaption" html={r(profile.section.caption)} />
          </figure>
        </div>

        <div className="va-main">
          {profile.sections.map((section) => (
            <section className="va-sec-block" id={`va-${section.id}`} key={section.id}>
              {section.aside === 'callouts' && callouts}
              <div className="va-col">
                <h2 className="va-h2">{section.h}</h2>
                {section.paras.map((para, i) => (
                  <Html key={i} html={r(para)} />
                ))}
                {section.table && tables[section.table]}
                {section.note && <Html className="va-note" html={r(section.note)} />}
                {section.map && (
                  <LazyMap
                    name={name}
                    lat={volcano.lat}
                    lon={volcano.lon}
                    elevation={volcano.elevation ?? 0}
                    type={ctx.type ?? 'Volcano'}
                    country={volcano.country}
                    region={volcano.region ?? ''}
                    status={ctx.cur_start ? `Erupting since ${ctx.cur_start}` : 'See the record on this page'}
                  />
                )}
              </div>
            </section>
          ))}

          <section className="va-wide" id="va-faq">
            <h2 className="va-h2">{profile.faq_h}</h2>
            <div className="va-faqgrid">
              {profile.faq.map(([question, answer]) => (
                <div className="va-qa" key={question}>
                  <h3>{question}</h3>
                  <p>{plain(answer, ctx)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="va-wide" id="va-sources">
            <h2 className="va-h2">Sources and how the numbers were calculated</h2>
            <div className="va-srcgrid">
              <ol className="va-srclist">
                {sources.map((source, i) => (
                  <li id={`va-src-${i + 1}`} key={source.id}>
                    {source.publisher}.{' '}
                    <a href={source.id === 'weekly' ? WEEKLY_HOME : source.url} rel="noopener">
                      {plain(source.title, ctx)}
                      {source.id === 'weekly' && weekly ? `, ${weekly.period}` : ''}
                    </a>
                    .
                  </li>
                ))}
              </ol>
              <ul className="va-calc">
                {profile.calc.map((line, i) => (
                  <Html as="li" key={i} html={r(line)} />
                ))}
              </ul>
            </div>
            <p className="va-srcline">
              Smithsonian and NOAA data retrieved {longDate(retrieved)}. The other sources were read on {longDate(isoToYmd(profile.observatory_read))}.
            </p>
          </section>

          {(others.length > 0 || explore.length > 0) && (
            <nav className="va-wide va-related" aria-labelledby="va-related-h">
              <h2 className="va-h2" id="va-related-h">More volcanoes</h2>
              <div className="va-relgrid">
                {others.length > 0 && (
                  <div>
                    <h3>In {volcano.country}</h3>
                    <ul>
                      {others.map((other) => (
                        <li key={other.slug}>
                          <Link href={`/volcano/${other.slug}`}>{other.hero.name}</Link>
                        </li>
                      ))}
                      {countryLink && (
                        <li>
                          <Link href={countryLink}>
                            All {ctx.n_country} volcanoes in {volcano.country}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {explore.length > 0 && (
                  <div>
                    <h3>Around the world</h3>
                    <ul>
                      {explore.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href}>{link.text}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>
      </article>
    </>
  );
}
