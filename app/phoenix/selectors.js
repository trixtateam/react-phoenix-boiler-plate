import { createSelector } from 'reselect';


const selectPhoenix = (state) => state.get('phoenix');


const makeSelectSocket = () =>
  createSelector(selectPhoenix, (phoenixState) => phoenixState.socket);


export {
  selectPhoenix,
  makeSelectSocket,
};
