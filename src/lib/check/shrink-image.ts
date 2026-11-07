// Runs in the browser. Phone screenshots are often several MB; OCR read a
// 1600px JPEG just as well as the original in our tests (2026-11-07), and the
// upload ends up around 50 to 300 KB. Drawing through a canvas also turns
// formats the server can't read (such as HEIC photos on iPhone) into JPEG.
const MAX_SIDE = 1600;
const QUALITY = 0.8;

export async function shrinkImage(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas_unavailable");
  // JPEG has no transparency: without a fill, transparent areas turn black.
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("encode_failed"))),
      "image/jpeg",
      QUALITY,
    ),
  );
}
