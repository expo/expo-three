import fs from 'fs';
async function readAsStringAsync(url) {
  return new Promise((res, rej) =>
    fs.readFile(url, buffer => res(buffer.toString('utf-8'))),
  );
}
export default readAsStringAsync;
