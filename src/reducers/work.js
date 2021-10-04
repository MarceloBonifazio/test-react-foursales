export const ADD = 'work/add';
export const REMOVE = 'work/remove';
export const EDIT = 'work/edit';

export const add = data => ({ type: ADD, payload: data });
export const remove = data => ({ type: REMOVE, payload: data });
export const edit = data => ({ type: EDIT, payload: data });

export const getWork = state => state;

export const initialState = {
  data: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD:
      return state.data.push(action.payload);
    case REMOVE:
      return state;
    case EDIT:
      return state;
    default:
      return state;
  }
}
