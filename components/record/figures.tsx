import type { ReactNode } from 'react';
import { decimalYear, feet, fmt, roundTo, shortDate } from '@/lib/eruptions';
import type { RecordData } from '@/lib/recordProfile';

/** Drawings of the record page. Every position and label comes from the source data passed in. */

const PAL = { paper: '#fbfcf9', grid: '#c4d8c9', ink: '#17212b', accent: '#d9482b', mute: '#4d5d58', pencil: '#c21f1f', sea: '#cfe3e6', seaInk: '#2d5560', rock: '#8a8f8c', lava: '#d9482b' };

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

/** Strip chart: the line is high while the Smithsonian lists an eruption in progress and flat during a pause. */
export function Timeline({ data, small = false }: { data: RecordData; small?: boolean }) {
  const { stats, profile, ctx } = data;
  const w = small ? 358 : 1140;
  const h = small ? 214 : 220;
  const y0 = profile.timeline.from;
  const y1 = profile.timeline.to;
  const x0 = small ? 16 : 70;
  const x1 = w - (small ? 36 : 40);
  const top = small ? 46 : 32;
  const ya = top + (small ? 34 : 44);
  const yb = ya + (small ? 44 : 62);
  const X = (year: number) => x0 + ((year - y0) / (y1 - y0)) * (x1 - x0);
  const rnd = wobble(7);
  const step = small ? 2.2 : 2;
  const periods = stats.periods
    .map((row) => ({ s: row.openStart ? y0 : Math.max(y0, decimalYear(row.start)), e: decimalYear(row.end), row }))
    .filter((p) => p.e > y0);

  const pts: [number, number][] = [];
  periods.forEach((p, i) => {
    const xa = X(p.s);
    const xb = X(p.e);
    const joined = i > 0 && Math.abs(periods[i - 1].e - p.s) < 0.01;
    if (i === 0) pts.push([xa, ya]);
    else if (!joined) pts.push([xa, yb], [xa, ya]);
    if (xb - xa < 1.5) pts.push([xa + 0.8, ya - 4]);
    else {
      for (let x = xa + step; x < xb; x += step) pts.push([x, ya + (rnd() * 6.4 - 3.2)]);
      pts.push([xb, ya]);
    }
    const next = periods[i + 1];
    if (!p.row.continuing && !(next && Math.abs(next.s - p.e) < 0.01)) pts.push([xb, yb]);
  });
  const spikes: { x: number; label: string }[] = [];
  for (const mark of profile.timeline.marks) {
    const xs = X(mark.year);
    let best = 0;
    pts.forEach((pt, k) => {
      if (Math.abs(pt[0] - xs) < Math.abs(pts[best][0] - xs)) best = k;
    });
    pts[best] = [pts[best][0], ya - (small ? 22 : 30)];
    spikes.push({ x: pts[best][0], label: mark.label });
  }
  const d = `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`;
  const xEnd = pts[pts.length - 1][0];
  const fs = small ? 12 : 14;
  const hand = small ? 17 : 22;
  const grid: ReactNode[] = [];
  for (let year = y0; year <= y1; year += 10) {
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
  const pauseCount = ctx.n_pauses_word;

  return (
    <svg
      className={`va-tl ${small ? 'va-tl-small' : 'va-tl-wide'}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={`Strip chart of ${profile.name}'s eruption record from ${y0} to ${stats.currentLast ? stats.currentLast[0] : y1}: the line stays high while an eruption is in progress and drops flat during ${pauseCount ?? 'the'} short pauses.`}
    >
      <rect x={0} y={0} width={w} height={h} fill={PAL.paper} />
      {grid}
      <line x1={x0} y1={ya} x2={x1} y2={ya} stroke={PAL.grid} strokeWidth={0.7} />
      <line x1={x0} y1={yb} x2={x1} y2={yb} stroke={PAL.grid} strokeWidth={0.7} />
      {!small && (
        <>
          <text x={x0 - 10} y={ya + 5} textAnchor="end" fontSize={13} fill={PAL.mute}>erupting</text>
          <text x={x0 - 10} y={yb + 5} textAnchor="end" fontSize={13} fill={PAL.mute}>paused</text>
        </>
      )}
      {periods.map((p) => (
        <rect key={`b${p.row.eruption.n}`} x={X(p.s)} y={yb + 12} width={Math.max(X(p.e) - X(p.s), 1.2)} height={6} fill={PAL.accent} />
      ))}
      <path className="va-draw" d={d} pathLength={1} fill="none" stroke={PAL.ink} strokeWidth={small ? 1.5 : 1.7} strokeLinejoin="round" strokeLinecap="round" />
      <g className="va-pen">
        <path d={`M${xEnd.toFixed(1)} ${ya} l9 -5 l0 10 z`} fill={PAL.ink} />
        <path d={`M${(xEnd + 8).toFixed(1)} ${ya} l${small ? 16 : 30} -${small ? 9 : 16}`} stroke={PAL.ink} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      </g>
      {!small &&
        stats.pauses.map((pause, k) => {
          const xm = (X(decimalYear(pause.from)) + X(decimalYear(pause.to))) / 2;
          const right = k === stats.pauses.length - 1;
          return (
            <text key={`p${k}`} className="va-hand" x={xm + (right ? 12 : -12)} y={yb - 24} textAnchor={right ? 'start' : 'end'} fontSize={hand} fill={PAL.pencil}>
              {pause.text}
            </text>
          );
        })}
      {!small && stats.pauses.length > 0 && (
        <text className="va-hand" x={X(y0 + (y1 - y0) * 0.775)} y={(ya + yb) / 2 + 8} textAnchor="middle" fontSize={hand} fill={PAL.pencil}>
          {pauseCount} pauses, {ctx.pause_years} years in all
        </text>
      )}
      {spikes
        .filter((s) => !small || profile.timeline.marks.indexOf(profile.timeline.marks.find((m) => m.label === s.label)!) % 2 === 1)
        .map((s) => (
          <text key={`s${s.label}`} x={s.x} y={ya - (small ? 27 : 36)} textAnchor="middle" fontSize={fs - 1} fill={PAL.mute}>
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
      {!small && ctx.open_before && (
        <text x={x0} y={yb + 74} fontSize={13} fill={PAL.mute}>
          already erupting before {ctx.open_before}
        </text>
      )}
    </svg>
  );
}

/** The volcano cut open. Heights are to scale (summit, crater terrace, sea level, base); the shape is schematic. */
export function SectionDrawing({ data, compact = false }: { data: RecordData; compact?: boolean }) {
  const { volcano, profile } = data;
  const summit = volcano.elevation ?? 0;
  const base = profile.facts.base_m;
  const [t0, t1] = profile.facts.terrace_m;
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
  const f = (n: number) => n.toFixed(1);
  // Left flank: sea floor up to the crater terrace. Right flank: summit down to the sea floor.
  const left: [number, number][] = [
    [cx - W, baseY],
    [cx - W * 0.5, baseY - 8],
    [tx - 18 - W * 0.3, seaY + dep * 0.3],
    [tx - 18, terrY + 12],
  ];
  const right: [number, number][] = [
    [sx, topY],
    [sx + W * 0.3, seaY + dep * 0.3],
    [cx + W * 0.5, baseY - 8],
    [cx + W, baseY],
  ];
  const outline =
    `M${f(left[0][0])} ${f(left[0][1])} C${f(left[1][0])} ${f(left[1][1])} ${f(left[2][0])} ${f(left[2][1])} ${f(left[3][0])} ${f(left[3][1])} ` +
    `L${f(tx - 6)} ${f(terrY)} L${f(tx + 12)} ${f(terrY)} L${f(sx)} ${f(topY)} ` +
    `C${f(right[1][0])} ${f(right[1][1])} ${f(right[2][0])} ${f(right[2][1])} ${f(right[3][0])} ${f(right[3][1])} Z`;
  // x of a flank at height y (the curve is sampled; good to a pixel)
  const flankX = (curve: [number, number][], y: number) => {
    let best = curve[0];
    for (let t = 0; t <= 1; t += 0.005) {
      const u = 1 - t;
      const px = u * u * u * curve[0][0] + 3 * u * u * t * curve[1][0] + 3 * u * t * t * curve[2][0] + t * t * t * curve[3][0];
      const py = u * u * u * curve[0][1] + 3 * u * u * t * curve[1][1] + 3 * u * t * t * curve[2][1] + t * t * t * curve[3][1];
      if (Math.abs(py - y) < Math.abs(best[1] - y)) best = [px, py];
    }
    return best[0];
  };
  const fs = 15 * big;
  const ventX = tx + 3;
  const dx1 = Math.max(cx + W * 0.4, flankX(right, seaY) + 14);
  const dx2 = w - 26;
  const ty = seaY + dep * (compact ? 0.2 : 0.3);
  const lx = 14;
  const labelEnd = Math.min(lx + (compact ? 104 : 208) * big + 5, tx - 3);
  const fy = (terrY + seaY) / 2 + 10;
  const terraceFt = `${fmt(roundTo(feet(t0), 100))}–${fmt(roundTo(feet(t1), 10))} ft`;

  return (
    <svg
      className={`va-sec ${compact ? 'va-sec-small' : 'va-sec-wide'}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      role="img"
      aria-label={`Section drawing of ${profile.name}: the summit is ${fmt(summit)} m above sea level, the crater terrace at about ${t0} to ${t1} m, and the base about ${fmt(base)} m below sea level.`}
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
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} className={`va-bub va-bub${i}`} cx={ventX} cy={terrY + 8} r={3.4 + (i % 2) * 1.2} fill={PAL.paper} stroke={PAL.ink} strokeWidth={0.9} />
      ))}
      <g className="va-burst" fill="none" stroke={PAL.lava} strokeWidth={2.2} strokeLinecap="round">
        <path d={`M${f(ventX)} ${f(terrY)} q-12 -30 -30 -16`} />
        <path d={`M${f(ventX)} ${f(terrY)} q-4 -40 -14 -34`} />
        <path d={`M${f(ventX)} ${f(terrY)} q4 -44 12 -34`} />
        <path d={`M${f(ventX)} ${f(terrY)} q14 -30 26 -14`} />
      </g>
      <line x1={0} y1={seaY} x2={w} y2={seaY} stroke={PAL.ink} strokeWidth={1.3} />
      <text className="va-it" x={w - 38} y={seaY - 9} textAnchor="end" fontSize={fs} fill={PAL.ink}>sea level</text>
      {!compact && <text className="va-it" x={14} y={seaY + 24} fontSize={fs} fill={PAL.seaInk}>Tyrrhenian Sea</text>}
      <line x1={sx + 6} y1={topY} x2={dx1 + 8} y2={topY} stroke={PAL.ink} strokeWidth={0.8} strokeDasharray="3 3" />
      <path d={`M${f(dx1)} ${f(topY)} V${seaY} M${f(dx1 - 5)} ${f(topY)} h10 M${f(dx1 - 5)} ${seaY} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={dx1 + 12} y={(topY + seaY) / 2 - 3} fontSize={fs + 3} fontWeight={700} fill={PAL.ink}>{fmt(Math.round(feet(summit)))} ft</text>
      <text x={dx1 + 12} y={(topY + seaY) / 2 + 17 * big} fontSize={fs} fill={PAL.ink}>({fmt(summit)} m){compact ? '' : ' above the sea'}</text>
      <path d={`M${f(dx2)} ${seaY} V${baseY} M${f(dx2 - 5)} ${baseY} h10`} stroke={PAL.ink} strokeWidth={1.1} fill="none" />
      <text x={dx2 - 12} y={ty} textAnchor="end" fontSize={fs + (compact ? 1 : 3)} fontWeight={700} fill={PAL.ink}>about {fmt(roundTo(feet(base), 100))} ft</text>
      <text x={dx2 - 12} y={ty + 20 * big} textAnchor="end" fontSize={fs} fill={PAL.ink}>({fmt(base)} m) down</text>
      <text x={dx2 - 12} y={ty + 39 * big} textAnchor="end" fontSize={fs} fill={PAL.ink}>to the base</text>
      <line x1={tx - 3} y1={terrY - 3} x2={labelEnd} y2={topY - 14} stroke={PAL.ink} strokeWidth={0.8} />
      <text x={lx} y={topY - 28} fontSize={fs} fontWeight={700} fill={PAL.ink}>crater terrace</text>
      <text x={lx} y={topY - 28 + 19 * big} fontSize={fs - 1} fill={PAL.ink}>{terraceFt}{compact ? '' : ` (${t0}–${t1} m)`}</text>
      {!compact && (
        <>
          <line x1={flankX(left, fy + 2) - 3} y1={fy + 2} x2={lx + 116} y2={fy + 2} stroke={PAL.ink} strokeWidth={0.8} />
          <text className="va-it" x={lx} y={fy + 7} fontSize={fs} fill={PAL.ink}>Sciara del Fuoco</text>
          <path d={`M${f(sx + 40)} ${f(topY - 30)} C${f(sx + 16)} ${f(topY - 30)} ${f(ventX + 26)} ${f(terrY - 46)} ${f(ventX + 12)} ${f(terrY - 34)}`} fill="none" stroke={PAL.pencil} strokeWidth={1.4} strokeLinecap="round" />
          <text className="va-hand" x={sx + 46} y={topY - 24} fontSize={23} fill={PAL.pencil}>{profile.section.note}</text>
        </>
      )}
    </svg>
  );
}
