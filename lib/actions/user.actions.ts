'use server'
import { revalidatePath } from 'next/cache';
import { FilterQuery, SortOrder } from 'mongoose';
import { connectToDB } from '../mongoose';
import User from '../models/user.model';
import Review from '../models/review.model';
import Community from '../models/community.model';
export async function fetchUser(userId: string) {
  try {
    await connectToDB()
    return await User.findOne({ id: userId }).populate({
      path: 'communities',
      model: Community
    })
  } catch (err) {
    //@ts-expect-error ***err.message***
    throw new Error(`Failed to fetch user: ${err.message}`)
  }
}
interface Params {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string
}
export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path
}: Params): Promise<void> {
  try {
    await connectToDB()
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true
      },
      { upsert: true }
    )
    if (path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (err) {
    //@ts-expect-error ***err.message***
    throw new Error(`Failed to create/update user: ${err.message}`)
  }
}
export async function fetchUserPosts(userId: string) {
  try {
    await connectToDB()
    const user = await User.findOne({ id: userId })
      .populate({
        path: 'reviews',
        model: Review,
        populate: [
          {
            path: 'author',
            model: User,
            select: 'name image id',
          },
          {
            path: 'community',
            model: Community,
            select: 'name id image _id'
          },
          {
            path: 'children',
            model: Review,
            populate: {
              path: 'author',
              model: User,
              select: 'name image id _id'
            }
          }
        ]
      })
      .populate({
        path: 'reposts',
        model: Review,
        populate: [
          {
            path: 'author',
            model: User,
            select: 'name image id',
          },
          {
            path: 'community',
            model: Community,
            select: 'name id image _id'
          },
          {
            path: 'children',
            model: Review,
            populate: {
              path: 'author',
              model: User,
              select: 'name image id _id'
            }
          }
        ]
      })
    return {
      ...user._doc,
      reviews: user.reviews,
      reposts: user.reposts
    }
  } catch (err) {
    console.error(`Error fetching user posts: ${err}`)
    throw err
  }
}
// Almost similar to Review (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    /* LINE:::===:::112:::===::: */
    connectToDB()
    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize
    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, 'i')
    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the search results.
    }
    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } }
      ]
    }
    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy }
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query)
    const users = await usersQuery.exec()
    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length
    return { users, isNext }
  } catch (err) {
    console.error(`Error fetching users: ${err}`)
    throw err
  }
}
export async function getActivity(userId: string) {
  try {
    await connectToDB()

    // Find all reviews created by the user
    const userReviews = await Review.find({ author: userId })

    // Collect all the child review ids (replies)
    const childReviewIds = userReviews.reduce((acc, userReview) => {
      return acc.concat(userReview.children)
    }, [])

    // Get replies, excluding those by the same user
    const replies = await Review.find({
      _id: { $in: childReviewIds },
      author: { $ne: userId }
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    })

    // Get likes on user's reviews, excluding self-likes
    const likes = await Review.find({
      _id: { $in: userReviews.map(review => review._id) },
      likes: { $ne: userId }
    }).populate({
      path: 'likes',
      model: User,
      select: 'name image _id'
    })

    // Get reposts of user's reviews, excluding self-reposts
    const reposts = await Review.find({
      _id: { $in: userReviews.map(review => review._id) },
      reposts: { $ne: userId }
    }).populate({
      path: 'reposts',
      model: User,
      select: 'name image _id'
    })

    // Combine and format all activities
    const activities = [
      ...replies.map(reply => ({
        type: 'reply',
        createdAt: reply.createdAt,
        author: reply.author,
        reviewId: reply.parentId
      })),
      ...likes.flatMap(review =>
        review.likes.map((user: any) => ({
          type: 'like',
          createdAt: review.createdAt,
          author: user,
          reviewId: review._id
        }))
      ),
      ...reposts.flatMap(review =>
        review.reposts.map((user: any) => ({
          type: 'repost',
          createdAt: review.createdAt,
          author: user,
          reviewId: review._id
        }))
      )
    ].sort((a, b) => b.createdAt - a.createdAt)

    return activities
  } catch (err) {
    console.error(`Error fetching activity: ${err}`)
    throw err
  }
}
