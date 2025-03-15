'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

type KeystrokeMetrics = {
  key: string;
  keyDownTime: number;
  keyUpTime: number;
  latency: number;
  flightTime: number;
};

type Analytics = {
  totalKeys: number;
  humanConfidence: number; // Weighted confidence score for human typing
  anomalyCount: number;
  isHuman: boolean;
};

export default function KeystrokeAnalytics() {
  const [metrics, setMetrics] = useState<KeystrokeMetrics[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalKeys: 0,
    humanConfidence: 0,
    anomalyCount: 0,
    isHuman: true,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastKeyUpTime = useRef<number>(0);
  const sequenceBuffer = useRef<KeystrokeMetrics[]>([]);

  const analyzeTypingPatterns = useCallback(() => {
    if (sequenceBuffer.current.length < 10) return;

    // Extract relevant metrics
    const latencies = sequenceBuffer.current.map(m => m.latency);
    const flightTimes = sequenceBuffer.current.map(m => m.flightTime);
    const backspaceCount = sequenceBuffer.current.filter(m => m.key === 'Backspace').length;

    // Detect anomalies: Latency and flight time thresholds
    const anomalyCount = sequenceBuffer.current.filter(m =>
      m.latency < 20 || m.latency > 500 || // Latency anomalies
      m.flightTime < 15 || m.flightTime > 1000 // Flight time anomalies
    ).length;

    // Scoring System for Confidence
    let humanConfidence = 50; // Start with a neutral base
    if (backspaceCount > 0) humanConfidence += 20; // Error corrections suggest human behavior
    if (anomalyCount < 2) humanConfidence += 15; // Low anomalies suggest natural typing
    if (calculateStdDeviation(latencies) > 25) humanConfidence += 10; // Variability is human-like
    if (calculateStdDeviation(flightTimes) > 50) humanConfidence += 10; // Reflects natural patterns

    // Final Decision
    const isHuman = humanConfidence >= 70; // Confidence above 70% indicates human
    setAnalytics({
      totalKeys: metrics.length,
      humanConfidence: Math.min(humanConfidence, 100), // Cap at 100%
      anomalyCount,
      isHuman,
    });
  }, [metrics]);

  const calculateStdDeviation = (data: number[]): number => {
    if (data.length < 2) return 0;
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== textareaRef.current) return;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.target !== textareaRef.current) return;

      const now = performance.now();
      const latency = now - lastKeyUpTime.current;
      const flightTime = sequenceBuffer.current.length > 0
        ? now - sequenceBuffer.current[sequenceBuffer.current.length - 1].keyUpTime
        : 0;

      const newMetric: KeystrokeMetrics = {
        key: e.key,
        keyDownTime: lastKeyUpTime.current,
        keyUpTime: now,
        latency,
        flightTime,
      };

      setMetrics(prev => [...prev, newMetric]);
      sequenceBuffer.current = [...sequenceBuffer.current.slice(-50), newMetric];
      lastKeyUpTime.current = now;
    };

    const textarea = textareaRef.current;
    textarea?.addEventListener('keydown', handleKeyDown);
    textarea?.addEventListener('keyup', handleKeyUp);

    return () => {
      textarea?.removeEventListener('keydown', handleKeyDown);
      textarea?.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const analysisInterval = setInterval(analyzeTypingPatterns, 500);
    return () => clearInterval(analysisInterval);
  }, [analyzeTypingPatterns]);

  return (
    <div className="analytics-container">
      <h3>Enhanced Typing Behavior Analysis</h3>
      <textarea
        ref={textareaRef}
        placeholder="Type your message here..."
        rows={6}
        className="message-textarea"
      />
      <div className="metrics-grid">
        <div className="metric">
          <span>Keystrokes:</span>
          <span>{analytics.totalKeys}</span>
        </div>
        <div className="metric">
          <span>Human Confidence:</span>
          <span>{analytics.humanConfidence.toFixed(1)}%</span>
        </div>
        <div className="metric">
          <span>Anomalies:</span>
          <span>{analytics.anomalyCount}</span>
        </div>
        <div className="metric">
          <span>Is Human:</span>
          <span>{analytics.isHuman ? '✅' : '❌'}</span>
        </div>
      </div>
    </div>
  );
}