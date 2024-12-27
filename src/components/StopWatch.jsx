import { useEffect, useState, useRef, useCallback } from "react";

// Custom Hook for Stopwatch Logic
function useStopWatch() {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const startTime = useRef(0);
    const animationFrameId = useRef(null);

    const updateElapsedTime = useCallback(() => {
        setElapsedTime(Date.now() - startTime.current);
        animationFrameId.current = requestAnimationFrame(updateElapsedTime);
    }, []);

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            startTime.current = Date.now() - elapsedTime; // Adjust for paused time
            animationFrameId.current = requestAnimationFrame(updateElapsedTime);
        }
    }, [elapsedTime, isRunning, updateElapsedTime]);

    const stop = useCallback(() => {
        if (isRunning) {
            setIsRunning(false);
            cancelAnimationFrame(animationFrameId.current);
        }
    }, [isRunning]);

    const reset = useCallback(() => {
        setElapsedTime(0);
        setIsRunning(false);
        cancelAnimationFrame(animationFrameId.current);
    }, []);

    // Cleanup animation frame when the component unmounts
    useEffect(() => {
        return () => cancelAnimationFrame(animationFrameId.current);
    }, []);

    return { elapsedTime, isRunning, start, stop, reset };
}

function StopWatch() {
    const { elapsedTime, isRunning, start, stop, reset } = useStopWatch();

    const formatTime = useCallback(() => {
        const totalMilliseconds = elapsedTime;
        const hours = Math.floor(totalMilliseconds / 3600000);
        const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
        const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
        const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
    }, [elapsedTime]);

    return (
        <div className="stopwatch">
            <div className="display">{formatTime()}</div>
            <div className="controls">
                <button onClick={start} className="start-button" disabled={isRunning}>
                    Start
                </button>
                <button onClick={reset} className="reset-button">
                    Reset
                </button>
                <button onClick={stop} className="stop-button" disabled={!isRunning}>
                    Stop
                </button>
            </div>
        </div>
    );
}

export default StopWatch;
