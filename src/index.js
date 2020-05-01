import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect, Provider } from "react-redux";
import {
	BrowserRouter,
	Redirect,
	Route,
	Switch,
	withRouter,
} from "react-router-dom";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import App from "./App";
import "./App.css";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Mask from "./components/Mask/Mask";
import firebase from "./firebase";
import "./index.css";
import { clearUser, setUser } from "./redux/actions/user.action";
import rootReducer from "./redux/reducers/index.reducer";
import * as serviceWorker from "./serviceWorker";
import "./static/css/main.min.css";

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
	componentDidMount() {
		const { setUser, clearUser } = this.props;

		firebase.auth().onAuthStateChanged((user) => {
			// console.log("user", user);

			if (user) {
				setUser(user);
				this.props.history.push("/");
			} else {
				// console.log("Go here");
				clearUser();
				this.goToLogin();
				this.props.history.push("/login");
			}
		});
	}

	goToLogin = () => <Redirect to="/login" />;

	render() {
		const { isLoading } = this.props;

		return isLoading ? (
			<Mask />
		) : (
			<Switch>
				<Route exact path="/" component={App} {...this.props}></Route>
				<Route exact path="/register" component={Register}></Route>
				<Route exact path="/login" component={Login}></Route>
			</Switch>
		);
	}
}

const mapStateToProps = (state) => ({
	isLoading: state.user.isLoading,
});

const RootWithAuth = withRouter(
	connect(mapStateToProps, { setUser, clearUser })(Root)
);

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<RootWithAuth />
		</BrowserRouter>
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
