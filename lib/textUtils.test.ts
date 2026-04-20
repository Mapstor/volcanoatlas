import { processWikiLinks, processMarkdownBold, processContent } from './textUtils';

describe('processMarkdownBold', () => {
  it('should convert basic markdown bold', () => {
    const input = '**Yellowstone, United States**';
    const expected = '<strong>Yellowstone, United States</strong>';
    expect(processMarkdownBold(input)).toBe(expected);
  });

  it('should handle multiple bold patterns on same line', () => {
    const input = '**Toba** and **Taupo** are supervolcanoes';
    const expected = '<strong>Toba</strong> and <strong>Taupo</strong> are supervolcanoes';
    expect(processMarkdownBold(input)).toBe(expected);
  });

  it('should NOT match empty bold patterns', () => {
    expect(processMarkdownBold('** **')).toBe('** **');
    expect(processMarkdownBold('****')).toBe('****');
  });

  it('should NOT match across newlines', () => {
    const input = '**Mount Erebus\n\nis active**';
    expect(processMarkdownBold(input)).toBe(input); // Should remain unchanged
  });

  it('should NOT match single asterisk italics', () => {
    const input = '*word* and **bold**';
    const expected = '*word* and <strong>bold</strong>';
    expect(processMarkdownBold(input)).toBe(expected);
  });

  it('should handle bold with special characters', () => {
    const input = '**Mount St. Helens (2,549 m)**';
    const expected = '<strong>Mount St. Helens (2,549 m)</strong>';
    expect(processMarkdownBold(input)).toBe(expected);
  });

  it('should not process bold with asterisk inside', () => {
    const input = '**Mount * Peak**'; // This has an asterisk in the middle
    expect(processMarkdownBold(input)).toBe(input); // Should remain unchanged
  });

  it('should handle nested asterisks correctly', () => {
    const input = '***bold italic*** text';
    // Our regex should match **bold italic** leaving one * before and after
    const expected = '*<strong>bold italic</strong>* text';
    expect(processMarkdownBold(input)).toBe(expected);
  });
});

describe('processContent (orchestrator)', () => {
  it('should process markdown bold before wiki-links', () => {
    const input = '**Visit [[volcano:etna|Etna]]**';
    const expected = '<strong>Visit <a href="/volcano/etna" class="wiki-link-internal">Etna</a></strong>';
    expect(processContent(input)).toBe(expected);
  });

  it('should handle both bold and wiki-links in complex text', () => {
    const input = 'The **[[volcano:vesuvius|Vesuvius]]** eruption of **79 CE** destroyed [[country:italy|Pompeii]]';
    const result = processContent(input);
    expect(result).toContain('<strong><a href="/volcano/vesuvius" class="wiki-link-internal">Vesuvius</a></strong>');
    expect(result).toContain('<strong>79 CE</strong>');
    expect(result).toContain('<a href="/volcanoes-in-italy" class="wiki-link-internal">Pompeii</a>');
  });

  it('should handle real-world supervolcano content', () => {
    const input = '**Yellowstone, United States** — Yellowstone is perhaps the world\'s most famous [[special:supervolcanoes|supervolcano]]';
    const result = processContent(input);
    expect(result).toContain('<strong>Yellowstone, United States</strong>');
    expect(result).toContain('<a href="/supervolcanoes" class="wiki-link-internal">supervolcano</a>');
  });
});

describe('processWikiLinks', () => {
  it('should convert volcano wiki-links with display text', () => {
    const input = 'Visit [[volcano:etna|Mount Etna]] in Italy';
    const expected = 'Visit <a href="/volcano/etna" class="wiki-link-internal">Mount Etna</a> in Italy';
    expect(processWikiLinks(input)).toBe(expected);
  });

  it('should convert volcano wiki-links without display text', () => {
    const input = 'The volcano [[volcano:krakatau]] erupted';
    const expected = 'The volcano <a href="/volcano/krakatau" class="wiki-link-internal">krakatau</a> erupted';
    expect(processWikiLinks(input)).toBe(expected);
  });

  it('should convert country wiki-links with display text', () => {
    const input = 'Volcanoes in [[country:indonesia|Indonesia]] are active';
    const expected = 'Volcanoes in <a href="/volcanoes-in-indonesia" class="wiki-link-internal">Indonesia</a> are active';
    expect(processWikiLinks(input)).toBe(expected);
  });

  it('should convert country wiki-links without display text', () => {
    const input = 'Visit [[country:italy]] for volcanoes';
    const expected = 'Visit <a href="/volcanoes-in-italy" class="wiki-link-internal">italy</a> for volcanoes';
    expect(processWikiLinks(input)).toBe(expected);
  });

  it('should convert special wiki-links', () => {
    const input = 'Learn about the [[special:ring-of-fire|Ring of Fire]]';
    const expected = 'Learn about the <a href="/ring-of-fire" class="wiki-link-internal">Ring of Fire</a>';
    expect(processWikiLinks(input)).toBe(expected);
  });

  it('should convert ranking wiki-links', () => {
    const input = 'See the [[ranking:deadliest-eruptions|deadliest eruptions]]';
    const expected = 'See the <a href="/deadliest-eruptions" class="wiki-link-internal">deadliest eruptions</a>';
    expect(processWikiLinks(input)).toBe(expected);
  });

  it('should convert external wiki-links', () => {
    const input = 'Visit [[ext:https://volcano.si.edu|Smithsonian GVP]]';
    const expected = 'Visit <a href="https://volcano.si.edu" target="_blank" rel="noopener noreferrer" class="wiki-link-external">Smithsonian GVP</a>';
    expect(processWikiLinks(input)).toBe(expected);
  });

  it('should handle multiple wiki-links in one text', () => {
    const input = 'The [[volcano:etna|Etna]] volcano in [[country:italy|Italy]] is part of the [[special:ring-of-fire|Ring of Fire]]';
    const expected = 'The <a href="/volcano/etna" class="wiki-link-internal">Etna</a> volcano in <a href="/volcanoes-in-italy" class="wiki-link-internal">Italy</a> is part of the <a href="/ring-of-fire" class="wiki-link-internal">Ring of Fire</a>';
    expect(processWikiLinks(input)).toBe(expected);
  });

  it('should handle complex real-world content', () => {
    const input = `Iceland's most famous volcanoes include [[volcano:eyjafjallajokull|Eyjafjallajökull]], 
    [[volcano:katla|Katla]], and [[volcano:hekla|Hekla]]. The country is not part of the 
    [[special:ring-of-fire|Ring of Fire]] but sits on the Mid-Atlantic Ridge.`;
    
    const result = processWikiLinks(input);
    expect(result).toContain('<a href="/volcano/eyjafjallajokull"');
    expect(result).toContain('<a href="/volcano/katla"');
    expect(result).toContain('<a href="/volcano/hekla"');
    expect(result).toContain('<a href="/ring-of-fire"');
    expect(result).not.toContain('[[');
  });

  it('should not process malformed wiki-links', () => {
    const input = 'This [[is not a valid link and [volcano:etna should not match either';
    const result = processWikiLinks(input);
    expect(result).toBe(input);
  });
});