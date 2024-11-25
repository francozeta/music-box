'use server'

import { connectToDB } from '../mongoose'
import { revalidatePath } from 'next/cache'

import User from '../models/user.model'
import Review from '../models/review.model'
import Community from '../models/community.model'

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB()

    // Calculate the number of posts to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize

    // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
    const postQuery = Review.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .select('image songTitle artist rating createdAt text likes') // remove text from review model
      .populate({
        path: 'author',
        model: User
      })
      .populate({
        path: 'community',
        model: Community,
      })
      .populate({
        path: 'children',  // Populate the children field
        populate: {
          path: 'author', // Populate the author field within children
          model: User,
          select: '_id name parentId image' // Select only _id and username fields of the author
        }
      })
    // Count the total number of top-level posts (reviews) i.e., reviews that are not comments.
    const totalPostCount = await Review.countDocuments({
      parentId: { $in: [null, undefined] },
    }) // Get the total count of posts

    const posts = await postQuery.exec()

    const isNext = totalPostCount > skipAmount + posts.length

    return { posts, isNext }
  } catch (err) {
    //@ts-expect-error ***err.message***
    console.error(`Error while fetching posts: ${err.message}`)
    throw new Error('Unable to fetch posts')

  }
}

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
  // NOTE: Add new fields to the Params interface: songTitle, artist, rating, listenedBefore
  songTitle: string,
  artist: string,
  rating: number,
  listenedBefore: boolean,
  dateListened: Date
  image: string
}

export async function createReview({
  text,
  author,
  communityId,
  path,
  // NOTE: Add new fields to the Params interface: songTitle, artist, rating, listenedBefore
  songTitle,
  artist,
  rating,
  listenedBefore,
  dateListened,
  image
}: Params) {
  try {
    connectToDB()

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    )

    const createdReview = await Review.create({
      text,
      author,
      community: communityIdObject,
      // Assign communityId if provided, or leave it null for personal account
      songTitle,
      artist,
      rating,
      listenedBefore,
      dateListened,
      image
    })

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { reviews: createdReview._id }
    })

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { reviews: createdReview._id }
      })

      revalidatePath(path)

      /* return { success: true, reviewId: createdReview._id }*/
    }
  } catch (err) {
    //@ts-expect-error ***err.message***
    throw new Error(`Failed to create review: ${err.message}`)
  }
}

async function fetchAllChildReviews(reviewId: string): Promise<any[]> {
  const childReviews = await Review.find({ parentId: reviewId })
  let allDescendants = [...childReviews]

  for (const childReview of childReviews) {
    const descendants = await fetchAllChildReviews(childReview._id)
    allDescendants = allDescendants.concat(descendants)
  }

  return allDescendants
}

export async function deleteReview(id: string, path: string): Promise<void> {
  try {
    connectToDB()

    //Find the review to be deleted (the main review)
    const mainReview = await Review.findById(id).populate('author community')

    if (!mainReview) throw new Error('Review not found')

    // Fetch all child reviewsand their descendants recursively
    const descendantReviews = await fetchAllChildReviews(id)

    //Get all descendant review IDs including the main review ID and child reviews IDs
    const descendantReviewsIds = [
      id,
      ...descendantReviews.map((review) => review._id.toString())
    ]

    // Extract the authorIds and communityIds to update User and Community models respectively
    const reviewsToDelete = [mainReview, ...descendantReviews]
    const uniqueAuthorIds = new Set(
      reviewsToDelete
        .map((review) => review.author?._id?.toString())
        .filter((id): id is string => id !== undefined)
    )

    const uniqueCommunityIds = new Set(
      reviewsToDelete
        .map((review) => review.community?._id?.toString())
        .filter((id): id is string => id !== undefined)
    )

    // Recursively delete child threads and their descendants
    await Review.deleteMany({ _id: { $in: descendantReviewsIds } });

    // Update User model - remove specific review references
    for (const userId of uniqueAuthorIds) {
      await User.updateOne(
        { _id: userId },
        { $pull: { reviews: { $in: descendantReviewsIds } } }
      )
    }

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { reviews: { $in: descendantReviewsIds } } }
    );

    revalidatePath(path)

  } catch (err) {
    //@ts-expect-error **err.message**
    throw new Error(`Failed to delete review: ${err.message}`)

  }
}
export async function fetchReviewById(reviewId: string) {
  connectToDB()
  try {
    const review = await Review.findById(reviewId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image'
      }) // Populate the author field with _id and usernmae 
      .populate({
        path: 'community',
        model: Community,
        select: '_id id name image'
      }) // Populate the community field with _id and name
      .populate({
        path: 'children',  // Populate the children field
        populate: [
          {
            path: 'author', // Populate the author field within children
            model: User,
            select: '_id id name parentId image'  // Select only _id and username fields of the author
          },
          {
            path: 'children',  // Populate the children field within children
            model: Review,  // The model of the nested children (assuming it's the same "Review" model)
            populate: {
              path: 'author',  // Populate the author field within nested children
              model: User,
              select: '_id id name parentId image' // Select only _id and username fields of the author
            }
          }
        ]
      })


    return review
  } catch (err) {
    //@ts-expect-error ***err.message***
    console.error(`Error while fetching review: ${err.message}`)
    throw new Error('Unable to fetch review')
  }
}

