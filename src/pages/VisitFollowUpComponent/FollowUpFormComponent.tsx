import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./FollowUpFormComponent.css";

interface FollowUpFormComponentProps {
	index: number;
}

const schema = z.object({
	followUpDate: z
		.string()
		.min(1, { message: "This field is required" })
		.refine(
			(value) => {
				const selectedDate = new Date(value);
				const today = new Date();
				return selectedDate <= today;
			},
			{ message: "Date must be in the past" }
		),
	followUpNotes: z.string().min(10, { message: "Please enter at least 10 characters" }),
	checkbox1: z.boolean(),
	checkbox2: z.boolean(),
	checkbox3: z.boolean(),
	checkbox4: z.boolean(),
	missedDoses: z
		.number({ invalid_type_error: "The field cannot be empty" })
		.min(0, { message: "Missed Doses can't be negative" }),
});

type FormData = z.infer<typeof schema>;

const FollowUpFormComponent = ({ index }: FollowUpFormComponentProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
	});

	const formSubmitHandler = (data: FormData) => {
		console.log("Submitted Data: ", data);
	};

	return (
		<form id="follow-up-form" onSubmit={handleSubmit(formSubmitHandler)}>
			<h2 className="form-title">Follow Up {index}</h2>

			<div className="form-section">
				<div className="form-group">
					<label htmlFor="follow-up-date">Follow Up Date</label>
					<input type="date" id="follow-up-date" {...register("followUpDate")} />
					{errors.followUpDate && (
						<p className="error-message">{errors.followUpDate.message}</p>
					)}
				</div>
			</div>

			<div className="form-section">
				<div className="form-group">
					<label htmlFor="followup-notes">Follow Up Notes</label>
					<textarea
						id="followup-notes"
						rows={4}
						placeholder="Enter detailed follow-up notes here..."
						{...register("followUpNotes")}
					/>
					{errors.followUpNotes && (
						<p className="error-message">{errors.followUpNotes.message}</p>
					)}
				</div>
			</div>

			<div className="form-row">
				<div>
					<div className="checkbox-group">
						<input type="checkbox" id="checkbox1" {...register("checkbox1")} />
						<label htmlFor="checkbox1">Checkbox 1</label>
					</div>
					<div className="checkbox-group">
						<input type="checkbox" id="checkbox2" {...register("checkbox2")} />
						<label htmlFor="checkbox2">Checkbox 2</label>
					</div>
					<div className="checkbox-group">
						<input type="checkbox" id="checkbox3" {...register("checkbox3")} />
						<label htmlFor="checkbox3">Checkbox 3</label>
					</div>
					<div className="checkbox-group">
						<input type="checkbox" id="checkbox4" {...register("checkbox4")} />
						<label htmlFor="checkbox4">Checkbox 4</label>
					</div>
				</div>

				<div className="form-group">
					<label htmlFor="dosage-missed-input">Missed Dosage</label>
					<input
						type="number"
						id="dosage-missed-input"
						placeholder="Enter number of doses missed"
						{...register("missedDoses", { valueAsNumber: true })}
					/>
					{errors.missedDoses && (
						<p className="error-message">{errors.missedDoses.message}</p>
					)}
				</div>
			</div>

			<div className="form-actions">
				<button type="button" className="btn cancel-btn" onClick={() => reset()}>
					Cancel
				</button>
				<button type="submit" className="btn submit-btn" disabled={!isValid}>
					Submit
				</button>
			</div>
		</form>
	);
};

export default FollowUpFormComponent;
