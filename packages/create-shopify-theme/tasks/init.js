import fs from 'fs-extra';
import execa from 'execa';
import chalk from 'chalk';
import os from 'os';
import path from 'path';
import validateProjectName from 'validate-npm-package-name';

const checkName = name => {
  const validationResult = validateProjectName(name);
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a project named ${chalk.green(
          `"${name}"`
        )} because of npm naming restrictions:\n`
      )
    );
    [
      ...(validationResult.errors || []),
      ...(validationResult.warnings || []),
    ].forEach(error => {
      console.error(chalk.red(`  * ${error}`));
    });
    console.error(chalk.red('\nPlease choose a different project name.'));
    process.exit(1);
  }
};

export const init = async name => {
  checkName(name);

  if (fs.existsSync(name)) {
    console.error(
      chalk.red(`The folder ${chalk.green(`"${name}"`)} already exists.`)
    );
    process.exit(1);
  } else {
    const root = path.resolve(name);

    //Creates a new folder
    fs.ensureDirSync(name);

    //Creates a package json in the new folder
    const packageJson = {
      name: name,
      version: '0.1.0',
      private: true,
    };
    fs.writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify(packageJson, null, 2) + os.EOL
    );

    //Copies the files from the template
    const templatePath = path.join(
      require.resolve('../../cst-template/package.json', { paths: [root] }),
      '..',
      'template'
    );
    fs.copySync(templatePath, root);
  }
};
