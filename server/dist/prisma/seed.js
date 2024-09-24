"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma = new client_1.PrismaClient();
function deleteAllData(orderedFileName) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathName = path_1.default.basename(orderedFileName, path_1.default.extname(orderedFileName));
        const pathNameSanitized = pathName.charAt(0).toUpperCase() + pathName.slice(1);
        const model = prisma[pathNameSanitized];
        if (model) {
            yield model.deleteMany({});
            console.log(`Cleared data from ${model.name}`);
        }
        else {
            console.error(`Model ${model.name} not found. Please ensure the model name is correctly specified.`);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dataDirectory = path_1.default.join(__dirname, "seedData");
        const orderedFileNames = "quotes.json";
        yield deleteAllData(orderedFileNames);
        const filePath = path_1.default.join(dataDirectory, orderedFileNames);
        const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
        const modelName = path_1.default.basename(orderedFileNames, path_1.default.extname(orderedFileNames));
        const model = prisma[modelName];
        if (!model) {
            console.error(`No Prisma model matches the file name: ${orderedFileNames}`);
        }
        for (const data of jsonData) {
            yield model.create({
                data,
            });
        }
        console.log(`Seeded ${modelName} with data from ${orderedFileNames}`);
    });
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
