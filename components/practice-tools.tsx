"use client";

import { useRef, useState } from "react";
import { Mic, Play, RotateCcw, Square, SpellCheck } from "lucide-react";

function normalize(value: string) {
  return value.toLowerCase().replace(/[.,!?;:'"’\-]/g, "").replace(/\s+/g, " ").trim();
}

export function PracticeTools({ text, resource }: { text: string; resource?: string }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<null | boolean>(null);
  const [recording, setRecording] = useState(false);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function toggleRecord() {
    if (recording) { recorder.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const item = new MediaRecorder(stream);
      chunks.current = [];
      item.ondataavailable = e => chunks.current.push(e.data);
      item.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunks.current, { type: item.mimeType || "audio/webm" }));
        setRecordingUrl(url); setRecording(false); stream.getTracks().forEach(track => track.stop());
      };
      recorder.current = item; item.start(); setRecording(true);
    } catch { setTranscript("浏览器没有拿到麦克风权限。请允许麦克风后再试。"); }
  }
  function transcribe() {
    const Recognition = (window as unknown as { SpeechRecognition?: new () => { lang: string; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onerror: () => void; start: () => void } }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => { lang: string; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onerror: () => void; start: () => void } }).webkitSpeechRecognition;
    if (!Recognition) { setTranscript("此浏览器不支持网页语音识别；录音和回放仍可使用。"); return; }
    const recognition = new Recognition(); recognition.lang = "en-US";
    recognition.onresult = e => setTranscript(e.results[0][0].transcript);
    recognition.onerror = () => setTranscript("没有识别到内容，请再读一次。"); recognition.start();
  }
  return <section className="practice-tools">
    <div className="tool-head"><span>自己说 · 自己写</span>{resource && <a href={resource} target="_blank" rel="noreferrer">打开真人讲解资源 ↗</a>}</div>
    <div className="dictation-row"><label><SpellCheck size={16}/>默写这句话</label><input value={answer} onChange={e => { setAnswer(e.target.value); setChecked(null); }} placeholder="输入你记住的英文" /><button className="secondary" onClick={() => setChecked(normalize(answer) === normalize(text))}>核对</button></div>
    {checked !== null && <p className={checked ? "tool-status good" : "tool-status"}>{checked ? "默写正确。" : <>参考答案：<b>{text}</b></>}</p>}
    <div className="record-row"><button className={recording ? "recording" : "record"} onClick={toggleRecord}>{recording ? <Square size={17}/> : <Mic size={17}/>}{recording ? "结束录音" : "录下跟读"}</button>{recordingUrl && <><audio controls src={recordingUrl} /><button className="icon-button" onClick={() => setRecordingUrl("")} aria-label="删除录音"><RotateCcw size={16}/></button></>}<button className="secondary" onClick={transcribe}><Play size={15}/>识别我说的</button></div>
    {transcript && <p className="tool-status">识别结果：{transcript}</p>}
  </section>;
}
