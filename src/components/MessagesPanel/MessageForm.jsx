import { FileImageOutlined } from "@ant-design/icons";
import mime from "mime-types";
import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import firebase from "../../firebase";

export default class MessageForm extends Component {
	state = {
		message: "",
		loading: false,
		errors: [],
		uploadState: "",
		uploadTask: null,
		storageRef: firebase.storage().ref(),
		percentUploaded: 0,
		file: null,
		authorized: ["image/jpeg", "image/png"],
	};

	handleChange = (event) =>
		this.setState({
			[event.target.name]: event.target.value,
		});

	createMessage = (fileURL = false) => {
		const { message } = this.state;
		const { user } = this.props;
		const newMessage = {
			timestamp: firebase.database.ServerValue.TIMESTAMP,
			time: new Date(),
			content: message,
			sentBy: {
				id: user?.uid || Math.random(),
				name: user?.displayName || "Unknown",
				avatar: user?.photoUrl || "Unknown",
			},
		};

		// console.log("newMessage", newMessage);

		if (fileURL) {
			newMessage["image"] = fileURL;
		}

		return newMessage;
	};

	sendMessage = async (event) => {
		event.preventDefault();

		const { messagesRef, currentChannel, user } = this.props;

		const { message } = this.state;

		if (message) {
			this.setState({ loading: true });
			try {
				await messagesRef
					.child(currentChannel.uid)
					.child(user.uid)
					.push()
					.set(this.createMessage());
				await messagesRef
					.child(user.uid)
					.child(currentChannel.uid)
					.push()
					.set(this.createMessage());
				this.setState({
					loading: false,
					message: "",
					errors: [],
				});
			} catch (err) {
				console.log("err", err);
				this.setState({
					loading: false,
					message: "",
					errors: [...this.state.errors, err],
				});
			}
		} else {
			this.setState({
				errors: [...this.state.errors, { message: "Add a message" }],
			});
		}
	};

	getPath = () => {
		// if (this.props.isPrivateChannel) {
		// 	return `chat/private-${this.state.channel.id}`;
		// }
		return "messages/users";
	};

	uploadFile = (file, metaData) => {
		const { currentChannel, messagesRef, user } = this.props;
		const pathToUpload = currentChannel.uid;
		const pathToUpload1 = user.uid;
		const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

		// console.log("this.state.storageRef", this.state.storageRef);

		this.setState(
			{
				uploadState: "uploading",
				uploadTask: this.state.storageRef
					.child(filePath)
					.put(file, metaData),
			},
			() => {
				this.state.uploadTask.on(
					"state_changed",
					(snap) => {
						const percentUploaded =
							Math.round(
								snap.bytesTransferred / snap.totalBytes
							) * 100;

						// console.log("percentUploaded", percentUploaded);
						// this.props.isProgressBarVisible(percentUploaded);
						this.setState({ percentUploaded });
					},
					(err) => {
						console.log("err", err);
						this.setState({
							errors: [...this.state.errors, err],
							uploadState: "error",
							uploadTask: null,
						});
					},
					() => {
						console.log(
							"this.state.uploadTask.snapshot",
							this.state.uploadTask.snapshot
						);

						this.state.uploadTask.snapshot.ref
							.getDownloadURL()
							.then((downloadUrl) => {
								this.sendFileMessage(
									downloadUrl,
									messagesRef,
									pathToUpload,
									pathToUpload1
								);
							})
							.catch((err) => {
								console.log("err", err);
								this.setState({
									errors: [...this.state.errors, err],
									uploadState: "error",
									uploadTask: null,
								});
							});
					}
				);
			}
		);
	};

	sendFileMessage = (fileUrl, ref, pathToUpload, pathToUpload1) => {
		ref.child(pathToUpload)
			.child(pathToUpload1)
			.push()
			.set(this.createMessage(fileUrl))
			.then(() => this.setState({ uploadState: "done" }))
			.catch((err) => {
				console.log("err: ", err);
				this.setState({
					errors: [...this.state.errors, err],
				});
			});
		ref.child(pathToUpload1)
			.child(pathToUpload)
			.push()
			.set(this.createMessage(fileUrl))
			.then(() => this.setState({ uploadState: "done" }))
			.catch((err) => {
				console.log("err: ", err);
				this.setState({
					errors: [...this.state.errors, err],
				});
			});
	};

	addFile = (event) => {
		const file = event.target.files[0];
		console.log("file", file);
		if (file) {
			this.setState({ file }, () => this.sendFile());
		}
	};

	sendFile = () => {
		const { file } = this.state;
		// console.log("MessageForm -> sendFile -> file", file);

		if (file !== null) {
			if (this.isAuthorized(file.name)) {
				const metaData = {
					contentType: mime.lookup(file.name),
				};
				this.uploadFile(file, metaData);
				this.clearFile();
			}
		}
	};

	isAuthorized = (fileName) =>
		this.state.authorized.includes(mime.lookup(fileName));

	clearFile = () => this.setState({ file: null });

	render() {
		const { message } = this.state;
		const { currentChannel } = this.props;

		// console.log("currentChannel", currentChannel);

		return (
			<form className="message-form" onSubmit={this.sendMessage}>
				<input
					type="text"
					name="message"
					placeholder="Type your message here..."
					className="message-form__input"
					onChange={this.handleChange}
					value={message}
				/>
				<span>
					<label
						htmlFor="upload-photo"
						className="message-form__file-label"
					>
						<FileImageOutlined />
					</label>
					<input
						type="file"
						name="file"
						id="upload-photo"
						className="message-form__file"
						onChange={this.addFile}
					/>
				</span>
			</form>
		);
	}
}
