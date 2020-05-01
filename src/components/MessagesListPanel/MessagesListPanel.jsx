import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import Search from "../Search";
import MessageListCard from "./MessageListCard";

class MessagesListPanel extends Component {
	state = {
		messagesRef: firebase.database().ref("messages"),
		usersRef: firebase.database().ref("users"),
		users: [],
		messages: [],
	};

	componentDidMount() {
		const { currentUser } = this.props;
		currentUser && this.addListeners(currentUser.uid);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { currentUser } = nextProps;
		currentUser && this.addListeners(currentUser.uid);
	}

	addListeners = (channelId) => {
		this.addMessageListener(channelId);
	};

	addMessageListener = (channelId) => {
		const { messagesRef } = this.state;
		// console.log("channelId", channelId);
		let loadedMessages = [];
		let users = [];
		const ref = messagesRef;
		ref.child(channelId).on("child_added", (snap) => {
			const { key } = snap;
			if (!users.includes(key)) {
				loadedMessages.push({
					messages: snap.val(),
					userId: key,
				});
				users.push(key);
				this.setState({
					messages: loadedMessages,
					users: users,
					messagesLoading: false,
				});
			}
		});
	};

	render() {
		const { otherUsers } = this.props;
		const { messages, users } = this.state;

		// console.log("messages", messages);
		// console.log("users", users);

		return (
			<section className="messages-list-panel">
				<Search />
				<div className="messages-list-panel__main">
					{otherUsers
						?.filter((user) => users.includes(user.uid))
						.map((item, index) => {
							const { avatar, name } = item;

							return (
								<MessageListCard
									name={name || ""}
									image={avatar || ""}
									currentChatting={index === 0}
									lastMessage="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam alias laborum praesentium quasi eum ipsum ipsa at asperiores ut eveniet, suscipit repudiandae voluptatibus repellendus velit perspiciatis soluta unde magni dolor."
								/>
							);
						})}
				</div>
			</section>
		);
	}
}

const mapStateToProps = (state) => ({
	currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(MessagesListPanel);
