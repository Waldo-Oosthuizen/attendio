import React, { useState, useEffect } from "react";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import {
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  Users,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          attendanceHistory: doc.data().attendanceHistory || [],
        }));
        setStudents(studentList);
        setError(null);
      } catch (error) {
        setError("Failed to fetch students. Please try again later.");
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleAttendance = async (studentId, status) => {
    setUpdating(studentId);
    try {
      const studentRef = doc(db, "students", studentId);
      const attendanceRecord = {
        status,
        timestamp: Timestamp.now(),
        date: new Date().toISOString().split("T")[0],
      };

      await updateDoc(studentRef, {
        attendance: status,
        attendanceHistory: arrayUnion(attendanceRecord),
      });

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? {
                ...student,
                attendance: status,
                attendanceHistory: [
                  ...(student.attendanceHistory || []),
                  attendanceRecord,
                ],
              }
            : student
        )
      );
    } catch (error) {
      setError("Failed to update attendance. Please try again.");
      console.error("Error updating attendance:", error);
    } finally {
      setUpdating(null);
    }
  };

  const getAttendanceStats = (history) => {
    if (!history || history.length === 0) return { present: 0, absent: 0 };

    return history.reduce(
      (acc, record) => ({
        present: acc.present + (record.status === "Present" ? 1 : 0),
        absent: acc.absent + (record.status === "Absent" ? 1 : 0),
      }),
      { present: 0, absent: 0 }
    );
  };

  const formatDate = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    }
    return new Date(timestamp).toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Student Attendance</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => {
          const stats = getAttendanceStats(student.attendanceHistory);
          return (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Card Header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <h2 className="font-semibold text-gray-800">
                      {student.name}
                    </h2>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                      student.attendance === "Present"
                        ? "bg-green-100 text-green-600"
                        : student.attendance === "Absent"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                    {student.attendance === "Present" && (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {student.attendance === "Absent" && (
                      <XCircle className="h-4 w-4" />
                    )}
                    {student.attendance || "Not marked"}
                  </span>
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-4 bg-white">
                <div className="flex justify-around mb-4">
                  <div className="text-center">
                    <div className="text-green-600 font-semibold">
                      {stats.present}
                    </div>
                    <div className="text-sm text-gray-500">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-semibold">
                      {stats.absent}
                    </div>
                    <div className="text-sm text-gray-500">Absent</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAttendance(student.id, "Present")}
                    disabled={updating === student.id}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    {updating === student.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Present
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAttendance(student.id, "Absent")}
                    disabled={updating === student.id}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    {updating === student.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        Absent
                      </>
                    )}
                  </button>
                </div>

                {/* History Toggle */}
                <button
                  onClick={() =>
                    setExpandedStudent(
                      expandedStudent === student.id ? null : student.id
                    )
                  }
                  className="w-full mt-4 flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                  {expandedStudent === student.id ? (
                    <>
                      Hide History <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      View History <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* History Section */}
                {expandedStudent === student.id && (
                  <div className="mt-4 space-y-2 border-t pt-4">
                    {[...student.attendanceHistory]
                      .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
                      .slice(0, 5) // Show only last 5 records
                      .map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                          <span
                            className={`flex items-center gap-1
                            ${
                              record.status === "Present"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}>
                            {record.status === "Present" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            {record.status}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar className="h-4 w-4" />
                              {formatDate(record.timestamp)}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="h-4 w-4" />
                              {formatTime(record.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentList;
