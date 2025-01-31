import { useState } from "react";
import FollowUpFormComponent from "./FollowUpFormComponent";
import "./VisitFollowUpPage.css";

const VisitFollowUpPage = () => {
	const [noOfFollowUps, setNoOfFollowUps] = useState(8);

	return (
		<div className="visit-follow-up-page">
			{Array.from({ length: noOfFollowUps }).map((_, index) => (
				<FollowUpFormComponent key={index} index={index + 1} />
			))}
			<div style={{ width: "30%", display: "flex", justifyContent: "space-evenly" }}>
				<button
					className="btn remove-btn"
					style={{ width: "40%" }}
					onClick={() => setNoOfFollowUps(Math.max(8, noOfFollowUps - 1))}>
					Remove
				</button>
				<button
					className="btn submit-btn"
					style={{ width: "40%" }}
					onClick={() => setNoOfFollowUps(Math.max(8, noOfFollowUps + 1))}>
					Add
				</button>
			</div>
		</div>
	);
};

export default VisitFollowUpPage;
