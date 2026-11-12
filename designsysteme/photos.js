const chapters = ["einleitung", "entwicklung", "anatomie", "foundations", "tokens", "komponenten", "barrierefreiheit", "figma-code", "figma-praxis", "governance", "mini-system"];
const aliases = {"ue-fehler": "einleitung", "ue-foundations": "foundations", "ue-atomic": "anatomie", "ue-tokens": "tokens", "ue-komponenten": "komponenten", "ue-styleguide": "mini-system", "quiz": "governance", "glossar": "entwicklung", "literatur": "entwicklung"};
export function photoFor(id) {
  const key = aliases[id] || id;
  return `fotos/${chapters.includes(key) ? key : "entwicklung"}.webp`;
}
