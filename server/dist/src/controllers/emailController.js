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
exports.addEmailController = addEmailController;
exports.removeEmailController = removeEmailController;
const prisma_1 = require("../lib/Db/prisma");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function addEmailController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, timeZone } = req.body;
            if (!email) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Email Required!", // Provide specific validation errors
                });
            }
            if (!timeZone) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Please Provide Timezone!", // Provide specific validation errors
                });
            }
            // Check if the timezone exists in the Timezone table
            let existingTimezone = yield prisma_1.db.timezone.findUnique({
                where: { value: timeZone.value },
            });
            // If the timezone doesn't exist, create it
            if (!existingTimezone) {
                existingTimezone = yield prisma_1.db.timezone.create({
                    data: {
                        value: timeZone.value,
                        label: timeZone.label,
                        offset: timeZone.offset,
                        abbrev: timeZone.abbrev,
                    },
                });
            }
            // Now create the user with the provided email and associate it with the timezone
            const newUser = yield prisma_1.db.user.create({
                data: {
                    email,
                    timeZone: {
                        connect: { id: existingTimezone.id },
                    },
                },
            });
            return res.status(200).json({
                status: 200,
                message: "User and Timezone created successfully!",
                data: newUser,
            });
        }
        catch (error) {
            res.status(500).json({
                status: "Failed",
                message: "Something went wrong, please try again.",
            });
        }
    });
}
function removeEmailController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Id Required!", // Provide specific validation errors
                });
            }
            const dbData = yield prisma_1.db.user.findUnique({
                where: {
                    id,
                },
            });
            if (!dbData) {
                return res.status(500).json({
                    status: "Failed",
                    message: "Data doesn't exist.", // Provide specific validation errors
                });
            }
            yield prisma_1.db.user.delete({
                where: {
                    id: dbData.id,
                },
            });
            res.status(200).json({
                status: 200,
                message: "Unsubscribe Successful",
            });
        }
        catch (error) {
            res.status(500).json({
                status: "Failed",
                message: "Something went wrong, please try again.",
            });
        }
    });
}
