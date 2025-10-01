const path = require('path');
const fs = require('fs');
const multer = require('multer');

const MINUTES_DIR = path.join(__dirname, '..', 'uploads', 'meeting-minutes');
fs.mkdirSync(MINUTES_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, MINUTES_DIR),
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-z0-9_.-]/gi, '_');
    cb(null, `${ts}__${safe}`);
  }
});

function pdfOnly(_req, file, cb) {
  if (file.mimetype !== 'application/pdf') return cb(new Error('PDF files only'));
  cb(null, true);
}

const upload = multer({ storage, fileFilter: pdfOnly, limits: { fileSize: 15 * 1024 * 1024 } });

module.exports = { upload, MINUTES_DIR };
