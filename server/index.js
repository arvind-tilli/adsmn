const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const initApp = require('./src/init/initApp');
const apiRouter = require('./src/apis/routes');


initApp(app).then(() => {
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({
        extended: true,
        limit: '1mb'
    }));
    app.use(cors());
    app.use((req, res, next) => {
        console.log("Req url: ", req.path, " Body of the req: ", req.body);
        next();
    })
    app.get('/test', (req, res) => {
        return res.status(200).json({
            message: "Server is running fine!!!"
        })
    });
    app.use('/apis', apiRouter);

    app.use((req, res, next) => {
        return res.status(404).json({
            success: false,
            message: "😒😒😒Page not found",
            statusCode: 404
        })
    });

    app.listen(PORT, () => {
        console.log(`🎈🎈🎈Server is running on http://localhost:${PORT}`)
    })
})
