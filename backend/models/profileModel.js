const mongoose=require("mongoose")
const Schema=mongoose.Schema

const educationSchema=new Schema({
    school:{
        type:String,
        default:''

    },
    degree:{
         type:String,
          default:''

    },
    fieldOfStudy:{
         type:String,
          default:''

    }

})
const companySchema=new Schema({
    company:{
        type:String,
        default:''

    },
   position:{
         type:String,
          default:''

    },
    years:{
         type:String,
          default:''

    }

})
const profileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    bio: {
        type: String,
        default: ""
    },

    currPost: {
        type: String
       
    },

    pastWork: [{
        type: Schema.Types.ObjectId,
        ref: "Company"
    }],

    education: [{
        type: Schema.Types.ObjectId,
        ref: "Education"
    }]
});
const Profile=mongoose.model("Profile",profileSchema)
const Education=mongoose.model("Education",educationSchema)
const Company=mongoose.model("Company",companySchema)
module.exports={Profile,Education,Company}