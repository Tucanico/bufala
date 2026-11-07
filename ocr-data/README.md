# OCR language data

`ita.traineddata.gz` and `eng.traineddata.gz` are Tesseract's "best_int" LSTM models, copied from the npm packages `@tesseract.js-data/ita` and `@tesseract.js-data/eng` 1.0.0 (folder `4.0.0_best_int`, MIT). They come from the Tesseract `tessdata_best` models (Apache 2.0).

They live here because tesseract.js 7.0.0 can only load several languages from one local folder (languages passed as data are broken in that version). See `src/lib/check/ocr.ts`.
