import mongoose, { Schema, Document, Model } from 'mongoose';
import { TravelPackage, ItineraryDay } from '@/types/travel';

export interface IPackageDocument extends Omit<TravelPackage, 'id'>, Document {
  id: string;
}

const ItineraryDaySchema = new Schema<ItineraryDay>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mealsIncluded: { type: [String], default: [] },
    stay: { type: String },
    highlights: { type: [String], default: [] },
  },
  { _id: false }
);

const PackageSchema = new Schema<IPackageDocument>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, index: true },
    tagline: { type: String, default: '' },
    destinationType: {
      type: String,
      enum: ['domestic', 'international'],
      required: true,
      index: true,
    },
    destinationName: { type: String, required: true, index: true },
    regionOrCountry: { type: String, required: true },
    durationNights: { type: Number, required: true, default: 3 },
    durationDays: { type: Number, required: true, default: 4 },
    startingPriceINR: { type: Number, required: true, index: true },
    originalPriceINR: { type: Number },
    isPriceVerified: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    badge: { type: String },
    categories: {
      type: [String],
      default: ['Family Vacation'],
      index: true,
    },
    heroImage: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
    overview: { type: String, default: '' },
    bestTimeToVisit: { type: String, default: 'Year Round' },
    route: { type: String, default: '' },
    itinerary: { type: [ItineraryDaySchema], default: [] },
    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    hotelCategory: { type: String, default: '4-Star Verified Stays' },
    cancellationPolicy: { type: [String], default: [] },
    importantNotes: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'published',
      index: true,
    },
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

// Prevent model recompilation during hot reloads
const PackageModel: Model<IPackageDocument> =
  mongoose.models.Package || mongoose.model<IPackageDocument>('Package', PackageSchema);

export default PackageModel;
