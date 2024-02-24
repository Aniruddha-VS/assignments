"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostInput = exports.createPostInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = require("zod");
exports.signupInput = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().min(6),
    email: zod_1.z.string().email(),
});
exports.signinInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.createPostInput = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
});
exports.updatePostInput = exports.createPostInput.partial();
