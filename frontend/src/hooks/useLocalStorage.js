
import { useState, useEffect } from "react";

/** 
 * useLocalStorage custom hook
 * 
 * Keeps state data synced with localStorage. 
 * 
 * Creates `item` as state and looks in localStorage for the current value -
 * if not found, defaults to `firstValue`
 * 
 * useEffect: when `item` changes, effect re-runs: 
 *  - if new state is null, removes from localStorage
 *  - else, updates localStorage
 * 
 * Implementation in components is similar to useState: 
 * 
 *  const [data, setData] = useLocalStorage("data")
 */

function useLocalStorage(key, firstValue = null) {
    const initialValue = localStorage.getItem(key) || firstValue;
    const [item, setItem] = useState(initialValue);
    useEffect(function setKeyInLocalStorage() {
        if (item === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, item);
        }
    }, [key, item]);

    return [item, setItem];
};

export default useLocalStorage;