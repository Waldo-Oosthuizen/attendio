import React, { useState, useEffect } from "react";
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

  const [defaultView, setDefaultView] = useState(Views.WEEK);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDefaultView(Views.DAY);
      } else {
        setDefaultView(Views.WEEK);
      }
    };

    handleResize(); // Set initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 ">
      <div className="shadow-lg rounded-xl p-4 sm:p-8 max-w-full mx-auto lg:ml-16 ml-0">
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
          style={{ height: "80vh", width: "100%" }}
          showMultiDayTimes={true}
        />
      </div>
    </div>
  );
};

export default Schedule;
