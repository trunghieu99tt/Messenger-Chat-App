import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../redux/actions/channel.action";

class FriendsList extends Component {
	state = {
		usersList: [],
	};

	componentDidUpdate(prevProps) {
		if (this.props.userList !== prevProps.userList) {
			this.setState({ usersList: this.props.userList }, () => {
				const { usersList } = this.state;
				console.log("typeof userList", typeof usersList);
				console.log("usersList.length", usersList.length);
				console.log("this.state.usersList", this.state.usersList);
			});
		}
	}

	render() {
		const { userList, setCurrentChannel, users } = this.props;
		const { usersList } = this.state;

		console.log("usersList", usersList);
		console.log("users", users);

		return (
			<section className="friends-list">
				<header className="friends-list__header">
					<h3>Friends({userList?.length ?? 0}) </h3>
				</header>

				<div className="friends-list__main-list">
					{/* {userList?.length > 0 &&
						userList[0] &&
						Object.values(userList[0]).map((item) => {
							const { avatar, name, status, uid } = item;
							return (
								<FriendCard
									image={avatar}
									name={name}
									isOnline={status === "online"}
									userId={uid}
									onClick={setCurrentChannel(item)}
								/>
							);
						})} */}
				</div>
			</section>
		);
	}
}

const mapStateToProps = (state) => ({
	users: state.user.users,
});

export default connect(mapStateToProps, { setCurrentChannel })(FriendsList);
