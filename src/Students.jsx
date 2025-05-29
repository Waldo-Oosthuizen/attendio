import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Save,
  Music2,
  Calendar,
  User,
} from "lucide-react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase-config";

const Students = () => {
  const [students, setStudents] = useState([]);
  const studentsCollectionRef = collection(db, "students");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(studentsCollectionRef);
        const studentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isEditable: false,
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students: ", error);
      }
    };

    fetchStudents();
  }, []);

  const handleAddRow = () => {
    const newStudent = { name: "", instrument: "", day: "", isEditable: true };
    setStudents([newStudent, ...students]);
  };

  const handleInputChange = (e, index, field) => {
    const { value } = e.target;
    const updatedStudents = students.map((student, i) =>
      i === index ? { ...student, [field]: value } : student
    );
    setStudents(updatedStudents);
  };

  const toggleEditMode = async (index) => {
    const student = students[index];
    const updatedStudents = students.map((s, i) =>
      i === index ? { ...s, isEditable: !s.isEditable } : s
    );

    if (student.isEditable) {
      try {
        if (student.id) {
          await updateDoc(doc(db, "students", student.id), {
            name: student.name,
            instrument: student.instrument,
            day: student.day,
          });
        } else {
          const docRef = await addDoc(studentsCollectionRef, {
            name: student.name,
            instrument: student.instrument,
            day: student.day,
          });
          updatedStudents[index].id = docRef.id;
        }
      } catch (error) {
        console.error("Error saving document: ", error);
        return;
      }
    }

    setStudents(updatedStudents);
  };

  const handleRemoveRow = async (index) => {
    try {
      const student = students[index];
      if (student.id) {
        await deleteDoc(doc(db, "students", student.id));
      }
      const updatedStudents = students.filter((_, i) => i !== index);
      setStudents(updatedStudents);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Students
            </h2>
            <button
              onClick={handleAddRow}
              className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue text-white rounded-md transition-colors duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </button>
          </div>
        </div>

        {/* Desktop view - Traditional table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instrument
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.isEditable ? (
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => handleInputChange(e, index, "name")}
                        placeholder="Enter Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    ) : (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {student.name || "Not specified"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.isEditable ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={student.instrument}
                          onChange={(e) =>
                            handleInputChange(e, index, "instrument")
                          }
                          placeholder="Enter Instrument"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          {student.instrument || "Not specified"}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.isEditable ? (
                      <select
                        value={student.day}
                        onChange={(e) => handleInputChange(e, index, "day")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                      </select>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                        {student.day || "Not selected"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleEditMode(index)}
                        className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          student.isEditable
                            ? "bg-green hover:bg-green-700 text-white"
                            : "bg-blue hover:bg-blue-700 text-white"
                        }`}>
                        {student.isEditable ? (
                          <>
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </>
                        ) : (
                          <>
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveRow(index)}
                        className="inline-flex items-center px-3 py-2 bg-red text-white rounded-md transition-colors duration-200">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile view - Card layout */}
        <div className="md:hidden">
          <div className="grid grid-cols-1 gap-4 p-4">
            {students.map((student, index) => (
              <div
                key={student.id || index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                {student.isEditable ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => handleInputChange(e, index, "name")}
                        placeholder="Enter Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Instrument
                      </label>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={student.instrument}
                          onChange={(e) =>
                            handleInputChange(e, index, "instrument")
                          }
                          placeholder="Enter Instrument"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day
                      </label>
                      <select
                        value={student.day}
                        onChange={(e) => handleInputChange(e, index, "day")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 flex justify-between">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium  text-gray-900">
                        {student.name || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Music2 className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {student.instrument || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="inline-flex px-2 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                        {student.day || "Not selected"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex   ">
                  <button
                    onClick={() => toggleEditMode(index)}
                    className={`w-2/3 mr-2 inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      student.isEditable
                        ? "bg-green  text-white"
                        : "bg-blue  text-white"
                    }`}>
                    {student.isEditable ? (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </>
                    ) : (
                      <>
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="w-2/3 bg-red  text-white mr-2 inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
