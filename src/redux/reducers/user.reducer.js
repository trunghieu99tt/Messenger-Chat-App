import * as actionTypes from "../types/index.types";

const INITIAL_STATE = {
	users: [],
	currentUser: null,
	isLoading: true,
};

const userReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case actionTypes.SET_USER:
			return {
				...state,
				currentUser: action.payload.currentUser,
				isLoading: false,
			};
		case actionTypes.CLEAR_USER:
			return {
				...state,
				currentUser: null,
				isLoading: false,
			};
		case actionTypes.SAVE_USERS:
			return {
				...state,
				users: action.payload.users,
			};
		default:
			return state;
	}
};

export default userReducer;
