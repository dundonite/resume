import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { execSync } from 'child_process';

// Directories for input/output
const SRC_DIR = path.resolve('src');
const OUT_DIR = path.resolve('out');

// Helper function to get the last commit date for a file using Git
function getLastUpdatedDate(filePath) {
  try {
    // Get the last commit date for the file in ISO 8601 format
    const gitCommand = `git log -1 --format=%aI -- "${filePath}"`;
    const lastUpdated = execSync(gitCommand, { encoding: 'utf-8' }).trim();
    return lastUpdated || null;
  } catch (error) {
    console.error(`Error getting last updated date for ${filePath}:`, error);
    return null;
  }
}

try {
  // Check if the source directory exists
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Error: ${SRC_DIR} not found!`);
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR);
  }

  // Get all YAML files in the source directory
  const yamlFiles = fs.readdirSync(SRC_DIR).filter(file => file.endsWith('.yml'));

  // Convert each YAML file to JSON
  yamlFiles.forEach(file => {
    const baseName = path.basename(file, '.yml');
    const yamlPath = path.join(SRC_DIR, file);
    const jsonPath = path.join(OUT_DIR, `${baseName}.json`);

    // Read and parse the YAML file
    const yamlContent = fs.readFileSync(yamlPath, 'utf8');
    const resumeData = yaml.parse(yamlContent);

    // Add/update the lastUpdated field using Git metadata
    const lastUpdated = getLastUpdatedDate(yamlPath) || new Date().toISOString();
    resumeData.meta = resumeData.meta || {};
    resumeData.meta.properties = resumeData.meta.properties || {};
    resumeData.meta.properties.lastUpdated = lastUpdated;

    // Write the updated JSON content to the output file
    fs.writeFileSync(jsonPath, JSON.stringify(resumeData, null, 2));
    console.log(`Successfully converted ${file} to ${baseName}.json`);
  });
} catch (error) {
  console.error('Error during YAML to JSON conversion:', error);
  process.exit(1);
}
