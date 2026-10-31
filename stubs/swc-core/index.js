function unavailable() {
  throw new Error(
    "@swc/core is stubbed in this project (native binary incompatible with this macOS). " +
    "Only next-intl message extraction needs it, and extraction is not enabled."
  );
}
module.exports = {
  transform: unavailable,
  transformSync: unavailable,
  transformFile: unavailable,
  transformFileSync: unavailable,
  parse: unavailable,
  parseSync: unavailable,
  print: unavailable,
  printSync: unavailable,
  minify: unavailable,
  minifySync: unavailable,
  bundle: unavailable,
};
