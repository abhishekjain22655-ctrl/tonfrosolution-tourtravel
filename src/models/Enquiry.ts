import mongoose, { Schema, Document, Model } from 'mongoose';
import { CustomerEnquiry } from '@/types/travel';

export interface IEnquiryDocument extends Omit<CustomerEnquiry, 'id'>, Document {
  id: string;
}

const EnquirySchema = new Schema<IEnquiryDocument>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, required: true },
    tripType: {
      type: String,
      enum: ['domestic', 'international'],
      required: true,
    },
    destinationPreference: { type: String, required: true },
    departureCity: { type: String, default: '' },
    travelDateApprox: { type: String, default: '' },
    adultsCount: { type: Number, default: 2 },
    childrenCount: { type: Number, default: 0 },
    approxBudgetINR: { type: String, default: '' },
    additionalNotes: { type: String, default: '' },
    originPackageSlug: { type: String },
    originPackageTitle: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'converted', 'archived'],
      default: 'new',
      index: true,
    },
    internalNotes: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        ret.createdAt = ret.createdAt?.toISOString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

const EnquiryModel: Model<IEnquiryDocument> =
  mongoose.models.Enquiry || mongoose.model<IEnquiryDocument>('Enquiry', EnquirySchema);

export default EnquiryModel;
