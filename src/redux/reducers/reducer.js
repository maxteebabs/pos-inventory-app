   /* eslint-disable */
//    import { combineReducers } from 'redux';
    import { ADD_USER  } from '../actionTypes';

    const initialState = {
        token: null,
        email: null,
        fullname: '',
        isActive: null,
        isAdmin: false,
        id: '',
    };
    export default function reducers( state = initialState, action) {
        switch(action.type) {
            case ADD_USER:
                return {
                    ...state,
                    email: action.user.email,
                    fullname: action.user.fullname,
                    id: action.user.id,
                    isActive: action.user.isActive,
                    isAdmin: action.user.isAdmin,
                    token: action.user.token,
                };
            default:
                return state;
        }
    }
    // const reducers = combineReducers({ reducer });
    // export default reducers;