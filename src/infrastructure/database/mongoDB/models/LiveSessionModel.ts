
import { LiveSessionStatus } from "@domain/entities/LiveSession";
import { Schema, Types, model } from "mongoose";


export interface LiveSessionDoc{
    _id:Types.ObjectId;
    courseId:Types.ObjectId;
    courseTitle:string;
    instructorId:Types.ObjectId;
    instructorName:string;
    description:string|null;
    status:LiveSessionStatus;
    scheduledAt:Date;
    startedAt:Date|null;
    endedAt:Date|null;
    durationInMinutes:number;
    meetingRoomId:string;
    createdAt:Date;
    updatedAt:Date;
    cancelledAt:Date|null;
    recordingURI:string|null;
    isPublished:boolean;
}

const LiveSessionSchema = new Schema<LiveSessionDoc>(
  {
    courseId: { type: Schema.Types.ObjectId, required: true ,ref:"Course"},
    courseTitle: { type: String , required:true},
    instructorId: { type: Schema.Types.ObjectId, required: true,ref:"Instructor" },
    instructorName: { type: String , required:true},
    description: { type: String , default:null},

    status: {
      type: String,
      enum: Object.values(LiveSessionStatus),
      default: LiveSessionStatus.Scheduled,
    },

    scheduledAt: { type: Date, required: true },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    cancelledAt:{type: Date, default:null},
    durationInMinutes: { type: Number,required:true },
    meetingRoomId: { type: String, required:true },
    isPublished:{type:Boolean, default:false},
    recordingURI:{type:String, default:null}
  },
  { timestamps: true }
);

export const LiveSessionModel = model("LiveSession", LiveSessionSchema);
