import moment from "moment";
import React from "react";

const isOwnMessage = (message, user) => {
	// console.log("message.sentBy.id", message.sentBy.id);
	// console.log("user", user.id);

	return message?.sentBy?.id === user?.uid ? "message__self" : "";
};

const isOwnImageMessage = (message, user) => {
	return message?.sentBy?.id === user?.uid ? "self" : "not-self";
};

const timeFromNow = (timestamp) => moment(timestamp).fromNow();

const isImage = (message) => {
	return message.hasOwnProperty("image");
};

const Message = ({ message, user }) => {
	return (
		<React.Fragment>
			{isImage(message) ? (
				<div className={`message ${isOwnMessage(message, user)}`}>
					<img
						src={message?.image}
						className={`message__image ${isOwnImageMessage(
							message,
							user
						)}`}
						alt={`${message?.image}`}
					/>
					<p className="message__time">
						{timeFromNow(message.timestamp)}
					</p>
				</div>
			) : (
				<div className={`message ${isOwnMessage(message, user)}`}>
					<figure className="message__user-avatar-container">
						<img
							className="rounded message__user-avatar"
							src={message?.sentBy?.avatar}
							alt=""
						/>
					</figure>

					<div>
						<p>{message?.content}</p>
					</div>

					<p className="message__time">
						{timeFromNow(message.timestamp)}
					</p>
				</div>
			)}
		</React.Fragment>
	);
};

export default Message;
