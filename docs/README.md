# Documentation

## Table of Contents

- [General](general)
  - [**CLI Commands**](general/commands.md)
  - [Introduction ](general/introduction.md)
  - [Tool Configuration](general/files.md)
  - [Server Configurations](general/server-configs.md)
  - [Deployment](general/deployment.md) _(currently Heroku and AWS S3 specific)_
  - [Debugging](general/debugging.md)
  - [FAQ](general/faq.md)
  - [Gotchas](general/gotchas.md)
  - [Remove](general/remove.md)
  - [Extracting components](general/components.md)
- [Testing](testing)
  - [Unit Testing](testing/unit-testing.md)
  - [Component Testing](testing/component-testing.md)
  - [Remote Testing](testing/remote-testing.md)
- [Styling (CSS)](css/README.md)
  - [React Semantic UI](css/react-semantic-ui.md)
  - [Next Generation CSS](css/README.md#next-generation-css)
  - [CSS Support](css/README.md#css-we-support)
  - [styled-components](css/README.md#styled-components)
  - [Stylesheet](css/README.md#stylesheet)
  - [CSS Modules](css/README.md#css-modules)
  - [Sass](css/README.md#sass)
  - [LESS](css/README.md#less)
- [JS](js)
  - [Phoenix-to-redux](https://github.com/trixtateam/phoenix-to-redux)
  - [Redux](js/redux.md)
  - [Immer](js/immer.md)
  - [reselect](js/reselect.md)
  - [redux-saga](js/redux-saga.md)
  - [i18n](js/i18n.md)
  - [routing](js/routing.md)
- [Maintenance](maintenance)
  - [Dependency Update](maintenance/dependency.md)
- [Forks](forks)

## Overview

### Quickstart

1.  First, let's kick the tyres by launching the sample _Repospective_ app
    bundled with this project to demo some of its best features:

    ```Shell
    npm start
    ```

1.  Open [localhost:3000](http://localhost:3000) to see it in action.

    - You will be presented with a login page, when trying to navigate to the home page
    - Edit the file at `./app/containers/LoginPage/index.js` remove the primary attribute
      on the login button ` <Button fluid size="large" primary>` component to change color"... [Hot Module Reloading](https://webpack.js.org/guides/hot-module-replacement/) gives
      you a feedback loop with your UI so smooth it's almost conversational!
    - Update your [`constants.js`](./app/phoenix/constants.js) file in the phoenix folder
      to include any changes required to connect your socket.
      The following defaults have been given:
      ```
          export const CHANNEL_NAME_PREFIX = 'space:';

          export const socketChannels = {
            AUTHENTICATION: 'session',
          };

          export const authenticationEvents = {
            LOGIN: 'login',
          };
      ```
    - After updating the [`constants.js`](./app/phoenix/constants.js) file in the phoenix folder, you
      should now be able to authenticate to your socket. Enter your socket url and credentials to login
      eg. ws:localhost:4000

### Development

Run `npm start` to see your app at `localhost:3000`

### Building & Deploying

1.  Run `npm run build`, which will compile all the necessary files to the
    `build` folder.

2.  Upload the contents of the `build` folder to your web server's root folder.

### Structure

The [`app/`](../../../tree/master/app) directory contains your entire application code, including CSS,
JavaScript, HTML and tests.

The rest of the folders and files only exist to make your life easier, and
should not need to be touched.

_(If they do have to be changed, please [submit an issue](https://github.com/react-boilerplate/react-boilerplate/issues)!)_

### CSS

Using [tagged template literals](https://www.styled-components.com/docs/advanced#tagged-template-literals)
(a recent addition to JavaScript) and the [power of CSS](https://github.com/styled-components/styled-components/blob/master/docs/css-we-support.md),
`styled-components` allows you to write actual CSS code to style your components.
It also removes the mapping between components and styles – using components as a
low-level styling construct could not be easier!

See the [CSS documentation](./css/README.md) for more information.

### JS

We bundle all your clientside scripts and chunk them into several files using
code splitting where possible. We then automatically optimize your code when
building for production so you don't have to worry about that.

See the [JS documentation](./js/README.md) for more information about the
JavaScript side of things.

### SEO

We use [react-helmet](https://github.com/nfl/react-helmet) for managing document head tags. Examples on how to
write head tags can be found [here](https://github.com/nfl/react-helmet#examples).

### Testing

For a thorough explanation of the testing procedure, see the
[testing documentation](./testing/README.md)!

#### Browser testing

`npm run start:tunnel` makes your locally-running app globally available on the web
via a temporary URL: great for testing on different devices, client demos, etc!

#### Unit testing

Unit tests live in `test/` directories right next to the components being tested
and are run with `npm run test`.
