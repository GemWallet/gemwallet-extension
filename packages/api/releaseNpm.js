const fs = require('fs');

const DESTINATION_FOLDER = 'dist';

fs.readFile('./package.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const packageJSON = JSON.parse(data);
  // Clean packageJSON
  delete packageJSON.scripts;
  packageJSON.private = false;
  delete packageJSON.devDependencies;
  fs.writeFile(`./${DESTINATION_FOLDER}/package.json`, JSON.stringify(packageJSON), function (err) {
    if (err) return console.log(err);
    console.log('package.json prepared');
  });
  // Prepare LICENSE
  fs.copyFile('../../LICENSE', `./${DESTINATION_FOLDER}/LICENSE`, (err) => {
    if (err) throw err;
    console.log('LICENSE prepared');
  });
  // Prepare README
  fs.copyFile('./README.md', `./${DESTINATION_FOLDER}/README.md`, (err) => {
    if (err) throw err;
    console.log('README prepared');
  });
});
