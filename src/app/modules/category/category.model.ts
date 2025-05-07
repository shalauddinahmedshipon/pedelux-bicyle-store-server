import { model, Schema } from 'mongoose';

import slugify from 'slugify';
import { TCategory } from './category.interface';

const CategorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Category = model<TCategory>('Category', CategorySchema);
