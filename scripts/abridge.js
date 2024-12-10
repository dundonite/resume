import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

// Input and output file paths
const INPUT_FILE = path.resolve('src/exhaustive.yml');
const OUTPUT_FILE = path.resolve('src/index.yml');
const currentYear = new Date().getFullYear();

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

  // Retain only the first entry in education
  if (Array.isArray(resumeData.education) && resumeData.education.length > 1) {
    resumeData.education = resumeData.education.slice(0, 1); // Keep only the first entry
  }

  if (Array.isArray(resumeData.work)) {
    resumeData.work = resumeData.work.filter((entry, index) => {
      // Remove work entries older than 15 years
      if (entry.endDate) {
        const endYear = parseInt(entry.endDate.split('-')[0], 10);
        if (currentYear - endYear > 12) {
          return false; // Filter out this entry
        }
      }
      
      // Remove skills from roles
      if (entry.skills) {
        delete entry.skills
      }

      // Remove highlights from entries beyond the first three
      if (index >= 3 && entry.highlights) {
        delete entry.highlights;
      }

      // Remove summary from work items that ended more than 10 years ago
      if (entry.endDate) {
        const endYear = parseInt(entry.endDate.split('-')[0], 10);
        if (currentYear - endYear > 10 && entry.summary) {
          delete entry.summary;
        }
      }

      return true; // Keep this entry
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
