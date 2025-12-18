//import partnerProfilemodel from "../models/partnerProfilemodel";
 import PartnerProfile from "../models/partnerProfilemodel.js";

//create and ubdate
 export const createOrUpdateProfile=async(req,res)=>
 {
    try
    {
        const {skills, experience, location, availability}=req.body;
        if(!skills|| !location || !experience)
        {
            return res.status(400).json({message:"all feilds are required"});
        }
        const profile= await PartnerProfile.findOneAndUpdate(
            {user:req.user.id},
            {
                skills,
                experience,
                location,
                availability
            },
            {new:true , upsert:true}
        );
        res.status(200).json({message:"patner profile saved successfully",profile});
    }
    catch(error)
    {
        return res.status(500).json({message:"server error"})
    }
 };

 //to view our prfile 
 export const getMyProfile=async(req,res)=>
 {
    try
    {
        const profile=await PartnerProfile.findOne(
            {
                user: req.user.id
            }
        ).populate("user", "name emailrole");
        if(!profile)
        {
            return res.status(404).json({message:"server error"})
        }
        res.status(200).json(profile);
    }
    catch(error)
    {
        res.status(400).json({message:"server error"})
    }
 }
