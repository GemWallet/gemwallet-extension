const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const DESTINATION_FOLDER = './dist';

const fromDir = (startPath, filter, callback) => {
  if (!fs.existsSync(startPath)) {
    console.log('There are no such directory: ', startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      fromDir(filename, filter, callback);
    } else if (filter.test(filename)) callback(filename);
  }
};

fs.readFile('./package.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const packageJSON = JSON.parse(data);
  // Clean packageJSON
  delete packageJSON.scripts;
  packageJSON.private = false;
  packageJSON.main = './index.js';
  packageJSON.module = './index.js';
  packageJSON.types = './index.d.ts';
  delete packageJSON.devDependencies;
  fs.writeFile(`${DESTINATION_FOLDER}/package.json`, JSON.stringify(packageJSON), function (err) {
    if (err) return console.log(err);
    console.log('package.json prepared');
  });

  // Prettify the package.json
  exec(
    'yarn workspace @gemwallet/api prettier dist/package.json --write',
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log('Successfully prettified the package.json');
    }
  );

  // Prepare LICENSE
  fs.copyFile('../../LICENSE', `${DESTINATION_FOLDER}/LICENSE`, (err) => {
    if (err) throw err;
    console.log('LICENSE prepared');
  });
  // Prepare README
  fs.copyFile('./README.md', `${DESTINATION_FOLDER}/README.md`, (err) => {
    if (err) throw err;
    console.log('README prepared');
  });

  // Add properly the constant package
  if (fs.existsSync(`${DESTINATION_FOLDER}/_constants`)) {
    fs.rmSync(`${DESTINATION_FOLDER}/_constants`, { recursive: true });
  }
  fs.rename('../constants/dist/src', `${DESTINATION_FOLDER}/_constants`, (err) => {
    if (err) {
      throw err;
    }

    // Cleanup the dist folder within the constants package
    if (fs.existsSync('../constants/dist')) {
      fs.rmSync('../constants/dist', { recursive: true });
    }

    // Replace "@gemwallet/constants" by "/_constants"
    fromDir(DESTINATION_FOLDER, /\.(js|d\.ts)$/, (filename) => {
      fs.readFile(filename, 'utf8', (err, contents) => {
        if (err) {
          console.log('Error while reading the file', err);
          return;
        }

        const relativePathToConstants = path.relative(
          path.dirname(filename),
          `${path.resolve(__dirname)}/dist/_constants`
        );
        const replacedImportPath = relativePathToConstants.startsWith('../')
          ? relativePathToConstants
          : `./${relativePathToConstants}`;
        const replacedImport = contents.replace(/@gemwallet\/constants/g, replacedImportPath);

        fs.writeFile(filename, replacedImport, 'utf-8', (err) => {
          if (err) {
            console.log('Error while writing the file', err);
            return;
          }
        });
      });
    });
  });

  // Add the umd file for the CDN
  if (!fs.existsSync(`${DESTINATION_FOLDER}/umd`)) {
    fs.mkdirSync(`${DESTINATION_FOLDER}/umd/`);
  }
  fs.copyFile(
    '../../dist/gemwallet-api.js',
    `${DESTINATION_FOLDER}/umd/gemwallet-api.js`,
    (err) => {
      if (err) throw err;
      console.log('UMD file prepared');
    }
  );

  //Remove the api/src folder
  fs.rmSync(`${DESTINATION_FOLDER}/api`, { recursive: true });

  //Remove the constants folder
  fs.rmSync(`${DESTINATION_FOLDER}/constants`, { recursive: true });
});
