/* 'use client' */

import Image from 'next/image';
import Link from 'next/link';

import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Repeat, Send, Star, MoreHorizontal, Trash2 } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import DeleteReview from '../forms/DeleteReview';




// NOTE: DELETE REVIEW FUNCTION

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string; // text review
  author: {
    name: string;
    image: string;
    id: string;
  };
  // ***new***
  songTitle: string,
  artist: string,
  rating: number,
  image: string,

  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

function ReviewCard({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  songTitle,
  artist,
  rating,
  image
}: Props) {
  /* [ Server ] Error: Maximum call stack size exceeded: DONE! */
  console.log('Author IMAGE:', author.image)

  return (
    <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-700 ">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={author.image} alt={author.name} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link href={`/profile/${author.id}`} className="font-semibold hover:underline text-foreground text-zinc-200">
            {author.name}
          </Link>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
        {community && (
          <Link href={`/communities/${community.id}`} className="ml-auto">
            <Avatar className="w-8 h-8">
              <AvatarImage src={community.image} alt={community.name} />
              <AvatarFallback>{community.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='bg-zinc-900 hover:bg-zinc-900 text-zinc-600 hover:text-zinc-100'>
            <Button variant="ghost" size="icon" className="ml-auto text-muted-foreground hover:text-zinc-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
            {currentUserId === author.id && (
              <DeleteReview
                reviewId={JSON.stringify(id)}
                currentUserId={currentUserId}
                authorId={author.id}
                parentId={parentId}
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm text-foreground text-zinc-200">{content}</p>
        <div className="flex items-center space-x-4 bg-zinc-900 p-4 rounded-lg border border-zinc-700">
          <Image
            src={image}
            alt={`${songTitle} by ${artist}`}
            width={80}
            height={80}
            className="rounded-md object-cover"
          />
          <div>
            <h4 className="font-medium text-foreground text-zinc-200">{songTitle}</h4>
            <p className="text-sm text-muted-foreground">{artist}</p>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
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
                className="text-muted-foreground hover:bg-zinc-900  hover:text-zinc-100">
                <Send className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

export default ReviewCard

{/* <DeleteReview
reviewId={JSON.stringify(id)}
currentUserId={currentUserId}
authorId={author.id}
parentId={parentId}
isComment={isComment}
/> */}