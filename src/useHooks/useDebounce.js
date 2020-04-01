// 防抖
import React, { useRef, useCallback, useEffect } from 'react';

const useDebounce = (fn, delay) => {
    const timeoutRef = useRef();

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const run = useCallback(() => {
        (...args) => {
            cancel();
            timeoutRef.current = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }, [delay, cancel]);

    useEffect(() => cancel, []);

    return { run, cancel };
};
