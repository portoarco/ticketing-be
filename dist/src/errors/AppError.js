"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError {
    constructor(_message, _rc) {
        (this.rc = _rc), (this.message = _message);
        this.success = false;
    }
}
exports.default = AppError;
