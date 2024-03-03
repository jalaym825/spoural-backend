import authRouter from './api/auth/index';
import matchRouter from './api/match/index';
import teamRouter from './api/team/index';
import playerRouter from './api/player/index';
import userRoutes from './api/user/index';
import ticketRouter from './api/ticket/index';
function routes(app: any) {
    app.use('/auth', authRouter);
    app.use('/matches', matchRouter);
    app.use('/teams', teamRouter);
    app.use('/players', playerRouter);
    app.use('/users', userRoutes);
    app.use('/tickets', ticketRouter)
}

export default routes;