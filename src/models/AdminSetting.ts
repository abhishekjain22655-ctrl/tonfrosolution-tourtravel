import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminSettingDocument extends Document {
  key: string;
  value: any;
  updatedAt: Date;
}

const AdminSettingSchema = new Schema<IAdminSettingDocument>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

const AdminSettingModel: Model<IAdminSettingDocument> =
  mongoose.models.AdminSetting || mongoose.model<IAdminSettingDocument>('AdminSetting', AdminSettingSchema);

export default AdminSettingModel;
