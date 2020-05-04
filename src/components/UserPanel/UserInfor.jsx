import { LogoutOutlined, MessageOutlined } from "@ant-design/icons";
import React from "react";

const UserInfor = ({ photoURL, displayName, activeToolbarItem }) => {
	return (
		<section className="user-infor">
			<figure className="user-infor__image-container">
				<img
					className="user-infor__image rounded image-outlined"
					src={
						photoURL ||
						require("../../static/images/default-avatar.png")
					}
					alt={`${displayName} avatar`}
				/>
				<figcaption className="user-infor__name">
					<p>{displayName}</p>
				</figcaption>
			</figure>

			<div className="toolbar">
				<div
					className="toolbar-item active"
					toolbaritemid={1}
					onClick={(event) => activeToolbarItem(event, false)}
				>
					<MessageOutlined />
					<span className="toolbar-item__text">Chat</span>
				</div>

				<div
					className="toolbar-item"
					toolbaritemid={3}
					onClick={(event) => activeToolbarItem(event, true)}
				>
					<LogoutOutlined />
					<span className="toolbar-item__text">LogOut</span>
				</div>
			</div>
		</section>
	);
};

export default UserInfor;
