import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from "../../firebase";
import FriendsList from "./FriendsList";
import UserInfor from "./UserInfor";

class UserPanel extends Component {
	state = {
		allUsers: [],
	};

	activeToolbarItem = (event, isLogout) => {
		const toolbarId = event?.target?.getAttribute("toolbaritemid") ?? 0;
		const toolbarItems = document.querySelectorAll(".toolbar-item");
		toolbarItems.forEach((item) => {
			const id = item?.getAttribute("toolbaritemid");
			if (id === toolbarId) {
				item.classList.add("active");
			} else {
				item.classList.remove("active");
			}
		});

		if (isLogout) {
			this.handleSignOut();
		}
	};

	handleSignOut = () =>
		firebase
			.auth()
			.signOut()
			.then(() => console.log("Signed out!"));

	componentDidMount() {
		const { currentUser } = this.props;
		if (!currentUser) this.props.history.push("/login");
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { otherUsers } = nextProps;
		console.log("nextProps", nextProps);
		this.setState({ allUsers: otherUsers }, () => {
			console.log("this.state.allUsers", this.state.allUsers);
		});
	}

	render() {
		const { currentUser, history, otherUsers, users } = this.props;
		const { allUsers } = this.state;

		console.log("otherUsers", otherUsers);

		if (!currentUser) {
			history.push("/login");
		} else {
			const { displayName, photoURL } = currentUser;

			// console.log("currentUser", currentUser);

			return (
				<React.Fragment>
					<UserInfor
						photoURL={photoURL}
						displayName={displayName}
						activeToolbarItem={this.activeToolbarItem}
					/>
					<FriendsList userList={allUsers} />
				</React.Fragment>
			);
		}

		return null;
	}
}

const mapStateToProps = (state) => ({
	currentUser: state.user.currentUser,
	users: state.user.users,
});

export default withRouter(connect(mapStateToProps)(UserPanel));
