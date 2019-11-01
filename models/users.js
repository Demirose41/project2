const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{ 
        type:String,
        required:true
    },
    email:{ 
        type:String,
        required:true
    },
    password:{ 
        type:String,
        required:true
    }, 
    events: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Event'
    }],
    phone:{ 
        type:Number,
        validate:{
            validator: function(v){
                return /d{10}/.test(v);
            },
            message:'{VALUE} is not a valid 10 digit number!'
        }
    }
})

const User = mongoose.model('User',userSchema);

module.exports = User;