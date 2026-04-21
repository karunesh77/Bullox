import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  body: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: Date;
  symbols: string[];
  category: string;
  aiMeta: {
    sentiment: 'bullish' | 'bearish' | 'neutral';
    impact: 'low' | 'medium' | 'high';
    summary: string;
    keywords: string[];
  };
  createdAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    body: { type: String, default: '' },
    summary: { type: String, default: '' },
    source: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    imageUrl: { type: String },
    publishedAt: { type: Date, required: true },
    symbols: [{ type: String }],
    category: { type: String, default: 'general' },
    aiMeta: {
      sentiment: { type: String, enum: ['bullish', 'bearish', 'neutral'], default: 'neutral' },
      impact: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      summary: { type: String, default: '' },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

// Index for fast queries
NewsSchema.index({ publishedAt: -1 });
NewsSchema.index({ symbols: 1 });
NewsSchema.index({ category: 1 });

export const NewsModel = mongoose.model<INews>('News', NewsSchema);
