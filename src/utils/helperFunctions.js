export function inputCleaner(input) {
  console.log("inputCleaner", input);
  return input.toLowerCase().replace(/\s/g, "");
}
