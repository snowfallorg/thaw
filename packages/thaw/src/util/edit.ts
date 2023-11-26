export default async function edit({ file, from, to, insert }) {
  const text = await Bun.file(file).text();

  let cursor = 0;
  let line = 1;
  let col = 1;

  let result = '';

  const eat = () => {
    let char = text[cursor];

    if (char === '\r' && text[cursor + 1] === '\n') {
      char += '\n';
      cursor += 2;
      line++;
      col = 1;
    } else if (char === '\n') {
      cursor++;
      line++;
      col = 1;
    } else {
      cursor++;
      col++;
    }

    return char;
  };

  while (line < from.line && cursor < text.length) {
    result += eat();
  }

  while (col < from.col && cursor < text.length) {
    result += eat();
  }

  result += insert;

  while (line < to.line && cursor < text.length) {
    eat();
  }

  while (col < to.col && cursor < text.length) {
    eat();
  }

  while (cursor < text.length) {
    result += eat();
  }

  await Bun.write(file, result);
}
