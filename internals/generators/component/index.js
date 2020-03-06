/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add an unconnected component',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of component',
      default: 'Stateless Function',
      choices: () => [
        'Stateless Function',
        'React.PureComponent',
        'React.Component',
      ],
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Button',
      validate: (value) => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A component or container with this name already exists'
            : true;
        }

        return 'The name is required';
      },
    },
    {
      type: 'confirm',
      name: 'wantStyle',
      default: false,
      message:
        'Do you want own style sheet (i.e. will this component use its own set of styles)?',
    },
    {
      type: 'confirm',
      name: 'wantMessages',
      default: true,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: false,
      message: 'Do you want to load the component asynchronously?',
    },
  ],
  actions: (data) => {
    // Generate index.js and index.test.js
    let componentTemplate;

    switch (data.type) {
      case 'Stateless Function': {
        componentTemplate = './component/stateless.js.hbs';
        break;
      }
      default: {
        componentTemplate = './component/class.js.hbs';
      }
    }

    const actions = [
      {
        type: 'add',
        path: '../../app/components/{{properCase name}}/index.js',
        templateFile: componentTemplate,
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../app/components/{{properCase name}}/tests/index.test.js',
        templateFile: './component/test.js.hbs',
        abortOnFail: true,
      },
    ];

    // If they want a i18n messages file
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/messages.js',
        templateFile: './component/messages.js.hbs',
        abortOnFail: true,
      });
    }

    // If they want own style sheet for component
    if (data.wantStyle) {
      actions.push({
        type: 'add',
        path: `../../app/components/{{properCase name}}/_{{dashCase name}}.scss`,
        templateFile: './component/_style.scss.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: `../../app/components/{{properCase name}}/_{{dashCase name}}-responsive.scss`,
        templateFile: './component/_style-responsive.scss.hbs',
        abortOnFail: true,
      });
    }

    // If want Loadable.js to load the component asynchronously
    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: '../../app/components/{{properCase name}}/Loadable.js',
        templateFile: './component/loadable.js.hbs',
        abortOnFail: true,
      });
    }

    actions.push({
      type: 'prettify',
      path: '/components/',
    });

    return actions;
  },
};
