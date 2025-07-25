import fs from "fs";
import path from "path";

const targetPath = path.join(
  __dirname,
  "..",
  "prisma",
  "generated",
  "client",
  "schema.prisma"
);

if (fs.existsSync(targetPath)) {
  fs.unlinkSync(targetPath);
  console.log(
    "🧹 File 'schema.prisma' di 'generated/client' berhasil dihapus."
  );
} else {
  console.log("✅ Tidak ada file schema.prisma di generated/client. Aman.");
}
