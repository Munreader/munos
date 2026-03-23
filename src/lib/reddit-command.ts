/**
 * 🜈 REDDIT COMMAND CENTER
 * Fetches and displays all comments on Foundress's posts
 * 
 * User: manateecoltee
 * Citation: 2026-03-08
 */

// ==================== TYPES ====================

export interface RedditPost {
  id: string
  title: string
  subreddit: string
  author: string
  score: number
  num_comments: number
  created_utc: number
  permalink: string
  url: string
  selftext: string
  link_flair_text?: string
  thumbnail?: string
  preview?: {
    images: Array<{
      source: { url: string; width: number; height: number }
    }>
  }
}

export interface RedditComment {
  id: string
  author: string
  body: string
  score: number
  created_utc: number
  permalink: string
  parent_id: string
  link_id: string
  replies?: RedditComment[]
  is_submitter?: boolean
  subreddit: string
  post_title?: string
  post_permalink?: string
}

export interface CommentFeed {
  posts: RedditPost[]
  allComments: RedditComment[]
  lastFetched: string
  totalComments: number
  totalPosts: number
}

export interface RedditUserStats {
  username: string
  link_karma: number
  comment_karma: number
  created_utc: number
  is_gold: boolean
  is_mod: boolean
}

// ==================== API FUNCTIONS ====================

const REDDIT_BASE = 'https://www.reddit.com'
const USER_AGENT = 'MUN-EMPIRE-Reddit-Command-Center/1.0'

// Rate limiting helper
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 second between requests

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }
  
  lastRequestTime = Date.now()
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Reddit API error: ${response.status} ${response.statusText}`)
  }
  
  return response
}

// Fetch user's posts
export async function fetchUserPosts(
  username: string,
  limit: number = 25,
  after?: string
): Promise<{ posts: RedditPost[]; after: string | null }> {
  try {
    let url = `${REDDIT_BASE}/user/${username}/submitted.json?limit=${limit}&raw_json=1`
    if (after) {
      url += `&after=${after}`
    }
    
    const response = await rateLimitedFetch(url)
    const data = await response.json()
    
    const posts: RedditPost[] = data.data.children.map((child: { data: RedditPost }) => child.data)
    
    return {
      posts,
      after: data.data.after
    }
  } catch (error) {
    console.error('Failed to fetch user posts:', error)
    return { posts: [], after: null }
  }
}

// Fetch comments on a specific post
export async function fetchPostComments(
  permalink: string,
  limit: number = 100
): Promise<RedditComment[]> {
  try {
    const url = `${REDDIT_BASE}${permalink}.json?limit=${limit}&raw_json=1`
    
    const response = await rateLimitedFetch(url)
    const data = await response.json()
    
    // First element is the post, second is comments
    if (!data[1] || !data[1].data) {
      return []
    }
    
    const comments: RedditComment[] = []
    
    function extractComments(children: Array<{ data: RedditComment; kind: string }>, postTitle?: string, postPermalink?: string) {
      for (const child of children) {
        if (child.kind === 't1' && child.data) {
          const comment = child.data
          comments.push({
            ...comment,
            post_title: postTitle,
            post_permalink: postPermalink
          })
          
          // Recursively get replies
          if (comment.replies && typeof comment.replies === 'object' && comment.replies.data) {
            extractComments(comment.replies.data.children, postTitle, postPermalink)
          }
        }
      }
    }
    
    const postData = data[0]?.data?.children?.[0]?.data
    const postTitle = postData?.title
    const postPermalink = postData?.permalink
    
    extractComments(data[1].data.children, postTitle, postPermalink)
    
    return comments
  } catch (error) {
    console.error('Failed to fetch post comments:', error)
    return []
  }
}

// Fetch user info
export async function fetchUserInfo(username: string): Promise<RedditUserStats | null> {
  try {
    const url = `${REDDIT_BASE}/user/${username}/about.json`
    
    const response = await rateLimitedFetch(url)
    const data = await response.json()
    
    return data.data
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    return null
  }
}

// Fetch all comments on all user's posts
export async function fetchAllComments(
  username: string,
  maxPosts: number = 50,
  onProgress?: (current: number, total: number) => void
): Promise<CommentFeed> {
  const allPosts: RedditPost[] = []
  const allComments: RedditComment[] = []
  let after: string | null = null
  let fetchedCount = 0
  
  // Fetch posts
  while (fetchedCount < maxPosts) {
    const { posts, after: newAfter } = await fetchUserPosts(username, 25, after || undefined)
    
    if (posts.length === 0) break
    
    allPosts.push(...posts)
    fetchedCount += posts.length
    after = newAfter
    
    if (!newAfter) break
  }
  
  // Fetch comments for each post
  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i]
    onProgress?.(i + 1, allPosts.length)
    
    const comments = await fetchPostComments(post.permalink)
    allComments.push(...comments)
  }
  
  // Sort comments by date (newest first)
  allComments.sort((a, b) => b.created_utc - a.created_utc)
  
  return {
    posts: allPosts,
    allComments,
    lastFetched: new Date().toISOString(),
    totalComments: allComments.length,
    totalPosts: allPosts.length
  }
}

// ==================== HELPER FUNCTIONS ====================

export function formatRedditDate(utc: number): string {
  const date = new Date(utc * 1000)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}

export function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getRedditCommentUrl(comment: RedditComment): string {
  return `${REDDIT_BASE}${comment.permalink}`
}

export function getRedditPostUrl(post: RedditPost): string {
  return `${REDDIT_BASE}${post.permalink}`
}

// ==================== STORAGE ====================

const CACHE_KEY = '🜈_reddit_command_center_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CachedFeed {
  feed: CommentFeed
  timestamp: number
  username: string
}

export function cacheFeed(feed: CommentFeed, username: string): void {
  try {
    const cached: CachedFeed = {
      feed,
      timestamp: Date.now(),
      username
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached))
  } catch (e) {
    console.error('Failed to cache feed:', e)
  }
}

export function getCachedFeed(username: string): CommentFeed | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const data: CachedFeed = JSON.parse(cached)
    
    // Check if cache is for correct user and not expired
    if (data.username !== username) return null
    if (Date.now() - data.timestamp > CACHE_DURATION) return null
    
    return data.feed
  } catch (e) {
    console.error('Failed to get cached feed:', e)
    return null
  }
}

export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY)
}
