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
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  parentId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
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
  ],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  repostsCount: {
    type: Number,
    default: 0
  }
})

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema)

export default Review;