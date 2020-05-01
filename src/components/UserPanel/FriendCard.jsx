import { Tag } from "antd";
import React from "react";

const FriendCard = ({ image, name, isOnline, userId }) => {
	return (
		<div className="friend-card" key={`friend-card-${userId}`}>
			<figure className="friend-card__image-container">
				<img
					className={`friend-card__image w-100 rounded ${
						isOnline ? "image-outlined" : ""
					}`}
					src={image}
					alt={`${name} avatar`}
				/>
			</figure>

			<p className="friend-card__name">{name}</p>

			<Tag color={isOnline ? "green" : "red"} className="ml-auto">
				{isOnline ? "Online" : "Offline"}
			</Tag>
		</div>
	);
};

export default FriendCard;
