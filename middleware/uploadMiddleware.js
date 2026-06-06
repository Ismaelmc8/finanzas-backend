import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.xls', '.xlsx', '.csv'];
  const ext = path.extname(file.originalname);
  cb(null, allowed.includes(ext));
};

const maxSizeBytes = (Number(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

export default multer({ storage, fileFilter, limits: { fileSize: maxSizeBytes } });
