const privacyandnotification = require('../model/privacyAndnotification');

const createPrivacyAndNotification = async (req,res,next) => {
    try{
        const userId = req.userId;
        const {privacy,notifications} = req.body;
        const existingPrivacyAndNotification = await privacyandnotification.findOne({userId: userId});
        if(existingPrivacyAndNotification){
            existingPrivacyAndNotification.privacy = privacy;
            existingPrivacyAndNotification.notifications = notifications;
            const result = await existingPrivacyAndNotification.save();
            return res.status(200).json({
                success: true,
                message:'privacy and notification updated successfully',
                data:result
            });
        }
        else{
            const newPrivacyAndNotification = new privacyandnotification({
                userId: userId,
                privacy: privacy,
                notifications: notifications
            });
            const result = await newPrivacyAndNotification.save();
            return res.status(200).json({
                success: true,
                message:'privacy and notification created successfully',
                data:result
            });
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
    getPrivacyAndNotification
}