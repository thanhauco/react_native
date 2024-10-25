import * as React from "react";
import { useState } from "react";
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
}

export function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: new Date(),
    endTime: new Date(),
  });

  const addEvent = () => {
    if (newEvent.title.trim()) {
      setEvents([...events, {
        id: Date.now().toString(),
        ...newEvent
      }]);
      setNewEvent({
        title: "",
        startTime: new Date(),
        endTime: new Date(),
      });
    }
  };

  return (
    <flexboxLayout className="h-full flex-col p-5 bg-gray-50">
      <flexboxLayout className="flex-col mb-4 space-y-3 bg-white p-4 rounded-lg shadow-sm">
        <textField
          className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-base"
          hint="Event title"
          text={newEvent.title}
          onTextChange={(args) => setNewEvent({
            ...newEvent,
            title: args.object.text
          })}
        />
        <datePicker
          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
          date={newEvent.startTime}
          onDateChange={(args) => setNewEvent({
            ...newEvent,
            startTime: args.value
          })}
        />
        <button
          className="p-3 bg-blue-600 text-white rounded-lg font-semibold"
          text="Add Event"
          onTap={addEvent}
        />
      </flexboxLayout>

      <scrollView className="flex-1">
        {events.map(event => (
          <gridLayout key={event.id} className="p-4 bg-white mb-2 rounded-lg shadow-sm">
            <stackLayout>
              <label className="text-lg font-semibold text-gray-800" text={event.title} />
              <label className="text-sm text-gray-600 mt-1" text={format(event.startTime, 'PPp')} />
            </stackLayout>
          </gridLayout>
        ))}
      </scrollView>
    </flexboxLayout>
  );
}