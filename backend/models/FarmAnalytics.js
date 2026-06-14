const mongoose =
require("mongoose");

const FarmAnalyticsSchema =
new mongoose.Schema({

  farmId:{

    type:
    mongoose.Schema.Types.ObjectId,

    ref:"Farm",

    required:true

  },

  analytics:Object,

  stresses:Array,

  recommendations:Object,

  cropAdvice:Array,

  yieldData:Object,

  aiAnalysis:String,

  timeline:Array,

  imageDate:String

},
{
  timestamps:true
});

module.exports =
mongoose.model(
  "FarmAnalytics",
  FarmAnalyticsSchema
);