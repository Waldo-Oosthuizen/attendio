import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addWeeks,
  addDays,
  addMinutes,
  set,
} from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enZA from 'date-fns/locale/en-ZA';

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase-config';

const locales = {
  'en-ZA': enZA,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Help: Day name to index (relative to Monday start)
const dayNameToIndex = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

// Function to build recurring events
function buildWeeklyEventsFromStudents(students, weeksAhead = 12) {
  const events = [];

  // start from this week's Monday
  const firstWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  for (let w = 0; w < weeksAhead; w++) {
    const weekStart = addWeeks(firstWeekStart, w);

    students.forEach((st) => {
      if (!st.day || !st.visitTime) return;

      const dayOffset = dayNameToIndex[st.day];
      if (dayOffset == null) return;

      const [hour, minute] = (st.visitTime || '').split(':').map(Number);

      const lessonDate = addDays(weekStart, dayOffset);

      // build start date
      const start = set(lessonDate, {
        hours: hour || 0,
        minutes: minute || 0,
        seconds: 0,
        milliseconds: 0,
      });

      // build end Date
      const durationMinutes = Number(st.duration) || 60;
      const end = addMinutes(start, durationMinutes);

      events.push({
        title: st.instrument
          ? `${st.name || 'Lesson'} – ${st.instrument}`
          : st.name || 'Lesson',
        start,
        end,
      });
    });
  }

  return events;
}

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [defaultView, setDefaultView] = useState(Views.WEEK);
  const [uid, setUid] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  /* ----------  AUTH HANDSHAKE  ---------- */
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ Auth confirmed in Schedule:', user.uid);
        setUid(user.uid);
        setAuthReady(true);
      } else {
        console.warn('⚠️ No user in Schedule');
        setUid(null);
        setAuthReady(false);
      }
    });

    return unsub;
  }, []);

  /* ----------  FIRESTORE -> EVENTS  ---------- */
  useEffect(() => {
    if (!authReady || !uid) {
      console.log('⏳ Waiting for auth in Schedule...');
      return;
    }

    const studentsCol = collection(db, 'students');
    const q = query(studentsCol, where('ownerId', '==', uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        console.log('📦 Schedule snapshot:', snap.docs.length, 'students');

        // 1. Map Firestore docs → student objects
        const students = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || 'Unnamed student',
            instrument: data.instrument || '',
            day: data.day || '',
            visitTime: data.visitTime || '',
            duration: Number(data.duration) || 60,
          };
        });

        // 2. Build recurring weekly events
        const weeklyEvents = buildWeeklyEventsFromStudents(students, 12); // 12 weeks ahead

        // 3. Save to state
        setEvents(weeklyEvents);
      },
      (err) => console.error('🔥 Firestore Schedule error:', err)
    );

    return unsub;
  }, [authReady, uid]);

  /* ----------  RESPONSIVE VIEW (DAY on mobile)  ---------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDefaultView(Views.DAY);
      } else {
        setDefaultView(Views.WEEK);
      }
    };

    handleResize(); // Set initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6">
      <div className="shadow-lg rounded-xl p-4 sm:p-8 max-w-full mx-auto lg:ml-16 ml-0 bg-white dark:bg-gray-800">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Lesson Schedule
        </h2>

        {!authReady && (
          <p className="mb-4 text-sm text-gray-500">Checking your account...</p>
        )}

        {authReady && events.length === 0 && (
          <p className="mb-4 text-sm text-gray-500">
            No scheduled lessons yet. Add students with times on the Students
            page to see them here.
          </p>
        )}

        <Calendar
          localizer={localizer}
          events={
            Array.isArray(events)
              ? events.filter((e) => e?.title && e?.start && e?.end)
              : []
          }
          startAccessor="start"
          endAccessor="end"
          views={{ day: true, week: true }}
          defaultView={defaultView}
          style={{ height: '80vh', width: '100%' }}
          showMultiDayTimes={true}
        />
      </div>
    </div>
  );
};

export default Schedule;
