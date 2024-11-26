'use client'

import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"
import { Heart, MessageCircle, Repeat, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from 'react';
import { getLikesCount, getRepostsCount, likeReview, repostReview } from '@/lib/actions/review.actions';

interface FooterReviewProps {
  id: string;
  commentsCount: number;
  initialLikesCount: number;
  initialRepostsCount: number;
  initialIsLiked: boolean;
  initialIsReposted: boolean;
  currentUserId: string;
}

export default function FooterReview({
  id,
  commentsCount,
  initialLikesCount,
  initialRepostsCount,
  initialIsLiked,
  initialIsReposted,
  currentUserId,
}: FooterReviewProps) {
  const { toast } = useToast()
  const [likes, setLikes] = useState(initialLikesCount)
  const [liked, setLiked] = useState(initialIsLiked)

  const [reposts, setReposts] = useState(initialRepostsCount)
  const [reposted, setReposted] = useState(initialIsReposted)

  useEffect(() => {
    setLiked(initialIsLiked);
    setReposted(initialIsReposted);
  }, [initialIsLiked, initialIsReposted]);


  const copyReviewUrl = () => {
    const reviewUrl = `${window.location.origin}/review/${id}`;
    navigator.clipboard.writeText(reviewUrl).then(() => {
      toast({
        title: "URL Copied",
        description: "The review URL has been copied to your clipboard.",
      })
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      toast({
        title: "Error",
        description: "Failed to copy the URL. Please try again.",
        variant: "destructive",
      })
    });
  };

  /*   const handleLike = async () => {
      try {
        const result = await likeReview(id, currentUserId);
        if (result.success) {
          setLiked(result.liked);
          setLikes(result.likesCount);
        }
      } catch (error) {
        console.error('Error liking: ', error);
        toast({
          title: "Error",
          description: "Failed to like the review. Please try again.",
          variant: "destructive",
        })
      }
    }; */
  const handleLike = async () => {
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "You must be logged in to like a review.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await likeReview(id, currentUserId);
      if (result.success) {
        setLiked(result.liked);
        setLikes(result.likesCount);
      }
    } catch (error) {
      console.error('Error liking review:', error);
      toast({
        title: "Error",
        description: "Failed to like the review. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleRepost = async () => {
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "You must be logged in to repost a review.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await repostReview(id, currentUserId);
      if (result.success) {
        setReposted(result.reposted);
        setReposts(result.repostsCount);
        toast({
          title: result.reposted ? "Reposted!" : "Removed repost",
          description: result.reposted
            ? "This review has been added to your profile"
            : "This review has been removed from your profile",
        });
      }
    } catch (error) {
      console.error('Error reposting review:', error);
      toast({
        title: "Error",
        description: "Failed to repost the review. Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`text-muted-foreground hover:bg-zinc-900 hover:text-zinc-100 ${liked ? 'text-red-500' : ''}`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              {likes > 0 && (
                  <span className="ml-1 text-xs">{likes}</span>
                )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{liked ? 'Unlike' : 'Like'}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Link href={`/review/${id}`}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-zinc-900  hover:text-zinc-100">
                <MessageCircle className="h-4 w-4" />
                {commentsCount > 0 && (
                  <span className="ml-1 text-xs">{commentsCount}</span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Comment</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`text-muted-foreground hover:bg-zinc-900 hover:text-zinc-100 ${reposted ? 'text-green-500' : ''}`}
              onClick={handleRepost}
            >
              <Repeat className={`h-4 w-4 ${reposted ? 'fill-current' : ''}`} />
              {reposts > 0 && (
                <span className="ml-1 text-xs">{reposts}</span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{reposted ? 'Remove Repost' : 'Repost'}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-zinc-900  hover:text-zinc-100"
              onClick={copyReviewUrl}
            >
              <Send className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

