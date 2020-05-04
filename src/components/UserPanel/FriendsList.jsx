import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../redux/actions/channel.action";
import FriendCard from "./FriendCard";

class FriendsList extends Component {
	state = {
		usersList: [],
	};

	handleClick = (item) => {
		const { setCurrentChannel } = this.props;
		setCurrentChannel(item);
	};

	render() {
		const { userList, setCurrentChannel, users } = this.props;

		return (
			<section className="friends-list">
				<header className="friends-list__header">
					<h3>Friends({userList?.length ?? 0}) </h3>
				</header>

				<div className="friends-list__main-list">
					{userList?.length &&
						userList.map((item) => {
							const { avatar, name, status, uid } = item;
							return (
								<FriendCard
									image={avatar}
									name={name}
									isOnline={status === "online"}
									userId={uid}
									handleClick={() => this.handleClick(item)}
								/>
							);
						})}
				</div>
			</section>
		);
	}
}

const mapStateToProps = (state) => ({
	users: state.user.users,
});

export default connect(mapStateToProps, { setCurrentChannel })(FriendsList);
