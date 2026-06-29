const fs = require('fs');

// 1. Read the file
const data = fs.readFileSync('cal_products.txt', 'utf-8');

// 2. Split into lines and trim whitespace from each line
const lines = data.split('\n').map(line => line.trim());

let currentCategory = 'Miscellaneous'; // Default category
let idCounter = 1;

// 3. Use reduce to build the products array
const products = lines.reduce((acc, line) => {
  // Skip empty lines
  if (!line) return acc;

  // Split line by tab or 2+ spaces
  const parts = line.split(/\t|\s{2,}/);

  // CATEGORY DETECTION LOGIC:
  // If there's only 1 item in the row, it's a new category header
  if (parts.length === 1) {
    currentCategory = parts[0];
    return acc;
  }

  // SKIP HEADERS LOGIC:
  if (parts[0] === 'Продукт') return acc;

  // DATA PARSING LOGIC:
  if (parts.length >= 5) {
    let [name, p, f, c, kcal] = parts;

    let protein = parseFloat(p.replace(',', '.')) || 0;
    let fats = parseFloat(f.replace(',', '.')) || 0;
    let carbs = parseFloat(c.replace(',', '.')) || 0;
    let calories = parseFloat(kcal.replace(',', '.')) || 0;

    // RECALCULATION FOR 100G LOGIC:
    // Search for weight in the name (e.g., "60гр" or "194гр")
    const weightMatch = name.match(/(\d+)\s*гр/);
    
    if (weightMatch) {
      const weight = parseFloat(weightMatch[1]);
      if (weight > 0 && weight !== 100) {
        // Recalculate all values for 100g
        protein = Number(((protein / weight) * 100).toFixed(2));
        fats = Number(((fats / weight) * 100).toFixed(2));
        carbs = Number(((carbs / weight) * 100).toFixed(2));
        calories = Number(((calories / weight) * 100).toFixed(2));
        
        // Update the name so it's clear it is per 100g
        name = name.replace(weightMatch[0], '(per 100g)');
      }
    }

    acc.push({
      id: idCounter++,
      name: name.trim(),
      category: currentCategory,
      protein,
      fats,
      carbs,
      calories,
    });
  }

  return acc;
}, []);

// 4. Write the result to JSON
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

console.log(`✅ Successfully processed and normalized ${products.length} products!`);
