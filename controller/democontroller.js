const Employee= require("../model/demoEmployee");

const addEmployee=async (req,res)=>{
    try{
       const user = new Employee(req.body);
       const emp=await user.save()
       res.status(200).json({message:"employee added succesfully",emp})
   }catch (error){
    console.error(error)
       res.status(500).json({ message: "internal server error", error })
   }
}

const getEmpData= async (req,res)=>{
    try{
        const empData=await Employee.find()
        res.status(200).json({ message: "employee Data ", empData })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "internal server error", error })
    }
}
module.exports = { addEmployee, getEmpData}