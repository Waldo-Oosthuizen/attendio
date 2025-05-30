import React, { useState, useEffect } from "react";
import StudentCard from "./StudentCard";

import { Plus, GraduationCap } from "lucide-react";
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
    <div className="max-w-6xl mx-auto my-8 px-4 pb-20">
      <div className="overflow-hidden">
        <div className="px-4 md:px-6 py-4 ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-6">
              <GraduationCap className="h-8 w-8 " />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {students.map((student, index) => (
            <StudentCard
              key={student.id || index}
              student={student}
              index={index}
              handleInputChange={handleInputChange}
              toggleEditMode={toggleEditMode}
              handleRemoveRow={handleRemoveRow}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Students;
