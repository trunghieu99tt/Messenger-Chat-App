import * as actionTypes from "../types/index.types";

export const setUser = (user) => {
	return {
		type: actionTypes.SET_USER,
		payload: {
			currentUser: user,
		},
	};
};

export const clearUser = () => {
	return {
		type: actionTypes.CLEAR_USER,
	};
};

export const saveUsers = (users) => {
	return {
		type: actionTypes.SAVE_USERS,
		payload: {
			users,
		},
	};
};
