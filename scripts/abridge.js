import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

// Input and output file paths
const INPUT_FILE = path.resolve('src/index.yml');
const OUTPUT_FILE = path.resolve('src/abridged.yml');

try {
  // Check if the input file exists
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Error: ${INPUT_FILE} not found!`);
    process.exit(1);
  }

  // Read and parse the YAML file
  const yamlContent = fs.readFileSync(INPUT_FILE, 'utf8');
  const resumeData = yaml.parse(yamlContent);

  // Remove skills, languages, publications and awards
  delete resumeData.skills;
  delete resumeData.languages;
  delete resumeData.publications;
  delete resumeData.awards;

  // Remove high school
  if (Array.isArray(resumeData.education) && resumeData.education.length > 2) {
    delete resumeData.education[2];
    resumeData.education = resumeData.education.filter(Boolean); // Remove undefined entries
  }

  // Remove 'highlights' from work entries beyond the first three
  if (Array.isArray(resumeData.work)) {
    resumeData.work.forEach((entry, index) => {
      if (index >= 3 && entry.highlights) {
        delete entry.highlights; // Remove highlights from entries beyond the first three
      }
    });
  }

  // Convert the updated data back to YAML
  const updatedYamlContent = yaml.stringify(resumeData);

  // Write the updated content to the output file
  fs.writeFileSync(OUTPUT_FILE, updatedYamlContent);

  console.log(`Successfully created ${OUTPUT_FILE} without 'skills' and 'languages' sections.`);
} catch (error) {
  console.error('Error during processing:', error);
  process.exit(1);
}
