export const ADD = 'personal/add';
export const REMOVE = 'personal/remove';
export const EDIT = 'personal/edit';

export const add = data => ({ type: ADD, payload: data });
export const remove = data => ({ type: REMOVE, payload: data });
export const edit = data => ({ type: EDIT, payload: data });

export const getPersonal = state => state;

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
