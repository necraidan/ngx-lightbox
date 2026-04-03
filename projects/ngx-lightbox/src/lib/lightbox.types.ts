/** Describes an image to display inside the lightbox. */
export interface LightboxImage {
  /** URL of the full-size image, a blob URL, or a Blob/File object. */
  src: string | Blob;
  /** Accessible description used as the `alt` attribute. */
  alt: string;
  /** Intrinsic width in pixels, used to compute the aspect ratio. */
  width: number;
  /** Intrinsic height in pixels, used to compute the aspect ratio. */
  height: number;
}
