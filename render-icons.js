import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import fs from 'fs';

const iconsToExtract = [
  'Search', 'Users', 'BookOpen', 'Shield', 'ChevronRight', 
  'GraduationCap', 'Menu', 'X', 'LayoutDashboard', 'LogOut',
  'Mail', 'Phone', 'CheckCircle2', 'Clock', 'MapPin', 'Star'
];

let svgs = {};

iconsToExtract.forEach(iconName => {
  const IconComponent = LucideIcons[iconName];
  if (IconComponent) {
    const svgString = renderToStaticMarkup(React.createElement(IconComponent, { size: 24 }));
    svgs[iconName] = svgString;
  } else {
    console.log("Icon not found:", iconName);
  }
});

fs.writeFileSync('html-dist/assets/icons/icons.json', JSON.stringify(svgs, null, 2));
console.log('Icons generated successfully.');
