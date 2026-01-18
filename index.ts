import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import axios from 'axios'

// Load environment variables
dotenv.config()

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID
// Normalize WEB_APP_URL: remove trailing slashes
const WEB_APP_URL = (process.env.WEB_APP_URL || 'http://localhost:3000').replace(/\/+$/, '')
const API_SECRET = process.env.API_SECRET

if (!DISCORD_BOT_TOKEN) {
  console.error('DISCORD_BOT_TOKEN is not set in environment variables')
  process.exit(1)
}

if (!DISCORD_CHANNEL_ID) {
  console.error('DISCORD_CHANNEL_ID is not set in environment variables')
  process.exit(1)
}

// Warn if WEB_APP_URL is not set or is localhost in production
if (WEB_APP_URL === 'http://localhost:3000' || WEB_APP_URL.includes('localhost')) {
  console.warn('⚠️  WARNING: WEB_APP_URL is set to localhost.')
  console.warn('⚠️  In production, set WEB_APP_URL to your deployed web app URL (e.g., https://your-app.vercel.app)')
  console.warn('⚠️  Update this in your deployment platform (Railway/Render) environment variables')
}

// YouTube Shorts URL patterns
const YOUTUBE_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/gi,
  /(?:https?:\/\/)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/gi,
]

// TikTok URL patterns
const TIKTOK_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.|vm\.)?tiktok\.com\/@[^/]+\/video\/(\d+)/gi,
  /(?:https?:\/\/)?(?:www\.|vm\.)?tiktok\.com\/t\/([A-Za-z0-9]+)/gi,
  /(?:https?:\/\/)?vm\.tiktok\.com\/([A-Za-z0-9]+)/gi,
]

interface VideoLink {
  url: string
  platform: 'youtube' | 'tiktok'
}

/**
 * Normalize URL to include protocol if missing
 */
function normalizeUrl(url: string): string {
  // If URL already has protocol, return as-is
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  // Otherwise, add https://
  return `https://${url}`
}

/**
 * Extract all video URLs from a message
 */
function extractVideoLinks(content: string): VideoLink[] {
  const links: VideoLink[] = []
  const foundUrls = new Set<string>()

  // Extract YouTube links
  for (const pattern of YOUTUBE_PATTERNS) {
    const matches = Array.from(content.matchAll(pattern))
    for (const match of matches) {
      const url = match[0]
      const normalizedUrl = normalizeUrl(url)
      if (!foundUrls.has(normalizedUrl)) {
        foundUrls.add(normalizedUrl)
        links.push({ url: normalizedUrl, platform: 'youtube' })
      }
    }
  }

  // Extract TikTok links
  for (const pattern of TIKTOK_PATTERNS) {
    const matches = Array.from(content.matchAll(pattern))
    for (const match of matches) {
      const url = match[0]
      const normalizedUrl = normalizeUrl(url)
      if (!foundUrls.has(normalizedUrl)) {
        foundUrls.add(normalizedUrl)
        links.push({ url: normalizedUrl, platform: 'tiktok' })
      }
    }
  }

  return links
}

/**
 * Submit video to web app API
 */
async function submitVideo(
  discordUsername: string,
  videoUrl: string,
  platform: 'youtube' | 'tiktok'
): Promise<{ success: boolean; message?: string; error?: string }> {
  // Construct API endpoint URL (WEB_APP_URL is already normalized to not have trailing slash)
  const apiUrl = `${WEB_APP_URL}/api/videos/submit`
  
  try {
    // Normalize URL to ensure it has a protocol
    const normalizedUrl = normalizeUrl(videoUrl)
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (API_SECRET) {
      headers['Authorization'] = `Bearer ${API_SECRET}`
    }

    console.log(`📤 Submitting to API: ${apiUrl}`)
    console.log(`📤 Payload:`, { discordUsername, videoUrl: normalizedUrl, platform })

    const response = await axios.post(
      apiUrl,
      {
        discordUsername,
        videoUrl: normalizedUrl,
        platform,
      },
      { headers, timeout: 30000 }
    )

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Video submitted successfully',
      }
    } else {
      return {
        success: false,
        error: response.data.error || 'Unknown error',
      }
    }
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status
      const statusText = error.response.statusText
      const errorData = error.response.data
      
      console.error(`❌ API Error ${status} ${statusText}:`, errorData)
      console.error(`❌ Request URL: ${apiUrl}`)
      
      return {
        success: false,
        error: errorData?.error || errorData?.message || `HTTP ${status}: ${statusText}`,
      }
    } else if (error.request) {
      console.error(`❌ Network error: Failed to connect to ${apiUrl}`)
      console.error(`❌ Error details:`, error.message)
      return {
        success: false,
        error: 'Failed to connect to web app API',
      }
    } else {
      console.error(`❌ Request setup error:`, error.message)
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }
}

/**
 * Get Discord username from message author
 */
function getDiscordUsername(message: Message): string {
  // Prefer globalName (new Discord username format), fallback to username
  return message.author.globalName || message.author.username
}

/**
 * Handle message and process video links
 */
async function handleMessage(message: Message) {
  // Ignore bot messages
  if (message.author.bot) {
    return
  }

  // Only process messages in the configured channel
  if (message.channel.id !== DISCORD_CHANNEL_ID) {
    return
  }

  const content = message.content
  const videoLinks = extractVideoLinks(content)

  if (videoLinks.length === 0) {
    return
  }

  const discordUsername = getDiscordUsername(message)
  console.log(`Processing ${videoLinks.length} video link(s) from ${discordUsername}`)

  // Process each video link
  for (const link of videoLinks) {
    try {
      console.log(`Submitting ${link.platform} video: ${link.url}`)
      const result = await submitVideo(discordUsername, link.url, link.platform)

      if (result.success) {
        console.log(`✅ Successfully submitted video: ${link.url}`)
        // Optionally send confirmation message (rate limited to avoid spam)
        // await message.react('✅')
      } else {
        console.error(`❌ Failed to submit video ${link.url}: ${result.error}`)
        // Optionally send error message
        // await message.reply(`❌ Failed to submit video: ${result.error}`)
      }
    } catch (error) {
      console.error(`Error processing video ${link.url}:`, error)
    }
  }
}

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.once('clientReady', () => {
  console.log(`✅ Discord bot logged in as ${client.user?.tag}`)
  console.log(`📺 Monitoring channel: ${DISCORD_CHANNEL_ID}`)
  console.log(`🌐 Web app URL: ${WEB_APP_URL}`)
  
  // Warn if using localhost in production
  if (WEB_APP_URL.includes('localhost') && process.env.NODE_ENV === 'production') {
    console.warn('⚠️  WARNING: WEB_APP_URL is set to localhost. This will not work in production!')
    console.warn('⚠️  Please set WEB_APP_URL to your deployed web app URL (e.g., https://your-app.vercel.app)')
  }
})

client.on('messageCreate', async (message) => {
  try {
    await handleMessage(message)
  } catch (error) {
    console.error('Error handling message:', error)
  }
})

client.on('error', (error) => {
  console.error('Discord client error:', error)
})

// Start bot
client.login(DISCORD_BOT_TOKEN).catch((error) => {
  console.error('Failed to login to Discord:', error)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down bot...')
  client.destroy()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down bot...')
  client.destroy()
  process.exit(0)
})

