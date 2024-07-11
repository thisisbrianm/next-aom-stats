"use server";

import { RedditPost } from "@/types/RedditPost";

let mappedPosts: RedditPost[];
export default async function fetchRedditPosts(): Promise<RedditPost[]> {
  if (mappedPosts) return mappedPosts; // return cached posts
  try {
    const url = "https://www.reddit.com/r/AgeofMythology.json?limit=25";
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reddit posts");
    }

    const data = await response.json();
    const posts: any[] = data.data.children.map((child: any) => child.data);
    mappedPosts = posts
      .filter((post) => !post.stickied)
      .map((post) => ({
        id: post.id,
        thumbnail_height: post.thumbnail_height,
        ups: post.ups,
        thumbnail_width: post.thumbnail_width,
        url: post.is_self || post.is_video ? null : post.url,
        author: post.author,
        title: post.title,
        permalink: post.permalink,
        total_awards_received: post.total_awards_received,
        num_comments: post.num_comments,
      }));

    return mappedPosts;
  } catch (error) {
    throw new Error(`Failed to fetch reddit posts: ${error}`);
  }
}
