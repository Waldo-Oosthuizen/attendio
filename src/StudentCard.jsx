import React from 'react';
import { Pencil, Save, Trash2, User, Music2, Calendar } from 'lucide-react';

/* ---------- Helpers ---------- */

// Format "HH:MM" (24-hour) into 12-hour with AM/PM
const formatTime12 = (hhmm) => {
  if (!hhmm) return '';
  const [hhStr, mmStr] = hhmm.split(':');
  const hh = Number(hhStr);
  const mm = Number(mmStr || 0);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return hhmm;
  const period = hh >= 12 ? 'PM' : 'AM';
  const hour12 = ((hh + 11) % 12) + 1;
  return `${hour12}:${String(mm).padStart(2, '0')} ${period}`;
};

const StudentCard = ({
  student,
  index,
  handleInputChange,
  toggleEditMode,
  handleRemoveRow,
}) => {
  // visitTime expected as "HH:MM" (24-hour)
  const visitTime = student.visitTime || '';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden ">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold text-gray-800">
            {student.name || 'New Student'}
          </h2>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
          {student.day || 'No Day Set'}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {student.isEditable ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={student.name || ''}
                onChange={(e) => handleInputChange(e, index, 'name')}
                placeholder="Enter Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instrument
              </label>
              <input
                type="text"
                value={student.instrument || ''}
                onChange={(e) => handleInputChange(e, index, 'instrument')}
                placeholder="Enter Instrument"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day
              </label>
              <select
                value={student.day || ''}
                onChange={(e) => handleInputChange(e, index, 'day')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lesson Duration
              </label>
              <select
                value={student.duration ?? ''}
                onChange={(e) => handleInputChange(e, index, 'duration')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Duration</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">1 Hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visit time
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={visitTime}
                onChange={(e) => handleInputChange(e, index, 'visitTime')}
                aria-label="Visit time (HH:MM)"
              />
              <p className="text-xs text-gray-500 mt-1">Pick a lesson time.</p>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {student.instrument || 'No Instrument'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {/* Show day and time nicely */}
                {student.day ? (
                  <>
                    {student.day}
                    {visitTime ? ` ${formatTime12(visitTime)}` : ''}
                    {student.duration ? ` ${student.duration} min` : ''}
                  </>
                ) : (
                  'No Day Set'
                )}
              </span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-2 border-t mt-4">
          <button
            onClick={() => toggleEditMode(index)}
            className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              student.isEditable ? 'bg-green text-white' : 'bg-blue text-white'
            }`}>
            {student.isEditable ? (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                Edit
              </>
            )}
          </button>

          <button
            onClick={() => handleRemoveRow(index)}
            className="flex-1 bg-red text-white inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
