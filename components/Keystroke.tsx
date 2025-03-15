"use client";
import { Question } from "@/data/questions";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";

type KeystrokeMetrics = {
  key: string;
  keyDownTime: number;
  keyUpTime: number;
  latency: number;
  flightTime: number;
};

type Analytics = {
  totalKeys: number;
  humanConfidence: number;
  anomalyCount: number;
  isHuman: boolean;
};

type Answers = {
  [key: string]: string;
};

export default function KeystrokeAnalytics({
  showResults,
  results,
  question,
  setTabSwitchCount,
  answers,
  setAnswers,
  handlePasteAttempt,
}: {
  showResults: boolean;
  results: { [key: number]: boolean };
  question: Question;
  answers: Answers;
  setTabSwitchCount: Dispatch<SetStateAction<number>>;
  setAnswers: Dispatch<SetStateAction<{ [key: number]: string }>>;
  handlePasteAttempt: () => void;
}) {
  const [metrics, setMetrics] = useState<KeystrokeMetrics[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalKeys: 0,
    humanConfidence: 0,
    anomalyCount: 0,
    isHuman: true,
  });
  let updated = useRef(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastKeyUpTime = useRef<number>(0);
  const sequenceBuffer = useRef<KeystrokeMetrics[]>([]);

  const analyzeTypingPatterns = useCallback(() => {
    if (sequenceBuffer.current.length < 10) return;

    const latencies = sequenceBuffer.current.map((m) => m.latency);
    const flightTimes = sequenceBuffer.current.map((m) => m.flightTime);
    const backspaceCount = sequenceBuffer.current.filter(
      (m) => m.key === "Backspace"
    ).length;

    const anomalyCount = sequenceBuffer.current.filter(
      (m) =>
        m.latency < 20 ||
        m.latency > 500 ||
        m.flightTime < 15 ||
        m.flightTime > 1000
    ).length;

    let humanConfidence = 50;
    if (backspaceCount > 0) humanConfidence += 20;
    if (anomalyCount < 2) humanConfidence += 15;
    if (calculateStdDeviation(latencies) > 25) humanConfidence += 10;
    if (calculateStdDeviation(flightTimes) > 50) humanConfidence += 10;

    const isHuman = humanConfidence >= 70;
    setAnalytics({
      totalKeys: metrics.length,
      humanConfidence: Math.min(humanConfidence, 100),
      anomalyCount,
      isHuman,
    });
    if (!isHuman && !updated.current) {
      updated.current = true;
      setTabSwitchCount((prev) => prev + 1);
    }
  }, [metrics]);

  const calculateStdDeviation = (data: number[]): number => {
    if (data.length < 2) return 0;
    const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
    const variance =
      data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
      data.length;
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
      const flightTime =
        sequenceBuffer.current.length > 0
          ? now -
          sequenceBuffer.current[sequenceBuffer.current.length - 1].keyUpTime
          : 0;

      const newMetric: KeystrokeMetrics = {
        key: e.key,
        keyDownTime: lastKeyUpTime.current,
        keyUpTime: now,
        latency,
        flightTime,
      };

      setMetrics((prev) => [...prev, newMetric]);
      sequenceBuffer.current = [
        ...sequenceBuffer.current.slice(-50),
        newMetric,
      ];
      lastKeyUpTime.current = now;
    };

    const textarea = textareaRef.current;
    textarea?.addEventListener("keydown", handleKeyDown);
    textarea?.addEventListener("keyup", handleKeyUp);

    return () => {
      textarea?.removeEventListener("keydown", handleKeyDown);
      textarea?.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const analysisInterval = setInterval(analyzeTypingPatterns, 500);
    return () => clearInterval(analysisInterval);
  }, [analyzeTypingPatterns]);

  return (
    <>
      <textarea
        className={`${showResults
          ? results[question.id]
            ? "border-green-500"
            : "border-red-500"
          : "border-transparent"
          } border-2 w-full bg-gray-700 p-2 rounded-lg px-4 text-white`}
        rows={4}
        disabled={showResults}
        value={answers[question.id] || ""}
        onChange={(e) =>
          setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
        }
        ref={textareaRef}
        onPaste={(e) => {
          e.preventDefault();
          handlePasteAttempt();
        }}
        onDrop={(e) => {
          e.preventDefault();
          handlePasteAttempt();
        }}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.metaKey) {
            if (e.key === "v") {
              e.preventDefault();
              handlePasteAttempt();
            }
          }
        }}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
      />
      {!analytics.isHuman && (
        <p className="text-sm text-white opacity-60 font-medium">
          Bot detected 🤖❌
        </p>
      )}
    </>
  );
}
