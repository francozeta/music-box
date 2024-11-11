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

    // Find all reviews authored by the user with the given userId
    const reviews = await User.findOne({ id: userId }).populate({
      path: 'reviews',
      model: Review,
      populate: [
        {
          path: 'community',
          model: Community,
          select: 'name id image _id' // Select the 'name' and '_id' fields from the 'Community' model
        },
        {
          path: 'children',
          model: Review,
          populate: {
            path: 'author',
            model: User,
            select: 'name image id _id' // Select the 'name' and '_id' fields from the 'User' model
          }
        }
      ]
    })
    return reviews
  } catch (err) {
    console.error(`Error fetching user reviews : ${err}`)
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

    // Collect all the child review ids (replies) from the 'children' field of each user thread
    const childReviewIds = userReviews.reduce((acc, userReview) => {
      return acc.concact(userReview.children)
    }, [])

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Review.find({
      _id: { $in: childReviewIds },
      author: { $ne: userId } // Exclude threads authored by the same 
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    })

    return replies
  } catch (err) {
    console.error(`Error fetching replies: ${err}`)
    throw err
  }
}