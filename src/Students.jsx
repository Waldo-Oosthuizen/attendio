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
  Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { db } from './firebase-config';
import { addOwnerIdToExistingDocs } from './utils/updateOwnerId';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [uid, setUid] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const studentsCol = collection(db, 'students');

  /* ----------  AUTH HANDSHAKE  ---------- */
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ Auth confirmed in Students:', user.uid);
        setUid(user.uid);
        setAuthReady(true);
        addOwnerIdToExistingDocs(); // Run once now that user is confirmed
      } else {
        console.warn('⚠️ No user signed in — redirecting or waiting...');
        setUid(null);
        setAuthReady(false);
      }
    });
    return unsub;
  }, []);

  /* ----------  REAL-TIME QUERY  ---------- */
  useEffect(() => {
    if (!authReady || !uid) {
      console.log('⏳ Waiting for auth before querying...');
      return;
    }

    console.log('✅ Querying Firestore for UID:', uid);
    const q = query(studentsCol, where('ownerId', '==', uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        console.log('📦 Students snapshot:', snap.docs.length, 'docs');
        setStudents(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              // ensure visitTime and other fields exist so StudentCard has predictable props
              visitTime: data.visitTime || '',
              // ensure duration is numeric; fallback to 60
              duration:
                typeof data.duration === 'number'
                  ? data.duration
                  : Number(data.duration) || 60,
              name: data.name || '',
              instrument: data.instrument || '',
              day: data.day || '',
              isEditable: false,
              ownerId: data.ownerId || null,
            };
          })
        );
      },
      (err) => console.error('🔥 Firestore query error:', err)
    );

    return unsub;
  }, [uid, authReady]);

  /* ----------  UI HELPERS  ---------- */
  const handleAddRow = () => {
    if (!authReady) return;
    setStudents([
      {
        name: '',
        instrument: '',
        day: '',
        visitTime: 0, // store as "HH:MM"
        duration: 30, // default duration in minutes
        isEditable: true,
      },
      ...students,
    ]);
  };

  // generic input handler works for visitTime, duration (string from select), etc.
  // We keep the raw input in local state; conversion to Number happens on save.
  const handleInputChange = (e, idx, field) =>
    setStudents(
      students.map((s, i) =>
        i === idx ? { ...s, [field]: e.target.value } : s
      )
    );

  // Helper: construct a Firestore Timestamp from a date (YYYY-MM-DD or Date) + "HH:MM"
  const toggleEditMode = async (idx) => {
    const st = students[idx];
    const next = students.map((s, i) =>
      i === idx ? { ...s, isEditable: !s.isEditable } : s
    );

    // Only run save logic when switching from edit → view
    if (st.isEditable) {
      const assuredUid = uid || getAuth().currentUser?.uid;
      if (!assuredUid) {
        console.error('❌ No authenticated user. Cannot save.');
        alert('Please log in again before saving.');
        return;
      }

      // Build payload (visitTime saved as simple "HH:MM" string; duration stored as Number)
      const payload = {
        name: (st.name || '').trim(),
        instrument: (st.instrument || '').trim(),
        day: (st.day || '').trim(),
        visitTime: (st.visitTime || '').trim(), // <-- included
        duration: Number(st.duration) || 0, // ensure Number in DB
        ownerId: assuredUid,
      };

      console.log('🧾 Attempting to save student:', payload);

      // keep previous required checks (name/instrument/day). If you want visitTime required,
      // add `|| !payload.visitTime` to the condition below.
      if (!payload.name || !payload.instrument || !payload.day) {
        console.warn(
          '⚠️ Incomplete data. Please fill in all fields before saving.'
        );
        alert('Please fill in all student fields before saving.');
        return;
      }

      try {
        if (st.id) {
          console.log('✏️ Updating existing student:', st.id);
          await updateDoc(doc(db, 'students', st.id), payload);
        } else {
          console.log('➕ Adding new student...');
          const ref = await addDoc(collection(db, 'students'), payload);
          next[idx].id = ref.id;
          console.log('✅ Added new student with ID:', ref.id);
        }

        console.log('✅ Student saved successfully!');
      } catch (err) {
        console.error('🔥 Firestore save error:', err);
        alert('Failed to save student. Check console for details.');
        return;
      }
    }

    setStudents(next);
  };

  const handleRemoveRow = async (idx) => {
    const st = students[idx];
    try {
      if (st.id) await deleteDoc(doc(db, 'students', st.id));
      setStudents(students.filter((_, i) => i !== idx));
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  /// Filter Function
  const studentsByDay = DAYS.reduce((acc, day) => {
    acc[day] = students
      .filter((student) => student.day === day)
      .sort((a, b) => a.visitTime.localeCompare(b.visitTime));

    return acc;
  }, {});

  /* ----------  RENDER  ---------- */
  return (
    <div className="max-w-6xl mx-auto my-8 px-4 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 px-4 md:px-6 py-4">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <GraduationCap className="h-8 w-8" /> Students
        </h2>
        <button
          onClick={handleAddRow}
          disabled={!authReady}
          className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue text-white rounded-md disabled:opacity-50">
          <Plus className="w-4 h-4 mr-2" /> Add Student
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {DAYS.map((day) => (
          <div key={day} className="col-span-full">
            <h3 className="text-lg font-bold mt-6 mb-3 border-b pb-1">{day}</h3>

            {studentsByDay[day].length === 0 ? (
              <p className="text-gray-400 mb-6">No students scheduled</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentsByDay[day].map((student, idx) => (
                  <StudentCard
                    key={student.id ?? `temp-${day}-${idx}`}
                    student={student}
                    index={idx}
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
    </div>
  );
};

export default Students;
