import mongoose, { Schema, Document, Model } from 'mongoose';
import { DestinationInfo } from '@/types/travel';

export interface IDestinationDocument extends Omit<DestinationInfo, 'id'>, Document {
  id: string;
}

const DestinationSchema = new Schema<IDestinationDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['domestic', 'international'],
      required: true,
      index: true,
    },
    stateOrCountry: { type: String, required: true },
    heroImage: { type: String, required: true },
    shortDescription: { type: String, required: true },
    bestMonths: { type: String, default: 'Year Round' },
    startingPriceINR: { type: Number, required: true, default: 0 },
    packageCount: { type: Number, default: 0 },
    popularHighlights: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

const DestinationModel: Model<IDestinationDocument> =
  mongoose.models.Destination || mongoose.model<IDestinationDocument>('Destination', DestinationSchema);

export default DestinationModel;
