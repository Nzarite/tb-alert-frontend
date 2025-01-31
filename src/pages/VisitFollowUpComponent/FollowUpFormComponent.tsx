import "./FollowUpFormComponent.css";

interface FollowUpFormComponentProps {
	index: number;
}

const FollowUpFormComponent = ({ index }: FollowUpFormComponentProps) => {
	// const { register, handleSubmit } = useForm();

	// const formSubmitHandler = () => {};

	return (
		<form id="follow-up-form">
			<h2 className="form-title">Follow Up {index}</h2>

			<div className="form-section">
				<div className="form-group">
					<label htmlFor="follow-up-date">Follow Up Date</label>
					<input
						type="date"
						id="follow-up-date"
						// {...register("followUpDate", { required: "true" })}
					/>
				</div>
			</div>

			<div className="form-section">
				<div className="form-group">
					<label htmlFor="followup-notes">Follow Up Notes</label>
					<textarea
						id="followup-notes"
						rows={4}
						placeholder="Enter detailed follow-up notes here..."
						// {...register("followUpNotes", { required: "true" })}
					/>
				</div>
			</div>

			<div className="form-row">
				<div>
					<div className="checkbox-group">
						<input type="checkbox" id="is-alive-input" />
						<label htmlFor="is-alive-input">Is Patient Alive?</label>
					</div>
					<div className="checkbox-group">
						<input type="checkbox" id="is-alive-input" />
						<label htmlFor="is-alive-input">Checkbox 2</label>
					</div>
					<div className="checkbox-group">
						<input type="checkbox" id="is-alive-input" />
						<label htmlFor="is-alive-input">Checkbox 3</label>
					</div>
					<div className="checkbox-group">
						<input type="checkbox" id="is-alive-input" />
						<label htmlFor="is-alive-input">Checkbox 4</label>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="dosage-missed-input">Missed Dosage</label>
					<input
						type="number"
						id="dosage-missed-input"
						placeholder="Enter number of doses missed"
						min="0"
						// {...register("missedDoses", { required: "true" })}
					/>
				</div>
			</div>

			<div className="form-actions">
				<button type="button" className="btn cancel-btn">
					Cancel
				</button>
				<button type="submit" className="btn submit-btn">
					Submit
				</button>
			</div>
		</form>
	);
};

export default FollowUpFormComponent;
