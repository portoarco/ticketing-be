import dotenv from "dotenv";
dotenv.config();
import  cors from 'cors';
import express, { Application,Request,Response } from "express";


const PORT:string = process.env.PORT || "8000"

class App {
    public app:Application;
    constructor(){
        this.app = express();
        this.configure();
        this.route();
    }

    private configure():void{
        this.app.use(cors());
        this.app.use(express.json());
    }
    private route():void {
        this.app.get("/",(req:Request,res:Response)=>{
            res.status(200).send("<h1>This is Main Page</h1>")
        })
    }
    public start():void {
        this.app.listen(PORT,()=>{
            console.log(`API is Running at http://localhost:${PORT}`);
        })
    }
}

export default App;