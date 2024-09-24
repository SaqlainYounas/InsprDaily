import {PrismaClient} from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData(orderedFileName: string) {
  const pathName = path.basename(
    orderedFileName,
    path.extname(orderedFileName),
  );

  const pathNameSanitized =
    pathName.charAt(0).toUpperCase() + pathName.slice(1);
  const model: any = prisma[pathNameSanitized as keyof typeof prisma];
  if (model) {
    await model.deleteMany({});
    console.log(`Cleared data from ${model.name}`);
  } else {
    console.error(
      `Model ${model.name} not found. Please ensure the model name is correctly specified.`,
    );
  }
}
async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = "quotes.json";

  await deleteAllData(orderedFileNames);

  const filePath = path.join(dataDirectory, orderedFileNames);
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const modelName = path.basename(
    orderedFileNames,
    path.extname(orderedFileNames),
  );
  const model: any = prisma[modelName as keyof typeof prisma];

  if (!model) {
    console.error(`No Prisma model matches the file name: ${orderedFileNames}`);
  }

  for (const data of jsonData) {
    await model.create({
      data,
    });
  }

  console.log(`Seeded ${modelName} with data from ${orderedFileNames}`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
