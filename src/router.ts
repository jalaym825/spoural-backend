import authRouter from './api/auth/index';

function routes(app: any) {
    app.use('/auth', authRouter);
}

export default routes;