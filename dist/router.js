"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./api/auth/index"));
const index_2 = __importDefault(require("./api/match/index"));
const index_3 = __importDefault(require("./api/team/index"));
const index_4 = __importDefault(require("./api/player/index"));
const index_5 = __importDefault(require("./api/user/index"));
const index_6 = __importDefault(require("./api/forgotpassword/index"));
const index_7 = __importDefault(require("./api/ticket/index"));
const index_8 = __importDefault(require("./api/test/index"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = require('../swagger-output.json');
function routes(app) {
    app.use('/auth', index_1.default);
    app.use('/matches', index_2.default);
    app.use('/teams', index_3.default);
    app.use('/players', index_4.default);
    app.use('/users', index_5.default);
    app.use('/forgotpassword', index_6.default);
    app.use('/tickets', index_7.default);
    app.use('/test', index_8.default);
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
exports.default = routes;
//# sourceMappingURL=router.js.map