import React, { useState } from "react";
import axiosInstance from "../components/axiosInstance";

const Reports: React.FC = () => {
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");

    const handleUpdateFile = async () => {
        try {
            const filters = {
                age: age ? parseInt(age) : 0,
                gender: gender || null,
            };

            await axiosInstance.post("/report/patient/filter", filters);

            console.log("Report file updated successfully in the backend.");
            alert("Patient report updated in local storage.");
        } catch (error) {
            console.error("Error updating report:", error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-4 w-50 border-0 rounded-4">
                <h2 className="text-center mb-4 fw-bold text-primary">Update Patient Report</h2>
                <div className="row">
                    {/* Age Input */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="fw-bold">Age:</label>
                            <input
                                type="number"
                                className="form-control form-control-lg rounded-3 shadow-sm"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Enter Age"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Gender Dropdown */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label className="fw-bold">Gender:</label>
                            <select
                                className="form-control form-control-lg rounded-3 shadow-sm"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 text-center mt-4">
                        <button className="btn btn-primary px-4 py-2 rounded-pill shadow-lg fw-bold" onClick={handleUpdateFile}>
                            Update Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
