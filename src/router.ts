import authRouter from './api/auth/index';
import matchRouter from './api/match/index';
import teamRouter from './api/team/index';
import playerRouter from './api/player/index';
import userRoutes from './api/user/index';
import forgotpassword from './api/forgotpassword/index'
import ticketRouter from './api/ticket/index';
import testRouter from './api/test/index'
import swaggerUi from 'swagger-ui-express';

const swaggerDocument  = require('../swagger-output.json');

function routes(app: any) {
    app.use('/auth', authRouter);
    app.use('/matches', matchRouter);
    app.use('/teams', teamRouter);
    app.use('/players', playerRouter);
    app.use('/users', userRoutes);
    app.use('/forgotpassword',forgotpassword);
    app.use('/tickets', ticketRouter);
    app.use('/test', testRouter);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

export default routes;