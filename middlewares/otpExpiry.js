const oneMinuteExpiry =async(otpTime) =>{
    try {
        console.log('Timestamp is:-  '+otpTime)
        const c_date = new Date();
        var differenceValue = (otpTime - c_date.getTime())/1000;
        differenceValue /=60;

        console.log('Expiry minutes:-  '+Math.abs (differenceValue))
        if (Math.abs (differenceValue) >1) {
            return true;
        } 
        return false;
        
        
    } catch (error) {
        return res.status(400)
      .json({ success: false, 
        error: error.message });
        
    }
}

const threeMinuteExpiry =async(otpTime) =>{
    try {
        console.log('Timestamp is:-  '+otpTime)
        const c_date = new Date();
        var differenceValue = (otpTime - c_date.getTime())/1000;
        differenceValue /=60;

        console.log('Expiry minutes:-  '+Math.abs (differenceValue))
        if (Math.abs (differenceValue) >3) {
            return true;
        } 
        return false;
        
        
    } catch (error) {
        return res.status(400)
      .json({ success: false, 
        error: error.message });
        
    }
}
module.exports ={
    oneMinuteExpiry, threeMinuteExpiry
}