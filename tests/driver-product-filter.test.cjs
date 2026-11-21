const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

function compileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  module._compile(output, filename);
}
require.extensions[".ts"] = compileTypeScript;

const { filterDriverProducts } = require("../src/lib/driver-product-filter.ts");
const products = [
  { id: "arrival-dali", category: "arrival", cities: ["dali"] },
  { id: "day-dali", category: "day", cities: ["dali"] },
  { id: "dali-lijiang", category: "intercity", cities: ["dali", "lijiang"], departureCities: ["dali", "lijiang"] },
  { id: "lijiang-shangri-la", category: "intercity", cities: ["lijiang", "shangri-la"], departureCities: ["lijiang", "shangri-la"] },
  { id: "lijiang-tiger-leaping-shangri-la", category: "intercity", cities: ["lijiang", "shangri-la"], departureCities: ["lijiang"] },
];

test("departure city returns only services that start in the selected city", () => {
  assert.deepEqual(filterDriverProducts(products, "all", "dali").map(({ id }) => id), [
    "arrival-dali", "day-dali", "dali-lijiang",
  ]);
  assert.deepEqual(filterDriverProducts(products, "all", "shangri-la").map(({ id }) => id), [
    "lijiang-shangri-la",
  ]);
});

test("service category and departure city filters combine", () => {
  assert.deepEqual(filterDriverProducts(products, "intercity", "dali").map(({ id }) => id), [
    "dali-lijiang",
  ]);
  assert.deepEqual(filterDriverProducts(products, "arrival", "dali").map(({ id }) => id), [
    "arrival-dali",
  ]);
});

test("all cities and all categories preserve the full catalog", () => {
  assert.equal(filterDriverProducts(products, "all", "").length, products.length);
});
