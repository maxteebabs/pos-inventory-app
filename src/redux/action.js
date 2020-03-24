import { ADD_USER } from './actionTypes';

export const setUser = user =>  ({
    type: ADD_USER,
    user,
});