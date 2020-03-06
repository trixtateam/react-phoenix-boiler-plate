## Removing `sanitize.css`

To remove `sanitize.css` you will need to remove it from both:

- [`app.js`](../../app/app.js)

```diff
import FontFaceObserver from 'fontfaceobserver';
import history from 'utils/history';
-import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';
```

- [`package.json`](../../package.json)!

```diff
"dependencies": {
  ...
  "redux-saga": "0.14.3",
  "reselect": "2.5.4",
- "sanitize.css": "4.1.0",
  "styled-components": "1.4.3",
  ...
},
```

## Removing `React Semantic UI`
Delete the `semantic` folder found in the root of the project


To remove `React Semantic UI` you will need to remove it from both:

- [`webpack.base.babel.js`](../../internals/webpack/webpack.base.babel.js)
```diff
resolve: {
    modules: ['node_modules', 'app'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    - alias: {
      '../../theme.config$': path.join(
        __dirname,
        '../../semantic/theme.config',
      ),
    },
  },
```

- [`app.js`](../../app/app.js)

```diff
import FontFaceObserver from 'fontfaceobserver';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';
-import '../semantic/semantic.less';

// Import root app
import App from 'containers/App';
```

- [`package.json`](../../package.json)!

```diff
"dependencies": {
  ...
  - "semantic-ui-react": "^0.87.3",
  - "semantic-ui-css": "^2.4.1",
  - "semantic-ui-less": "^2.4.1",
  ...
},
```




