const mongoose =
require("mongoose");

const ChatSchema =
new mongoose.Schema({

  farmId:{
    type:
    mongoose.Schema.Types.ObjectId,

    ref:"Farm",

    required:true
    },

  role:{
    type:String,
    required:true
  },

  message:{
    type:String,
    required:true
  }

},
{
 timestamps:true
});

module.exports =
mongoose.model(
 "Chat",
 ChatSchema
);