import { renderHook, act } from "@testing-library/react-hooks";
import useEndDateTime from "./useEndDateTime";

describe("useEndDateTime hook", () => {
    test("should initialize with empty strings", () => {
        const { result } = renderHook(() => useEndDateTime());

        expect(result.current.endDateTime).toBe("");
        expect(result.current.rawEndDateTime).toBe("");
    });

   test("should update endDateTime and rawEndDateTime when handleEndDateTimeChange is called", () => {
        const { result } = renderHook(() => useEndDateTime());

        act(() => {
            result.current.handleEndDateTimeChange({ target: { value: "2024-07-17T12:00" } });
        });

        // Expected value in UTC time zone
        const expectedDateTime = "2024-07-17T17:00:00Z";

        expect(result.current.rawEndDateTime).toBe("2024-07-17T12:00");
        expect(result.current.endDateTime).toBe(expectedDateTime);
    });

    test("should handle clearing date when handleEndDateTimeChange is called with empty string", () => {
        const { result } = renderHook(() => useEndDateTime());

        act(() => {
            result.current.handleEndDateTimeChange({ target: { value: "" } });
        });

        expect(result.current.rawEndDateTime).toBe("");
        expect(result.current.endDateTime).toBe(null);
    });
});