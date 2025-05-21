import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the source and destination file paths
const sourceDir = path.join(__dirname, '../../packages/chain-list/src/data');
const destDir = path.join(__dirname, '../../packages/chain-list/src/data');

// The GitHub Pages URL
const GITHUB_PAGES_URL = 'https://bitriel.github.io/BitrielWallet-ChainList/logo';

// Function to update the icon URLs in JSON files
const updateIconUrls = (jsonFile) => {
  try {
    const fullSourcePath = path.join(sourceDir, jsonFile);
    const fullDestPath = path.join(destDir, jsonFile);
    
    console.log(`Updating ${jsonFile}...`);
    
    // Read the JSON file
    const jsonContent = fs.readFileSync(fullSourcePath, 'utf8');
    const jsonData = JSON.parse(jsonContent);
    let modified = false;
    
    // Process each entry in the JSON file
    Object.keys(jsonData).forEach(key => {
      const item = jsonData[key];
      
      // Check if the item has an icon property with a URL
      if (item && item.icon && typeof item.icon === 'string') {
        // Extract just the filename from the icon URL
        const iconFileName = item.icon.split('/').pop();
        
        // Replace the icon URL with the GitHub Pages URL
        if (iconFileName) {
          item.icon = `${GITHUB_PAGES_URL}/${iconFileName}`;
          modified = true;
        }
      }
    });
    
    // Write the updated JSON back to file if modified
    if (modified) {
      fs.writeFileSync(fullDestPath, JSON.stringify(jsonData, null, 2));
      console.log(`Updated ${jsonFile} successfully`);
    } else {
      console.log(`No changes needed for ${jsonFile}`);
    }
    
    return modified;
  } catch (error) {
    console.error(`Error updating ${jsonFile}:`, error);
    return false;
  }
};

// Main function
const main = () => {
  const jsonFiles = [
    'ChainInfo.json',
    'ChainAsset.json',
    'MultiChainAsset.json',
    'AssetRef.json'
  ];
  
  let modifiedCount = 0;
  
  jsonFiles.forEach(file => {
    if (updateIconUrls(file)) {
      modifiedCount++;
    }
  });
  
  console.log(`Updated ${modifiedCount} files`);
};

main(); 