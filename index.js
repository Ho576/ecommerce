import 'dotenv/config.js'
import express from 'express'
import initApp from './src/app.router.js'

const app = express();
const PORT = process.env.PORT || 4000;

initApp(app,express);

app.listen(PORT,()=>{
    console.log(`servet is running .... ${PORT}`);
});