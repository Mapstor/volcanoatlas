import type { ReactNode } from 'react';
import { dateText, daysBetween, decimalYear, feet, fmt, precisionOf, roundTo, spanBetween, type Precision, type Ymd } from '@/lib/eruptions';
import { fill, type RecordData } from '@/lib/recordProfile';

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
    .map((span) => ({ s: span.openStart ? y0 : Math.max(y0, decimalYear(span.start)), e: decimalYear(span.end), span }))
    .filter((p) => p.e > y0);

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
    const days = daysBetween(p.span.end, to);
    if (days > 3) gaps.push({ from: p.span.end, to, days, text: spanBetween(p.span.end, p.span.endPrecision, to, toPrecision).text });
  });
  const centered = spec.label_gaps !== undefined;
  const labelled = centered ? [...gaps].sort((a, b) => b.days - a.days).slice(0, spec.label_gaps) : gaps;

  const fs = small ? 12 : 14;
  const hand = small ? 17 : 22;
  const grid: ReactNode[] = [];
  for (let year = Math.ceil(y0 / 10) * 10; year <= y1; year += 10) {
    const x = X(year);
    const major = year % 50 === 0;
    grid.push(<line key={`g${year}`} x1={x} y1={top - 8} x2={x} y2={yb + 22} stroke={PAL.grid} strokeWidth={major ? 1.4 : 0.7} />);
    if (major || (!small && year % 25 === 0))
      grid.push(
        <text key={`t${year}`} x={x} y={yb + 42} textAnchor="middle" fontSize={fs} fill={PAL.mute}>
          {year}
        </text>,
      );
  }
  const startX = stats.currentStart ? X(decimalYear(stats.currentStart)) : null;
  const lastX = !erupting && stats.lastEnd ? X(decimalYear(stats.lastEnd)) : null;
  const note = spec.note ? fill(spec.note, ctx) : null;

  return (
    <svg
      className={`va-tl ${small ? 'va-tl-small' : 'va-tl-wide'}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={`Strip chart of ${profile.name}'s eruption record from ${y0} to ${endDate[0]}: the line is high while an eruption is in progress and low while the volcano is ${low}.`}
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
      {startX !== null && stats.currentStart && (
        <>
          <line x1={startX} y1={yb + 22} x2={startX} y2={yb + (small ? 50 : 58)} stroke={PAL.accent} strokeWidth={1.5} />
          <text x={small ? w / 2 : startX + 6} y={yb + (small ? 66 : 74)} textAnchor={small ? 'middle' : 'start'} fontSize={fs + 1} fontWeight={700} fill={PAL.ink}>
            {stats.current?.sdmod === '<'
              ? `by ${dateText(stats.currentStart, precisionOf(stats.current.sdunc))}: current eruption under way`
              : `${dateText(stats.currentStart, precisionOf(stats.current?.sdunc))}: current eruption begins`}
          </text>
        </>
      )}
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
            {dateText(stats.lastEnd, stats.lastEndPrecision)}: last eruption ended
          </text>
        </>
      )}
      {!small && ctx.open_before && (
        <text x={x0} y={yb + 74} fontSize={13} fill={PAL.mute}>
          already erupting before {ctx.open_before}
        </text>
      )}
    </svg>
  );
}

/** The cut-open drawing that fits the profile: an island cone, a shield pressed into the sea floor, or a volcano on land. */
export function SectionDrawing({ data, compact = false }: { data: RecordData; compact?: boolean }) {
  const kind = data.profile.section.kind;
  if (kind === 'shield') return <ShieldDrawing data={data} compact={compact} />;
  if (kind === 'land') return <LandDrawing data={data} compact={compact} />;
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
  const k = Math.min(((compact ? 420 : 520) - (compact ? 34 : 40) - topY) / highest, W / (highest - ground));
  const seaY = topY + highest * k;
  const h = Math.round(seaY + (compact ? 34 : 40));
  const Y = (m: number) => seaY - m * k;
  const summitY = Y(summit);
  const groundY = Y(ground);
  const H = groundY - summitY;
  const notch = sec.crater_share ? W * sec.crater_share : compact ? 6 : 9;
  const crater = Math.min(H * 0.5, Math.max(3, (sec.crater_depth_m ?? 0) * k));
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
          <rect x={0} y={0} width={w} height={iceY} fill={PAL.paper} clipPath={`url(#${clip})`} />
          <path d={`${teeth} V${f(iceY)} Z`} fill={PAL.paper} clipPath={`url(#${clip})`} />
          <path d={teeth} fill="none" stroke={PAL.ink} strokeWidth={0.8} strokeLinejoin="round" />
        </>
      )}
      {active && <path d={`M${f(cx + 3)} ${f(groundY + (onWater ? 0 : Math.min(18, seaY - groundY)))} C${f(cx + 4)} ${f(groundY - H * 0.3)} ${f(cx - 3)} ${f(ventY + H * 0.35)} ${f(cx)} ${f(ventY + 2)}`} fill="none" stroke={PAL.lava} strokeWidth={compact ? 5 : 6} strokeLinecap="round" />}
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
      <text x={xa + 12} y={summitY - 12 - line * 2} fontSize={bold} fontWeight={700} fill={PAL.ink}>{fmt(summitFt)} ft</text>
      <text x={xa + 12} y={summitY - 11 - line} fontSize={fs} fill={PAL.ink}>({fmt(summit)} m)</text>
      <text x={xa + 12} y={summitY - 10} fontSize={fs} fill={PAL.ink}>above {onWater && sec.baseline ? 'the water' : 'sea level'}</text>

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
          <line x1={cx - (notch - inset) * 0.8} y1={ventY - 2} x2={xa + (compact ? 88 : 104)} y2={summitY + 18} stroke={PAL.ink} strokeWidth={0.8} />
          <text x={xa + 12} y={summitY + 22} fontSize={fs} fontWeight={700} fill={PAL.ink}>{sec.crater}</text>
          {sec.crater_depth_m !== undefined && (
            <text x={xa + 12} y={summitY + 22 + line - 1} fontSize={fs - 1} fill={PAL.ink}>{fmt(sec.crater_depth_ft ?? roundTo(feet(sec.crater_depth_m), 50))} ft deep</text>
          )}
        </>
      )}
      {iceY !== null && sec.ice_label && (
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
