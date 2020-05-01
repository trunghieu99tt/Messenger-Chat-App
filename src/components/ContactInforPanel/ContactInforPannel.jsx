import React, { Component } from "react";
import ContactInfor from "./ContactInfor";
import Toolbar from "./Toolbar";

export default class ContactInforPanel extends Component {
	render() {
		return (
			<section className="contact-infor-panel">
				<ContactInfor />
				<Toolbar />
			</section>
		);
	}
}
