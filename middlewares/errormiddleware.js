const errorMiddleware=(err,req,res,next)=>{
    console.log(err,"error occure")
    res.status(500).send({
       success: false,
        message:'internal server error ',
       err, 
    })
}

module.exports=errorMiddleware