import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

import enZA from "date-fns/locale/en-ZA";

const locales = {
  "en-ZA": enZA,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Schedule = () => {
  const [events, setEvents] = useState([
    {
      title: "Math Class",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className=" shadow-lg rounded-xl p-6 max-w-6xl mx-auto">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={{ week: true, day: true }}
          defaultView="week"
          style={{ height: 500 }}
        />
      </div>
    </div>
  );
};

export default Schedule;
