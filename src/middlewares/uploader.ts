import multer from "multer";

export const uploaderMemory = () => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
  });
};
