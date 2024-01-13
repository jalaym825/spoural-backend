import authRouter from './api/auth/index';
import matchRouter from './api/match/index';
import teamRouter from './api/team/index';
import playerRouter from './api/player/index';
import userRoutes from './api/user/index';
function routes(app: any) {
    app.use('/auth', authRouter);
    app.use('/matches', matchRouter);
    app.use('/teams', teamRouter);
    app.use('/players', playerRouter);
    app.use('/users', userRoutes);
}

export default routes;