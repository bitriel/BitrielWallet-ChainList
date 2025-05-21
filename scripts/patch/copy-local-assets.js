import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define file paths
const assetLogoMapPath = path.join(__dirname, '../../packages/chain-list/src/data/AssetLogoMap.json');
const outputDir = path.join(__dirname, '../../packages/chain-list/build/logo');
const assetsBaseDir = path.join(__dirname, '../../packages/chain-list-assets/public/assets');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to copy a file
const copyFile = (sourcePath, targetPath) => {
  return new Promise((resolve, reject) => {
    // Create directory if it doesn't exist
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy the file
    fs.copyFile(sourcePath, targetPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

// Main function
const main = async () => {
  try {
    // Read the AssetLogoMap.json
    const assetLogoMapContent = fs.readFileSync(assetLogoMapPath, 'utf8');
    const assetLogoMap = JSON.parse(assetLogoMapContent);
    
    console.log(`Found ${Object.keys(assetLogoMap).length} asset logo entries`);
    
    // Process each asset logo file
    const operations = [];
    let count = 0;
    
    for (const [assetKey, logoUrl] of Object.entries(assetLogoMap)) {
      // Extract the filename and path components from the URL
      // Example URL: https://dev.sw-chain-list-assets.pages.dev/assets/chain-assets/selendra-native-sel.png
      const urlPath = new URL(logoUrl).pathname;
      const pathParts = urlPath.split('/');
      const fileName = pathParts.pop(); // Get filename
      
      // Possible source locations (in order of preference)
      const possiblePaths = [
        path.join(assetsBaseDir, 'chain-assets', fileName),
        path.join(assetsBaseDir, 'chains', fileName),
        path.join(assetsBaseDir, 'multi-chain-assets', fileName),
        path.join(assetsBaseDir, 'custom-chain-assets', fileName),
        path.join(assetsBaseDir, 'custom-chains', fileName),
        path.join(assetsBaseDir, fileName) // For default.png
      ];

      const targetPath = path.join(outputDir, fileName);
      
      // Skip if the target file already exists
      if (fs.existsSync(targetPath)) {
        console.log(`Skipping ${fileName} (already exists in target)`);
        continue;
      }

      // Find the first existing source file
      const sourcePath = possiblePaths.find(p => fs.existsSync(p));

      if (sourcePath) {
        operations.push(
          copyFile(sourcePath, targetPath)
            .then(() => {
              count++;
              console.log(`Copied ${count}: ${fileName} from local assets`);
            })
            .catch((error) => {
              console.error(`Error copying ${fileName}:`, error.message);
            })
        );
      } else {
        console.warn(`Warning: Asset file not found for ${fileName}`);
      }
    }
    
    // Wait for all operations to complete
    await Promise.all(operations);
    
    console.log(`Copied ${count} asset logo files`);
  } catch (error) {
    console.error('Error:', error);
  }
};

main(); 