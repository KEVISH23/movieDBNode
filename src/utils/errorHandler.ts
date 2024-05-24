export const errorHandler = (err:any):string => {
    let message = ''
    if(err.code === 11000){
        return "Email already registered"
    }
    if(err.name === 'ValidationError'){

        for (const key in err.errors) {
            message += err.errors[key].message
            message += ', '
        }
        return message.slice(0,message.length -2)
    }
    return err.message
}