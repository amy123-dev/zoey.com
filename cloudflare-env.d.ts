declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    COURSE_FILES?: R2Bucket;
  }
}
