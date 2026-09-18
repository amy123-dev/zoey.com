import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";

const allowed = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp"]);
const maximum = 25 * 1024 * 1024;

async function identity() { const user = await getChatGPTUser(); return user?.userId ?? (process.env.NODE_ENV === "development" ? "local-preview" : null); }

export async function GET() {
  const user = await identity(); if (!user) return Response.json({ error: "请登录后查看自己的导入文件。" }, { status: 401 });
  const db = env.DB; if (!db) return Response.json({ error: "导入服务暂时不可用。" }, { status: 503 });
  const result = await db.prepare("SELECT id,file_name,content_type,size,status,created_at AS createdAt FROM course_imports WHERE user_id=? ORDER BY created_at DESC LIMIT 20").bind(user).all();
  return Response.json({ imports: result.results }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const user = await identity(); if (!user) return Response.json({ error: "请先登录，再保存你的课程文件。" }, { status: 401 });
  const origin = request.headers.get("origin"); if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "请求来源不匹配。" }, { status: 403 });
  const form = await request.formData().catch(() => null); const file = form?.get("file");
  if (!(file instanceof File) || !allowed.has(file.type) || file.size < 1 || file.size > maximum) return Response.json({ error: "请上传 25MB 以内的文档或 PNG、JPG、WebP 图片。" }, { status: 400 });
  const db = env.DB, bucket = env.COURSE_FILES; if (!db || !bucket) return Response.json({ error: "导入存储暂时不可用。" }, { status: 503 });
  const id = crypto.randomUUID(), objectKey = `imports/${user}/${id}/${file.name.replace(/[^\w.()-]/g, "_")}`;
  await bucket.put(objectKey, file.stream(), { httpMetadata: { contentType: file.type } });
  await db.prepare("INSERT INTO course_imports(id,user_id,file_name,object_key,content_type,size,status,created_at) VALUES(?,?,?,?,?,?,?,?)").bind(id,user,file.name,objectKey,file.type,file.size,"received",Date.now()).run();
  return Response.json({ id, status: "received" }, { status: 201 });
}
