import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the source and destination file paths
const filePath = path.join(__dirname, '../../packages/chain-list/src/data/AssetLogoMap.json');

// The GitHub Pages URL
const GITHUB_PAGES_URL = 'https://bitriel.github.io/BitrielWallet-ChainList/logo';

// Function to update the AssetLogoMap URLs
const updateAssetLogoMap = () => {
  try {
    console.log(`Updating AssetLogoMap.json...`);
    
    // Read the JSON file
    const jsonContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(jsonContent);
    let modified = false;
    
    // Process each entry in the JSON file
    Object.keys(jsonData).forEach(key => {
      const url = jsonData[key];
      
      // Check if the value is a URL string
      if (url && typeof url === 'string') {
        // Extract just the filename from the URL
        const fileName = url.split('/').pop();
        
        // Replace the URL with the GitHub Pages URL
        if (fileName) {
          jsonData[key] = `${GITHUB_PAGES_URL}/${fileName}`;
          modified = true;
        }
      }
    });
    
    // Write the updated JSON back to file if modified
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      console.log(`Updated AssetLogoMap.json successfully`);
    } else {
      console.log(`No changes needed for AssetLogoMap.json`);
    }
    
    return modified;
  } catch (error) {
    console.error(`Error updating AssetLogoMap.json:`, error);
    return false;
  }
};

// Main function
const main = () => {
  updateAssetLogoMap();
};

main(); 