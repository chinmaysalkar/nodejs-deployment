const errorMiddleware=(err,req,res,next)=>{
    console.log(err,"error occure")
    const defaultError={
       statuscode:500,
        message:'internal server error ',
       err, 
    }
    //missing value
    if(err.error=="validationError"){
        defaultError.statuscode=400
        defaultError.message= Object.values(err.error)
        .map(item=> item.message)
        .join(',')
    }

    //duplicate error
    if (err.code&&err.code===11000){
        defaultError.statuscode=400
        defaultError.message=`${Object.keys(err.keyValue)} field must be unique`
    }
}

module.exports=errorMiddleware