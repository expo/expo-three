import { getUrlExtension, matchUrlExtensions } from '../utils';

describe('utils', () => {
  it('getUrlExtension()', () => {
    expect(getUrlExtension('https://example.com/file.jpg')).toBe('jpg');
    expect(getUrlExtension('https://example.com/file.jpg?query=string')).toBe(
      'jpg'
    );
    expect(getUrlExtension('https://example.com/file')).toBe('');
    expect(getUrlExtension('https://example.com/file.')).toBe('');
    expect(getUrlExtension('https://example.com/file.123')).toBe('123');
  });

  it('matchUrlExtensions()', () => {
    expect(
      matchUrlExtensions('https://example.com/file.jpg', ['jpg', 'png'])
    ).toBe(true);
    expect(matchUrlExtensions('https://example.com/file.jpg', ['png'])).toBe(
      false
    );
    expect(matchUrlExtensions('https://example.com/file.jpg', [])).toBe(false);
    expect(matchUrlExtensions('https://example.com/file.jpg', [''])).toBe(
      false
    );
    expect(
      matchUrlExtensions('https://example.com/file.jpg', ['jpg', ''])
    ).toBe(true);

    expect(
      matchUrlExtensions('https://example.com/file.jpg?query=string', ['jpg'])
    ).toBe(true);
    expect(
      matchUrlExtensions('https://example.com/file.jpg?query=string', ['png'])
    ).toBe(false);
    expect(
      matchUrlExtensions('https://example.com/file.jpg?query=string', [])
    ).toBe(false);
  });
});
