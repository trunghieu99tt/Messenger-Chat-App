import { Tag } from "antd";
import React, { Component } from "react";
import Search from "../Search";

export default class MessagesPanelHeader extends Component {
	render() {
		const { channel, handleSearchChange, searchLoading } = this.props;

		return (
			<section className="messages-panel-header">
				<div className="row align-items-center">
					<div className="col-lg-5">
						{channel && (
							<figure className="messages-panel-header__image-container">
								<img
									src={channel?.avatar ?? ""}
									alt={channel?.name ?? "user avatar"}
									className="rounded messages-panel-header__image"
								/>
								<figcaption className="messages-panel-header__infor">
									<p className="messages-panel-header__name">
										{channel?.name || "Unknown"}
									</p>
									<Tag
										color={
											channel?.status === "online"
												? "green"
												: "red"
										}
										className="messages-panel-header__status"
									>
										{channel?.status ?? "offline"}
									</Tag>
								</figcaption>
							</figure>
						)}
					</div>

					<div className="col-lg-7">
						<Search handleSearchChange={handleSearchChange} />
					</div>
				</div>
			</section>
		);
	}
}
