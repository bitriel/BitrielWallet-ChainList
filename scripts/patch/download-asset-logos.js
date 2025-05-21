import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define file paths
const assetLogoMapPath = path.join(__dirname, '../../packages/chain-list/src/data/AssetLogoMap.json');
const outputDir = path.join(__dirname, '../../packages/chain-list/build/logo');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to download a file
const downloadFile = (url, outputPath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file on error
      reject(err);
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
    
    // Download each asset logo file
    const downloads = [];
    let count = 0;
    
    for (const [assetKey, logoUrl] of Object.entries(assetLogoMap)) {
      // Extract the filename from the URL
      const fileName = logoUrl.split('/').pop();
      const outputPath = path.join(outputDir, fileName);
      
      // Skip if the file already exists
      if (fs.existsSync(outputPath)) {
        console.log(`Skipping ${fileName} (already exists)`);
        continue;
      }
      
      downloads.push(
        downloadFile(logoUrl, outputPath)
          .then(() => {
            count++;
            console.log(`Downloaded ${count}/${Object.keys(assetLogoMap).length}: ${fileName}`);
          })
          .catch((error) => {
            console.error(`Error downloading ${fileName}:`, error.message);
          })
      );
    }
    
    // Wait for all downloads to complete
    await Promise.all(downloads);
    
    console.log(`Downloaded ${count} asset logo files`);
  } catch (error) {
    console.error('Error:', error);
  }
};

main(); 