import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import express from "express";

const app = express.Router();


const openApi = "3.0.0"
const version = "0.1.0";
const title = "Blank Slate"
const components = {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        }
    }
}

const security = [{
    bearerAuth: []
}]

const Definitions = {
    Account: {
        definition: {
            openapi: openApi,
            info: {
                title: `${title} - Account`,
                version: version,
            },
            components: components,
            security: security
        },
        apis: ['./src/routes/account.js']
    },
    Users: {
        definition: {
            openapi: openApi,
            info: {
                title: `${title} - Media`,
                version: version,
            },
            components: components,
            security: security
        },
        apis: ['./src/routes/users.js']
    },
    Media: {
        definition: {
            openapi: openApi,
            info: {
                title: `${title} - Media`,
                version: version,
            },
            components: components,
            security: security
        },
        apis: ['./src/routes/media.js']
    },
}



const accountSpec = await swaggerJsdoc(Definitions.Account);
const mediaSpec = await swaggerJsdoc(Definitions.Media);
const usersSpec = await swaggerJsdoc(Definitions.Users);

const swagOptionsHome = {
    explorer: true,
    swaggerOptions: {
        urls: [
            {
                url: '/swagger/account',
                name: 'Account API'
            },
            {
                url: '/swagger/users',
                name: 'Users API'
            },
            {
                url: '/swagger/media',
                name: 'Media API'
            },
        ],
    },
    customCss: '.scheme-container { background-color: #fafafa !important }',
    customJs: '/js/swagger_ui.js'
}

app.get('/swagger/account',(req, res) => {
    res.status(200).json(accountSpec)
});

app.get('/swagger/media',(req, res) => {
    res.status(200).json(mediaSpec)
});
app.get('/swagger/users',(req, res) => {
    res.status(200).json(usersSpec)
});

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(accountSpec, swagOptionsHome));



export default app;
