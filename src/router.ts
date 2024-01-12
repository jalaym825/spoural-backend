import authRouter from './api/auth/index';
import matchRouter from './api/match/index';
import teamRouter from './api/team/index';


function routes(app: any) {
    app.use('/auth', authRouter);
    app.use('/match', matchRouter);
    app.use('/team', teamRouter);
}

export default routes;