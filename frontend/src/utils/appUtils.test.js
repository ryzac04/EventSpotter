
import { formatDateToISO, options, groupEventsByVenue } from "./appUtils";

// formatDateToIso tests
test('formatDateToISO returns ISO string for valid date', () => {
  const date = new Date('2024-07-15T12:00:00Z');
  const isoString = formatDateToISO(date);
  expect(isoString).toBe('2024-07-15T12:00:00Z');
});

test('formatDateToISO returns null for null input', () => {
  const isoString = formatDateToISO(null);
  expect(isoString).toBeNull();
});

// options tests
test('options has correct structure', () => {
  expect(options).toEqual({
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });
});

// groupEventsByVenue tests
test('groupEventsByVenue groups events by venue id', () => {
  const events = [
    { _embedded: { venues: [{ id: 'venue1' }] } },
    { _embedded: { venues: [{ id: 'venue2' }] } },
    { _embedded: { venues: [{ id: 'venue1' }] } },
  ];
  const groupedEvents = groupEventsByVenue(events);
  expect(groupedEvents).toEqual({
    venue1: {
      venue: { id: 'venue1' },
      events: [
        { _embedded: { venues: [{ id: 'venue1' }] } },
        { _embedded: { venues: [{ id: 'venue1' }] } },
      ],
    },
    venue2: {
      venue: { id: 'venue2' },
      events: [{ _embedded: { venues: [{ id: 'venue2' }] } }],
    },
  });
});