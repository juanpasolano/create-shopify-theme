import fs from 'fs-extra';
import execa from 'execa';
import chalk from 'chalk';
import os from 'os';
import path from 'path';
import Listr from 'listr';
import validateProjectName from 'validate-npm-package-name';

const checkName = name => {
  return new Promise((resolve, reject) => {
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
      reject(
        new Error(
          `Cannot create a project named "${name}" because of npm naming restrictions`
        )
      );
    }
    resolve();
  });
};

export const init = async name => {
  const tasks = new Listr([
    {
      title: 'Check name',
      task: () => checkName(name),
    },
    {
      title: 'Crete folder and copy files',
      task: () => {
        if (fs.existsSync(name)) {
          const msg = `The folder ${chalk.green(`"${name}"`)} already exists.`;
          console.error(chalk.red(msg));
          throw new Error(msg);
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
            require.resolve('../../cst-template/package.json', {
              paths: [root],
            }),
            '..',
            'template'
          );
          fs.copySync(templatePath, root);
        }
      },
    },
  ]);
  await tasks.run();

  console.log(chalk.green('Project ready!'));
};
