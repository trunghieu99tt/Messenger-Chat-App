import { combineReducers } from "redux";
import channelReducer from "./channel.reducer";
import userReducer from "./user.reducer";

const rootReducer = combineReducers({
	user: userReducer,
	channel: channelReducer,
});

export default rootReducer;
