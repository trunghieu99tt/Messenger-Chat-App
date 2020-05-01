import mime from "mime-types";
import React, { Component } from "react";

export default class FileModal extends Component {
	state = {
		file: null,
		authorized: ["image/jpeg", "image/png"],
	};

	addFile = (event) => {
		const file = event?.target?.files[0] ?? null;

		if (file) {
			this.setState({ file });
		}
	};

	sendFile = () => {
		const { file } = this.state;

		const { uploadFile, closeModal } = this.props;

		if (file !== null) {
			if (this.isAuthorized(file.name)) {
				const metaData = {
					contentType: mime.lookup(file.name),
				};
				uploadFile(file, metaData);
				closeModal();
				this.clearFile();
			}
		}
	};

	isAuthorized = (fileName) =>
		this.state.authorized.includes(mime.lookup(fileName));

	clearFile = () => this.setState({ file: null });

	render() {
		return <div></div>;
	}
}
