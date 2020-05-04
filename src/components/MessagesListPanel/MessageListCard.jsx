import React from "react";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../redux/actions/channel.action";

const isImage = (message) => {
	return message?.hasOwnProperty("image");
};

const MessageListCard = ({
	image,
	name,
	lastMessage,
	currentChatting,
	handleClick,
}) => {
	return (
		<div className="messages-list-card" onClick={handleClick}>
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
				<p className="messages-list-card__lastMessage">
					{isImage(lastMessage)
						? `${name} đã gửi 1 ảnh`
						: `${lastMessage?.content || ""}`}
				</p>
			</div>

			{/* <div className="ml-auto">
				<Badge count={5} />
				<p>Time</p>
			</div> */}
		</div>
	);
};

export default connect(null, { setCurrentChannel })(MessageListCard);
