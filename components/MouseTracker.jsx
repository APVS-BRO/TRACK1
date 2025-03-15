"use client"

import React, { useEffect, useState, useRef } from 'react';


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

  straightLineThreshold = 0.95,     
  speedVariabilityThreshold = 0.3,    
  angleVariabilityThreshold = 0.4,    
  pauseThreshold = 300,              
  clickIntervalThreshold = 50,       
  clickRegularityThreshold = 0.25,   
  accelerationVariabilityThreshold = 0.1, 
  hesitationThreshold = 10,           

  
  movementWeights = {
    speed: 0.25,
    angle: 0.25,
    straightLine: 0.3,
    pause: 0.1,
    acceleration: 0.1 
  },
  clickWeights = {
    interval: 0.4,
    fastClick: 0.9,
    position: 0.1,
    hesitation: 0.1 
  }
}) => {
  
  const [isValidMovement, setIsValidMovement] = useState(true);
  const [confidenceScore, setConfidenceScore] = useState(1.0);
  const movementData = useRef([]);
  const clickData = useRef([]);
  const lastPosition = useRef({ x: 0, y: 0, timestamp: null }); 
  const startTime = useRef(Date.now());

  
  const BUFFER_SIZE = 100; 
  const CLICK_BUFFER_SIZE = 20;
  const MIN_MOVEMENTS_FOR_ANALYSIS = 20;
  const MIN_CLICKS_FOR_ANALYSIS = 5;

  
  const resetTracking = () => {
    movementData.current = [];
    clickData.current = [];
    lastPosition.current = { x: 0, y: 0, timestamp: null };
    startTime.current = Date.now();
    setIsValidMovement(true);
    setConfidenceScore(1.0);
  };

  
  const calculateMetrics = (data) => {
    if (data.length < MIN_MOVEMENTS_FOR_ANALYSIS) return null;

    
    const speeds = data.map(point => point.speed);
    const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const speedVariability = Math.std(speeds) / avgSpeed;

    
    const accelerations = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i-1].speed !== undefined) { 
        const timeDelta = data[i].timestamp - data[i-1].timestamp;
        if (timeDelta > 0) {
          const acceleration = (data[i].speed - data[i-1].speed) / timeDelta;
          accelerations.push(acceleration);
        }
      }
    }
    const avgAcceleration = accelerations.length > 0 ? accelerations.reduce((sum, acc) => sum + acc, 0) / accelerations.length : 0;
    const accelerationVariability = accelerations.length > 0 && avgAcceleration !== 0 ? Math.std(accelerations) / Math.abs(avgAcceleration) : 0;


    
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

    
    let straightLineCount = 0;
    for (let i = 0; i < angles.length; i++) {
      if (Math.abs(Math.cos(angles[i])) > straightLineThreshold) {
        straightLineCount++;
      }
    }
    const straightLineRatio = angles.length > 0 ?
      straightLineCount / angles.length : 0;

    
    const timeGaps = [];
    for (let i = 1; i < data.length; i++) {
      timeGaps.push(data[i].timestamp - data[i - 1].timestamp);
    }

    const maxPause = timeGaps.length > 0 ? Math.max(...timeGaps) : 0; 
    const hasNaturalPauses = maxPause > pauseThreshold;

    return {
      speedVariability,
      angleVariability,
      straightLineRatio,
      hasNaturalPauses,
      accelerationVariability 
    };
  };

  
  const calculateClickMetrics = (clicks) => {
    if (clicks.length < MIN_CLICKS_FOR_ANALYSIS) return null;

    
    const intervals = [];
    for (let i = 1; i < clicks.length; i++) {
      intervals.push(clicks[i].timestamp - clicks[i - 1].timestamp);
    }

    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const intervalVariability = Math.std(intervals) / avgInterval;

    
    const tooFastClicks = intervals.filter(interval => interval < clickIntervalThreshold).length;
    const fastClickRatio = tooFastClicks / intervals.length;

    
    const positions = clicks.map(click => ({ x: click.x, y: click.y }));
    const xPositions = positions.map(pos => pos.x);
    const yPositions = positions.map(pos => pos.y);

    const positionVariability =
      (Math.std(xPositions) + Math.std(yPositions)) /
      (Math.max(...xPositions) - Math.min(...xPositions) + Math.max(...yPositions) - Math.min(...yPositions) + 1);

    
    const preClickPauses = clicks.map(click => click.preClickPause).filter(pause => pause !== null);
    const avgPreClickPause = preClickPauses.length > 0 ? preClickPauses.reduce((sum, pause) => sum + pause, 0) / preClickPauses.length : 0;
    const hasHesitation = avgPreClickPause > hesitationThreshold;

    return {
      intervalVariability,
      fastClickRatio,
      positionVariability,
      hasHesitation 
    };
  };

  
  const analyzeInteractions = () => {
    const movementMetrics = calculateMetrics(movementData.current);
    const clickMetrics = calculateClickMetrics(clickData.current);

    
    let movementSuspicionScore = 0;
    let clickSuspicionScore = 0;

    
    if (movementMetrics) {
      const speedSuspicion = Math.max(0, 1 - movementMetrics.speedVariability / speedVariabilityThreshold);
      const angleSuspicion = Math.max(0, 1 - movementMetrics.angleVariability / angleVariabilityThreshold);
      const straightLineSuspicion = Math.min(1, movementMetrics.straightLineRatio * 1.5);
      const pauseSuspicion = movementMetrics.hasNaturalPauses ? 0 : 0.7;
      const accelerationSuspicion = Math.max(0, 1 - movementMetrics.accelerationVariability / accelerationVariabilityThreshold); 

      
      movementSuspicionScore =
        speedSuspicion * movementWeights.speed +
        angleSuspicion * movementWeights.angle +
        straightLineSuspicion * movementWeights.straightLine +
        pauseSuspicion * movementWeights.pause +
        accelerationSuspicion * movementWeights.acceleration; 
    }

    
    if (clickMetrics) {
      const intervalSuspicion = Math.max(0, 1 - clickMetrics.intervalVariability / clickRegularityThreshold);
      const fastClickSuspicion = Math.min(1, clickMetrics.fastClickRatio * 2);
      const positionSuspicion = Math.max(0, 1 - clickMetrics.positionVariability * 5);
      const hesitationSuspicion = clickMetrics.hasHesitation ? 0 : 1.6; 

      
      clickSuspicionScore =
        intervalSuspicion * clickWeights.interval +
        fastClickSuspicion * clickWeights.fastClick +
        positionSuspicion * clickWeights.position +
        hesitationSuspicion * clickWeights.hesitation; 
    }

    
    const hasMovementData = movementMetrics !== null;
    const hasClickData = clickMetrics !== null;

    let suspicionScore;
    if (hasMovementData && hasClickData) {
      
      suspicionScore = (movementSuspicionScore * 0.6) + (clickSuspicionScore * 0.4);
    } else if (hasMovementData) {
      
      suspicionScore = movementSuspicionScore;
    } else if (hasClickData) {
      
      suspicionScore = clickSuspicionScore;
    } else {
      
      return;
    }

    
    const adjustedScore = suspicionScore * sensitivityLevel;

    
    const newIsValid = adjustedScore < 0.6;
    const newConfidence = 1 - adjustedScore;

    if (newIsValid !== isValidMovement) {
      setIsValidMovement(newIsValid);
      onValidityChange && onValidityChange(newIsValid, newConfidence);
    }

    setConfidenceScore(newConfidence);
  };

  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const position = { x: e.clientX, y: e.clientY, timestamp: currentTime };

      
      if (lastPosition.current.timestamp !== null) { 
        const timeDelta = currentTime - lastPosition.current.timestamp;
        if (timeDelta > 0) {
          const distance = Math.sqrt(
            Math.pow(position.x - lastPosition.current.x, 2) +
            Math.pow(position.y - lastPosition.current.y, 2)
          );
          position.speed = distance / timeDelta;

          
          movementData.current.push(position);
          if (movementData.current.length > BUFFER_SIZE) {
            movementData.current.shift();
          }

          
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
        button: e.button 
      };

      
      let preClickPause = null;
      if (movementData.current.length > 0) {
          const lastMovementBeforeClick = movementData.current[movementData.current.length - 1];
          preClickPause = click.timestamp - lastMovementBeforeClick.timestamp;
      }
      click.preClickPause = preClickPause; 


      
      clickData.current.push(click);
      if (clickData.current.length > CLICK_BUFFER_SIZE) {
        clickData.current.shift();
      }

      
      analyzeInteractions(); 

      
      
      
      
    };

    
    lastPosition.current.timestamp = Date.now();

    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseClick);

    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseClick);
    };
  }, [onValidityChange, sensitivityLevel, straightLineThreshold, speedVariabilityThreshold, angleVariabilityThreshold, pauseThreshold, clickIntervalThreshold, clickRegularityThreshold, accelerationVariabilityThreshold, hesitationThreshold, movementWeights, clickWeights]); 

  const movementMetricsDebug = calculateMetrics(movementData.current);
  const clickMetricsDebug = calculateClickMetrics(clickData.current);


  return (
    <div className="mouse-tracking-container">
      {children}
      {/* {process.env.NODE_ENV === 'development' && (
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
      )} */}
    </div>
  );
};

export default MouseMovementAnalyzer;