# Sean Dundon's Resume

A basic tool for maintaining a resume and role-specific edits.

An exhaustive resume is kept in src/exhaustive.yml.

scripts/abridge.js contains rules that convert this exhuastive resume into a more succinct version and places it in src/abrdiged.yml

Run `npm run abridge` to generate src/index.yml.

Rename src/index.yml to create a new version for a specific role.

Run `npm run yaml2json` to convert src/*yaml to out/*json (using jsonrsume.org but I hate editing in JSON)

This will also use the git log to set the meta.lastModified field.

`npm run validate` will validate out/*.json with [resumed](https://github.com/rbardini/resumed)

`npm run render` uses [resumed](https://github.com/rbardini/resumed) to generate out/*.html from out/*.json

`npm run debridge` removes the generated src/index.yml file.

`npm run build` runs through the entire process.