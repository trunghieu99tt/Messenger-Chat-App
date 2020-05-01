import { Badge } from "antd";
import React from "react";

const MessageListCard = ({ image, name, lastMessage, currentChatting }) => {
	return (
		<div className="messages-list-card">
			<figure className="messages-list-card__image-container">
				<img
					className={`${
						currentChatting ? "image-outlined" : ""
					} rounded messages-list-card__image`}
					src={
						image ||
						require("../../static/images/default-avatar.png")
					}
					alt={`${name} avatar`}
				/>
			</figure>

			<div className="messages-list-card__infor">
				<p className="messages-list-card__username">{name}</p>
				<p className="messages-list-card__lastMessage">{lastMessage}</p>
			</div>

			<div className="ml-auto">
				<Badge count={5} />
				<p>Time</p>
			</div>
		</div>
	);
};

export default MessageListCard;
