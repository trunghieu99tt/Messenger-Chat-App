import React from "react";

const SubmitButton = ({ children, ...otherProps }) => (
	<button className="button--1" {...otherProps}>
		{children}
	</button>
);

export default SubmitButton;
