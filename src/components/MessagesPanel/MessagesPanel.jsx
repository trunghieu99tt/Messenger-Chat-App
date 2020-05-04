import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import MessageForm from "./MessageForm";
import MessagesPanelHeader from "./MessagesPanelHeader";
import MessagesPanelMain from "./MessagesPanelMain";

class MessagesPanel extends Component {
	state = {
		messagesRef: firebase.database().ref("messages"),
		user: this.props.currentUser,
		messages: [],
		progressBar: false,
		messagesLoading: true,
		numUniqueUsers: "",
		searchTerm: "",
		searchLoading: false,
		searchResults: [],
	};

	componentDidMount() {
		const { currentUser, currentChannel } = this.props;
		currentChannel && currentUser && this.addListeners(currentChannel.uid);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { currentUser, currentChannel } = nextProps;
		console.log("currentChannel from nextProps", currentChannel);
		currentChannel && currentUser && this.addListeners(currentChannel.uid);
	}

	addListeners = (channelId) => {
		this.addMessageListener(channelId);
	};

	addMessageListener = (channelId) => {
		const { currentUser } = this.props;
		const { messagesRef } = this.state;
		let loadedMessages = [];
		const ref = messagesRef;
		ref.child(channelId)
			.child(currentUser.uid)
			.on("child_added", (snap) => {
				loadedMessages.push(snap.val());
				this.setState({
					messages: loadedMessages,
					messagesLoading: false,
				});
			});
	};

	handleSearchChange = (event) => {
		this.setState(
			{
				searchTerm: event.target.value,
				searchLoading: true,
			},
			() => this.handleSearchMessages()
		);
	};

	handleSearchMessages = (event) => {
		event.preventDefault();
		const channelMessages = [...this.state.messages];
		const regex = new RegExp(this.state.searchTerm, "gi");
		const searchResults = channelMessages.reduce((acc, message) => {
			if (
				(message && message.content && message.content.match(regex)) ||
				message?.sentBy?.name.match(regex)
			) {
				acc.push(message);
			}
			return acc;
		}, []);
		this.setState({ searchResults });
		setTimeout(() => {
			this.setState({ searchLoading: false });
		}, 1000);
	};

	render() {
		const {
			messagesRef,
			user,
			messages,
			searchResults,
			searchTerm,
			searchLoading,
		} = this.state;

		const { currentChannel, currentUser } = this.props;

		console.log("currentChannel", currentChannel);

		// console.log("messages", messages);

		return (
			<section className="messages-panel">
				<MessagesPanelHeader
					channel={currentChannel ?? null}
					handleSearchChange={this.handleSearchChange}
					searchLoading={searchLoading}
				/>
				<MessagesPanelMain
					messages={messages}
					searchResults={searchResults}
					currentUser={currentUser}
					currentChannel={currentChannel}
				/>
				<MessageForm
					messagesRef={messagesRef}
					currentChannel={currentChannel}
					user={currentUser}
					isProgressBarVisible={this.isProgressBarVisible}
				></MessageForm>
			</section>
		);
	}
}

const mapStateToProps = (state) => ({
	currentChannel: state.channel.currentChannel,
});

export default connect(mapStateToProps)(MessagesPanel);
