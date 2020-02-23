var open = require('open');
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

(async () => {
  try {
    const file = fs.readFileSync(
      path.resolve(__dirname, '../config.yml'),
      'utf8'
    );
    const config = yaml.safeLoad(file);
    if (config.development && config.development.theme_id) {
      const { theme_id, store } = config.development;
      const url = `https://${store}?preview_theme_id=${theme_id}`;
      console.log(`Opening: ${url}`);
      await open(url);
    }
  } catch (e) {
    console.log(e);
  }
})();
