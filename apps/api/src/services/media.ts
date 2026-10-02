// ─────────────────────────────────────────────────────────────────────────────
// Media Service — Vercel Blob upload / deletion with permission guards
// ─────────────────────────────────────────────────────────────────────────────

export type MediaPurpose =
  | 'platform_logo'
  | 'event_hero'
  | 'event_logo'
  | 'page_cta'
  | 'nominee_photo'
  | 'category_image'
  | 'gallery_image'
  | 'sponsor_logo'
  | 'favicon'
  | 'other';

export interface UploadedMedia {
  url: string;
  pathname: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
]);

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

export class MediaService {
  private isVercelBlobConfigured: boolean;

  constructor() {
    this.isVercelBlobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  }

  /**
   * Validate file before upload — permission-checked regardless of storage backend
   */
  validateFile(file: { mimetype: string; size: number; originalname: string }): { valid: boolean; error?: string } {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return {
        valid: false,
        error: `File type "${file.mimetype}" is not allowed. Accepted types: JPEG, PNG, WebP, GIF, AVIF, SVG.`,
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds the 8MB maximum.`,
      };
    }

    return { valid: true };
  }

  /**
   * Upload file buffer to Vercel Blob storage
   * Falls back to local URL string in dev when BLOB_READ_WRITE_TOKEN is absent
   */
  async upload(
    buffer: Buffer,
    filename: string,
    mimeType: string,
    purpose: MediaPurpose,
    entityId?: string
  ): Promise<UploadedMedia> {
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const pathname = `${purpose}/${entityId ? `${entityId}/` : ''}${Date.now()}_${safeName}`;

    if (this.isVercelBlobConfigured) {
      const { put } = await import('@vercel/blob');
      const blob = await put(pathname, buffer, {
        access: 'public',
        contentType: mimeType,
        addRandomSuffix: false,
      });

      return {
        url: blob.url,
        pathname: blob.pathname,
        filename: safeName,
        mimeType,
        sizeBytes: buffer.byteLength,
      };
    }

    // Dev mode: return a local placeholder path
    console.log(`[Media Service - DEV MODE] Would upload: ${pathname} (${buffer.byteLength} bytes)`);
    return {
      url: `/uploads/${pathname}`,
      pathname,
      filename: safeName,
      mimeType,
      sizeBytes: buffer.byteLength,
    };
  }

  /**
   * Delete a media asset from Vercel Blob by its pathname
   */
  async delete(pathname: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isVercelBlobConfigured) {
      console.log(`[Media Service - DEV MODE] Would delete: ${pathname}`);
      return { success: true };
    }

    try {
      const { del } = await import('@vercel/blob');
      await del(pathname);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Blob deletion error';
      console.error('[Media Service] Delete failed:', message);
      return { success: false, error: message };
    }
  }
}
