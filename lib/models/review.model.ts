import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  parentId: {
    type: String,
  },
  songTitle: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  listenedBefore: {
    type: Boolean,
    default: false
  },
  dateListened: {
    type: Date,
    default: Date.now
  },
  image: String,
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)

export default Review;