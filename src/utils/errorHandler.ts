export const errorHandler = (err:any):string => {
    let message = ''
    if(err.code === 11000){
        return "Email already registered"
    }
    if(err.name === 'CastError'){
        return `provided ID(s) are not valid `
    }
    if(err.name === 'ValidationError'){
        for (const key in err.errors) {
            if(err.errors[key].name === "CastError"){
                message += `Id provided at ${err.errors[key].path} is not valid!!!`
            }else{
                message += err.errors[key].message
                message += ', '
            }
        }
        return message.slice(0,message.length -2)
    }
    return err.message
}