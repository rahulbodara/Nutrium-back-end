const mongoose = require('mongoose');

const professionalPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
      },
    systempreference: {

        timezone:{
            type: String,
        },
        language:{
            type: String,
        },
        weightunit:{
            type: String,
        },
        legnthunit:{
            type: String,
        },
        energyunit:{
            type: String,
        },
        volumeunit:{

        },
        distanceunit:{
            type: String,
        },
        statisticmeasure:{
            type: String,
        }
    },
    calendarsettings:{

      birtdaysystem:{
        type: String,
      },
      appointmentrequestsystem:{
        type: String,
      }
    },
    presets:{
        accesstomobileapp:{
            type: String,
        },
        clientmessages:{
            type: String,
        },
        clientweightregistration:{
            type: String,
        },
        appointementconfirmation:{
            type: String,
        },
        fooddiary:{
            type: String,
        },
        nutritionalinformation:{
            type: String,
        },
        clientreviews:{
            type: String,
        }
    },
    appointementreference:{
        status:{
            type: String,
        },
        appointementnotification:{
            type: Array
        }
    },
    nutritionassessmentformconfiguration:{

        appointementinformation:{
            type: Array,
        },
        personalandsocialhistory:{
            type: Array,
        },
        dietaryhistory:{
            type: Array,
        },
        medicalhistory:{
            type: Array,
        },
        gestationalinformation:{
            type: Array,
        },
        finalconsideration:{
            type: Array,
        }
    },
    emailandprintingpreference:{

        mealplanemailsubject:{
            type: String,
        },
        mealplanemailbody:{
            type: String,
        },
        mealplansections:{
            type: Array,
        },
        printingdesign:{
            type: String
        },
        multipledaysprintinglayout:{
            type: String
        },
        fontsizeoftheprints:{
            type: String
        }
    },
    mealplansettings:{

        lunchanddinnersection:{
            type: Array
        },
        fooddatabases:{
            type: Array
        }
    },
    measurementspreferences:{

        deducemeasurements:{
            type: String
        },
        anthropometricmeasurements:{
            type: Array
        },
        analyticaldata:{
            type: Array
        },
        bodycompotion:{
            type: Array
        }
    }
        
},{timestamps:true})

module.exports =  mongoose.model('professionalPreference',professionalPreferenceSchema)