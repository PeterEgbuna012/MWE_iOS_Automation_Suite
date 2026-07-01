"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relative = relative;
const node_path_1 = __importDefault(require("node:path"));
function relative(from, to) {
    if (to === undefined) {
        return (nextTo) => `.${node_path_1.default.sep}${node_path_1.default.relative(from, nextTo)}`;
    }
    return `.${node_path_1.default.sep}${node_path_1.default.relative(from, to)}`;
}
//# sourceMappingURL=path.js.map