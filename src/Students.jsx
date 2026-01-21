import React, { useState, useEffect } from 'react';
import StudentCard from './StudentCard';
import { Plus, GraduationCap } from 'lucide-react';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { db } from './firebase-config';
import { addOwnerIdToExistingDocs } from './utils/updateOwnerId';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [uid, setUid] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  /* ---------- AUTH ---------- */
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setAuthReady(true);
        addOwnerIdToExistingDocs();
      } else {
        setUid(null);
        setAuthReady(false);
      }
    });
    return unsub;
  }, []);

  /* ---------- FIRESTORE ---------- */
  useEffect(() => {
    if (!authReady || !uid) return;

    const q = query(collection(db, 'students'), where('ownerId', '==', uid));

    const unsub = onSnapshot(q, (snap) => {
      setStudents(
        snap.docs.map((d) => {
          const data = d.data();
          return {
            localId: d.id, // ✅ STABLE FRONTEND ID
            id: d.id, // Firestore ID
            name: data.name || '',
            instrument: data.instrument || '',
            day: data.day || '',
            visitTime: data.visitTime || '',
            duration: Number(data.duration) || 60,
            isEditable: false,
            ownerId: data.ownerId || null,
          };
        })
      );
    });

    return unsub;
  }, [uid, authReady]);

  /* ---------- ADD ---------- */
  const handleAddRow = () => {
    if (!authReady) return;

    setStudents((prev) => [
      {
        localId: crypto.randomUUID(), // ✅ REQUIRED
        id: null,
        name: '',
        instrument: '',
        day: '',
        visitTime: '',
        duration: 30,
        isEditable: true,
      },
      ...prev,
    ]);
  };

  /* ---------- INPUT ---------- */
  const handleInputChange = (e, localId, field) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.localId === localId ? { ...s, [field]: e.target.value } : s
      )
    );
  };

  /* ---------- EDIT / SAVE ---------- */
  const toggleEditMode = async (localId) => {
    const student = students.find((s) => s.localId === localId);

    const next = students.map((s) =>
      s.localId === localId ? { ...s, isEditable: !s.isEditable } : s
    );

    if (student.isEditable) {
      const uidSafe = uid || getAuth().currentUser?.uid;

      const payload = {
        name: student.name.trim(),
        instrument: student.instrument.trim(),
        day: student.day.trim(),
        visitTime: student.visitTime.trim(),
        duration: Number(student.duration) || 0,
        ownerId: uidSafe,
      };

      if (!payload.name || !payload.instrument || !payload.day) {
        alert('Please fill in all fields.');
        return;
      }

      if (student.id) {
        await updateDoc(doc(db, 'students', student.id), payload);
      } else {
        const ref = await addDoc(collection(db, 'students'), payload);
        next.find((s) => s.localId === localId).id = ref.id;
      }
    }

    setStudents(next);
  };

  /* ---------- DELETE ---------- */
  const handleRemoveRow = async (localId) => {
    const st = students.find((s) => s.localId === localId);

    if (st?.id) {
      await deleteDoc(doc(db, 'students', st.id));
    }

    setStudents((prev) => prev.filter((s) => s.localId !== localId));
  };

  /* ---------- GROUP + SORT ---------- */
  const unscheduledStudents = students.filter((s) => s.isEditable);

  const studentsByDay = DAYS.reduce((acc, day) => {
    const dayStudents = students.filter((s) => s.day === day);

    const editing = dayStudents.filter((s) => s.isEditable);
    const normal = dayStudents.filter((s) => !s.isEditable);

    acc[day] = [
      ...editing, // stay where user put them
      ...normal.sort((a, b) => a.visitTime.localeCompare(b.visitTime)),
    ];

    return acc;
  }, {});

  /* ---------- RENDER ---------- */
  return (
    <div className="max-w-6xl mx-auto my-8 px-4 pb-20">
      <header className="flex justify-between items-center py-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <GraduationCap /> Students
        </h2>

        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue text-white rounded-md">
          <Plus className="inline mr-2" />
          Add Student
        </button>
      </header>

      {unscheduledStudents.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-bold mt-2 mb-3 border-b pb-1">
            Add Students
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unscheduledStudents.map((student) => (
              <StudentCard
                key={student.localId}
                student={student}
                handleInputChange={handleInputChange}
                toggleEditMode={toggleEditMode}
                handleRemoveRow={handleRemoveRow}
              />
            ))}
          </div>
        </div>
      )}

      {DAYS.map((day) => (
        <div key={day} className="mb-10">
          <h3 className="text-lg font-bold border-b mb-3">{day}</h3>

          {studentsByDay[day].length === 0 ? (
            <p className="text-gray-400">No students scheduled</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentsByDay[day].map((student) => (
                <StudentCard
                  key={student.localId}
                  student={student}
                  handleInputChange={handleInputChange}
                  toggleEditMode={toggleEditMode}
                  handleRemoveRow={handleRemoveRow}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Students;
