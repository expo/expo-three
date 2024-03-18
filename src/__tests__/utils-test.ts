import { getUrlExtension, matchUrlExtensions } from '../utils';

const baseUrl = 'https://github.com/expo/expo-three';

describe('utils', () => {
  it('getUrlExtension()', () => {
    expect(getUrlExtension(`${baseUrl}/file.jpg`)).toBe('jpg');
    expect(getUrlExtension(`${baseUrl}/file.jpg?query=string`)).toBe('jpg');
    expect(getUrlExtension(`${baseUrl}/file`)).toBe('');
    expect(getUrlExtension(`${baseUrl}/file.`)).toBe('');
    expect(getUrlExtension(`${baseUrl}/file.123`)).toBe('123');
  });

  it('matchUrlExtensions()', () => {
    expect(matchUrlExtensions(`${baseUrl}/file.jpg`, ['jpg', 'png'])).toBe(
      true
    );
    expect(matchUrlExtensions(`${baseUrl}/file.jpg`, ['png'])).toBe(false);
    expect(matchUrlExtensions(`${baseUrl}/file.jpg`, [])).toBe(false);
    expect(matchUrlExtensions(`${baseUrl}/file.jpg`, [''])).toBe(false);
    expect(matchUrlExtensions(`${baseUrl}/file.jpg`, ['jpg', ''])).toBe(true);

    expect(
      matchUrlExtensions(`${baseUrl}/file.jpg?query=string`, ['jpg'])
    ).toBe(true);
    expect(
      matchUrlExtensions(`${baseUrl}/file.jpg?query=string`, ['png'])
    ).toBe(false);
    expect(matchUrlExtensions(`${baseUrl}/file.jpg?query=string`, [])).toBe(
      false
    );
  });
});
