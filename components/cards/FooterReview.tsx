'use client'

import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"
import { Heart, MessageCircle, Repeat, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FooterReviewProps {
  id: string;
  commentsCount: number;
}

export default function FooterReview({ id, commentsCount }: FooterReviewProps) {
  const { toast } = useToast()

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

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-zinc-900  hover:text-zinc-100">
              <Heart className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Like</TooltipContent>
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

