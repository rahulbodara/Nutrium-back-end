const privacyandnotification = require('../model/privacyAndnotification');
const User = require('../model/User');

const createPrivacyAndNotification = async (userId) => {
    try{
       const user = await User.findOne({_id: userId});
       const defaultData = {
        "privacy":{
            "termsofuse":"I accept the Terms and Conditions",
            "privacypolicy":"I accept the Privacy Policy"
        },
        "notifications":{
            "marketingcommunications":"I want to receive all communications",
            "browsernotifications":"I want to receive notifications",
            "emailswithdailyhighlights":"I want to get emails with daily highlights",
            "emailswithmymonthlystatistics":"I want to get emails with my monthly statistics"
        }
       }

       const privacy = new privacyandnotification({
            userId: userId,
            ...defaultData
       })
       const result = await privacy.save();
    }
    catch(err){
        console.log(err);
    }
}

const updatePrivacyAndNotifications = async(req,res, next) => {
    try {

        const userId = req.userId;
        const updateFields = req.body;
        const existingPrivacy = await privacyandnotification.findOne({userId:userId});

        if(existingPrivacy){

            for(let field in updateFields){
                if(existingPrivacy.privacy.hasOwnProperty(field)){
                    existingPrivacy.privacy[field] = updateFields[field];
                }
                if(existingPrivacy.notifications.hasOwnProperty(field)){
                    existingPrivacy.notifications[field] = updateFields[field];
                }
            }

            const result = await existingPrivacy.save();
            return res.status(201).json({success:true,message:"privacy and notifications updated successfully",data:result})
        }

    }
    catch(err){
        next(err);
    }
}

const getPrivacyAndNotification = async (req, res, next) => {
    try{
        const userId = req.userId;
        const existingPrivacyAndNotification = await privacyandnotification.findOne({userId: userId});
        if(existingPrivacyAndNotification){
            return res.status(200).json({
                success: true,
                message:'privacy and notification retrieved successfully',
                data:existingPrivacyAndNotification
            });
        }
        else{
            return res.status(404).json({
                success: false,
                message:'privacy and notification not found'
            });
        }
    }
    catch(err){
        next(err);
    }
}


module.exports = {
    createPrivacyAndNotification,
    getPrivacyAndNotification,
    updatePrivacyAndNotifications
}