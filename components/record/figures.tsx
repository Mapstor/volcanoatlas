import type { ReactNode } from 'react';
import { dateText, daysBetween, decimalYear, feet, fmt, precisionOf, roundTo, spanBetween, yearText, type Precision, type Ymd } from '@/lib/eruptions';
import { fill, type LagoonLevel, type RecordData } from '@/lib/recordProfile';

/** Drawings of the record page. Every position and label comes from the source data passed in. */

const PAL = {
  paper: '#fbfcf9',
  grid: '#c4d8c9',
  ink: '#17212b',
  accent: '#d9482b',
  mute: '#4d5d58',
  pencil: '#c21f1f',
  sea: '#cfe3e6',
  seaInk: '#2d5560',
  rock: '#8a8f8c',
  root: '#777d7a',
  crust: '#c9cfca',
  lava: '#d9482b',
};

// small deterministic generator, so the hand-drawn wobble of the line is the same on every build
function wobble(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Curve = [number, number][];
const f = (n: number) => n.toFixed(1);
const cubic = (c: Curve) => `C${f(c[1][0])} ${f(c[1][1])} ${f(c[2][0])} ${f(c[2][1])} ${f(c[3][0])} ${f(c[3][1])}`;
/** x of a curve at height y (the curve is sampled; good to a pixel) */
function curveX(curve: Curve, y: number) {
  let best = curve[0];
  for (let t = 0; t <= 1; t += 0.005) {
    const u = 1 - t;
    const px = u * u * u * curve[0][0] + 3 * u * u * t * curve[1][0] + 3 * u * t * t * curve[2][0] + t * t * t * curve[3][0];
    const py = u * u * u * curve[0][1] + 3 * u * u * t * curve[1][1] + 3 * u * t * t * curve[2][1] + t * t * t * curve[3][1];
    if (Math.abs(py - y) < Math.abs(best[1] - y)) best = [px, py];
  }
  return best[0];
}

/**
 * Strip chart of the eruption record: the line is high while the Smithsonian lists an eruption in progress and low in
 * between. An eruption too short to show as a stretch is a spike. The record ends at the Smithsonian's last update of
 * a continuing eruption, or on the day the data was retrieved.
 */
export function Timeline({ data, small = false }: { data: RecordData; small?: boolean }) {
  const { stats, profile, ctx, retrieved } = data;
  const spec = profile.timeline;
  const w = small ? 358 : 1140;
  const h = small ? 214 : 220;
  const y0 = spec.from;
  const y1 = spec.to;
  const x0 = small ? 16 : 70;
  const x1 = w - (small ? 36 : 40);
  const top = small ? 46 : 32;
  const ya = top + (small ? 34 : 44);
  const yb = ya + (small ? 44 : 62);
  const X = (year: number) => x0 + ((year - y0) / (y1 - y0)) * (x1 - x0);
  const rnd = wobble(7);
  const calm = wobble(11);
  const step = small ? 2.2 : 2;
  const endDate: Ymd = stats.currentLast ?? retrieved;
  const endYear = decimalYear(endDate);
  const low = spec.low_label ?? 'paused';

  const items = stats.spans
    // an eruption that began "before" a year is drawn from the left edge only when the record also gives it an end (or has it
    // continuing); with no end on record it is a spike at that year, like any other eruption without an end date
    .map((span) => {
      const start = decimalYear(span.start);
      const row = span.eruption;
      // an end the record gives only to the month or to the year still ends the eruption there (Sakurajima 1779 to May 1781,
      // Pico de Orizaba 1569 to 1589): the middle of that year, or the first of that month
      const looseEnd: Ymd | null = !span.continuing && row.ey && !(row.em && row.ed) ? [row.ey, row.em || 7, 1] : null;
      const loose = looseEnd !== null && decimalYear(looseEnd) > start;
      const endYmd: Ymd = loose && looseEnd ? looseEnd : span.end;
      const endPrecision: Precision = loose ? (row.em ? 'month' : 'year') : span.endPrecision;
      const end = decimalYear(endYmd);
      return { s: span.openStart && (span.continuing || end > start) ? y0 : Math.max(y0, start), e: end, span, loose, endYmd, endPrecision };
    })
    .filter((p) => p.e > y0);
  // such a block never runs past the start of the next eruption
  items.forEach((p, i) => {
    const next = items[i + 1];
    if (p.loose && next && p.e > next.s) p.e = next.s;
  });

  // the line, left to right
  const pts: [number, number][] = [];
  const quiet = (from: number, to: number) => {
    // a long quiet stretch gets the slight tremble of a pen at rest
    if (to - from > 40) for (let x = from + 6; x < to - 3; x += 6) pts.push([x, yb + (calm() * 1.6 - 0.8)]);
  };
  items.forEach((p, i) => {
    const xa = X(p.s);
    const xb = X(p.e);
    const joined = i > 0 && Math.abs(items[i - 1].e - p.s) < 0.01;
    if (i === 0) {
      if (p.s <= y0 + 0.01) pts.push([xa, ya]);
      else {
        pts.push([x0, yb]);
        quiet(x0, xa);
        pts.push([xa, yb], [xa, ya]);
      }
    } else if (!joined) {
      quiet(X(items[i - 1].e), xa);
      pts.push([xa, yb], [xa, ya]);
    }
    if (xb - xa < 1.5) pts.push([xa + 0.8, ya - 4]);
    else {
      for (let x = xa + step; x < xb; x += step) pts.push([x, ya + (rnd() * 6.4 - 3.2)]);
      pts.push([xb, ya]);
    }
    const next = items[i + 1];
    if (!p.span.continuing && !(next && Math.abs(next.s - p.e) < 0.01)) pts.push([xb, yb]);
  });
  // a volcano with no eruption on the list (Blup Blup): the pen rests from the left edge of the strip to today
  if (items.length === 0) {
    pts.push([x0, yb]);
    quiet(x0, X(endYear));
    pts.push([X(endYear), yb]);
  }
  const lastItem = items[items.length - 1];
  const erupting = Boolean(lastItem && lastItem.span.continuing);
  if (lastItem && !erupting) {
    quiet(X(lastItem.e), X(endYear));
    pts.push([X(endYear), yb]);
  }
  const spikes: { x: number; label: string }[] = [];
  for (const mark of spec.marks) {
    const xs = X(mark.year);
    // the nearest point of the line that is in an eruption, so a marked year is a peak and never a ramp up to one
    let best = -1;
    pts.forEach((pt, k) => {
      if (pt[1] < yb - 1 && (best < 0 || Math.abs(pt[0] - xs) < Math.abs(pts[best][0] - xs))) best = k;
    });
    if (best < 0) continue;
    pts[best] = [pts[best][0], ya - (small ? 22 : 30)];
    spikes.push({ x: pts[best][0], label: mark.label });
  }
  const d = `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`;
  const xEnd = pts.length ? pts[pts.length - 1][0] : x0;
  const penY = erupting ? ya : yb;

  // gaps between eruptions, and the one since the last eruption
  const gaps: { from: Ymd; to: Ymd; days: number; text: string }[] = [];
  items.forEach((p, i) => {
    const next = items[i + 1];
    const to: Ymd | null = next ? next.span.start : erupting ? null : endDate;
    if (!to) return;
    const toPrecision: Precision = next ? next.span.startPrecision : 'day';
    const days = daysBetween(p.endYmd, to);
    // the gap since the last eruption runs to today: whole months, never rounded up, like the page's main number
    // (Mount Pelee's strip said "94 years" beside a main number of 93 once the data was read after the 16th of a month)
    if (days > 3) gaps.push({ from: p.endYmd, to, days, text: spanBetween(p.endYmd, p.endPrecision, to, toPrecision, !next).text });
  });
  const centered = spec.label_gaps !== undefined;
  const labelled = centered ? [...gaps].sort((a, b) => b.days - a.days).slice(0, spec.label_gaps) : gaps;

  const fs = small ? 12 : 14;
  const hand = small ? 17 : 22;
  const grid: ReactNode[] = [];
  const gridLabels: ReactNode[] = [];
  // a record of several centuries on a phone gets a line every 50 years and a year every 100; otherwise 10 and 50.
  // Past 700 years (Mount Fuji: 750 to 2030) the lines are 50 years apart at every width and the years 100 apart,
  // 250 on a phone, where a year every 100 would run into the next
  const long = small && y1 - y0 > 260;
  const veryLong = y1 - y0 > 700;
  // a record of several thousand years (Chimborazo: 8500 BCE to 2030) gets a line every 1,000 years and a year every
  // 2,000, every 4,000 on a phone; its years carry their era, and the mark at the turn of the eras reads "1 CE"
  const ages = y1 - y0 > 3000;
  const gridStep = ages ? 1000 : long || veryLong ? 50 : 10;
  const labelStep = ages ? (small ? 4000 : 2000) : veryLong ? (small ? 250 : 100) : long ? 100 : 50;
  const gridYear = (year: number) => (y0 >= 0 ? String(year) : year < 0 ? `${-year} BCE` : year === 0 ? '1 CE' : `${year} CE`);
  for (let year = Math.ceil(y0 / gridStep) * gridStep; year <= y1; year += gridStep) {
    const x = X(year);
    const major = year % labelStep === 0;
    grid.push(<line key={`g${year}`} x1={x} y1={top - 8} x2={x} y2={yb + 22} stroke={PAL.grid} strokeWidth={major ? 1.4 : 0.7} />);
    if (major)
      // the years are drawn last, on a paper edge, so a red date tick passes behind them
      gridLabels.push(
        <text key={`t${year}`} x={x} y={yb + 42} textAnchor="middle" fontSize={fs} fill={PAL.mute} stroke={PAL.paper} strokeWidth={4} paintOrder="stroke">
          {gridYear(year)}
        </text>,
      );
  }
  const startX = stats.currentStart ? X(decimalYear(stats.currentStart)) : null;
  const lastX = !erupting && stats.lastEnd ? X(decimalYear(stats.lastEnd)) : null;
  // a last eruption the record gives only by year is marked at the middle of that year, where its spike stands
  const lastYearX = !erupting && !stats.lastEnd && stats.lastYearOnly !== null ? X(stats.lastYearOnly + 0.5) : null;
  // a last eruption dated from deposits, as a year with a margin, is marked at that year and labelled "about"
  const lastMargin = !erupting && !stats.lastEnd && stats.lastYearOnly === null ? stats.lastYearMargin : null;
  // a last eruption whose year the record questions and gives no margin (Pululahua) is marked the same way, with the word
  const lastQuestioned = !erupting && !stats.lastEnd && stats.lastYearOnly === null && !stats.lastYearMargin ? stats.lastYearQuestioned : null;
  const lastAbout = lastMargin ? { year: lastMargin.year, questioned: false } : lastQuestioned !== null ? { year: lastQuestioned, questioned: true } : null;
  const lastMarginX = lastAbout ? X(lastAbout.year + 0.5) : null;
  const note = spec.note ? fill(spec.note, ctx) : null;
  const struck = (spec.struck ?? []).filter((mark) => mark.year > y0 && mark.year < y1);
  const from = y0 < 0 ? `${-y0} BCE` : y0;
  const label =
    items.length === 0
      ? `Strip chart for ${profile.name} from ${from} to ${endDate[0]}: the Smithsonian's list has no eruption, so the line stays low.`
      : `Strip chart of ${profile.name}'s eruption record from ${from} to ${endDate[0]}: the line is high while an eruption is in progress and low while the volcano is ${low}.`;
  const struckLabel = struck.length ? ` Crossed-out marks at ${struck.map((mark) => mark.label).join(' and ')} are reports the Smithsonian lists as discredited.` : '';

  return (
    <svg
      className={`va-tl ${small ? 'va-tl-small' : 'va-tl-wide'}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={label + struckLabel}
    >
      <rect x={0} y={0} width={w} height={h} fill={PAL.paper} />
      {grid}
      <line x1={x0} y1={ya} x2={x1} y2={ya} stroke={PAL.grid} strokeWidth={0.7} />
      <line x1={x0} y1={yb} x2={x1} y2={yb} stroke={PAL.grid} strokeWidth={0.7} />
      {!small && (
        <>
          <text x={x0 - 10} y={ya + 5} textAnchor="end" fontSize={13} fill={PAL.mute}>erupting</text>
          <text x={x0 - 10} y={yb + 5} textAnchor="end" fontSize={13} fill={PAL.mute}>{low}</text>
        </>
      )}
      {items.map((p) => (
        <rect key={`b${p.span.eruption.n}`} x={X(p.s)} y={yb + 12} width={Math.max(X(p.e) - X(p.s), 1.2)} height={6} fill={PAL.accent} />
      ))}
      {struck.map((mark) => {
        // a report the Smithsonian rejects: a dashed mark where the eruption would stand, crossed out in red pencil
        const x = X(mark.year);
        const mid = (ya + yb) / 2;
        const r = small ? 6 : 8;
        return (
          <g key={`x${mark.label}`}>
            <line x1={x} y1={yb} x2={x} y2={ya} stroke={PAL.mute} strokeWidth={1.2} strokeDasharray="3 4" />
            <path d={`M${x - r} ${mid - r} L${x + r} ${mid + r} M${x + r} ${mid - r} L${x - r} ${mid + r}`} stroke={PAL.pencil} strokeWidth={2.4} strokeLinecap="round" fill="none" />
            <text x={x} y={ya - (small ? 8 : 10)} textAnchor="middle" fontSize={fs - 1} fill={PAL.mute} stroke={PAL.paper} strokeWidth={4} paintOrder="stroke">
              {mark.label}
            </text>
          </g>
        );
      })}
      <path className="va-draw" d={d} pathLength={1} fill="none" stroke={PAL.ink} strokeWidth={small ? 1.5 : 1.7} strokeLinejoin="round" strokeLinecap="round" />
      <g className="va-pen">
        <path d={`M${xEnd.toFixed(1)} ${penY} l9 -5 l0 10 z`} fill={PAL.ink} />
        <path d={`M${(xEnd + 8).toFixed(1)} ${penY} l${small ? 16 : 30} -${small ? 9 : 16}`} stroke={PAL.ink} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      </g>
      {!small &&
        labelled.map((gap, k) => {
          const xm = (X(decimalYear(gap.from)) + X(decimalYear(gap.to))) / 2;
          if (centered)
            return (
              <text key={`p${k}`} className="va-hand" x={xm} y={yb - 12} textAnchor="middle" fontSize={hand} fill={PAL.pencil}>
                {gap.text}
              </text>
            );
          const right = k === labelled.length - 1;
          return (
            <text key={`p${k}`} className="va-hand" x={xm + (right ? 12 : -12)} y={yb - 24} textAnchor={right ? 'start' : 'end'} fontSize={hand} fill={PAL.pencil}>
              {gap.text}
            </text>
          );
        })}
      {!small && note && typeof spec.note_at === 'number' && (
        <text className="va-hand" x={X(y0 + (y1 - y0) * spec.note_at)} y={(ya + yb) / 2 + 8} textAnchor="middle" fontSize={hand} fill={PAL.pencil}>
          {note}
        </text>
      )}
      {small && note && items.length === 0 && (
        // a strip with no eruption has no date label under it: on a phone the pencil note takes that place
        <text className="va-hand" x={w / 2} y={yb + 66} textAnchor="middle" fontSize={hand} fill={PAL.pencil}>
          {note}
        </text>
      )}
      {!small && note && spec.note_at === 'bottom' && (
        <text className="va-hand" x={x0} y={yb + 76} fontSize={hand} fill={PAL.pencil}>
          {note}
        </text>
      )}
      {spikes
        .filter((s) => !small || spec.marks.indexOf(spec.marks.find((m) => m.label === s.label)!) % 2 === 1)
        .map((s) => (
          <text key={`s${s.label}`} x={s.x} y={ya - (small ? 27 : 36)} textAnchor="middle" fontSize={fs - 1} fill={PAL.mute} stroke={PAL.paper} strokeWidth={4} paintOrder="stroke">
            {s.label}
          </text>
        ))}
      {startX !== null && stats.currentStart && (() => {
        const text =
          stats.current?.sdmod === '<'
            ? `by ${dateText(stats.currentStart, precisionOf(stats.current.sdunc))}: current eruption under way`
            : // a start day the Smithsonian marks with a question mark says so here too, as the end of a last eruption does below
              `${dateText(stats.currentStart, precisionOf(stats.current?.sdunc))}${stats.current?.sdmod === '?' ? ' (uncertain)' : ''}: current eruption begins`;
        // the label goes left of its tick when it would run off the right end of the strip
        // (bold Archivo runs about half an em per letter; measured on the Erebus label, which fits and stays put)
        const flip = !small && startX + 6 + text.length * (fs + 1) * 0.5 > w - 8;
        return (
          <>
            <line x1={startX} y1={yb + 22} x2={startX} y2={yb + (small ? 50 : 58)} stroke={PAL.accent} strokeWidth={1.5} />
            <text x={small ? w / 2 : flip ? startX - 6 : startX + 6} y={yb + (small ? 66 : 74)} textAnchor={small ? 'middle' : flip ? 'end' : 'start'} fontSize={fs + 1} fontWeight={700} fill={PAL.ink}>
              {text}
            </text>
          </>
        );
      })()}
      {lastX !== null && stats.lastEnd && (
        <>
          <line x1={lastX} y1={yb + 22} x2={lastX} y2={yb + (small ? 50 : 58)} stroke={PAL.accent} strokeWidth={1.5} />
          <text
            x={small ? w / 2 : lastX > w * 0.6 ? lastX - 6 : lastX + 6}
            y={yb + (small ? 66 : 74)}
            textAnchor={small ? 'middle' : lastX > w * 0.6 ? 'end' : 'start'}
            fontSize={fs + 1}
            fontWeight={700}
            fill={PAL.ink}
          >
            {dateText(stats.lastEnd, stats.lastEndPrecision)}
            {stats.lastEndQuestioned ? ' (uncertain)' : ''}
            {/* an observatory that dates a later eruption leads the page (D-68): the strip's end is then the list's own */}
            {profile.agency_last ? ': last eruption on this list ended' : ': last eruption ended'}
          </text>
        </>
      )}
      {lastYearX !== null && (
        <>
          <line x1={lastYearX} y1={yb + 22} x2={lastYearX} y2={yb + (small ? 50 : 58)} stroke={PAL.accent} strokeWidth={1.5} />
          <text
            x={small ? w / 2 : lastYearX > w * 0.6 ? lastYearX - 6 : lastYearX + 6}
            y={yb + (small ? 66 : 74)}
            textAnchor={small ? 'middle' : lastYearX > w * 0.6 ? 'end' : 'start'}
            fontSize={fs + 1}
            fontWeight={700}
            fill={PAL.ink}
          >
            {stats.lastYearOnly}: last eruption on record
          </text>
        </>
      )}
      {lastMarginX !== null && lastAbout && (
        <>
          <line x1={lastMarginX} y1={yb + 22} x2={lastMarginX} y2={yb + (small ? 50 : 58)} stroke={PAL.accent} strokeWidth={1.5} />
          <text
            x={small ? w / 2 : lastMarginX > w * 0.6 ? lastMarginX - 6 : lastMarginX + 6}
            y={yb + (small ? 66 : 74)}
            textAnchor={small ? 'middle' : lastMarginX > w * 0.6 ? 'end' : 'start'}
            fontSize={fs + 1}
            fontWeight={700}
            fill={PAL.ink}
          >
            about {`${yearText(lastAbout.year)}${lastAbout.questioned ? ' (uncertain)' : ''}`}: last eruption on record
          </text>
        </>
      )}
      {!small && ctx.open_before && (
        <text x={x0} y={yb + 74} fontSize={13} fill={PAL.mute}>
          already erupting by {ctx.open_before}
        </text>
      )}
      {gridLabels}
    </svg>
  );
}

/** The cut-open drawing that fits the profile: an island cone, a shield pressed into the sea floor, a volcano on land, a summit caldera, or a caldera flooded by the sea. */
export function SectionDrawing({ data, compact = false }: { data: RecordData; compact?: boolean }) {
  const kind = data.profile.section.kind;
  if (kind === 'shield') return <ShieldDrawing data={data} compact={compact} />;
  if (kind === 'land') return <LandDrawing data={data} compact={compact} />;
  if (kind === 'caldera') return <CalderaDrawing data={data} compact={compact} />;
  if (kind === 'lagoon') return <LagoonDrawing data={data} compact={compact} />;
  if (kind === 'basin') return <BasinDrawing data={data} compact={compact} />;
  if (kind === 'seamount') return <SeamountDrawing data={data} compact={compact} />;
  return <ConeDrawing data={data} compact={compact} />;
}

/** Small waves under a water surface; the path is longer than the drawing so it can slide without a seam. */
function wavePath(y: number, half: number, w: number) {
  let d = `M${-4 * half} ${f(y)} q${half / 2} -2.4 ${half} 0`;
  for (let x = -3 * half; x < w + 4 * half; x += half) d += ` t${half} 0`;
  return d;
}

/**
 * A volcano on land, or one that rises straight from the water, cut open. Two heights are to scale: the summit above
 * sea level and the land around the volcano. The outline is schematic. Lava and gas are drawn only while the
 * Smithsonian lists the eruption as continuing.
 */
function LandDrawing({ data, compact }: { data: RecordData; compact: boolean }) {
  const { profile, stats } = data;
  const sec = profile.section;
  const summit = data.summit?.m ?? 0;
  const summitFt = data.summit?.ft ?? 0;
  const ground = data.ground?.m ?? 0;
  const onWater = !data.ground;
  const former = sec.former;
  const w = compact ? 340 : 560;
  const fs = compact ? 13 : 15;
  const bold = fs + (compact ? 1.5 : 3);
  const line = fs + 4;
  const topY = compact ? 96 : 104;
  const cx = w * (compact ? 0.37 : 0.38);
  const W = w * (compact ? 0.26 : 0.29);
  // One scale for every height. It fills the drawing unless that would make the volcano taller than half its drawn
  // base is wide; then the drawing is made shorter instead.
  const highest = Math.max(summit, former?.m ?? 0);
  // A volcano on a high plateau (Cotopaxi stands on land 3,750 m up): at one scale the slab of land under it would be
  // taller than the volcano. The slab is then cut short with a break mark, and heights are to scale above the land only.
  const cut = !onWater && ground > (highest - ground) * 1.2;
  const slab = compact ? 58 : 66;
  const room = (compact ? 420 : 520) - (compact ? 34 : 40) - topY;
  const k = cut ? Math.min((room - slab) / (highest - ground), W / (highest - ground)) : Math.min(room / highest, W / (highest - ground));
  const seaY = cut ? topY + (highest - ground) * k + slab : topY + highest * k;
  const h = Math.round(seaY + (compact ? 34 : 40));
  const Y = (m: number) => (cut ? seaY - slab - (m - ground) * k : seaY - m * k);
  const breakY = seaY - slab * 0.47;
  const zigzag = (y: number) => {
    let d = `M0 ${f(y)}`;
    for (let x = 7, up = true; x <= w + 14; x += 14, up = !up) d += ` L${x} ${f(y + (up ? -4 : 4))}`;
    return d;
  };
  const summitY = Y(summit);
  const groundY = Y(ground);
  const H = groundY - summitY;
  const notch = sec.crater_share ? W * sec.crater_share : compact ? 6 : 9;
  // a crater is drawn to scale down to 60% of the drawn height (Fernandina's caldera is 850 m deep in a 1,476 m volcano)
  const crater = Math.min(H * 0.6, Math.max(3, (sec.crater_depth_m ?? 0) * k));
  const inset = Math.min(notch * 0.4, crater * 0.5);
  const dome = sec.dome_m ? Math.min(crater * 0.8, sec.dome_m * k) : 0;
  // flanks of a stratovolcano: gentle at the foot, steeper under the summit
  const left: Curve = [
    [cx - W, groundY],
    [cx - W * 0.58, groundY - H * 0.12],
    [cx - notch - (W - notch) * 0.22, summitY + H * 0.34],
    [cx - notch, summitY],
  ];
  const right: Curve = [
    [cx + notch, summitY],
    [cx + notch + (W - notch) * 0.22, summitY + H * 0.34],
    [cx + W * 0.58, groundY - H * 0.12],
    [cx + W, groundY],
  ];
  // the same cone without its crater, for the layer lines inside
  const body = `M${f(cx - W)} ${f(groundY)} C${f(cx - W * 0.58)} ${f(groundY - H * 0.12)} ${f(cx - W * 0.2)} ${f(summitY + H * 0.34)} ${f(cx)} ${f(summitY + crater + 4)} C${f(cx + W * 0.2)} ${f(summitY + H * 0.34)} ${f(cx + W * 0.58)} ${f(groundY - H * 0.12)} ${f(cx + W)} ${f(groundY)}`;
  const outline =
    `M${f(left[0][0])} ${f(left[0][1])} ${cubic(left)} L${f(cx - notch + inset)} ${f(summitY + crater)} ` +
    (dome
      ? `L${f(cx - (notch - inset) * 0.55)} ${f(summitY + crater)} Q${f(cx)} ${f(summitY + crater - dome * 2)} ${f(cx + (notch - inset) * 0.55)} ${f(summitY + crater)} `
      : '') +
    `L${f(cx + notch - inset)} ${f(summitY + crater)} L${f(right[0][0])} ${f(right[0][1])} ${cubic(right)} Z`;
  const active = Boolean(stats.current);
  const ventY = summitY + crater;
  const xa = compact ? 12 : 16;
  const xb = cx + W + (compact ? 10 : 14);
  const tall = groundY < seaY - 24;
  const rise = summit - ground;
  const riseFt = fmt(roundTo(feet(roundTo(rise, 50)), 100));
  const riseM = fmt(roundTo(rise, 50));
  const midY = (summitY + groundY) / 2;
  const base = sec.baseline ?? 'sea level';
  const clip = `va-land-${compact ? 'small' : 'wide'}`;
  const iceY = sec.ice_from_m !== undefined ? Y(sec.ice_from_m) : null;
  // an earlier, higher summit: the old flanks carried on up to their meeting point
  const formerY = former ? Y(former.m) : null;
  // the third line of the summit label ("above sea level") is left out on a phone when it would run into the lava
  // burst of an erupting volcano or into the dashed outline of an earlier summit
  const thirdLineEnd = xa + 12 + 15 * fs * 0.52;
  const shortLabel = compact && (active || (Boolean(former) && thirdLineEnd > cx - notch - 8));
  const teeth = (() => {
    if (iceY === null) return '';
    const x0 = curveX(left, iceY);
    const x1 = curveX(right, iceY);
    const n = Math.max(3, Math.round((x1 - x0) / 13));
    let d = `M${f(x0)} ${f(iceY)}`;
    for (let i = 1; i <= n; i++) d += ` L${f(x0 + ((x1 - x0) * (i - 0.5)) / n)} ${f(iceY + (i % 2 ? 7 : 4))} L${f(x0 + ((x1 - x0) * i) / n)} ${f(iceY)}`;
    return d;
  })();
  const label =
    `Section drawing of ${profile.name}: the summit is ${fmt(summit)} m above sea level` +
    (data.ground ? `, and the land around the volcano is at about ${fmt(ground)} m, so it stands about ${riseM} m above its surroundings` : '') +
    (former ? `. A dashed outline shows the earlier summit at ${fmt(former.m)} m` : '') +
    (cut ? '. The land under the volcano is cut short in the drawing' : '') +
    '.';

  return (
    <svg className={`va-sec ${compact ? 'va-sec-small' : 'va-sec-wide'}`} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={label}>
      <defs>
        <clipPath id={clip}>
          <path d={outline} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={w} height={h} fill={PAL.paper} />
      {onWater ? (
        <>
          <rect x={0} y={seaY} width={w} height={h - seaY} fill={PAL.sea} />
          {!sec.still_water && (
            <>
              <path className="va-wave" d={wavePath(seaY + 6, 18, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.9} opacity={0.5} />
              <path className="va-wave va-wave2" d={wavePath(seaY + 13, 26, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.8} opacity={0.3} />
            </>
          )}
        </>
      ) : (
        <rect x={0} y={groundY} width={w} height={seaY - groundY} fill={PAL.crust} />
      )}
      <path d={outline} fill={PAL.rock} />
      {[0.78, 0.56].map((sc) => (
        <path key={sc} d={body} fill="none" stroke={PAL.paper} strokeWidth={1} opacity={0.35} transform={`translate(${f(cx * (1 - sc))} ${f(groundY * (1 - sc))}) scale(${sc})`} />
      ))}
      {iceY !== null && (
        <>
          {/* ice: paper over the rock, then a pale wash of the water colour so it reads as ice against the page */}
          <rect x={0} y={0} width={w} height={iceY} fill={PAL.paper} clipPath={`url(#${clip})`} />
          <path d={`${teeth} V${f(iceY)} Z`} fill={PAL.paper} clipPath={`url(#${clip})`} />
          <rect x={0} y={0} width={w} height={iceY} fill={PAL.sea} opacity={0.5} clipPath={`url(#${clip})`} />
          <path d={`${teeth} V${f(iceY)} Z`} fill={PAL.sea} opacity={0.5} clipPath={`url(#${clip})`} />
          <path d={teeth} fill="none" stroke={PAL.ink} strokeWidth={0.8} strokeLinejoin="round" />
        </>
      )}
      {/* the conduit stops at the ground line when the land label sits inside the band, so it never runs through the label */}
      {active && <path d={`M${f(cx + 3)} ${f(groundY + (onWater ? 0 : tall ? 4 : Math.min(18, seaY - groundY)))} C${f(cx + 4)} ${f(groundY - H * 0.3)} ${f(cx - 3)} ${f(ventY + H * 0.35)} ${f(cx)} ${f(ventY + 2)}`} fill="none" stroke={PAL.lava} strokeWidth={compact ? 5 : 6} strokeLinecap="round" />}
      <path d={outline} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      {active && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} className={`va-bub va-bub${i}`} cx={cx} cy={ventY + 8} r={3.4 + (i % 2) * 1.2} fill={PAL.paper} stroke={PAL.ink} strokeWidth={0.9} />
          ))}
          <g className="va-burst" fill="none" stroke={PAL.lava} strokeWidth={2.2} strokeLinecap="round">
            <path d={`M${f(cx)} ${f(ventY)} q-12 -30 -30 -16`} />
            <path d={`M${f(cx)} ${f(ventY)} q-4 -40 -14 -34`} />
            <path d={`M${f(cx)} ${f(ventY)} q4 -44 12 -34`} />
            <path d={`M${f(cx)} ${f(ventY)} q14 -30 26 -14`} />
          </g>
        </>
      )}
      {former && formerY !== null && (
        <path
          className="va-former"
          d={`M${f(cx - notch)} ${f(summitY)} L${f(cx - 5)} ${f(formerY)} L${f(cx + 5)} ${f(formerY)} L${f(cx + notch)} ${f(summitY)}`}
          fill="none"
          stroke={PAL.pencil}
          strokeWidth={1.4}
          strokeDasharray="6 5"
          strokeLinejoin="round"
        />
      )}
      {!onWater && <line x1={0} y1={groundY} x2={w} y2={groundY} stroke={PAL.ink} strokeWidth={0.9} />}
      <line x1={0} y1={seaY} x2={w} y2={seaY} stroke={PAL.ink} strokeWidth={1.3} />
      <text className="va-it" x={w - 8} y={tall || onWater ? seaY - 7 : seaY + 17} textAnchor="end" fontSize={fs} fill={PAL.ink}>{base}</text>

      {/* summit above sea level */}
      <line x1={xa} y1={summitY} x2={cx - notch - 5} y2={summitY} stroke={PAL.ink} strokeWidth={0.8} strokeDasharray="3 3" />
      <path d={`M${xa} ${f(summitY)} V${f(seaY)} M${xa - 5} ${f(summitY)} h10 M${xa - 5} ${f(seaY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      {/* the break mark of a slab that is cut short; it also interrupts the bracket that runs down to sea level */}
      {cut && (
        <g aria-hidden="true">
          <path d={zigzag(breakY)} fill="none" stroke={PAL.paper} strokeWidth={6} />
          <path d={zigzag(breakY - 3)} fill="none" stroke={PAL.ink} strokeWidth={0.8} />
          <path d={zigzag(breakY + 3)} fill="none" stroke={PAL.ink} strokeWidth={0.8} />
        </g>
      )}
      {/* on a phone the lava burst of an erupting volcano needs the room of the third line, and so does the dashed
          outline of an earlier summit when the line would run into it; the bracket down to the baseline and its
          label say what the height is measured from */}
      <text x={xa + 12} y={summitY - 12 - line * (shortLabel ? 1 : 2)} fontSize={bold} fontWeight={700} fill={PAL.ink}>{fmt(summitFt)} ft</text>
      <text x={xa + 12} y={summitY - 11 - (shortLabel ? 0 : line)} fontSize={fs} fill={PAL.ink}>({fmt(summit)} m)</text>
      {!shortLabel && (
        <text x={xa + 12} y={summitY - 10} fontSize={fs} fill={PAL.ink}>above {onWater && sec.baseline ? 'the water' : 'sea level'}</text>
      )}

      {/* summit above the land around it */}
      {data.ground && rise > 0 && (
        <>
          <line x1={cx + notch + 5} y1={summitY} x2={xb + 8} y2={summitY} stroke={PAL.ink} strokeWidth={0.8} strokeDasharray="3 3" />
          <path d={`M${f(xb)} ${f(summitY)} V${f(groundY)} M${f(xb - 5)} ${f(summitY)} h10 M${f(xb - 5)} ${f(groundY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
          {compact ? (
            <>
              <text x={xb + 10} y={midY - 10} fontSize={fs} fill={PAL.ink}>
                about <tspan fontWeight={700}>{riseFt} ft</tspan>
              </text>
              <text x={xb + 10} y={midY - 10 + line - 1} fontSize={fs - 0.5} fill={PAL.ink}>above the land</text>
              <text x={xb + 10} y={midY - 10 + line * 2 - 3} fontSize={fs - 0.5} fill={PAL.ink}>9 miles away</text>
            </>
          ) : (
            <>
              <text x={xb + 12} y={midY - 6} fontSize={bold} fontWeight={700} fill={PAL.ink}>about {riseFt} ft</text>
              <text x={xb + 12} y={midY - 6 + line} fontSize={fs} fill={PAL.ink}>({riseM} m) above the</text>
              <text x={xb + 12} y={midY - 6 + line * 2 - 2} fontSize={fs} fill={PAL.ink}>land 9 miles away</text>
            </>
          )}
          <text className="va-it" x={xa + 12} y={tall ? groundY + 18 : seaY + 17} fontSize={fs - 1} fill={PAL.ink}>
            {compact ? `land around it: ${fmt(roundTo(feet(ground), 100))} ft` : `land 9 miles (15 km) away: about ${fmt(roundTo(feet(ground), 100))} ft (${fmt(ground)} m)`}
          </text>
        </>
      )}

      {sec.crater && !compact && (
        <>
          {/* the pointer ends just past the label, however long the label is */}
          <line x1={cx - (notch - inset) * 0.8} y1={ventY - 2} x2={Math.max(xa + 104, xa + 12 + sec.crater.length * fs * 0.5 + 6)} y2={summitY + 18} stroke={PAL.ink} strokeWidth={0.8} />
          <text x={xa + 12} y={summitY + 22} fontSize={fs} fontWeight={700} fill={PAL.ink}>{sec.crater}</text>
          {sec.crater_depth_m !== undefined && (
            <text x={xa + 12} y={summitY + 22 + line - 1} fontSize={fs - 1} fill={PAL.ink}>{sec.crater_depth_text ?? `${fmt(sec.crater_depth_ft ?? roundTo(feet(sec.crater_depth_m), 50))} ft deep`}</text>
          )}
        </>
      )}
      {iceY !== null && sec.ice_label && iceY - summitY > (compact ? 40 : 70) && (
        // a big ice cap carries its name on the ice; on a pointed cone the name sits low, where the ice is widest
        <text className="va-it" x={cx} y={(sec.crater_share ?? 0) < 0.1 ? iceY - 9 : (iceY + summitY) / 2 + 14} textAnchor="middle" fontSize={fs} fill={PAL.seaInk}>{sec.ice_label}</text>
      )}
      {iceY !== null && sec.ice_label && iceY - summitY <= (compact ? 40 : 70) && (
        <>
          <line x1={curveX(left, iceY + 3) - 3} y1={iceY + 3} x2={xa + (compact ? 92 : 132)} y2={iceY + 3 + (sec.crater ? line * 2 + 6 : 0)} stroke={PAL.ink} strokeWidth={0.8} />
          <text x={xa + 12} y={iceY + 8 + (sec.crater ? line * 2 + 6 : 0)} fontSize={fs - 1} fill={PAL.ink}>{sec.ice_label}</text>
        </>
      )}
      {former && formerY !== null && (
        <text x={cx + 14} y={formerY + 4} fontSize={fs - 1} fill={PAL.pencil} fontWeight={600}>{former.label}</text>
      )}
      {!compact && sec.note && (
        <>
          <path
            d={
              former && formerY !== null
                ? `M${f(cx + 92)} ${f(formerY - 34)} C${f(cx + 60)} ${f(formerY - 36)} ${f(cx + 30)} ${f(formerY - 26)} ${f(cx + 12)} ${f(formerY - 12)}`
                : `M${f(cx + 96)} ${f(summitY - 46)} C${f(cx + 64)} ${f(summitY - 48)} ${f(cx + 30)} ${f(summitY - 38)} ${f(cx + 10)} ${f(summitY - (active ? 44 : 10))}`
            }
            fill="none"
            stroke={PAL.pencil}
            strokeWidth={1.4}
            strokeLinecap="round"
          />
          <text className="va-hand" x={cx + 100} y={(former && formerY !== null ? formerY : summitY - 12) - 28} fontSize={23} fill={PAL.pencil}>{sec.note}</text>
        </>
      )}
    </svg>
  );
}

