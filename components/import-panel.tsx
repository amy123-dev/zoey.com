"use client";
import { useEffect, useState } from "react";
import { FileUp, LoaderCircle, LockKeyhole } from "lucide-react";
type Import = { id:string; file_name:string; size:number; status:string; createdAt:number };
export function ImportPanel() {
  const [items,setItems]=useState<Import[]>([]),[file,setFile]=useState<File|null>(null),[message,setMessage]=useState("登录后可上传你自己的下一季资料。");
  const [busy,setBusy]=useState(false);
  async function load(){try{const r=await fetch('/api/imports');if(r.ok){const d=await r.json() as {imports:Import[]};setItems(d.imports);}}catch{setMessage('暂时无法读取导入记录，请稍后重试。');}}
  useEffect(()=>{load();},[]);
  async function upload(){if(!file)return;setBusy(true);setMessage("");try{const form=new FormData();form.append('file',file);const r=await fetch('/api/imports',{method:'POST',body:form});const d=await r.json() as {error?:string};if(!r.ok){setMessage(d.error||'上传未完成。');return;}setMessage('文件已安全保存到你的导入队列。');setFile(null);await load();}catch{setMessage('网络连接中断，文件尚未确认保存，请重试。');}finally{setBusy(false);}}
  return <section className="import-panel"><div className="import-icon"><FileUp/></div><div><span className="eyebrow">PRIVATE COURSE INBOX</span><h2>上传下一季的课程资料</h2><p>支持文档和 PNG、JPG、WebP 图片，单个文件不超过 25MB。原文件只归上传者所有，不会在公开课程中展示。</p></div><label className="file-picker"><input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)}/><span>{file?file.name:'选择课程文件'}</span></label><button className="primary" disabled={!file||busy} onClick={upload}>{busy?<LoaderCircle className="spin"/>:<FileUp/>}{busy?'正在保存':'加入导入队列'}</button><p className="import-note"><LockKeyhole size={15}/>{message}</p><div className="import-history"><h3>我的导入记录</h3>{items.length?items.map(item=><div key={item.id}><span>{item.file_name}</span><small>{Math.ceil(item.size/1024)} KB · 已安全保存</small></div>):<p>这里会显示你上传的文件。文件保存后可作为下一季的课程资料。</p>}</div></section>;
}
