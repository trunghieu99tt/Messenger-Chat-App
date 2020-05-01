import { message } from "antd";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import FormInput from "../Form/FormInput";
import SubmitButton from "../Form/SubmitButton";
import Mask from "../Mask/Mask";

export default class login extends Component {
	state = {
		email: "",
		password: "",
		loading: false,
		userRef: firebase.database().ref("users"),
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleSubmit = async (event) => {
		event.preventDefault();

		const { email, password } = this.state;

		this.setState({ loading: true });

		try {
			const signedUser = await firebase
				.auth()
				.signInWithEmailAndPassword(email, password);
			this.setState({ loading: false });
		} catch (err) {
			this.failedAlert(err.message);
			this.setState({ loading: false });
		}
	};

	successAlert = () => message.success("User created successfully");

	failedAlert = (err) => message.error(err);

	render() {
		const { email, password, loading } = this.state;

		// console.log("loading", loading);

		return (
			<React.Fragment>
				<section className="login">
					<div className="container">
						<div className="row form__main">
							<div className="col-lg-6 login__form-container">
								<div className="form__heading">Login</div>

								<form
									onSubmit={this.handleSubmit}
									className="login__form"
								>
									<FormInput
										name="email"
										type="email"
										handleChange={this.handleChange}
										value={email}
										label="Email"
										required
									/>
									<FormInput
										name="password"
										type="password"
										handleChange={this.handleChange}
										value={password}
										label="Password"
										required
									/>
									<SubmitButton
										type="submit"
										onSubmit={this.handleSubmit}
									>
										Sign In
									</SubmitButton>

									<span className="form__add-info">
										Don't have an account ?{" "}
										<Link to="/register">Register</Link>
									</span>
								</form>
							</div>
							<div className="col-lg-6 form__image-container">
								<img
									src={require("../../static/images/register.jpg")}
									alt=""
									className="w-100 login__image "
								/>
							</div>
						</div>
					</div>
					{loading ? <Mask /> : null}
				</section>
			</React.Fragment>
		);
	}
}
