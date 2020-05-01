import React, { Component } from "react";
import Message from "./Message";

export default class MessagesPanelMain extends Component {
	state = {
		showMessages: [],
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { messages } = nextProps;
		this.setState({ showMessages: messages });
		this.updateScroll();
		// this.displayMessage(messages);
	}

	componentDidMount() {
		this.updateScroll();
	}

	updateScroll = () => {
		const container = document.querySelector(".messages-panel-main");

		if (container && container.scrollTop && container.scrollHeight)
			container.scrollTop = container.scrollHeight;
	};

	render() {
		const { currentUser, currentChannel } = this.props;
		const { showMessages } = this.state;

		// console.log("showMessages", showMessages);

		return (
			<section className="messages-panel-main">
				{showMessages?.length > 0 &&
					showMessages.map((message) => (
						<Message
							key={message.timestamp}
							message={message}
							user={currentUser}
							channel={currentChannel}
						/>
					))}
			</section>
		);
	}
}
