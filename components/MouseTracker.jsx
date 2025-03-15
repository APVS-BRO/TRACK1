"use client"

import React, { useEffect, useState, useRef } from 'react';

// Helper function for Standard Deviation if not natively available
if (!Math.std) {
  Math.std = function(array) {
    const n = array.length;
    const mean = array.reduce((a, b) => a + b, 0) / n;
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n);
  };
}

const MouseMovementAnalyzer = ({
  onValidityChange,
  sensitivityLevel = 0.7,
  children,

  // --- Configurable Thresholds ---
  straightLineThreshold = 0.95,     // Higher = stricter straight line detection
  speedVariabilityThreshold = 0.3,    // Lower = stricter speed variability detection
  angleVariabilityThreshold = 0.4,    // Lower = stricter angle variability detection
  pauseThreshold = 300,              // Higher = longer pause considered natural (ms)
  clickIntervalThreshold = 50,       // Lower = stricter fast click detection (ms) - REDUCED
  clickRegularityThreshold = 0.25,   // Lower = stricter click regularity detection
  accelerationVariabilityThreshold = 0.1, // Lower = stricter acceleration variability detection
  hesitationThreshold = 10,           // Higher = longer pre-click pause considered hesitation (ms)

  // --- Configurable Weights ---
  movementWeights = {
    speed: 0.25,
    angle: 0.25,
    straightLine: 0.3,
    pause: 0.1,
    acceleration: 0.1 // Weight for acceleration variability
  },
  clickWeights = {
    interval: 0.4,
    fastClick: 0.9,
    position: 0.1,
    hesitation: 0.1 // Weight for pre-click hesitation
  }
}) => {
  // State to track mouse movements and analysis results
  const [isValidMovement, setIsValidMovement] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(1.0);
  const movementData = useRef([]);
  const clickData = useRef([]);
  const lastPosition = useRef({ x: 0, y: 0, timestamp: null }); // Initialize timestamp to null
  const startTime = useRef(Date.now());

  // Constants for analysis (now configurable via props - defaults here if not provided)
  const BUFFER_SIZE = 100; // INCREASED BUFFER_SIZE
  const CLICK_BUFFER_SIZE = 20;
  const MIN_MOVEMENTS_FOR_ANALYSIS = 20;
  const MIN_CLICKS_FOR_ANALYSIS = 5;

  // Reset function for tracking a new session
  const resetTracking = () => {
    movementData.current = [];
    clickData.current = [];
    lastPosition.current = { x: 0, y: 0, timestamp: null };
    startTime.current = Date.now();
    setIsValidMovement(true);
    setConfidenceScore(1.0);
  };

  // Calculate metrics from movement data
  const calculateMetrics = (data) => {
    if (data.length < MIN_MOVEMENTS_FOR_ANALYSIS) return null;

    // Calculate speeds
    const speeds = data.map(point => point.speed);
    const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const speedVariability = Math.std(speeds) / avgSpeed;

    // Calculate accelerations
    const accelerations = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i-1].speed !== undefined) { // Ensure previous speed is defined
        const timeDelta = data[i].timestamp - data[i-1].timestamp;
        if (timeDelta > 0) {
          const acceleration = (data[i].speed - data[i-1].speed) / timeDelta;
          accelerations.push(acceleration);
        }
      }
    }
    const avgAcceleration = accelerations.length > 0 ? accelerations.reduce((sum, acc) => sum + acc, 0) / accelerations.length : 0;
    const accelerationVariability = accelerations.length > 0 && avgAcceleration !== 0 ? Math.std(accelerations) / Math.abs(avgAcceleration) : 0;


    // Calculate angles
    const angles = [];
    for (let i = 2; i < data.length; i++) {
      const prevVector = {
        x: data[i - 1].x - data[i - 2].x,
        y: data[i - 1].y - data[i - 2].y
      };
      const currVector = {
        x: data[i].x - data[i - 1].x,
        y: data[i].y - data[i - 1].y
      };

      // Calculate angle between vectors
      const dotProduct = prevVector.x * currVector.x + prevVector.y * currVector.y;
      const prevMagnitude = Math.sqrt(prevVector.x * prevVector.x + prevVector.y * prevVector.y);
      const currMagnitude = Math.sqrt(currVector.x * currVector.x + currVector.y * currVector.y);

      if (prevMagnitude > 0 && currMagnitude > 0) {
        const cosAngle = dotProduct / (prevMagnitude * currMagnitude);
        angles.push(Math.acos(Math.min(Math.max(cosAngle, -1), 1)));
      }
    }

    const angleVariability = angles.length > 0 ?
      Math.std(angles) / (Math.PI / 4) : 0;

    // Calculate straight line ratio
    let straightLineCount = 0;
    for (let i = 0; i < angles.length; i++) {
      if (Math.abs(Math.cos(angles[i])) > straightLineThreshold) {
        straightLineCount++;
      }
    }
    const straightLineRatio = angles.length > 0 ?
      straightLineCount / angles.length : 0;

    // Calculate time gaps
    const timeGaps = [];
    for (let i = 1; i < data.length; i++) {
      timeGaps.push(data[i].timestamp - data[i - 1].timestamp);
    }

    const maxPause = timeGaps.length > 0 ? Math.max(...timeGaps) : 0; // Handle empty timeGaps array
    const hasNaturalPauses = maxPause > pauseThreshold;

    return {
      speedVariability,
      angleVariability,
      straightLineRatio,
      hasNaturalPauses,
      accelerationVariability // Include acceleration variability in metrics
    };
  };

  // Calculate metrics from click data
  const calculateClickMetrics = (clicks) => {
    if (clicks.length < MIN_CLICKS_FOR_ANALYSIS) return null;

    // Calculate intervals between clicks
    const intervals = [];
    for (let i = 1; i < clicks.length; i++) {
      intervals.push(clicks[i].timestamp - clicks[i - 1].timestamp);
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const intervalVariability = Math.std(intervals) / avgInterval;

    // Calculate suspicious fast clicking
    const tooFastClicks = intervals.filter(interval => interval < clickIntervalThreshold).length;
    const fastClickRatio = tooFastClicks / intervals.length;

    // Calculate click positions variability
    const positions = clicks.map(click => ({ x: click.x, y: click.y }));
    const xPositions = positions.map(pos => pos.x);
    const yPositions = positions.map(pos => pos.y);

    const positionVariability =
      (Math.std(xPositions) + Math.std(yPositions)) /
      (Math.max(...xPositions) - Math.min(...xPositions) + Math.max(...yPositions) - Math.min(...yPositions) + 1);

    // Calculate pre-click hesitation
    const preClickPauses = clicks.map(click => click.preClickPause).filter(pause => pause !== null);
    const avgPreClickPause = preClickPauses.length > 0 ? preClickPauses.reduce((sum, pause) => sum + pause, 0) / preClickPauses.length : 0;
    const hasHesitation = avgPreClickPause > hesitationThreshold;

    return {
      intervalVariability,
      fastClickRatio,
      positionVariability,
      hasHesitation // Include hesitation metric
    };
  };

  // Analyze movement patterns
  const analyzeInteractions = () => {
    const movementMetrics = calculateMetrics(movementData.current);
    const clickMetrics = calculateClickMetrics(clickData.current);

    // Default values if not enough data
    let movementSuspicionScore = 0;
    let clickSuspicionScore = 0;

    // Calculate movement suspicion if we have enough data
    if (movementMetrics) {
      const speedSuspicion = Math.max(0, 1 - movementMetrics.speedVariability / speedVariabilityThreshold);
      const angleSuspicion = Math.max(0, 1 - movementMetrics.angleVariability / angleVariabilityThreshold);
      const straightLineSuspicion = Math.min(1, movementMetrics.straightLineRatio * 1.5);
      const pauseSuspicion = movementMetrics.hasNaturalPauses ? 0 : 0.7;
      const accelerationSuspicion = Math.max(0, 1 - movementMetrics.accelerationVariability / accelerationVariabilityThreshold); // Acceleration suspicion

      // Weight movement factors (using configurable weights)
      movementSuspicionScore =
        speedSuspicion * movementWeights.speed +
        angleSuspicion * movementWeights.angle +
        straightLineSuspicion * movementWeights.straightLine +
        pauseSuspicion * movementWeights.pause +
        accelerationSuspicion * movementWeights.acceleration; // Include acceleration weight
    }

    // Calculate click suspicion if we have enough data
    if (clickMetrics) {
      const intervalSuspicion = Math.max(0, 1 - clickMetrics.intervalVariability / clickRegularityThreshold);
      const fastClickSuspicion = Math.min(1, clickMetrics.fastClickRatio * 2);
      const positionSuspicion = Math.max(0, 1 - clickMetrics.positionVariability * 5);
      const hesitationSuspicion = clickMetrics.hasHesitation ? 0 : 1.6; // Hesitation suspicion

      // Weight click factors (using configurable weights)
      clickSuspicionScore =
        intervalSuspicion * clickWeights.interval +
        fastClickSuspicion * clickWeights.fastClick +
        positionSuspicion * clickWeights.position +
        hesitationSuspicion * clickWeights.hesitation; // Include hesitation weight
    }

    // Combined score - weight by amount of data we have
    const hasMovementData = movementMetrics !== null;
    const hasClickData = clickMetrics !== null;

    let suspicionScore;
    if (hasMovementData && hasClickData) {
      // We have both types of data
      suspicionScore = (movementSuspicionScore * 0.6) + (clickSuspicionScore * 0.4);
    } else if (hasMovementData) {
      // Only movement data
      suspicionScore = movementSuspicionScore;
    } else if (hasClickData) {
      // Only click data
      suspicionScore = clickSuspicionScore;
    } else {
      // Not enough data for analysis
      return;
    }

    // Apply sensitivity adjustment
    const adjustedScore = suspicionScore * sensitivityLevel;

    // Update validity state
    const newIsValid = adjustedScore < 0.6;
    const newConfidence = 1 - adjustedScore;

    if (newIsValid !== isValidMovement) {
      setIsValidMovement(newIsValid);
      onValidityChange && onValidityChange(newIsValid, newConfidence);
    }

    setConfidenceScore(newConfidence);
  };

  // Track mouse movement and clicks
  useEffect(() => {
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const position = { x: e.clientX, y: e.clientY, timestamp: currentTime };

      // Calculate speed
      if (lastPosition.current.timestamp !== null) { // Ensure lastPosition timestamp is initialized
        const timeDelta = currentTime - lastPosition.current.timestamp;
        if (timeDelta > 0) {
          const distance = Math.sqrt(
            Math.pow(position.x - lastPosition.current.x, 2) +
            Math.pow(position.y - lastPosition.current.y, 2)
          );
          position.speed = distance / timeDelta;

          // Add to buffer, keeping buffer size limited
          movementData.current.push(position);
          if (movementData.current.length > BUFFER_SIZE) {
            movementData.current.shift();
          }

          // Analyze periodically, not on every movement
          if ((movementData.current.length >= MIN_MOVEMENTS_FOR_ANALYSIS ||
              clickData.current.length >= MIN_CLICKS_FOR_ANALYSIS) &&
              (movementData.current.length + clickData.current.length) % 10 === 0) {
            analyzeInteractions();
          }
        }
      }

      lastPosition.current = { ...position, timestamp: currentTime };
    };

    const handleMouseClick = (e) => {
      const currentTime = Date.now();
      const click = {
        x: e.clientX,
        y: e.clientY,
        timestamp: currentTime,
        button: e.button // 0 = left, 1 = middle, 2 = right
      };

      // Calculate pre-click pause
      let preClickPause = null;
      if (movementData.current.length > 0) {
          const lastMovementBeforeClick = movementData.current[movementData.current.length - 1];
          preClickPause = click.timestamp - lastMovementBeforeClick.timestamp;
      }
      click.preClickPause = preClickPause; // Add pre-click pause to click data


      // Add to click buffer
      clickData.current.push(click);
      if (clickData.current.length > CLICK_BUFFER_SIZE) {
        clickData.current.shift();
      }

      // *** UNCONDITIONAL ANALYSIS ON CLICK ***
      analyzeInteractions(); // <--- Analyze on *every* click now

      // (Existing conditional analysis - still keep this for periodic analysis during movement)
      // if (clickData.current.length >= MIN_CLICKS_FOR_ANALYSIS) {
      //   analyzeInteractions();
      // }
    };

    // Initialize tracking - important to set initial timestamp
    lastPosition.current.timestamp = Date.now();

    // Set up event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseClick);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseClick);
    };
  }, [onValidityChange, sensitivityLevel, straightLineThreshold, speedVariabilityThreshold, angleVariabilityThreshold, pauseThreshold, clickIntervalThreshold, clickRegularityThreshold, accelerationVariabilityThreshold, hesitationThreshold, movementWeights, clickWeights]); // Add all configurable props to dependency array for useEffect

  const movementMetricsDebug = calculateMetrics(movementData.current);
  const clickMetricsDebug = calculateClickMetrics(clickData.current);


  return (
    <div className="mouse-tracking-container">
      {children}
      {process.env.NODE_ENV === 'development' && (
        <div className="mouse-tracking-debug" style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          <p>Movement: {isValidMovement ? '✅ Valid' : '❌ Suspicious'}</p>
          <p>Confidence: {(confidenceScore * 100).toFixed(1)}%</p>
          <p>Movement points: {movementData.current.length}</p>
          <p>Click points: {clickData.current.length}</p>
          <hr style={{borderColor: 'rgba(255,255,255,0.2)', margin: '5px 0'}}/>
          {movementMetricsDebug && (
            <>
              <p>Speed Var: {movementMetricsDebug.speedVariability?.toFixed(2)}</p>
              <p>Angle Var: {movementMetricsDebug.angleVariability?.toFixed(2)}</p>
              <p>Straight Line Ratio: {movementMetricsDebug.straightLineRatio?.toFixed(2)}</p>
              <p>Pause: {movementMetricsDebug.hasNaturalPauses ? 'Natural' : 'Suspicious'}</p>
              <p>Accel Var: {movementMetricsDebug.accelerationVariability?.toFixed(2)}</p>
              <hr style={{borderColor: 'rgba(255,255,255,0.2)', margin: '5px 0'}}/>
            </>
          )}
          {clickMetricsDebug && (
            <>
              <p>Interval Var: {clickMetricsDebug.intervalVariability?.toFixed(2)}</p>
              <p>Fast Click Ratio: {clickMetricsDebug.fastClickRatio?.toFixed(2)}</p>
              <p>Position Var: {clickMetricsDebug.positionVariability?.toFixed(2)}</p>
              <p>Hesitation: {clickMetricsDebug.hasHesitation ? 'Present' : 'Absent'}</p>
              <hr style={{borderColor: 'rgba(255,255,255,0.2)', margin: '5px 0'}}/>
            </>
          )}
          <button onClick={resetTracking}>Reset</button>
        </div>
      )}
    </div>
  );
};

export default MouseMovementAnalyzer;