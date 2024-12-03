import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { formatISO } from 'date-fns';

// Paths for input/output files
const RESUME_YAML = path.resolve('src/resume.yml');
const RESUME_JSON = path.resolve('out/resume.json');

try {
  // Check if the YAML resume file exists
  if (!fs.existsSync(RESUME_YAML)) {
    console.error(`Error: ${RESUME_YAML} not found!`);
    process.exit(1);
  }

  // Read and parse the YAML file
  const yamlContent = fs.readFileSync(RESUME_YAML, 'utf8');
  const resumeData = yaml.parse(yamlContent);

  // Add/update the lastUpdated field with the current datetime in ISO 8601 format
  resumeData.meta = resumeData.meta || {};
  resumeData.meta.properties = resumeData.meta.properties || {};
  resumeData.meta.properties.lastUpdated = formatISO(new Date());

  // Write the updated JSON content to the output file
  if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
  }
  fs.writeFileSync(RESUME_JSON, JSON.stringify(resumeData, null, 2));

  console.log(`Successfully converted ${RESUME_YAML} to ${RESUME_JSON}`);
} catch (error) {
  console.error('Error during YAML to JSON conversion:', error);
  process.exit(1);
}
