const fs = require('fs');

const replaceScssImport = () => {
  try {
    const data = fs.readFileSync('./node_modules/shards-ui/src/scss/shards.scss', 'utf8');
    // sass fails to recognize absolute imports and needs relative
    const lineToReplace = '@import "node_modules/bootstrap/scss/functions";';

    const found = data.includes(lineToReplace);

    if (found) {
      var newFile = data.replace(
        lineToReplace,
        '@import "../../node_modules/bootstrap/scss/functions";'
      );
      fs.writeFileSync('./node_modules/shards-ui/src/scss/shards.scss', newFile, 'utf-8');
    }
  } catch (err) {
    console.error(err);
  }
};

(() => {
  replaceScssImport();
})();
