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
const prisma_1 = require("../config/prisma");
const AppError_1 = __importDefault(require("../errors/AppError"));
class OrganizerController {
    organizersById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = res.locals.decrypt.id;
                console.log(user_id);
                const organizer = yield prisma_1.prisma.organizer.findUnique({
                    where: { user_id },
                    select: {
                        organizer_name: true,
                    },
                });
                console.log(organizer);
                if (!organizer) {
                    throw new AppError_1.default("Organizer Not Found", 404);
                }
                res.status(200).send({ success: true, result: organizer });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = OrganizerController;
