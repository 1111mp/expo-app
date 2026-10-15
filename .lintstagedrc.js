export default {
  '**/*.{js,mjs,cjs,ts,jsx,tsx}': ['oxfmt --write', 'oxlint'],
  '**/*.{md,html,css}': ['oxfmt --write'],
};
