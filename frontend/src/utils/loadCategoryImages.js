const imageModules = import.meta.glob('/src/assets/img/categories/*.jpg', { eager: true });

export const allCategoriesImages = Object.entries(imageModules).reduce((acc, [path, mod]) => {
  const fileName = path.split('/').pop(); // categories-beef.jpg
  const match = fileName.match(/^categories-(.+?)(@2x)?\.jpg$/);
  if (!match) return acc;

  const [, category, is2x] = match;
  if (!acc[category]) acc[category] = {};
  acc[category][is2x ? 'retina' : 'normal'] = mod.default;

  return acc;
}, {});

