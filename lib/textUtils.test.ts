import { processWikiLinks } from './textUtils';

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
    expect(result).toContain('<a href="/volcano/eyjafjallajokull" class="wiki-link-internal">Eyjafjallajökull</a>');
    expect(result).toContain('<a href="/volcano/katla" class="wiki-link-internal">Katla</a>');
    expect(result).toContain('<a href="/volcano/hekla" class="wiki-link-internal">Hekla</a>');
    expect(result).toContain('<a href="/ring-of-fire" class="wiki-link-internal">Ring of Fire</a>');
    expect(result).not.toContain('[[');
  });

  it('should not process malformed wiki-links', () => {
    const input = 'This [[is not a valid link and [volcano:etna should not match either';
    const result = processWikiLinks(input);
    expect(result).toBe(input);
  });
});