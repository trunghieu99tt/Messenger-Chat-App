import { message } from "antd";
import md5 from "md5";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import FormInput from "../Form/FormInput";
import SubmitButton from "../Form/SubmitButton";
import Mask from "../Mask/Mask";

export default class Register extends Component {
	state = {
		username: "",
		email: "",
		password: "",
		passwordConfirm: "",
		loading: false,
		userRef: firebase.database().ref("users"),
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	isPasswordValid = ({ password, passwordConfirm }) =>
		password === passwordConfirm;

	handleSubmit = async (event) => {
		event.preventDefault();

		if (this.isPasswordValid(this.state)) {
			const { email, password, username } = this.state;

			this.setState({ loading: true });

			try {
				const createdUser = await firebase
					.auth()
					.createUserWithEmailAndPassword(email, password);

				await createdUser.user.updateProfile({
					displayName: username,
					photoURL: `https://gravatar.com/avatar/${md5(
						createdUser.user.email
					)}?d=identical`,
				});

				await this.saveUser(createdUser);
				this.successAlert();
				this.setState({ loading: false });
			} catch (err) {
				console.log("err", err);
				this.failedAlert(err.message);
				this.setState({ loading: false });
			}
		}
	};

	successAlert = () => message.success("User created successfully");

	failedAlert = (err) => message.error(err);

	saveUser = (createdUser) => {
		const { userRef } = this.state;
		return userRef.child(createdUser.user.uid).set({
			name: createdUser.user.displayName,
			avatar: createdUser.user.photoURL,
		});
	};

	render() {
		const {
			username,
			email,
			password,
			passwordConfirm,
			loading,
		} = this.state;

		return (
			<React.Fragment>
				<section className="register">
					<div className="container">
						<div className="row form__main">
							<div className="col-lg-6 register__form-container">
								<div className="form__heading">
									Register Now!
								</div>

								<form
									onSubmit={this.handleSubmit}
									className="register__form"
								>
									<FormInput
										name="username"
										type="text"
										handleChange={this.handleChange}
										value={username}
										label="Username"
										required
									/>
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
									<FormInput
										name="passwordConfirm"
										type="password"
										handleChange={this.handleChange}
										value={passwordConfirm}
										label="Confirm Password"
										required
									/>

									<SubmitButton
										type="submit"
										onSubmit={this.handleSubmit}
									>
										Register Now!
									</SubmitButton>

									<span className="form__add-info">
										Do you have an account ?{" "}
										<Link to="/login">Login</Link>
									</span>
								</form>
							</div>
							<div className="col-lg-6 form__image-container">
								<img
									src={require("../../static/images/register.jpg")}
									alt=""
									className="w-100 register__image "
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