/** Pushes label baselines apart so each keeps `gap` from the one above, then lifts the stack if it runs past `max`. */
function spread(wanted: number[], gap: number, max: number): number[] {
  const down = wanted.reduce<number[]>((out, y, i) => [...out, i === 0 ? y : Math.max(y, out[i - 1] + gap)], []);
  const over = down.length ? Math.max(0, down[down.length - 1] - max) : 0;
  if (!over) return down;
  // lift from the bottom: the last label goes to `max`, the ones above keep their gap
  return down.reduceRight<number[]>((out, y, i) => [i === down.length - 1 ? max : Math.min(y, out[0] - gap), ...out], []);
}

/**
 * The summit of a caldera volcano cut open. Every labelled height is to one scale: the rim, the caldera floor, the
 * bottom of the collapse pit, the lava layers that have refilled it and the tallest lava fountain. Widths and wall
 * shapes are schematic. The fountain plays only while the Smithsonian lists the eruption as continuing.
 */
function CalderaDrawing({ data, compact }: { data: RecordData; compact: boolean }) {
  const { profile, stats } = data;
  const sec = profile.section;
  const cut = sec.cut;
  if (!cut) throw new Error(`record profile ${profile.slug}: a caldera drawing needs section.cut`);
  const active = Boolean(stats.current);
  const w = compact ? 340 : 560;
  const sx = w / 560;
  const fs = compact ? 12.5 : 14;
  const bold = fs + (compact ? 1.5 : 2);
  const line = fs + 3;
  const top = compact ? 30 : 40;
  const surface = cut.fills[cut.fills.length - 1];
  const fountainTop = cut.fountain ? cut.fountain.vent_m + cut.fountain.m : cut.rim.m + 60;
  const zTop = Math.max(fountainTop, cut.rim.m + 60);
  const zBot = cut.pit.m - (compact ? 95 : 75);
  const k = (compact ? 330 : 400) / (zTop - zBot);
  const Y = (m: number) => top + (zTop - m) * k;
  const h = Math.round(Y(zBot) + 2);
  const rimY = Y(cut.rim.m);
  const floorY = Y(cut.floor.m);
  const pitY = Y(cut.pit.m);
  // schematic plan: outer slope, rim, caldera floor, the pit, the far rim, outer slope
  const xRim = 64 * sx;
  const xFloor0 = 84 * sx;
  const xFloor1 = (compact ? 150 : 176) * sx;
  const xPit0 = (compact ? 214 : 236) * sx;
  const xPit1 = (compact ? 278 : 300) * sx;
  const xFar = (compact ? 352 : 372) * sx;
  const farM = cut.fountain ? cut.fountain.vent_m + 65 : cut.floor.m + 65;
  const farY = Y(farM);
  const leftX = (y: number) => xFloor1 + ((y - floorY) / (pitY - floorY)) * (xPit0 - xFloor1);
  const rightX = (y: number) => xPit1 + ((pitY - y) / (pitY - farY)) * (xFar - xPit1);
  const ground =
    `M0 ${f(Y(cut.rim.m - 70))} L${f(xRim)} ${f(rimY)} L${f(xFloor0)} ${f(floorY)} L${f(xFloor1)} ${f(floorY)} L${f(xPit0)} ${f(pitY)} ` +
    `L${f(xPit1)} ${f(pitY)} L${f(xFar)} ${f(farY)} L${w} ${f(Y(farM - 55))}`;
  // lava layers, oldest at the bottom
  const tones = [PAL.rock, PAL.root];
  const layers = cut.fills.map((l, i) => {
    const y = Y(l.m);
    const below = i === 0 ? pitY : Y(cut.fills[i - 1].m);
    const d = `M${f(leftX(below))} ${f(below)} L${f(rightX(below))} ${f(below)} L${f(rightX(y))} ${f(y)} L${f(leftX(y))} ${f(y)} Z`;
    return { d, y, level: l, tone: tones[Math.min(i, tones.length - 1)] };
  });
  const surfaceY = surface ? Y(surface.m) : pitY;
  const beforeY = cut.before ? Y(cut.before.m) : null;
  const ventY = cut.fountain ? Y(cut.fountain.vent_m) : floorY;
  const ventX = rightX(ventY);
  const jetTop = cut.fountain ? Y(fountainTop) : ventY;
  const jetH = ventY - jetTop;
  const jetW = compact ? 8 : 11;
  // how far the spray reaches sideways, and where the fountain's height bracket stands clear of it
  const reach = compact ? 0.62 : 1;
  const fx = ventX + jetW * 2.75 * reach + 6;
  const lx = xFar + (compact ? 12 : 18);
  const ft = (l: { m: number; ft: number }) => (compact ? `${fmt(l.ft)} ft` : `${fmt(l.ft)} ft (${fmt(l.m)} m)`);
  const words = (l: { label: string; short?: string }) => (compact ? (l.short ?? l.label) : l.label);
  const label =
    `Section drawing of the summit of ${profile.name}: the caldera rim is at ${fmt(cut.rim.m)} m above sea level and the caldera floor at ${fmt(cut.floor.m)} m. ` +
    `The collapse pit reached down to ${fmt(cut.pit.m)} m` +
    (surface ? ` and lava has refilled it to ${fmt(surface.m)} m` : '') +
    (cut.fountain ? `. The tallest lava fountain on record rose ${fmt(cut.fountain.m)} m above its vent` : '') +
    '.';
  // labels on the far side of the pit, one per level, pushed apart so they never touch
  const sideLabels: { y: number; level: { m: number; ft: number; label: string; short?: string }; from: [number, number] }[] = [];
  if (surface) sideLabels.push({ y: surfaceY, level: surface, from: [rightX(surfaceY), surfaceY] });
  if (!compact) cut.fills.slice(0, -1).forEach((l) => sideLabels.push({ y: Y(l.m), level: l, from: [rightX(Y(l.m)), Y(l.m)] }));
  sideLabels.push({ y: pitY, level: cut.pit, from: [xPit1, pitY] });
  sideLabels.sort((a, b) => a.y - b.y);
  // a label sits just under its own level, on the rock
  const tys = spread(sideLabels.map((l) => l.y + bold + 2), line * 2 + 6, h - line - 4);
  const placed = sideLabels.map((l, i) => ({ ...l, ty: tys[i] }));

  return (
    <svg className={`va-sec ${compact ? 'va-sec-small' : 'va-sec-wide'}`} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={label}>
      <rect x={0} y={0} width={w} height={h} fill={PAL.paper} />
      <path d={`${ground} V${h} H0 Z`} fill={PAL.crust} />
      {layers.map((l, i) => (
        <path key={i} d={l.d} fill={l.tone} />
      ))}
      {layers.slice(0, -1).map((l, i) => (
        <line key={i} x1={leftX(l.y)} y1={l.y} x2={rightX(l.y)} y2={l.y} stroke={PAL.paper} strokeWidth={1} opacity={0.6} />
      ))}
      <path d={ground} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      {surface && <line x1={leftX(surfaceY)} y1={surfaceY} x2={rightX(surfaceY)} y2={surfaceY} stroke={active ? PAL.lava : PAL.ink} strokeWidth={active ? 2.6 : 1.2} />}
      {beforeY !== null && (
        <line x1={leftX(beforeY) - 2} y1={beforeY} x2={rightX(beforeY) + 2} y2={beforeY} stroke={PAL.pencil} strokeWidth={1.3} strokeDasharray="6 5" />
      )}

      {/* the tallest fountain on record, to the same scale as the pit */}
      {cut.fountain && (
        <>
          {active ? (
            <g className="va-jet">
              {/* a jet that swells toward the top, with spray falling back on both sides */}
              <path
                d={
                  `M${f(ventX - 3.5)} ${f(ventY)} C${f(ventX - 4)} ${f(ventY - jetH * 0.45)} ${f(ventX - jetW)} ${f(ventY - jetH * 0.6)} ${f(ventX - jetW * 0.7)} ${f(ventY - jetH * 0.8)} ` +
                  `C${f(ventX - jetW * 0.45)} ${f(ventY - jetH * 0.93)} ${f(ventX - 1.5)} ${f(ventY - jetH * 0.97)} ${f(ventX)} ${f(jetTop)} ` +
                  `C${f(ventX + 1.5)} ${f(ventY - jetH * 0.97)} ${f(ventX + jetW * 0.45)} ${f(ventY - jetH * 0.93)} ${f(ventX + jetW * 0.7)} ${f(ventY - jetH * 0.8)} ` +
                  `C${f(ventX + jetW)} ${f(ventY - jetH * 0.6)} ${f(ventX + 4)} ${f(ventY - jetH * 0.45)} ${f(ventX + 3.5)} ${f(ventY)} Z`
                }
                fill={PAL.lava}
              />
              <g fill="none" stroke={PAL.lava} strokeWidth={1.6} strokeLinecap="round">
                {[1, -1].map((side) => (
                  <g key={side}>
                    <path d={`M${f(ventX + side * jetW * 0.5)} ${f(ventY - jetH * 0.9)} q${f(side * jetW * 1.5 * reach)} ${f(jetH * 0.04)} ${f(side * jetW * 1.9 * reach)} ${f(jetH * 0.42)}`} />
                    <path d={`M${f(ventX + side * jetW * 0.8)} ${f(ventY - jetH * 0.74)} q${f(side * jetW * 0.9 * reach)} ${f(jetH * 0.06)} ${f(side * jetW * 1.1 * reach)} ${f(jetH * 0.36)}`} />
                    <circle cx={ventX + side * (jetW * 0.5 + jetW * 2.05 * reach)} cy={ventY - jetH * 0.42} r={1.6} fill={PAL.lava} stroke="none" />
                    <circle cx={ventX + side * (jetW * 0.8 + jetW * 1.25 * reach)} cy={ventY - jetH * 0.32} r={1.3} fill={PAL.lava} stroke="none" />
                  </g>
                ))}
              </g>
            </g>
          ) : (
            <line x1={ventX} y1={ventY} x2={ventX} y2={jetTop} stroke={PAL.pencil} strokeWidth={1.3} strokeDasharray="6 5" />
          )}
          <path d={`M${f(fx)} ${f(jetTop)} V${f(ventY)} M${f(fx - 5)} ${f(jetTop)} h10 M${f(fx - 5)} ${f(ventY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
          <text x={fx + 9} y={(jetTop + ventY) / 2 - line + 2} fontSize={bold} fontWeight={700} fill={PAL.ink}>{ft(cut.fountain)}</text>
          <text x={fx + 9} y={(jetTop + ventY) / 2 + 3} fontSize={compact ? fs - 0.5 : fs} fill={PAL.ink}>{words(cut.fountain)}</text>
          {cut.fountain.when && <text x={fx + 9} y={(jetTop + ventY) / 2 + 3 + line} fontSize={fs - 1} fill={PAL.mute}>{cut.fountain.when}</text>}
        </>
      )}

      {/* rim and caldera floor */}
      <line x1={xRim} y1={rimY - 3} x2={xRim} y2={rimY - (compact ? 16 : 22)} stroke={PAL.ink} strokeWidth={0.8} />
      <text x={compact ? 6 : 10} y={rimY - (compact ? 22 : 28) - line} fontSize={bold} fontWeight={700} fill={PAL.ink}>{ft(cut.rim)}</text>
      <text x={compact ? 6 : 10} y={rimY - (compact ? 22 : 28)} fontSize={fs} fill={PAL.ink}>{words(cut.rim)}</text>
      {!compact && (
        <>
          <text x={(xFloor0 + xFloor1) / 2} y={floorY - 9 - line} textAnchor="middle" fontSize={fs - 1} fontWeight={700} fill={PAL.ink}>{fmt(cut.floor.ft)} ft</text>
          <text x={(xFloor0 + xFloor1) / 2} y={floorY - 9} textAnchor="middle" fontSize={fs - 1} fill={PAL.ink}>{cut.floor.label}</text>
        </>
      )}

      {/* the pit's levels, written on the rock beside it */}
      {placed.map((l, i) => (
        <g key={i}>
          <path d={`M${f(l.from[0] + 2)} ${f(l.from[1])} H${f(lx - 4)} ${Math.abs(l.ty - bold - l.from[1]) > 6 ? `L${f(lx + 2)} ${f(l.ty - bold * 0.35)}` : ''}`} fill="none" stroke={PAL.ink} strokeWidth={0.8} />
          <text x={lx + 6} y={l.ty} fontSize={bold - 1} fontWeight={700} fill={PAL.ink}>{ft(l.level)}</text>
          <text x={lx + 6} y={l.ty + line - 1} fontSize={fs - 0.5} fill={PAL.ink}>{words(l.level)}</text>
        </g>
      ))}
      {cut.before && beforeY !== null && !compact && (
        <>
          <path d={`M${f(leftX(beforeY) - 4)} ${f(beforeY)} L${f(xFloor0 + 62)} ${f(beforeY + 24)}`} fill="none" stroke={PAL.ink} strokeWidth={0.8} />
          <text x={10} y={beforeY + 30} fontSize={fs - 0.5} fontWeight={700} fill={PAL.ink}>{ft(cut.before)}</text>
          <text x={10} y={beforeY + 30 + line - 1} fontSize={fs - 1} fill={PAL.ink}>{cut.before.label}</text>
        </>
      )}
      {!compact && sec.note && (() => {
        // the pencil note, on two lines so it stays clear of the pit
        const words = fill(sec.note, data.ctx).split(' ');
        // break before the number, so a figure stays with its unit; otherwise in the middle
        const digit = words.findIndex((word) => /\d/.test(word));
        const half = digit > 0 ? digit : Math.ceil(words.length / 2);
        const lines = [words.slice(0, half).join(' '), words.slice(half).join(' ')];
        return (
          <>
            <path
              d={`M${f(xPit0 - 84)} ${f(pitY - 20)} C${f(xPit0 - 62)} ${f(pitY - 4)} ${f(xPit0 - 32)} ${f(pitY)} ${f(xPit0 - 5)} ${f(pitY - 3)}`}
              fill="none"
              stroke={PAL.pencil}
              strokeWidth={1.4}
              strokeLinecap="round"
            />
            <text className="va-hand" x={10} y={pitY - 54} fontSize={23} fill={PAL.pencil}>{lines[0]}</text>
            <text className="va-hand" x={10} y={pitY - 30} fontSize={23} fill={PAL.pencil}>{lines[1]}</text>
          </>
        );
      })()}
    </svg>
  );
}

/**
 * A caldera flooded by the sea, cut across from one wall to the other: the old volcano's ring of cliffs, the water
 * inside and the young island in the middle. Four heights are to one scale: the volcano's highest point on the rim,
 * the top of the cliffs, the island and the deepest water. Widths and shapes are schematic. Only the water moves:
 * the drawing has no vent, so it is for a volcano that the Smithsonian does not list as erupting. With `lagoon.edge`
 * the young cone stands on the hollow's far edge and has a vent: see LagoonEdgeDrawing.
 */
function LagoonDrawing({ data, compact }: { data: RecordData; compact: boolean }) {
  const { profile, stats } = data;
  const sec = profile.section;
  const lag = sec.lagoon;
  if (!lag) throw new Error(`record profile ${profile.slug}: a lagoon drawing needs section.lagoon`);
  if (lag.edge) return <LagoonEdgeDrawing data={data} compact={compact} />;
  if (stats.current) throw new Error(`record profile ${profile.slug}: the lagoon drawing has no vent to show an eruption in progress`);
  const summit = data.summit?.m ?? lag.wall.m;
  const summitFt = data.summit?.ft ?? roundTo(feet(lag.wall.m), 10);
  const ft = (lv: LagoonLevel) => fmt(lv.ft ?? roundTo(feet(lv.m), 10));
  // a lake above the sea (Crater Lake): heights from its surface, the land outside at the height around the volcano
  const lake = lag.lake;
  const base = lake ? lake.m : 0;
  const outside = lake && data.ground ? data.ground.m - base : null;
  const w = compact ? 340 : 560;
  const sx = w / 560;
  const fs = compact ? 12.5 : 14;
  const bold = fs + (compact ? 1.5 : 2);
  const line = fs + 3;
  const top = compact ? 52 : 70;
  const high = Math.max(summit - base, lag.wall.m);
  const low = Math.max(lag.depth.m, outside !== null ? -outside : 0);
  const k = (compact ? 250 : 300) / (high + low);
  const seaY = top + high * k;
  const Y = (m: number) => seaY - m * k;
  const floorY = Y(-lag.depth.m);
  const h = Math.round(Y(-low) + (compact ? 26 : 32));
  const rimY = Y(high);
  const wallY = Y(lag.wall.m);
  const islandY = Y(lag.island.m);
  // schematic plan, left to right: outer slope, high point, cliff, the wide basin, the island's shield, the narrow
  // basin, the far cliff, outer slope
  const xHigh = 56 * sx;
  const xEdge = 104 * sx;
  const xShore = 118 * sx;
  const xFloor0 = 150 * sx;
  const xK0 = 226 * sx;
  const xT0 = 340 * sx;
  const xT1 = 374 * sx;
  const xK1 = 458 * sx;
  const xFloor1 = 478 * sx;
  const xShoreR = 500 * sx;
  const xEdgeR = 514 * sx;
  const ground =
    `M0 ${f(Y(outside ?? lag.wall.m * 0.5))} L${f(xHigh)} ${f(rimY)} L${f(xEdge)} ${f(wallY)} L${f(xShore)} ${f(seaY)} L${f(xFloor0)} ${f(floorY)} ` +
    `L${f(xFloor1)} ${f(floorY)} L${f(xShoreR)} ${f(seaY)} L${f(xEdgeR)} ${f(wallY)} L${w} ${f(Y(outside ?? lag.wall.m * 0.78))}`;
  // the young lava shield: gentle at its foot on the caldera floor, steeper under the island
  const hk = floorY - islandY;
  const left: Curve = [
    [xK0, floorY],
    [xK0 + (xT0 - xK0) * 0.5, floorY - hk * 0.1],
    [xT0 - (xT0 - xK0) * 0.3, islandY + hk * 0.22],
    [xT0, islandY],
  ];
  const right: Curve = [
    [xT1, islandY],
    [xT1 + (xK1 - xT1) * 0.3, islandY + hk * 0.22],
    [xK1 - (xK1 - xT1) * 0.5, floorY - hk * 0.1],
    [xK1, floorY],
  ];
  const shield = `M${f(left[0][0])} ${f(left[0][1])} ${cubic(left)} L${f(right[0][0])} ${f(right[0][1])} ${cubic(right)}`;
  const xc = (xT0 + xT1) / 2;
  // the depth bracket stands in the wide basin, its label beside it
  const xb = xFloor0 + (compact ? 9 : 16);
  const midY = (seaY + floorY) / 2;
  const label = lake
    ? `Section drawing of ${profile.name}: cliffs up to ${fmt(lag.wall.m)} m high ring a caldera holding a lake, ${fmt(lag.depth.m)} m deep at its deepest. ` +
      `${lag.island.label} rises ${fmt(lag.island.m)} m above the water. The volcano's highest point is ${fmt(summit)} m above sea level, and the lake's surface about ${fmt(lake.m)} m.`
    : `Section drawing of ${profile.name}: cliffs about ${fmt(lag.wall.m)} m high ring a caldera flooded by the sea, ${fmt(lag.depth.m)} m deep at its deepest. ` +
      `${lag.island.label} rises ${fmt(lag.island.m)} m above the water in the middle. The volcano's highest point is ${fmt(summit)} m above sea level.`;
  // the lake fills only the caldera
  const waterD = `M${f(xShore)} ${f(seaY)} L${f(xFloor0)} ${f(floorY)} L${f(xFloor1)} ${f(floorY)} L${f(xShoreR)} ${f(seaY)} Z`;
  const clipId = `va-lake-${profile.slug}-${compact ? 's' : 'w'}`;

  return (
    <svg className={`va-sec ${compact ? 'va-sec-small' : 'va-sec-wide'}`} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={label}>
      <rect x={0} y={0} width={w} height={h} fill={PAL.paper} />
      {lake ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <path d={waterD} />
            </clipPath>
          </defs>
          <path d={waterD} fill={PAL.sea} />
          <g clipPath={`url(#${clipId})`}>
            <path className="va-wave" d={wavePath(seaY + 6, 18, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.9} opacity={0.5} />
            <path className="va-wave va-wave2" d={wavePath(seaY + 13, 26, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.8} opacity={0.3} />
          </g>
          <line x1={xShore} y1={seaY} x2={xShoreR} y2={seaY} stroke={PAL.ink} strokeWidth={1.3} />
        </>
      ) : (
        <>
          <rect x={0} y={seaY} width={w} height={h - seaY} fill={PAL.sea} />
          <path className="va-wave" d={wavePath(seaY + 6, 18, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.9} opacity={0.5} />
          <path className="va-wave va-wave2" d={wavePath(seaY + 13, 26, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.8} opacity={0.3} />
          <line x1={0} y1={seaY} x2={w} y2={seaY} stroke={PAL.ink} strokeWidth={1.3} />
        </>
      )}
      {/* the old volcano under and around the water, then the young shield that has grown on the caldera floor */}
      <path d={`${ground} V${h} H0 Z`} fill={PAL.crust} />
      <path d={`${shield} Z`} fill={PAL.rock} />
      <path d={ground} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      <path d={shield} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />

      {/* the volcano's highest point, on the rim */}
      <line x1={xHigh} y1={rimY - 3} x2={xHigh} y2={rimY - 9} stroke={PAL.ink} strokeWidth={0.8} />
      <text x={compact ? 6 : 10} y={rimY - 13 - line * (compact ? 1 : 2)} fontSize={bold} fontWeight={700} fill={PAL.ink}>{fmt(summitFt)} ft</text>
      <text x={compact ? 6 : 10} y={rimY - 12 - (compact ? 0 : line)} fontSize={fs} fill={PAL.ink}>({fmt(summit)} m)</text>
      {!compact && <text x={10} y={rimY - 11} fontSize={fs} fill={PAL.ink}>above sea level</text>}

      {/* the island */}
      <text x={xc} y={islandY - 10 - line} textAnchor="middle" fontSize={bold} fontWeight={700} fill={PAL.ink}>{compact ? (lag.island.short ?? lag.island.label) : lag.island.label}</text>
      <text x={xc} y={islandY - 9} textAnchor="middle" fontSize={fs} fill={PAL.ink}>{compact ? `${ft(lag.island)} ft` : `${ft(lag.island)} ft (${fmt(lag.island.m)} m)`}</text>

      {/* the deepest water */}
      <path d={`M${f(xb)} ${f(seaY)} V${f(floorY)} M${f(xb - 5)} ${f(floorY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={xb + 9} y={midY - line + 4} fontSize={bold} fontWeight={700} fill={PAL.ink}>{ft(lag.depth)} ft</text>
      <text x={xb + 9} y={midY + 5} fontSize={fs} fill={PAL.ink}>({fmt(lag.depth.m)} m)</text>
      <text x={xb + 9} y={midY + 5 + line} fontSize={fs - 0.5} fill={PAL.ink}>{compact ? (lag.depth.short ?? lag.depth.label) : lag.depth.label}</text>

      {!compact && (
        <>
          {/* the cliffs, named above the far wall */}
          <line x1={xEdgeR} y1={wallY - 3} x2={xEdgeR} y2={wallY - 9} stroke={PAL.ink} strokeWidth={0.8} />
          <text x={w - 8} y={wallY - 13 - line} textAnchor="end" fontSize={bold - 1} fontWeight={700} fill={PAL.ink}>{ft(lag.wall)} ft ({fmt(lag.wall.m)} m)</text>
          <text x={w - 8} y={wallY - 12} textAnchor="end" fontSize={fs - 0.5} fill={PAL.ink}>{lag.wall.label}</text>
          <text className="va-it" x={xShore + 16} y={seaY - 7} fontSize={fs} fill={PAL.ink}>{lake ? lake.label : 'sea level'}</text>
        </>
      )}
      {!compact && sec.note && (() => {
        // the pencil note stands in the sky over the wide basin, under the island's name; its arrow ends on the
        // island's shoulder, clear of the name
        const words = fill(sec.note, data.ctx);
        const from = Math.min(xT0 - 34, xShore + 14 + words.length * 8.6 + 10);
        return (
          <>
            <path
              d={`M${f(from)} ${f(islandY + 8)} C${f(from + 14)} ${f(islandY + 6)} ${f(xT0 - 26)} ${f(islandY + 14)} ${f(xT0 - 15)} ${f(islandY + 32)}`}
              fill="none"
              stroke={PAL.pencil}
              strokeWidth={1.4}
              strokeLinecap="round"
            />
            <text className="va-hand" x={xShore + 14} y={islandY + 13} fontSize={23} fill={PAL.pencil}>{words}</text>
          </>
        );
      })()}
    </svg>
  );
}

/**
 * A cone whose top lies under the sea (East Epi's Epi B), cut across: the water from its surface down to the sea floor
 * and the cone standing on the floor, with its crater. Depths are to one scale: the top, the crater floor and the foot
 * of the cone. Widths are squeezed so the cone fits, which makes it look steeper than it is; the drawing prints the
 * true width at the foot and the caption says so. The far rim is drawn a little lower than the near one, where the
 * source puts the highest point (schematic). Only the water moves: there is no vent, so the build stops while the
 * Smithsonian lists the volcano as erupting.
 */
function SeamountDrawing({ data, compact }: { data: RecordData; compact: boolean }) {
  const { profile, stats } = data;
  const sec = profile.section;
  const sm = sec.seamount;
  if (!sm) throw new Error(`record profile ${profile.slug}: a seamount drawing needs section.seamount`);
  if (stats.current) throw new Error(`record profile ${profile.slug}: the seamount drawing has no vent to show an eruption in progress`);
  if (!data.summit || data.summit.m >= 0) throw new Error(`record profile ${profile.slug}: the seamount drawing needs a top below sea level`);
  const ft = (lv: LagoonLevel) => fmt(lv.ft ?? roundTo(feet(lv.m), 10));
  const topM = -data.summit.m;
  const topFt = -data.summit.ft;
  const footM = topM + sm.height.m;
  const w = compact ? 340 : 560;
  const fs = compact ? 12.5 : 14;
  const bold = fs + (compact ? 1.5 : 2);
  const line = fs + 3;
  // paper above the surface carries the top's depth and the pencil note; one scale for every depth below it
  const seaY = compact ? 50 : 62;
  const k = (compact ? 205 : 262) / footM;
  const Y = (m: number) => seaY + m * k;
  const topY = Y(topM);
  const floorY = Y(footM);
  const h = Math.round(floorY + (compact ? 40 : 46));
  const cx = w * (compact ? 0.47 : 0.5);
  const W = w * 0.33;
  // the crater, squeezed by as much as the foot
  const cw = sm.crater_width ? Math.max(8, (sm.crater_width.m / (sm.foot.km * 1000)) * 2 * W) : 0;
  const craterY = sm.crater ? Y(sm.crater.m) : topY;
  const rimL = cx - cw / 2;
  const rimR = cx + cw / 2;
  const lip = compact ? 4 : 6;
  const rimRY = topY + (cw ? 3 : 0);
  const H = floorY - topY;
  // flanks: gentle at the foot on the sea floor, steeper under the rim
  const left: Curve = [
    [cx - W, floorY],
    [cx - W * 0.6, floorY - H * 0.07],
    [rimL - lip - (W - cw / 2) * 0.28, topY + H * 0.3],
    [rimL - lip, topY],
  ];
  const right: Curve = [
    [rimR + lip, rimRY],
    [rimR + lip + (W - cw / 2) * 0.28, rimRY + H * 0.3],
    [cx + W * 0.6, floorY - H * 0.07],
    [cx + W, floorY],
  ];
  const crater = cw ? `L${f(rimL)} ${f(topY)} L${f(rimL + cw * 0.18)} ${f(craterY)} L${f(rimR - cw * 0.18)} ${f(craterY)} L${f(rimR)} ${f(rimRY)} ` : '';
  const outline = `M${f(left[0][0])} ${f(left[0][1])} ${cubic(left)} ${crater}L${f(right[0][0])} ${f(right[0][1])} ${cubic(right)} Z`;
  // the same cone without its crater, for the layer lines inside
  const body = `M${f(left[0][0])} ${f(left[0][1])} ${cubic(left)} L${f(right[0][0])} ${f(right[0][1])} ${cubic(right)} Z`;
  const xa = compact ? 14 : 20;
  const xr = w - (compact ? 14 : 20);
  const midH = topY + H * 0.38;
  const about = (on?: boolean) => (on ? 'about ' : '');
  const label =
    `Section drawing of ${profile.name}: the cone ${sm.name} rises ${about(sm.height.about)}${fmt(sm.height.m)} m from the sea floor to a top ${fmt(topM)} m below the sea surface, ` +
    `and is ${about(sm.foot.about)}${sm.foot.km} km across at its foot${sm.crater ? `; its crater floor lies ${fmt(sm.crater.m)} m below the surface` : ''}. Depths are to scale; widths are squeezed.`;

  return (
    <svg className={`va-sec ${compact ? 'va-sec-small' : 'va-sec-wide'}`} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={label}>
      <rect x={0} y={0} width={w} height={h} fill={PAL.paper} />
      <rect x={0} y={seaY} width={w} height={floorY - seaY} fill={PAL.sea} />
      {[0.35, 0.6, 0.85].map((share) => (
        <line key={share} x1={0} y1={f(seaY + (floorY - seaY) * share)} x2={w} y2={f(seaY + (floorY - seaY) * share)} stroke={PAL.seaInk} strokeWidth={0.5} opacity={0.25} />
      ))}
      <rect x={0} y={floorY} width={w} height={h - floorY} fill={PAL.crust} />
      <path d={outline} fill={PAL.rock} />
      {[0.78, 0.56].map((sc) => (
        <path key={sc} d={body} fill="none" stroke={PAL.paper} strokeWidth={1} opacity={0.35} transform={`translate(${f(cx * (1 - sc))} ${f(floorY * (1 - sc))}) scale(${sc})`} />
      ))}
      <path d={outline} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      <line x1={0} y1={floorY} x2={w} y2={floorY} stroke={PAL.ink} strokeWidth={1.2} />
      <path className="va-wave" d={wavePath(seaY + 6, 18, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.9} opacity={0.5} />
      <path className="va-wave va-wave2" d={wavePath(seaY + 13, 26, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.8} opacity={0.3} />
      <line x1={0} y1={seaY} x2={w} y2={seaY} stroke={PAL.ink} strokeWidth={1.3} />
      <text className="va-it" x={w - 8} y={seaY - 7} textAnchor="end" fontSize={fs} fill={PAL.ink}>sea level</text>

      {/* the water above the top: the bracket in the sea, its words on the paper above */}
      <line x1={xa + 6} y1={topY} x2={rimL - lip - 4} y2={topY} stroke={PAL.ink} strokeWidth={0.8} strokeDasharray="3 3" />
      <path d={`M${f(xa)} ${f(seaY)} V${f(topY)} M${f(xa - 5)} ${f(seaY)} h10 M${f(xa - 5)} ${f(topY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={xa - 6} y={seaY - 10 - line} fontSize={bold} fontWeight={700} fill={PAL.ink}>{fmt(topFt)} ft ({fmt(topM)} m)</text>
      <text x={xa - 6} y={seaY - 9} fontSize={fs} fill={PAL.ink}>of water above the top</text>

      {/* the cone's height from its foot */}
      <line x1={rimR + lip + 6} y1={topY} x2={xr + 6} y2={topY} stroke={PAL.ink} strokeWidth={0.8} strokeDasharray="3 3" />
      <path d={`M${f(xr)} ${f(topY)} V${f(floorY)} M${f(xr - 5)} ${f(topY)} h10 M${f(xr - 5)} ${f(floorY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={xr - 9} y={midH - 4} textAnchor="end" fontSize={bold} fontWeight={700} fill={PAL.ink}>{about(sm.height.about)}{ft(sm.height)} ft</text>
      <text x={xr - 9} y={midH - 4 + line} textAnchor="end" fontSize={fs} fill={PAL.ink}>({fmt(sm.height.m)} m) {compact ? (sm.height.short ?? sm.height.label) : sm.height.label}</text>

      <text x={cx} y={f(topY + H * 0.64)} textAnchor="middle" fontSize={bold} fontWeight={700} fill={PAL.ink}>{sm.name}</text>
      <text className="va-it" x={compact ? 8 : 10} y={floorY - 7} fontSize={fs - 1} fill={PAL.seaInk}>sea floor</text>

      {/* the width at the foot, measured along the sea floor */}
      <path d={`M${f(cx - W)} ${f(floorY + 12)} H${f(cx + W)} M${f(cx - W)} ${f(floorY + 7)} v10 M${f(cx + W)} ${f(floorY + 7)} v10`} stroke={PAL.ink} strokeWidth={0.9} fill="none" />
      <text x={cx} y={floorY + 30} textAnchor="middle" fontSize={fs - 0.5} fill={PAL.ink}>
        {about(sm.foot.about)}{sm.foot.mi} miles ({sm.foot.km} km) across{compact ? '' : ' at its foot'}
      </text>

      {!compact && sm.crater && (
        <>
          <line x1={rimL + cw * 0.3} y1={craterY - 2} x2={xa + 146} y2={craterY + 16} stroke={PAL.ink} strokeWidth={0.8} />
          <text x={xa - 6} y={craterY + 20} fontSize={fs} fontWeight={700} fill={PAL.ink}>{sm.crater.label}</text>
          <text x={xa - 6} y={craterY + 20 + line} fontSize={fs - 0.5} fill={PAL.ink}>{ft(sm.crater)} ft ({fmt(sm.crater.m)} m) down</text>
        </>
      )}
      {!compact && sec.note && (
        <>
          <path d={`M${f(cx + 40)} 30 C${f(cx + 16)} 32 ${f(cx + 6)} ${f(seaY + 4)} ${f(cx + 1)} ${f(craterY - 8)}`} fill="none" stroke={PAL.pencil} strokeWidth={1.4} strokeLinecap="round" />
          <text className="va-hand" x={cx + 46} y={36} fontSize={23} fill={PAL.pencil}>{fill(sec.note, data.ctx)}</text>
        </>
      )}
    </svg>
  );
}

/**
 * A dry crater or caldera on land with lava domes on its floor (Pululahua), cut across: the volcano's highest point
 * beside the rim, the wall down to the flat floor, and a dome standing on the floor. Four figures are to one scale: the
 * summit and the floor above sea level, the depth of the hollow below its rim and the height of the domes above the
 * floor. Widths and shapes are schematic. There is no vent: the build stops if the volcano is listed as erupting.
 */
function BasinDrawing({ data, compact }: { data: RecordData; compact: boolean }) {
  const { profile, stats } = data;
  const sec = profile.section;
  const bas = sec.basin;
  if (!bas) throw new Error(`record profile ${profile.slug}: a basin drawing needs section.basin`);
  if (!data.summit) throw new Error(`record profile ${profile.slug}: a basin drawing needs the summit height`);
  if (stats.current) throw new Error(`record profile ${profile.slug}: the basin drawing has no vent to show an eruption in progress`);
  const summit = data.summit.m;
  const rise = summit - bas.floor.m;
  if (rise <= bas.depth.m) throw new Error(`record profile ${profile.slug}: the summit must stand above the rim of the basin`);
  const ft = (m: number) => fmt(roundTo(feet(m), 10));
  const w = compact ? 340 : 560;
  const sx = w / 560;
  const fs = compact ? 12.5 : 14;
  const bold = fs + (compact ? 1.5 : 2);
  const line = fs + 3;
  const top = compact ? 56 : 74;
  const k = (compact ? 210 : 250) / rise;
  const floorY = top + rise * k;
  const Y = (above: number) => floorY - above * k;
  const h = Math.round(floorY + (compact ? 58 : 66));
  const peakY = Y(rise);
  const rimY = Y(bas.depth.m);
  const domeY = Y(bas.dome.m);
  // schematic plan, left to right: outer slope, the highest point, the rim, the wall, the floor, a dome, the floor,
  // the far wall, the far rim, outer slope
  const xPeak = 60 * sx;
  const xRim = 112 * sx;
  const xFloor0 = 138 * sx;
  const xD0 = (compact ? 236 : 250) * sx;
  const xT0 = (compact ? 300 : 316) * sx;
  const xT1 = (compact ? 322 : 338) * sx;
  const xD1 = (compact ? 392 : 404) * sx;
  const xFloor1 = 476 * sx;
  const xRimR = 502 * sx;
  const under = floorY + (compact ? 30 : 36);
  const ground =
    `M0 ${f(Y(rise * 0.42))} L${f(xPeak - 14 * sx)} ${f(peakY + 5)} L${f(xPeak)} ${f(peakY)} L${f(xPeak + 12 * sx)} ${f(peakY + 6)} L${f(xRim)} ${f(rimY)} ` +
    `L${f(xFloor0)} ${f(floorY)} L${f(xFloor1)} ${f(floorY)} L${f(xRimR)} ${f(rimY)} L${w} ${f(Y(bas.depth.m * 0.35))}`;
  // the dome: steep sides and a rounded top, standing on the floor
  const hk = floorY - domeY;
  const left: Curve = [
    [xD0, floorY],
    [xD0 + (xT0 - xD0) * 0.35, floorY - hk * 0.05],
    [xT0 - (xT0 - xD0) * 0.42, domeY + hk * 0.08],
    [xT0, domeY],
  ];
  const right: Curve = [
    [xT1, domeY],
    [xT1 + (xD1 - xT1) * 0.42, domeY + hk * 0.08],
    [xD1 - (xD1 - xT1) * 0.35, floorY - hk * 0.05],
    [xD1, floorY],
  ];
  const dome = `M${f(left[0][0])} ${f(left[0][1])} ${cubic(left)} L${f(right[0][0])} ${f(right[0][1])} ${cubic(right)}`;
  const xc = (xT0 + xT1) / 2;
  // the depth bracket stands on the floor beside the near wall
  const xb = xFloor0 + (compact ? 12 : 20);
  const midY = (rimY + floorY) / 2;
  const label =
    `Section drawing of ${profile.name}: a crater about ${fmt(bas.depth.m)} m deep, its floor about ${fmt(bas.floor.m)} m above sea level, ` +
    `with lava domes that rise up to ${fmt(bas.dome.m)} m above the floor. The volcano's highest point is ${fmt(summit)} m above sea level.`;

  return (
    <svg className={`va-sec ${compact ? 'va-sec-small' : 'va-sec-wide'}`} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={label}>
      <rect x={0} y={0} width={w} height={h} fill={PAL.paper} />
      {/* the older volcano with the hollow in it, then the dome that grew on the floor */}
      <path d={`${ground} V${h} H0 Z`} fill={PAL.crust} />
      <path d={`${dome} Z`} fill={PAL.rock} />
      <path d={ground} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      <path d={dome} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      <line x1={xRim - 2} y1={rimY} x2={xRimR + 2} y2={rimY} stroke={PAL.ink} strokeWidth={0.8} strokeDasharray="2 5" opacity={0.55} />

      {/* the volcano's highest point */}
      <line x1={xPeak} y1={peakY - 3} x2={xPeak} y2={peakY - 9} stroke={PAL.ink} strokeWidth={0.8} />
      <text x={compact ? 6 : 10} y={peakY - 13 - line * (compact ? 1 : 2)} fontSize={bold} fontWeight={700} fill={PAL.ink}>{fmt(data.summit.ft)} ft</text>
      <text x={compact ? 6 : 10} y={peakY - 12 - (compact ? 0 : line)} fontSize={fs} fill={PAL.ink}>({fmt(summit)} m)</text>
      {!compact && <text x={10} y={peakY - 11} fontSize={fs} fill={PAL.ink}>above sea level</text>}

      {/* the dome */}
      <text x={xc} y={domeY - 10 - line} textAnchor="middle" fontSize={bold} fontWeight={700} fill={PAL.ink}>{compact ? (bas.dome.short ?? bas.dome.label) : bas.dome.label}</text>
      <text x={xc} y={domeY - 9} textAnchor="middle" fontSize={fs} fill={PAL.ink}>{compact ? `up to ${ft(bas.dome.m)} ft` : `up to ${ft(bas.dome.m)} ft (${fmt(bas.dome.m)} m) above the floor`}</text>

      {/* how deep the hollow is */}
      <path d={`M${f(xb - 5)} ${f(rimY)} h10 M${f(xb)} ${f(rimY)} V${f(floorY)} M${f(xb - 5)} ${f(floorY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={xb + 9} y={midY - 2} fontSize={bold} fontWeight={700} fill={PAL.ink}>{ft(bas.depth.m)} ft</text>
      <text x={xb + 9} y={midY - 1 + line} fontSize={fs} fill={PAL.ink}>{compact ? (bas.depth.short ?? bas.depth.label) : `(${fmt(bas.depth.m)} m) ${bas.depth.label}`}</text>

      {/* the floor's height above sea level, written in the rock under it */}
      <text x={w / 2} y={under - (compact ? 6 : 8)} textAnchor="middle" fontSize={fs} fill={PAL.ink}>
        {compact ? `${bas.floor.short ?? bas.floor.label}: about ${ft(bas.floor.m)} ft` : `${bas.floor.label}: about ${ft(bas.floor.m)} ft (${fmt(bas.floor.m)} m) above sea level`}
      </text>
      {!compact && sec.note && (() => {
        // the pencil note stands in the sky over the far side of the hollow, clear of the dome's name; its arrow comes
        // down to the floor between the dome and the far wall
        const words = fill(sec.note, data.ctx);
        const ty = domeY - 24 - line * 2;
        const ax = (xD1 + xFloor1) / 2 + 16;
        return (
          <>
            <path d={`M${f(w - 70)} ${f(ty + 8)} C${f(w - 72)} ${f(floorY - 90)} ${f(ax + 8)} ${f(floorY - 50)} ${f(ax)} ${f(floorY - 9)}`} fill="none" stroke={PAL.pencil} strokeWidth={1.4} strokeLinecap="round" />
            <text className="va-hand" x={w - 12} y={ty} textAnchor="end" fontSize={23} fill={PAL.pencil}>{words}</text>
          </>
        );
      })()}
    </svg>
  );
}

/**
 * A flooded caldera whose young cone stands on the far edge of the hollow instead of in its middle (Krakatau): the
 * tall remnant of the old island on one side, the hollow the collapse left in the sea bed, and the young cone built
 * on the hollow's far wall. Three levels are to one scale: the remnant's top, the cone's top (the height the page
 * prints for the volcano) and the deepest point of the hollow. Widths, slopes and the sea floor beyond the cone are
 * schematic. The cone has a vent: lava bursts from it only while the Smithsonian lists the eruption as continuing.
 * An earlier, higher top of the cone is a dashed red outline, to the same scale.
 */
function LagoonEdgeDrawing({ data, compact }: { data: RecordData; compact: boolean }) {
  const { profile, stats } = data;
  const sec = profile.section;
  const lag = sec.lagoon;
  if (!lag) throw new Error(`record profile ${profile.slug}: a lagoon drawing needs section.lagoon`);
  if (data.summit && data.summit.m !== lag.island.m) {
    throw new Error(`record profile ${profile.slug}: with lagoon.edge the young cone is the volcano's summit, so lagoon.island.m must be ${data.summit.m}`);
  }
  const former = sec.former;
  if (former && former.m <= lag.island.m) throw new Error(`record profile ${profile.slug}: section.former must be higher than the cone`);
  const active = Boolean(stats.current);
  const ft = (m: number) => fmt(roundTo(feet(m), 10));
  const islandFt = data.summit ? fmt(data.summit.ft) : ft(lag.island.m);
  const w = compact ? 340 : 560;
  const sx = w / 560;
  const fs = compact ? 12.5 : 14;
  const bold = fs + (compact ? 1.5 : 2);
  const line = fs + 3;
  const top = compact ? 52 : 62;
  const k = (compact ? 250 : 300) / (lag.wall.m + lag.depth.m);
  const seaY = top + lag.wall.m * k;
  const Y = (m: number) => seaY - m * k;
  const floorY = Y(-lag.depth.m);
  const h = Math.round(floorY + (compact ? 26 : 32));
  const peakY = Y(lag.wall.m);
  const islandY = Y(lag.island.m);
  // the sea floor beyond the cone is drawn shallow; no source gives its depth, so it carries no figure
  const shelfY = seaY + (floorY - seaY) * 0.3;
  // schematic plan, left to right: outer slope of the remnant, its top, the cliff, the hollow, the hollow's far
  // wall with the young cone on it, the shallow sea beyond
  const xPeak = 78 * sx;
  const xShore = 112 * sx;
  const xFloor0 = 144 * sx;
  const xK0 = 322 * sx;
  const xWall0 = 372 * sx;
  const xWall1 = 396 * sx;
  const xT0 = 429 * sx;
  const xT1 = 447 * sx;
  const xK1 = 524 * sx;
  const cx = (xT0 + xT1) / 2;
  const ventY = islandY + (compact ? 5 : 6);
  const ground =
    `M0 ${f(Y(lag.wall.m * 0.55))} L${f(xPeak)} ${f(peakY)} L${f(xShore)} ${f(seaY)} L${f(xFloor0)} ${f(floorY)} ` +
    `L${f(xWall0)} ${f(floorY)} L${f(xWall1)} ${f(shelfY)} L${w} ${f(shelfY)}`;
  // the young cone: a long apron down into the hollow, a shorter flank on the shallow side
  const hk = floorY - islandY;
  const left: Curve = [
    [xK0, floorY],
    [xK0 + (xT0 - xK0) * 0.45, floorY - hk * 0.12],
    [xT0 - (xT0 - xK0) * 0.28, islandY + hk * 0.2],
    [xT0, islandY],
  ];
  const hr = shelfY - islandY;
  const right: Curve = [
    [xT1, islandY],
    [xT1 + (xK1 - xT1) * 0.3, islandY + hr * 0.3],
    [xK1 - (xK1 - xT1) * 0.4, shelfY - hr * 0.08],
    [xK1, shelfY],
  ];
  const coneTop = `M${f(left[0][0])} ${f(left[0][1])} ${cubic(left)} L${f(cx)} ${f(ventY)} L${f(right[0][0])} ${f(right[0][1])} ${cubic(right)}`;
  const cone = `${coneTop} L${f(xWall1)} ${f(shelfY)} L${f(xWall0)} ${f(floorY)} Z`;
  // an earlier, higher top: the flanks carried on up from half the cone's height above the water
  const formerY = former ? Y(former.m) : null;
  const shoulderY = islandY + (seaY - islandY) * 0.5;
  const formerPath =
    former && formerY !== null
      ? `M${f(curveX(left, shoulderY))} ${f(shoulderY)} L${f(cx - 5)} ${f(formerY)} L${f(cx + 5)} ${f(formerY)} L${f(curveX(right, shoulderY))} ${f(shoulderY)}`
      : null;
  // the depth bracket stands in the hollow, its label beside it
  const xb = xFloor0 + (compact ? 9 : 16);
  const midY = (seaY + floorY) / 2;
  // the cone's name stands in the sky beside the vent, clear of the lava burst and of the dashed outline
  const xName = cx - (compact ? 40 : 44);
  const label =
    `Section drawing of ${profile.name}: ${lag.wall.label} rises ${fmt(lag.wall.m)} m above the sea beside a hollow in the sea bed ${fmt(lag.depth.m)} m deep. ` +
    `${lag.island.label}, ${fmt(lag.island.m)} m high, stands on the far edge of the hollow.` +
    (former ? ` A dashed outline shows ${former.label} at ${fmt(former.m)} m.` : '');

  return (
    <svg className={`va-sec ${compact ? 'va-sec-small' : 'va-sec-wide'}`} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={label}>
      <rect x={0} y={0} width={w} height={h} fill={PAL.paper} />
      <rect x={0} y={seaY} width={w} height={h - seaY} fill={PAL.sea} />
      <path className="va-wave" d={wavePath(seaY + 6, 18, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.9} opacity={0.5} />
      <path className="va-wave va-wave2" d={wavePath(seaY + 13, 26, w)} fill="none" stroke={PAL.seaInk} strokeWidth={0.8} opacity={0.3} />
      <line x1={0} y1={seaY} x2={w} y2={seaY} stroke={PAL.ink} strokeWidth={1.3} />
      {/* the old volcano under and around the water, then the young cone on the hollow's far wall */}
      <path d={`${ground} V${h} H0 Z`} fill={PAL.crust} />
      <path d={cone} fill={PAL.rock} />
      {active && (
        <path
          d={`M${f(cx + 5)} ${h} C${f(cx + 7)} ${f(floorY)} ${f(cx - 4)} ${f(seaY)} ${f(cx)} ${f(ventY + 2)}`}
          fill="none"
          stroke={PAL.lava}
          strokeWidth={compact ? 5 : 6}
          strokeLinecap="round"
        />
      )}
      <path d={ground} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      <path d={coneTop} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      {active && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} className={`va-bub va-bub${i}`} cx={cx} cy={ventY + 8} r={3.4 + (i % 2) * 1.2} fill={PAL.paper} stroke={PAL.ink} strokeWidth={0.9} />
          ))}
          <g className="va-burst" fill="none" stroke={PAL.lava} strokeWidth={2.2} strokeLinecap="round">
            <path d={`M${f(cx)} ${f(ventY)} q-12 -30 -30 -16`} />
            <path d={`M${f(cx)} ${f(ventY)} q-4 -40 -14 -34`} />
            <path d={`M${f(cx)} ${f(ventY)} q4 -44 12 -34`} />
            <path d={`M${f(cx)} ${f(ventY)} q14 -30 26 -14`} />
          </g>
        </>
      )}
      {formerPath && <path className="va-former" d={formerPath} fill="none" stroke={PAL.pencil} strokeWidth={1.4} strokeDasharray="6 5" strokeLinejoin="round" />}

      {/* the remnant of the old island */}
      <text x={compact ? 6 : 8} y={peakY - 9 - line} fontSize={bold} fontWeight={700} fill={PAL.ink}>{compact ? (lag.wall.short ?? lag.wall.label) : lag.wall.label}</text>
      <text x={compact ? 6 : 8} y={peakY - 8} fontSize={fs} fill={PAL.ink}>{compact ? `${ft(lag.wall.m)} ft` : `${ft(lag.wall.m)} ft (${fmt(lag.wall.m)} m)`}</text>

      {/* the young cone, the height the page prints for the volcano */}
      <text x={xName} y={islandY - 9 - line} textAnchor="end" fontSize={bold} fontWeight={700} fill={PAL.ink}>{compact ? (lag.island.short ?? lag.island.label) : lag.island.label}</text>
      <text x={xName} y={islandY - 8} textAnchor="end" fontSize={fs} fill={PAL.ink}>{compact ? `${islandFt} ft` : `${islandFt} ft (${fmt(lag.island.m)} m)`}</text>

      {/* the hollow */}
      <path d={`M${f(xb)} ${f(seaY)} V${f(floorY)} M${f(xb - 5)} ${f(floorY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={xb + 9} y={midY - line + 4} fontSize={bold} fontWeight={700} fill={PAL.ink}>{ft(lag.depth.m)} ft</text>
      <text x={xb + 9} y={midY + 5} fontSize={fs} fill={PAL.ink}>({fmt(lag.depth.m)} m)</text>
      <text x={xb + 9} y={midY + 5 + line} fontSize={fs - 0.5} fill={PAL.ink}>{compact ? (lag.depth.short ?? lag.depth.label) : lag.depth.label}</text>

      {!compact && <text className="va-it" x={xShore + 16} y={seaY - 7} fontSize={fs} fill={PAL.ink}>sea level</text>}
      {!compact && sec.note && (() => {
        // the pencil note stands beside the dashed top when there is one, otherwise over the hollow; its arrow ends
        // on the dashed top or on the cone's shoulder
        const words = fill(sec.note, data.ctx);
        if (formerY !== null) {
          const ny = formerY - 5;
          return (
            <>
              <path
                d={`M${f(cx - 36)} ${f(ny - 9)} C${f(cx - 26)} ${f(ny - 16)} ${f(cx - 15)} ${f(ny - 12)} ${f(cx - 8)} ${f(formerY - 4)}`}
                fill="none"
                stroke={PAL.pencil}
                strokeWidth={1.4}
                strokeLinecap="round"
              />
              <text className="va-hand" x={cx - 42} y={ny} textAnchor="end" fontSize={23} fill={PAL.pencil}>{words}</text>
            </>
          );
        }
        const from = xShore + 16 + words.length * 8.6 + 10;
        return (
          <>
            <path
              d={`M${f(from)} ${f(islandY - 48)} C${f(from + 16)} ${f(islandY - 52)} ${f(xT0 - 40)} ${f(islandY - 20)} ${f(xT0 - 14)} ${f(islandY + 12)}`}
              fill="none"
              stroke={PAL.pencil}
              strokeWidth={1.4}
              strokeLinecap="round"
            />
            <text className="va-hand" x={xShore + 16} y={islandY - 44} fontSize={23} fill={PAL.pencil}>{words}</text>
          </>
        );
      })()}
    </svg>
  );
}

/** An island cone cut open. Heights are to scale (summit, crater terrace, sea level, base); the shape is schematic. */
function ConeDrawing({ data, compact }: { data: RecordData; compact: boolean }) {
  const { profile, stats } = data;
  const summit = data.summit?.m ?? 0;
  const summitFt = data.summit?.ft ?? 0;
  const base = profile.facts.base_m ?? 0;
  const terrace = profile.facts.terrace_m;
  const [t0, t1] = terrace ?? [summit, summit];
  const w = compact ? 340 : 560;
  const h = compact ? 420 : 520;
  const big = compact ? 0.93 : 1;
  const seaY = Math.round(h * 0.37);
  const baseY = h - 46;
  const k = (baseY - seaY) / base;
  const Y = (m: number) => seaY - m * k;
  const cx = w * 0.44;
  const W = w * 0.42;
  const topY = Y(summit);
  const terrY = Y((t0 + t1) / 2);
  const tx = cx - 30;
  const sx = cx + 8;
  const dep = baseY - seaY;
  // Left flank: sea floor up to the crater terrace. Right flank: summit down to the sea floor.
  const left: Curve = [
    [cx - W, baseY],
    [cx - W * 0.5, baseY - 8],
    [tx - 18 - W * 0.3, seaY + dep * 0.3],
    [tx - 18, terrY + 12],
  ];
  const right: Curve = [
    [sx, topY],
    [sx + W * 0.3, seaY + dep * 0.3],
    [cx + W * 0.5, baseY - 8],
    [cx + W, baseY],
  ];
  const outline = `M${f(left[0][0])} ${f(left[0][1])} ${cubic(left)} L${f(tx - 6)} ${f(terrY)} L${f(tx + 12)} ${f(terrY)} L${f(sx)} ${f(topY)} ${cubic(right)} Z`;
  const fs = 15 * big;
  const ventX = tx + 3;
  const dx1 = Math.max(cx + W * 0.4, curveX(right, seaY) + 14);
  const dx2 = w - 26;
  const ty = seaY + dep * (compact ? 0.2 : 0.3);
  const lx = 14;
  const labelEnd = Math.min(lx + (compact ? 104 : 208) * big + 5, tx - 3);
  const fy = (terrY + seaY) / 2 + 10;
  const terraceFt = `${fmt(roundTo(feet(t0), 100))}–${fmt(roundTo(feet(t1), 10))} ft`;
  // gas bubbles and bursts are drawn only while the Smithsonian lists the eruption as continuing
  const active = Boolean(stats.current);

  return (
    <svg
      className={`va-sec ${compact ? 'va-sec-small' : 'va-sec-wide'}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={`Section drawing of ${profile.name}: the summit is ${fmt(summit)} m above sea level${terrace ? `, the crater terrace at about ${t0} to ${t1} m,` : ''} and the base about ${fmt(base)} m below sea level.`}
    >
      <rect x={0} y={0} width={w} height={seaY} fill={PAL.paper} />
      <rect x={0} y={seaY} width={w} height={baseY - seaY} fill={PAL.sea} />
      {[1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={0} y1={seaY + (dep * i) / 6} x2={w} y2={seaY + (dep * i) / 6} stroke={PAL.seaInk} strokeWidth={0.5} opacity={0.35} />
      ))}
      <rect x={0} y={baseY} width={w} height={h - baseY} fill={PAL.rock} />
      <path d={outline} fill={PAL.rock} stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      {[0.8, 0.6, 0.4].map((s) => (
        <path key={s} d={outline} fill="none" stroke={PAL.paper} strokeWidth={1} opacity={0.35} transform={`translate(${f(cx * (1 - s))} ${f(baseY * (1 - s))}) scale(${s})`} />
      ))}
      <path d={`M${f(cx + 2)} ${baseY + 10} C${f(cx + 2)} ${f(seaY + 150)} ${f(ventX)} ${f(seaY + 120)} ${f(ventX)} ${f(terrY + 2)}`} fill="none" stroke={PAL.lava} strokeWidth={6} strokeLinecap="round" />
      {active && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} className={`va-bub va-bub${i}`} cx={ventX} cy={terrY + 8} r={3.4 + (i % 2) * 1.2} fill={PAL.paper} stroke={PAL.ink} strokeWidth={0.9} />
          ))}
          <g className="va-burst" fill="none" stroke={PAL.lava} strokeWidth={2.2} strokeLinecap="round">
            <path d={`M${f(ventX)} ${f(terrY)} q-12 -30 -30 -16`} />
            <path d={`M${f(ventX)} ${f(terrY)} q-4 -40 -14 -34`} />
            <path d={`M${f(ventX)} ${f(terrY)} q4 -44 12 -34`} />
            <path d={`M${f(ventX)} ${f(terrY)} q14 -30 26 -14`} />
          </g>
        </>
      )}
      <line x1={0} y1={seaY} x2={w} y2={seaY} stroke={PAL.ink} strokeWidth={1.3} />
      <text className="va-it" x={w - 38} y={seaY - 9} textAnchor="end" fontSize={fs} fill={PAL.ink}>sea level</text>
      {!compact && profile.section.sea && <text className="va-it" x={14} y={seaY + 24} fontSize={fs} fill={PAL.seaInk}>{profile.section.sea}</text>}
      <line x1={sx + 6} y1={topY} x2={dx1 + 8} y2={topY} stroke={PAL.ink} strokeWidth={0.8} strokeDasharray="3 3" />
      <path d={`M${f(dx1)} ${f(topY)} V${seaY} M${f(dx1 - 5)} ${f(topY)} h10 M${f(dx1 - 5)} ${seaY} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={dx1 + 12} y={(topY + seaY) / 2 - 3} fontSize={fs + 3} fontWeight={700} fill={PAL.ink}>{fmt(summitFt)} ft</text>
      <text x={dx1 + 12} y={(topY + seaY) / 2 + 17 * big} fontSize={fs} fill={PAL.ink}>({fmt(summit)} m){compact ? '' : ' above the sea'}</text>
      <path d={`M${f(dx2)} ${seaY} V${baseY} M${f(dx2 - 5)} ${baseY} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={dx2 - 12} y={ty} textAnchor="end" fontSize={fs + (compact ? 1 : 3)} fontWeight={700} fill={PAL.ink}>about {fmt(roundTo(feet(base), 100))} ft</text>
      <text x={dx2 - 12} y={ty + 20 * big} textAnchor="end" fontSize={fs} fill={PAL.ink}>({fmt(base)} m) down</text>
      <text x={dx2 - 12} y={ty + 39 * big} textAnchor="end" fontSize={fs} fill={PAL.ink}>to the base</text>
      {terrace && (
        <>
          <line x1={tx - 3} y1={terrY - 3} x2={labelEnd} y2={topY - 14} stroke={PAL.ink} strokeWidth={0.8} />
          <text x={lx} y={topY - 28} fontSize={fs} fontWeight={700} fill={PAL.ink}>crater terrace</text>
          <text x={lx} y={topY - 28 + 19 * big} fontSize={fs - 1} fill={PAL.ink}>{terraceFt}{compact ? '' : ` (${t0}–${t1} m)`}</text>
        </>
      )}
      {!compact && (
        <>
          {profile.section.flank_label && (
            <>
              <line x1={curveX(left, fy + 2) - 3} y1={fy + 2} x2={lx + 116} y2={fy + 2} stroke={PAL.ink} strokeWidth={0.8} />
              <text className="va-it" x={lx} y={fy + 7} fontSize={fs} fill={PAL.ink}>{profile.section.flank_label}</text>
            </>
          )}
          <path d={`M${f(sx + 40)} ${f(topY - 30)} C${f(sx + 16)} ${f(topY - 30)} ${f(ventX + 26)} ${f(terrY - 46)} ${f(ventX + 12)} ${f(terrY - 34)}`} fill="none" stroke={PAL.pencil} strokeWidth={1.4} strokeLinecap="round" />
          <text className="va-hand" x={sx + 46} y={topY - 24} fontSize={23} fill={PAL.pencil}>{profile.section.note}</text>
        </>
      )}
    </svg>
  );
}

/**
 * A shield volcano cut open, with three heights to scale: the part above the sea, the flank under water, and the part
 * that has pressed the sea floor down. Widths are squeezed; the caption says so. Nothing erupts in it: the only
 * movement is the sea and the sea floor giving way under the volcano's weight.
 */
function ShieldDrawing({ data, compact }: { data: RecordData; compact: boolean }) {
  const { profile } = data;
  const summit = data.summit?.m ?? 0;
  const summitFt = data.summit?.ft ?? 0;
  const base = profile.facts.base_m ?? 0;
  const root = profile.section.root_m ?? 0;
  const w = compact ? 340 : 560;
  const h = compact ? 420 : 520;
  const fs = compact ? 13.5 : 15;
  const summitY = compact ? 50 : 60;
  const bottom = compact ? 24 : 32;
  const k = (h - summitY - bottom) / (summit + base + root);
  const seaY = summitY + summit * k;
  const floorY = seaY + base * k;
  const rootY = floorY + root * k;
  const cx = w * (compact ? 0.34 : 0.385);
  const W = w * (compact ? 0.3 : 0.365);
  const H = floorY - summitY;
  const R = rootY - floorY;
  const notch = compact ? 6 : 9;
  // the shield: steep flanks under water, a broad and nearly flat top
  const left: Curve = [
    [cx - W, floorY],
    [cx - W * 0.6, floorY - H * 0.5],
    [cx - W * 0.46, summitY + H * 0.015],
    [cx - notch, summitY],
  ];
  const right: Curve = [
    [cx + notch, summitY],
    [cx + W * 0.46, summitY + H * 0.015],
    [cx + W * 0.6, floorY - H * 0.5],
    [cx + W, floorY],
  ];
  const calderaDepth = Math.max(2.5, (profile.section.caldera_depth_m ?? 0) * k);
  const shield =
    `M${f(left[0][0])} ${f(left[0][1])} ${cubic(left)} L${f(cx - notch + 3)} ${f(summitY + calderaDepth)} L${f(cx + notch - 3)} ${f(summitY + calderaDepth)} ` +
    `L${f(right[0][0])} ${f(right[0][1])} ${cubic(right)} Z`;
  // the part pressed into the sea floor mirrors the shield above it
  const rootRight: Curve = [
    [cx + W, floorY],
    [cx + W * 0.6, floorY + R * 0.5],
    [cx + W * 0.46, rootY - R * 0.015],
    [cx, rootY],
  ];
  const rootLeft: Curve = [
    [cx, rootY],
    [cx - W * 0.46, rootY - R * 0.015],
    [cx - W * 0.6, floorY + R * 0.5],
    [cx - W, floorY],
  ];
  const rootPath = `M${f(cx + W)} ${f(floorY)} ${cubic(rootRight)} ${cubic(rootLeft)} Z`;
  const dx1 = curveX(right, seaY) + (compact ? 10 : 16);
  const dx2 = w - (compact ? 14 : 20);
  const lx = dx2 - (compact ? 9 : 12);
  const line = fs + 4;
  const y2 = seaY + (floorY - seaY) * (compact ? 0.36 : 0.41);
  const y3 = floorY + R * (compact ? 0.4 : 0.38);
  const bold = fs + (compact ? 1 : 3);
  const ft = (m: number) => fmt(roundTo(feet(m), 50));
  const clip = `va-shield-${compact ? 'small' : 'wide'}`;
  const wave = (y: number, half: number) => wavePath(y, half, w);

  return (
    <svg
      className={`va-sec ${compact ? 'va-sec-small' : 'va-sec-wide'}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={`Section drawing of ${profile.name}: the summit is ${fmt(summit)} m above sea level, the flanks go about ${fmt(base)} m further down to the sea floor, and the volcano has pressed the sea floor down by about another ${fmt(root)} m.`}
    >
      <defs>
        <clipPath id={clip}>
          <path d={shield} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={w} height={seaY} fill={PAL.paper} />
      <rect x={0} y={seaY} width={w} height={floorY - seaY} fill={PAL.sea} />
      <path className="va-wave" d={wave(seaY + 5, 18)} fill="none" stroke={PAL.seaInk} strokeWidth={0.9} opacity={0.5} />
      <path className="va-wave va-wave2" d={wave(seaY + 10.5, 26)} fill="none" stroke={PAL.seaInk} strokeWidth={0.8} opacity={0.3} />
      <rect x={0} y={floorY} width={w} height={h - floorY} fill={PAL.crust} />
      <g className="va-press">
        <path d={rootPath} fill={PAL.root} stroke={PAL.ink} strokeWidth={1.1} strokeDasharray="5 4" strokeLinejoin="round" />
      </g>
      <path d={shield} fill={PAL.rock} />
      {/* the flank under water takes a little of the sea's colour */}
      <rect x={0} y={seaY} width={w} height={floorY - seaY} fill={PAL.seaInk} opacity={0.2} clipPath={`url(#${clip})`} />
      {[0.8, 0.6, 0.4].map((s) => (
        <path key={s} d={shield} fill="none" stroke={PAL.paper} strokeWidth={1} opacity={0.35} transform={`translate(${f(cx * (1 - s))} ${f(floorY * (1 - s))}) scale(${s})`} />
      ))}
      <path d={shield} fill="none" stroke={PAL.ink} strokeWidth={1.6} strokeLinejoin="round" />
      <line x1={0} y1={seaY} x2={w} y2={seaY} stroke={PAL.ink} strokeWidth={1.3} />
      <line x1={cx + W} y1={floorY} x2={w} y2={floorY} stroke={PAL.ink} strokeWidth={0.9} />
      <line x1={0} y1={floorY} x2={cx - W} y2={floorY} stroke={PAL.ink} strokeWidth={0.9} />
      <text className="va-it" x={lx} y={seaY - 8} textAnchor="end" fontSize={fs} fill={PAL.ink}>sea level</text>
      {!compact && profile.section.sea && <text className="va-it" x={lx} y={seaY + 27} textAnchor="end" fontSize={fs} fill={PAL.seaInk}>{profile.section.sea}</text>}
      <text className="va-it" x={lx} y={floorY - 7} textAnchor="end" fontSize={fs} fill={PAL.ink}>sea floor</text>

      {/* above the sea */}
      <line x1={cx + notch + 4} y1={summitY} x2={dx1 + 8} y2={summitY} stroke={PAL.ink} strokeWidth={0.8} strokeDasharray="3 3" />
      <path d={`M${f(dx1)} ${f(summitY)} V${f(seaY)} M${f(dx1 - 5)} ${f(summitY)} h10 M${f(dx1 - 5)} ${f(seaY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={dx1 + 11} y={(summitY + seaY) / 2 - 2} fontSize={bold} fontWeight={700} fill={PAL.ink}>{fmt(summitFt)} ft</text>
      <text x={dx1 + 11} y={(summitY + seaY) / 2 - 2 + line} fontSize={fs} fill={PAL.ink}>({fmt(summit)} m){compact ? '' : ' above the sea'}</text>

      {/* under water, and pressed into the sea floor */}
      <path d={`M${f(dx2)} ${f(seaY)} V${f(rootY)} M${f(dx2 - 5)} ${f(floorY)} h10 M${f(dx2 - 5)} ${f(rootY)} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={lx} y={y2} textAnchor="end" fontSize={bold} fontWeight={700} fill={PAL.ink}>about {ft(base)} ft</text>
      <text x={lx} y={y2 + line} textAnchor="end" fontSize={fs} fill={PAL.ink}>({fmt(base)} m) under</text>
      <text x={lx} y={y2 + line * 2 - 2} textAnchor="end" fontSize={fs} fill={PAL.ink}>the sea</text>
      <text x={lx} y={y3} textAnchor="end" fontSize={bold} fontWeight={700} fill={PAL.ink}>about {ft(root)} ft</text>
      <text x={lx} y={y3 + line} textAnchor="end" fontSize={fs} fill={PAL.ink}>({fmt(root)} m) pressed</text>
      <text x={lx} y={y3 + line * 2 - 2} textAnchor="end" fontSize={fs} fill={PAL.ink}>into the sea floor</text>

      {profile.section.caldera && (
        <>
          <line x1={cx - 2} y1={summitY + calderaDepth - 1} x2={compact ? 92 : 128} y2={summitY - 20} stroke={PAL.ink} strokeWidth={0.8} />
          <text x={12} y={summitY - 30} fontSize={fs} fontWeight={700} fill={PAL.ink}>{profile.section.caldera}</text>
          <text x={12} y={summitY - 30 + line - 1} fontSize={fs - 1} fill={PAL.ink}>summit caldera</text>
        </>
      )}
      {!compact && (
        <>
          <path d={`M${f(cx + 96)} ${f(summitY - 28)} C${f(cx + 70)} ${f(summitY - 30)} ${f(cx + 52)} ${f(summitY - 6)} ${f(cx + 44)} ${f(summitY + 16)}`} fill="none" stroke={PAL.pencil} strokeWidth={1.4} strokeLinecap="round" />
          <text className="va-hand" x={cx + 102} y={summitY - 21} fontSize={23} fill={PAL.pencil}>{profile.section.note}</text>
        </>
      )}
    </svg>
  );
}
