import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import firebase from "../../firebase";
import FriendsList from "./FriendsList";
import UserInfor from "./UserInfor";

class UserPanel extends Component {
	state = {
		connectedRef: firebase.database().ref(".info/connected"),
		presenceRef: firebase.database().ref("presence"),
		users: [],
		usersRef: firebase.database().ref("users"),
	};

	componentDidMount() {
		const { currentUser } = this.props;
		if (!currentUser) this.props.history.push("/login");
		if (currentUser) {
			this.addListener(currentUser.uid);
		}
	}

	addListener = (currentUserUid) => {
		let loadedUsers = [];

		const { usersRef, connectedRef, presenceRef } = this.state;
		const { saveUsers } = this.props;

		usersRef.on("child_added", (snap) => {
			if (currentUserUid !== snap.key) {
				let user = snap.val();
				user["uid"] = snap.key;
				user["status"] = "offline";
				loadedUsers.push(user);
				console.log("loadedUsers", loadedUsers);
				this.setState({ users: loadedUsers });
			}
		});
		connectedRef.on("value", (snap) => {
			if (snap.val()) {
				const ref = presenceRef.child(currentUserUid);
				ref.set(true);
				ref.onDisconnect().remove((err) => {
					if (err !== null) {
						console.log("err", err);
					}
				});
			}
		});

		presenceRef.on("child_added", (snap) => {
			if (currentUserUid !== snap.key) {
				this.addStatusToUser(snap.key);
			}
		});

		presenceRef.on("child_removed", (snap) => {
			if (currentUserUid !== snap.key) {
				this.addStatusToUser(snap.key, false);
			}
		});
	};

	addStatusToUser = (userId, connected = true) => {
		const { users } = this.state;
		const { setUsers } = this.props;

		const updatedUsers = users.reduce((acc, user) => {
			if (user.uid === userId) {
				user["status"] = `${connected ? "online" : "offline"}`;
			}
			return [...acc, user];
		}, []);

		if (typeof setUsers === "function") {
			setUsers(updatedUsers);
		}
	};

	isUserOnline = (user) => user.status === "online";

	changeChannel = (user) => {
		const channelId = this.getChannelId(user.uid);
		const channelData = {
			id: channelId,
			name: user.name,
		};
		this.props.setCurrentChannel(channelData);
		this.props.setPrivateChannel(true);
		this.setActiveChannel(user.uid);
	};

	setActiveChannel = (userId) => {
		this.setState({ activeChannel: userId });
	};

	getChannelId = (userId) => {
		const currentUserId = this.state.user.uid;
		return userId < currentUserId
			? `${userId}/${currentUserId}`
			: `${currentUserId}/${userId}`;
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

	render() {
		const { currentUser, history, otherUsers } = this.props;
		const { allUsers, users } = this.state;

		// console.log("users", users);

		// console.log("otherUsers", otherUsers);
		// console.log("allUsers", allUsers);

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
					<FriendsList userList={users} key={Math.random()} />
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
