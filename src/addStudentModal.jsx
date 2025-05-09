import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

const AddStudentModal = ({ isOpen, closeModal, addStudent, studentToEdit }) => {
  const [name, setName] = useState("");
  const [instrument, setInstrument] = useState("");
  const [day, setDay] = useState("");

  // Reset form fields when modal is closed or when studentToEdit changes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setInstrument("");
      setDay("");
    } else if (studentToEdit) {
      setName(studentToEdit.name || "");
      setInstrument(studentToEdit.instrument || "");
      setDay(studentToEdit.day || "");
    }
  }, [isOpen, studentToEdit]); // Depend on isOpen and studentToEdit

  const handleSubmit = (e) => {
    e.preventDefault();
    addStudent({ name, instrument, day });
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {studentToEdit ? "Edit Student" : "Add New Student"}
          </h3>
          <button onClick={closeModal}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="instrument"
              className="block text-sm font-medium text-gray-700">
              Instrument
            </label>
            <input
              id="instrument"
              type="text"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              placeholder="Enter instrument"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="day"
              className="block text-sm font-medium text-gray-700">
              Day
            </label>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required>
              <option value="">Select Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue text-white px-4 py-2 rounded-md">
              {studentToEdit ? "Update Student" : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
