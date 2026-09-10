const fs = require('fs');

const path = 'src/pages/NewAssetPage.tsx';
let content = fs.readFileSync(path, 'utf-8');

// Replacements map
const colorMap = {
  "'#0F172A'": "'text.primary'",
  "'#334155'": "'text.primary'",
  "'#64748B'": "'text.secondary'",
  "'#475569'": "'text.secondary'",
  "'#94A3B8'": "'text.secondary'",
  "'#E2E8F0'": "'divider'",
  "'#CBD5E1'": "'divider'",
  "'#FFFFFF'": "'background.paper'",
  "'#F8FAFC'": "'background.default'",
  "'#F1F5F9'": "'background.default'", // or 'action.hover' maybe?
  "'#FAFAFA'": "'background.default'",
  "'#4F46E5'": "'primary.main'",
  "'#4338CA'": "'primary.dark'",
  "'#EF4444'": "'error.main'",
  "'#F5F3FF'": "'action.selected'"
};

for (const [hex, themeVal] of Object.entries(colorMap)) {
  // We use global replacement for exact string matches
  const regex = new RegExp(hex, 'g');
  content = content.replace(regex, themeVal);
}

fs.writeFileSync(path, content);
console.log('Colors replaced!');