export async function addCommentToReview(
  reviewId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB()

  try {
    // Find the original review by its ID
    const originalReview = await Review.findById(reviewId)

    if (!originalReview) throw new Error('Review not found')

    // Create the new comment review
    const commentReview = new Review({
      text: commentText,
      author: userId,
      parentId: reviewId, // Set the parentId to the original thread's ID
      songTitle: 'CommentChild', // Add default values for required fields
      artist: 'N/A',
      rating: 0,
      listenedBefore: false,
      dateListened: new Date(),
      image: ''
    })

    // Save the comment review to the database 
    const savedCommentReview = await commentReview.save()

    // Add the comment review's ID to the original thread's children array
    originalReview.children.push(savedCommentReview._id)

    // Save the updated original review to the database
    await originalReview.save()

    revalidatePath(path)
  } catch (err) {
    //@ts-expect-error ***err.message***
    console.error(`Error while adding comment: ${err.message}`)
    throw new Error('Unable to add comment')
  }
}

export async function likeReview(reviewId: string, userId: string) {
  try {
    connectToDB()

    const review = await Review.findById(reviewId)
    const user = await User.findOne({ id: userId })

    if (!review) {
      throw new Error('Review not found')
    }

    if (!user) {
      throw new Error('User not found')
    }

    const alreadyLiked = review.likes.some((id: any) => id.equals(user._id))

    if (alreadyLiked) {
      // Si ya dio like, quitarlo
      review.likes = review.likes.filter((id: any) => !id.equals(user._id))
    } else {
      // Si no ha dado like, agregarlo
      review.likes.push(user._id)
    }

    await review.save()

    return { success: true, liked: !alreadyLiked, likesCount: review.likes.length }
  } catch (err) {
    //@ts-expect-error ***err.message***
    console.error(`Error while liking review: ${err.message}`)
    throw new Error('Unable to like review')
  }
}

export async function getLikesCount(reviewId: string) {
  try {
    connectToDB()

    const review = await Review.findById(reviewId)

    if (!review) {
      throw new Error('Review not found')
    }

    return { count: review.likes.length }
  } catch (err) {
    //@ts-expect-error ***err.message***
    console.error(`Error while getting likes count: ${err.message}`)
    throw new Error('Unable to get likes count')
  }
}

// Add this new function to handle reposts
export async function repostReview(reviewId: string, userId: string) {
  try {
    connectToDB()

    const review = await Review.findById(reviewId)
    const user = await User.findOne({ id: userId })

    if (!review) {
      throw new Error('Review not found')
    }

    if (!user) {
      throw new Error('User not found')
    }

    const hasReposted = user.reposts.includes(review._id)

    if (hasReposted) {
      // Remove the repost
      user.reposts = user.reposts.filter(
        (id: any) => !id.equals(review._id)
      )
      // Decrease repost count
      review.repostsCount = Math.max(0, review.repostsCount - 1)
    } else {
      // Add the repost
      user.reposts.push(review._id)
      // Increase repost count
      review.repostsCount = (review.repostsCount || 0) + 1
    }

    await Promise.all([user.save(), review.save()])

    return { success: true, reposted: !hasReposted }
  } catch (err) {
    //@ts-expect-error ***err.message***
    console.error(`Error while reposting review: ${err.message}`)
    throw new Error('Unable to repost review')
  }
}

// Add this function to get repost count
export async function getRepostsCount(reviewId: string) {
  try {
    connectToDB()

    const repostsCount = await User.countDocuments({
      reposts: reviewId
    })

    return { count: repostsCount }
  } catch (err) {
    //@ts-expect-error ***err.message***
    console.error(`Error while getting reposts count: ${err.message}`)
    throw new Error('Unable to get reposts count')
  }
}