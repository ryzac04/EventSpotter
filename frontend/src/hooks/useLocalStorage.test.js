
import { renderHook, act } from "@testing-library/react-hooks";
import useLocalStorage from "./useLocalStorage";

describe("useLocalStorage hook", () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });

    test("should initialize with default value if key not found in localStorage", () => {
        const { result } = renderHook(() => useLocalStorage("testKey", "defaultValue"));

        expect(result.current[0]).toBe("defaultValue");
    });

    test("should initialize with value from localStorage if key found", () => {
        localStorage.setItem("testKey", "storedValue");

        const { result } = renderHook(() => useLocalStorage("testKey", "defaultValue"));

        expect(result.current[0]).toBe("storedValue");
    });

    test("should update localStorage when state changes", () => {
        const { result } = renderHook(() => useLocalStorage("testKey", "initialValue"));

        act(() => {
            result.current[1]("updatedValue");
        });

        expect(localStorage.getItem("testKey")).toBe("updatedValue");
    });

    test("should remove key from localStorage when state is set to null", () => {
        localStorage.setItem("testKey", "storedValue");

        const { result } = renderHook(() => useLocalStorage("testKey", "defaultValue"));

        act(() => {
            result.current[1](null);
        });

        expect(localStorage.getItem("testKey")).toBe(null);
    });
});