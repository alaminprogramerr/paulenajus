const express=require('express')
const app=express()
const PORT=process.env.PORT||5000
const mongoos=require('mongoose')
const bodyParser=require('body-parser')
const cors =require('cors')
const multer=require('multer')
const mailer=require('./mailer')
const userRouter=require('./router/userRouter')


const storage = multer.diskStorage({
    destination:function(req, file , cb){
        cb(null , './uploads/')
    }, 
    filename:function(req, file , cb){
        cb(null ,  Date.now().toString()+file.originalname  )
    }
})

const upload =multer({storage:storage})




app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(userRouter)
app.use(require('./router/chargerRouter'))
app.use(require('./router/chargingRouter'))




app.post('/send-email' ,upload.single('file'), (req, res)=>{
    mailer(
        req.body.from,
        req.body.to.split(','),
        req.body.subject,
        req.body.massage,
        req.file.filename,
        res
    )
})
app.listen(PORT, (req, res)=>{
    console.log('Server started on port ', PORT)
    mongoos.connect('mongodb+srv://car-app:car-app@fiverr.sitlk.mongodb.net/<fiverr>?retryWrites=true&w=majority',{useFindAndModify:false,useUnifiedTopology:true,useNewUrlParser:true},(err=>{
        if(err){
            console.log(err)
            return
        }
        console.log('Mongodb  connected')
    }))
})

