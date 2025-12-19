import partnerProfilemodel from "../models/partnerProfilemodel";
import Service from "../models/service";
export const  createService=async(req,res)=>
{
    try
    {
        const{title,descprition,price,duration}=req.body;
        if(!title || !descprition || !price || duration)
        {
            return res.status(400).json({message:"all feilds are required"});
        }
        const profile=await Service.create({
            patner:req.user.id,
            title,
            descprition,
            price,
            duration
        });
        return res.status(200).json({message:"service created",service});
    }
    catch(error)
    {
        return res.status(400).json({message:"server error"})
    }
}
//patner can view his services
export const getMyServices = async (req, res) => 
{
  try 
  {
    const services = await Service.find({ partner: req.user.id });
    res.status(200).json(services);
  } 
  catch (error) 
  {
    res.status(500).json({ message: "Server error" });
  }
};
//Users view all active services
export const getAllServices = async (req, res) => {
  try 
  {
    const services = await Service.find({ isActive: true }).populate("partner", "name");
    res.status(200).json(services);
  } 
  catch (error) 
  {
    res.status(500).json({ message: "Server error" });
  }
};
