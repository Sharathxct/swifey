"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.send("Helthy");
});
app.use("/api", routes_1.default);
//@ts-ignore
mongoose_1.default.connect(process.env.MONGODB_URI).then(() => {
    app.listen(3000, () => {
        console.log("Server started on port 3000 and connected to mongodb");
    });
}).catch((e) => console.log(e));
