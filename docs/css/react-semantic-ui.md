# `React Semantic UI`
React Semantic UI assists you in building your application by simply
importing their amazing components for you to utilize.

[Theming](https://react.semantic-ui.com/theming)
has also been implemented and setup, to allow you to configure and customize your look and feel.

`Semantic UI` components used in this template to work with [phoenix](https://github.com/trixtateam/react-phoenix-boiler-plate/tree/master/app/phoenix) integration

The theming can be found in the [`semantic/`](https://github.com/trixtateam/react-phoenix-boiler-plate/tree/master/semantic) folder

See the [official documentation](https://react.semantic-ui.com/usage) for more
information.


_Don't like this feature? [Click here](remove.md)_

---
## Semantic UI Components used
### LoadingStatusContainer

[LoadingStatusContainer](https://github.com/trixtateam/react-phoenix-boiler-plate/blob/master/app/components/common/LoadingStatusContainer/index.js) -
This component is connected via `makeSelectLoadingStatusForKey` selector which
is connected to the `app` reducer. Example a key of `login` has a status of `true`
```JS
export const initialState = {
  loading: false,
  loadingStatus: {
    'login' : { status : true }
},
};
const appReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATE_LOADING_STATUS:
      case PHOENIX_CHANNEL_LOADING_STATUS:
        draft.loadingStatus[_.get(action, 'data.loadingStatusKey', '')] = {
          status: true,
        };
        break;
      case PHOENIX_CHANNEL_END_PROGRESS:
      case END_PROGRESS:
        {
          const loadingStatusKey = _.get(
            action,
            'data.loadingStatusKey',
            false,
          );
          if (!loadingStatusKey) {
            draft.progressMessage = false;
            draft.loadingType = false;
          } else {
            delete draft.loadingStatus[loadingStatusKey];
          }
        }
        break;
    }
  });
export default appReducer;

````

### Usage
When this component is used, if the `loadingStatus` key has a status of `true` in the `app reducer` and matches the `loadingStatusKey` being passed to LoadingStatusContainer component,
a loading progress indicator will be shown
```JS
import LoadingStatusContainer from 'app/components/common/LoadingStatusContainer';

 return (<LoadingStatusContainer loadingStatusKey='login' />)

````

### Loading

[Loading](https://github.com/trixtateam/react-phoenix-boiler-plate/blob/master/app/components/common/Loading/index.js) - This component is used as a progress indicator

### Usage

```JS
import React from 'react';
import Loading from 'app/components/common/Loading';

return (<Loading />)

````


