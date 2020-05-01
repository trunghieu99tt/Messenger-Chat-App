import { SearchOutlined } from "@ant-design/icons";
import React from "react";
const Search = ({ handleSearchChange }) => {
	return (
		<form className="search-bar" onSubmit={handleSearchChange}>
			<input
				type="text"
				placeholder="Search"
				className="search-bar__input"
				onChange={handleSearchChange}
			/>
			<SearchOutlined className="search-bar__icon" />
		</form>
	);
};

export default Search;
