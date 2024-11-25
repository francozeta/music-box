'use client'

import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"
import { Heart, MessageCircle, Repeat, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from 'react';
import { getLikesCount, likeReview } from '@/lib/actions/review.actions';

interface FooterReviewProps {
  id: string;
  commentsCount: number;
  likesCount: number;
  isLiked: boolean;
  currentUserId: string;
}

export default function FooterReview({
  id,
  commentsCount,
  likesCount,
  isLiked,
  currentUserId,
}: FooterReviewProps) {
  const { toast } = useToast()
  const [likes, setLikes] = useState(likesCount);
  const [liked, setLiked] = useState(isLiked);

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

  const handleLike = async () => {
    try {
      const result = await likeReview(id, currentUserId);
      if (result.success) {
        setLiked(result.liked);
        const newCount = await getLikesCount(id);
        setLikes(newCount.count);
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      toast({
        title: "Error",
        description: "Failed to like the review. Please try again.",
        variant: "destructive",
      })
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
              <span className="ml-1 text-xs">{likes}</span>
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
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-zinc-900 hover:text-zinc-100">
              <Repeat className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Repost</TooltipContent>
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

