"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT ?? '8080', 10);
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));
app.use((0, compression_1.default)());
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production' &&
        req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(301, `https://${req.headers.host ?? ''}${req.url}`);
        return;
    }
    next();
});
app.use('/assets/images', express_1.default.static(path_1.default.join(__dirname, '..', 'assets', 'images'), {
    maxAge: '1y',
    immutable: true,
}));
app.use('/assets/css', express_1.default.static(path_1.default.join(__dirname, '..', 'assets', 'css'), {
    maxAge: '30d',
}));
app.use('/assets/js', express_1.default.static(path_1.default.join(__dirname, '..', 'assets', 'js'), {
    maxAge: '30d',
}));
app.use(express_1.default.static(path_1.default.join(__dirname, '..'), {
    maxAge: '2d',
}));
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'max-estates-59' });
});
app.get('/thank-you', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'thank-you.html'));
});
app.get('/privacy-policy', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'privacy-policy.html'));
});
app.get('/{*path}', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`[Max Estates 59] Server running on port ${PORT}`);
    console.log(`[Max Estates 59] Environment: ${process.env.NODE_ENV ?? 'development'}`);
});
exports.default = app;
