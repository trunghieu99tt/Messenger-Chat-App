import React, { Component } from "react";
import { connect } from "react-redux";
import MessagesListPanel from "./components/MessagesListPanel/MessagesListPanel";
import MessagesPanel from "./components/MessagesPanel/MessagesPanel";
import UserPanel from "./components/UserPanel/UserPanel";
import firebase from "./firebase";
import { saveUsers } from "./redux/actions/user.action";

class App extends Component {
	// console.log("currentChannel", currentChannel);
	// console.log("currentUser", currentUser);
	// console.log("isPrivateChannel", isPrivateChannel);

	state = {
		usersRef: firebase.database().ref("users"),
		connectedRef: firebase.database().ref(".info/connected"),
		presenceRef: firebase.database().ref("presence"),
		users: [],
	};

	componentDidMount() {
		const { currentUser } = this.props;
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
				// console.log("snap", snap);
				let user = snap.val();
				user["uid"] = snap.key;
				user["status"] = "offline";
				loadedUsers.push(user);
				// console.log("loadedUsers", loadedUsers);
				this.setState({ users: loadedUsers });
				saveUsers(loadedUsers);
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
		console.log("users", users);
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

	// console.log("users", users);
	render() {
		const { currentUser, currentChannel } = this.props;
		const { users } = this.state;

		// console.log("users", users);

		// console.log("currentChannel", currentChannel);

		return (
			<React.Fragment>
				<div className="row app">
					<div className="col-lg-3">
						<UserPanel
							currentUser={currentUser}
							otherUsers={users}
						/>
					</div>

					<div
						className="col-lg-3"
						style={{
							borderLeft: "1px solid #e6e6e6",
							borderRight: "1px solid #e6e6e6",
						}}
					>
						<MessagesListPanel
							user={currentUser}
							otherUsers={users}
						/>
					</div>

					<div className="col-lg-6">
						<MessagesPanel
							currentChannel={currentChannel}
							currentUser={currentUser}
						/>
					</div>

					{/* <div className="col-lg-2">
					<ContactInforPanel />
				</div> */}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => ({
	currentUser: state.user.currentUser,
	currentChannel: state.channel.currentChannel,
	isPrivateChannel: state.channel.isPrivateChannel,
});

export default connect(mapStateToProps, { saveUsers })(App);
