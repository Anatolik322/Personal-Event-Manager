import React from "react";
import logo from "./logo.svg";
import "./App.css";
import EventManager from "./components/table/Table";
import Header from "./components/header/Header";
import "react-toastify/dist/ReactToastify.css";
function App() {
	return (
		<div className="Ap">
			<Header />
			<EventManager />
		</div>
	);
}

export default App;
