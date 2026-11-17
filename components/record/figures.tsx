import type { ReactNode } from 'react';
import { daysBetween, decimalYear, feet, fmt, roundTo, shortDate, spanText, type Ymd } from '@/lib/eruptions';
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
    const to: Ymd | null = items[i + 1] ? items[i + 1].span.start : erupting ? null : endDate;
    if (!to) return;
    const days = daysBetween(p.span.end, to);
    if (days > 3) gaps.push({ from: p.span.end, to, days, text: spanText(p.span.end, to) });
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
            {shortDate(stats.currentStart)}: current eruption begins
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
            {shortDate(stats.lastEnd)}: last eruption ended
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

/** The cut-open drawing that fits the profile: an island cone, or a shield with the part pressed into the sea floor. */
export function SectionDrawing({ data, compact = false }: { data: RecordData; compact?: boolean }) {
  return data.profile.section.kind === 'shield' ? <ShieldDrawing data={data} compact={compact} /> : <ConeDrawing data={data} compact={compact} />;
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
  // small waves under the surface; each path is one wavelength longer than the drawing so it can slide without a seam
  const wave = (y: number, half: number) => {
    let d = `M${-4 * half} ${f(y)} q${half / 2} -2.4 ${half} 0`;
    for (let x = -3 * half; x < w + 4 * half; x += half) d += ` t${half} 0`;
    return d;
  };

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
