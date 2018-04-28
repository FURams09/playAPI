import BaseRoutes from './base-routes';
import ReduxCourse from './redux-course';

const Index = (app, db) => {
    //Universal Home
    app.get('/', (req, res) => {
        res.send('Hooked Up');
    });

    BaseRoutes(app, db);
    ReduxCourse(app, db);


    //add future calls here
}

export default Index;