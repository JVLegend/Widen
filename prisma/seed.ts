import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 86400000);

async function main() {
  // Clean existing data
  await prisma.ranking.deleteMany();
  await prisma.clip.deleteMany();
  await prisma.campaignVideo.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.video.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.user.deleteMany();

  // ─── Churches (role: "influencer" in DB) ──────────────────────────────────
  const [church1, church2, church3, church4, church5, tela, redeTela, cariani] = await Promise.all([
    prisma.user.create({ data: { email: "faith@example.com", password: "123456", name: "Faith Chapel", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=faith", role: "influencer", bio: "Community church focused on youth ministry and worship. 5,000 congregation." } }),
    prisma.user.create({ data: { email: "livingwater@example.com", password: "123456", name: "Living Water Church", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=livingwater", role: "influencer", bio: "Multicampus church with a heart for evangelism and discipleship." } }),
    prisma.user.create({ data: { email: "harvest@example.com", password: "123456", name: "Harvest Fellowship", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=harvest", role: "influencer", bio: "Bible-centered church planting movement with 3 campuses." } }),
    prisma.user.create({ data: { email: "newlife@example.com", password: "123456", name: "New Life Ministry", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=newlife", role: "influencer", bio: "Contemporary worship and teaching ministry reaching young adults." } }),
    prisma.user.create({ data: { email: "refuge@example.com", password: "123456", name: "The Refuge Church", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=refuge", role: "influencer", bio: "Urban church focused on prayer, community outreach, and discipleship." } }),
    // Grace Community — main demo account (real login)
    prisma.user.create({ data: { email: "tela@widen.com", password: "123456", name: "Grace Community Church", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=grace", role: "influencer", bio: "Growing church passionate about spreading God's Word through digital media. Pastor James Wilson." } }),
    // Rede Tela — Christian business & missions channel (REAL YouTube content)
    prisma.user.create({ data: { email: "contato@redetela.com.br", password: "123456", name: "Rede Tela | Business & Missions", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=redetela", role: "influencer", bio: "Engaging Christian leaders and entrepreneurs. Business, missions, and biblical financial stewardship." } }),
    // Cariani Ministry — fitness + faith ministry
    prisma.user.create({ data: { email: "cariani@widen.com", password: "123456", name: "Cariani Ministry", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=cariani", role: "influencer", bio: "Body, mind, and spirit. Discipline, supplementation, and a winning mindset rooted in faith." } }),
  ]);

  // ─── Creators (role: "clipper" in DB) ─────────────────────────────────────
  const [cr1, cr2, cr3, cr4, cr5, cr6, cr7, cr8, cr9, cr10, maria, muscleminds] = await Promise.all([
    prisma.user.create({ data: { email: "daniel@example.com",   password: "123456", name: "Daniel Thompson",  avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=daniel",   role: "clipper", bio: "Passionate about making God's word accessible to Gen Z." } }),
    prisma.user.create({ data: { email: "emily@example.com",    password: "123456", name: "Emily Chen",       avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=emily",    role: "clipper", bio: "Worship content creator. TikTok specialist." } }),
    prisma.user.create({ data: { email: "michael@example.com",  password: "123456", name: "Michael Santos",   avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=michael",  role: "clipper", bio: "Bible teaching shorts. 50K followers across platforms." } }),
    prisma.user.create({ data: { email: "rachel@example.com",   password: "123456", name: "Rachel Kim",       avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=rachel",   role: "clipper", bio: "Storytelling through Scripture. Visual faith content." } }),
    prisma.user.create({ data: { email: "joshua@example.com",   password: "123456", name: "Joshua Adams",     avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=joshua",   role: "clipper", bio: "Youth pastor turned content creator. YouTube Shorts expert." } }),
    prisma.user.create({ data: { email: "hannah@example.com",   password: "123456", name: "Hannah Martinez",  avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=hannah",   role: "clipper", bio: "Viral faith content. 15 pieces published last month." } }),
    prisma.user.create({ data: { email: "caleb@example.com",    password: "123456", name: "Caleb Wright",     avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=caleb",    role: "clipper", bio: "Motion graphics + worship. High-energy sermon edits." } }),
    prisma.user.create({ data: { email: "grace.lee@example.com", password: "123456", name: "Grace Lee",       avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=gracelee", role: "clipper", bio: "TikTok first. Trending gospel content creator." } }),
    prisma.user.create({ data: { email: "nathan@example.com",   password: "123456", name: "Nathan Rivera",    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=nathan",   role: "clipper", bio: "Devotional and testimony clips. High engagement." } }),
    prisma.user.create({ data: { email: "olivia@example.com",   password: "123456", name: "Olivia Park",      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=olivia",   role: "clipper", bio: "Minimalist aesthetic. Clean faith content that converts." } }),
    // Maria Chen — real demo account (YouTube channel: @GeoGlobeTales, 1.16M subs)
    prisma.user.create({ data: { email: "maria.tela@widen.com", password: "123456", name: "Maria Chen", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=mariachen", role: "clipper", bio: "Creator of geography and global curiosity content. Channel @GeoGlobeTales · 1.16M subscribers · 678M views." } }),
    // Muscle Minds — REAL creator tracked via public YouTube data
    prisma.user.create({ data: { email: "joao.tela@widen.com",  password: "123456", name: "Muscle Minds",   avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=muscleminds",  role: "clipper", bio: "Shorts of discipline, mindset and ministry inspired by influencer content. 24.9K subs · 208 videos." } }),
  ]);

  // ─── Social Accounts (Churches) ───────────────────────────────────────────
  await prisma.socialAccount.createMany({
    data: [
      { userId: church1.id, platform: "youtube",   handle: "@faithchapel",        profileUrl: "https://youtube.com/@faithchapel",        followers: 82000  },
      { userId: church1.id, platform: "instagram", handle: "@faith.chapel",       profileUrl: "https://instagram.com/faith.chapel",       followers: 38000  },
      { userId: church2.id, platform: "youtube",   handle: "@livingwaterchurch",  profileUrl: "https://youtube.com/@livingwaterchurch",  followers: 56000  },
      { userId: church2.id, platform: "tiktok",    handle: "@livingwater.church", profileUrl: "https://tiktok.com/@livingwater.church", followers: 120000 },
      { userId: church2.id, platform: "instagram", handle: "@livingwaterchurch",  profileUrl: "https://instagram.com/livingwaterchurch",  followers: 49000  },
      { userId: church3.id, platform: "youtube",   handle: "@harvestfellowship",  profileUrl: "https://youtube.com/@harvestfellowship",  followers: 240000 },
      { userId: church3.id, platform: "tiktok",    handle: "@harvest.fellowship", profileUrl: "https://tiktok.com/@harvest.fellowship", followers: 89000  },
      { userId: church4.id, platform: "instagram", handle: "@newlifeministry",    profileUrl: "https://instagram.com/newlifeministry",    followers: 150000 },
      { userId: church4.id, platform: "tiktok",    handle: "@newlife.ministry",   profileUrl: "https://tiktok.com/@newlife.ministry",   followers: 72000  },
      { userId: church5.id, platform: "youtube",   handle: "@therefugechurch",    profileUrl: "https://youtube.com/@therefugechurch",    followers: 34000  },
      { userId: church5.id, platform: "instagram", handle: "@the.refuge.church",  profileUrl: "https://instagram.com/the.refuge.church",  followers: 68000  },
      { userId: church5.id, platform: "tiktok",    handle: "@therefugechurch",    profileUrl: "https://tiktok.com/@therefugechurch",    followers: 92000  },
      { userId: tela.id,    platform: "youtube",   handle: "@gracecommunitych",   profileUrl: "https://youtube.com/@gracecommunitych",   followers: 245000 },
      { userId: tela.id,    platform: "instagram", handle: "@grace.community",    profileUrl: "https://instagram.com/grace.community",    followers: 198000 },
      { userId: tela.id,    platform: "tiktok",    handle: "@gracecommunity",     profileUrl: "https://tiktok.com/@gracecommunity",     followers: 312000 },
      // Rede Tela — real YouTube channel
      { userId: redeTela.id, platform: "youtube",  handle: "@RedeTelaNegóciosEMissões", profileUrl: "https://www.youtube.com/c/telanegociosemissoes", followers: 3520 },
      // Cariani Ministry
      { userId: cariani.id, platform: "instagram", handle: "@cariani.ministry",   profileUrl: "https://instagram.com/cariani.ministry",   followers: 420000 },
      { userId: cariani.id, platform: "youtube",   handle: "@carianiministry",    profileUrl: "https://youtube.com/@carianiministry",    followers: 180000 },
    ],
  });

  // ─── Social Accounts (Creators) ───────────────────────────────────────────
  const acc = await Promise.all([
    /* 0  */ prisma.socialAccount.create({ data: { userId: cr1.id,  platform: "instagram", handle: "@danielfaith",      profileUrl: "https://instagram.com/danielfaith",      followers: 32000  } }),
    /* 1  */ prisma.socialAccount.create({ data: { userId: cr1.id,  platform: "tiktok",    handle: "@daniel.faith",     profileUrl: "https://tiktok.com/@daniel.faith",     followers: 78000  } }),
    /* 2  */ prisma.socialAccount.create({ data: { userId: cr1.id,  platform: "youtube",   handle: "@danielfaithyt",    profileUrl: "https://youtube.com/@danielfaithyt",    followers: 15000  } }),
    /* 3  */ prisma.socialAccount.create({ data: { userId: cr2.id,  platform: "instagram", handle: "@emilyworship",     profileUrl: "https://instagram.com/emilyworship",     followers: 55000  } }),
    /* 4  */ prisma.socialAccount.create({ data: { userId: cr2.id,  platform: "tiktok",    handle: "@emily.worship",    profileUrl: "https://tiktok.com/@emily.worship",    followers: 140000 } }),
    /* 5  */ prisma.socialAccount.create({ data: { userId: cr3.id,  platform: "youtube",   handle: "@michaelteaches",   profileUrl: "https://youtube.com/@michaelteaches",   followers: 28000  } }),
    /* 6  */ prisma.socialAccount.create({ data: { userId: cr3.id,  platform: "instagram", handle: "@michael.teaches",  profileUrl: "https://instagram.com/michael.teaches",  followers: 41000  } }),
    /* 7  */ prisma.socialAccount.create({ data: { userId: cr4.id,  platform: "tiktok",    handle: "@rachelkim",        profileUrl: "https://tiktok.com/@rachelkim",        followers: 95000  } }),
    /* 8  */ prisma.socialAccount.create({ data: { userId: cr4.id,  platform: "instagram", handle: "@rachel.faith",     profileUrl: "https://instagram.com/rachel.faith",     followers: 67000  } }),
    /* 9  */ prisma.socialAccount.create({ data: { userId: cr5.id,  platform: "youtube",   handle: "@joshuashorts",     profileUrl: "https://youtube.com/@joshuashorts",     followers: 52000  } }),
    /* 10 */ prisma.socialAccount.create({ data: { userId: cr5.id,  platform: "tiktok",    handle: "@joshua.adams",     profileUrl: "https://tiktok.com/@joshua.adams",     followers: 83000  } }),
    /* 11 */ prisma.socialAccount.create({ data: { userId: cr6.id,  platform: "instagram", handle: "@hannahviral",      profileUrl: "https://instagram.com/hannahviral",      followers: 120000 } }),
    /* 12 */ prisma.socialAccount.create({ data: { userId: cr6.id,  platform: "tiktok",    handle: "@hannah.martinez",  profileUrl: "https://tiktok.com/@hannah.martinez",  followers: 210000 } }),
    /* 13 */ prisma.socialAccount.create({ data: { userId: cr7.id,  platform: "youtube",   handle: "@calebworship",     profileUrl: "https://youtube.com/@calebworship",     followers: 38000  } }),
    /* 14 */ prisma.socialAccount.create({ data: { userId: cr7.id,  platform: "tiktok",    handle: "@caleb.wright",     profileUrl: "https://tiktok.com/@caleb.wright",     followers: 62000  } }),
    /* 15 */ prisma.socialAccount.create({ data: { userId: cr8.id,  platform: "tiktok",    handle: "@gracelee.faith",   profileUrl: "https://tiktok.com/@gracelee.faith",   followers: 175000 } }),
    /* 16 */ prisma.socialAccount.create({ data: { userId: cr8.id,  platform: "instagram", handle: "@grace.lee.faith",  profileUrl: "https://instagram.com/grace.lee.faith",  followers: 89000  } }),
    /* 17 */ prisma.socialAccount.create({ data: { userId: cr9.id,  platform: "instagram", handle: "@nathanrivera",     profileUrl: "https://instagram.com/nathanrivera",     followers: 47000  } }),
    /* 18 */ prisma.socialAccount.create({ data: { userId: cr9.id,  platform: "youtube",   handle: "@nathandevotional", profileUrl: "https://youtube.com/@nathandevotional",  followers: 31000  } }),
    /* 19 */ prisma.socialAccount.create({ data: { userId: cr10.id, platform: "instagram", handle: "@oliviapark",       profileUrl: "https://instagram.com/oliviapark",       followers: 74000  } }),
    /* 20 */ prisma.socialAccount.create({ data: { userId: cr10.id, platform: "tiktok",    handle: "@olivia.park",      profileUrl: "https://tiktok.com/@olivia.park",      followers: 110000 } }),
    /* 21 */ prisma.socialAccount.create({ data: { userId: maria.id, platform: "tiktok",    handle: "@maria.chen",       profileUrl: "https://tiktok.com/@maria.chen",       followers: 185000 } }),
    /* 22 */ prisma.socialAccount.create({ data: { userId: maria.id, platform: "instagram", handle: "@mariachencreates", profileUrl: "https://instagram.com/mariachencreates", followers: 92000 } }),
    // Maria — REAL YouTube channel: GeoGlobeTales (1.16M subs · 678M views · #1 ranking)
    /* 23 */ prisma.socialAccount.create({ data: { userId: maria.id, platform: "youtube", handle: "@GeoGlobeTales", profileUrl: "https://www.youtube.com/@GeoGlobeTales", followers: 1160000 } }),
    // Muscle Minds — real public YouTube data
    /* 24 */ prisma.socialAccount.create({ data: { userId: muscleminds.id, platform: "youtube", handle: "@muscleminds_1", profileUrl: "https://www.youtube.com/@muscleminds_1", followers: 24900 } }),
  ]);

  // ─── Sermons (Videos) ────────────────────────────────────────────────────
  const [
    v1, v2, v3,          // Faith Chapel
    v4, v5, v6,          // Living Water
    v7, v8,              // Harvest
    v9, v10,             // New Life
    v11, v12,            // The Refuge
    // Grace Community (tela) — 6 sermons
    vg1, vg2, vg3, vg4, vg5, vg6,
    // Rede Tela — 7 real videos (vrt1 and vrt7 belong to Grace/tela, vrt2-vrt6 to redeTela)
    vrt1, vrt2, vrt3, vrt4, vrt5, vrt6, vrt7,
  ] = await Promise.all([
    prisma.video.create({ data: { influencerId: church1.id, title: "The Power of Faith in Uncertain Times", description: "Sunday sermon on trusting God through life's storms.", originalUrl: "https://youtube.com/watch?v=faith-power", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s1/640/360", tags: JSON.stringify(["faith", "trust", "sermon"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: church1.id, title: "Finding Peace: A Study in Philippians", description: "Deep dive into Paul's letter to the Philippians about finding peace.", originalUrl: "https://youtube.com/watch?v=philippians-peace", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s2/640/360", tags: JSON.stringify(["peace", "philippians", "bible study"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: church1.id, title: "Worship Night Live — March 2026", description: "Full worship night recording with praise and testimony.", originalUrl: "https://youtube.com/watch?v=worship-march", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s3/640/360", tags: JSON.stringify(["worship", "praise", "live"]), status: "available" } }),
    prisma.video.create({ data: { influencerId: church2.id, title: "Walking in the Spirit — Romans 8", description: "Teaching on living by the Spirit from Romans chapter 8.", originalUrl: "https://youtube.com/watch?v=romans8", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s4/640/360", tags: JSON.stringify(["spirit", "romans", "teaching"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: church2.id, title: "Youth Revival: Purpose & Calling", description: "Special youth service on discovering God's calling for your life.", originalUrl: "https://youtube.com/watch?v=youth-revival", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s5/640/360", tags: JSON.stringify(["youth", "calling", "purpose"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: church2.id, title: "Baptism Sunday — New Beginnings", description: "Celebration of new believers being baptized.", originalUrl: "https://youtube.com/watch?v=baptism-sunday", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s6/640/360", tags: JSON.stringify(["baptism", "testimony", "celebration"]), status: "available" } }),
    prisma.video.create({ data: { influencerId: church3.id, title: "The Parables of Jesus — Modern Lessons", description: "Series exploring Jesus's parables and their relevance today.", originalUrl: "https://youtube.com/watch?v=parables", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s7/640/360", tags: JSON.stringify(["parables", "jesus", "teaching"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: church3.id, title: "Easter Message: The Empty Tomb", description: "Powerful Easter sermon on the resurrection of Christ.", originalUrl: "https://youtube.com/watch?v=easter-tomb", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s8/640/360", tags: JSON.stringify(["easter", "resurrection", "gospel"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: church4.id, title: "Worship & The Word — Psalm 23", description: "Intimate worship session with teaching on Psalm 23.", originalUrl: "https://instagram.com/reel/psalm23", platform: "instagram", thumbnailUrl: "https://picsum.photos/seed/s9/640/360", tags: JSON.stringify(["psalm", "worship", "devotional"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: church4.id, title: "Marriage & Family — Building on the Rock", description: "Teaching series on building a God-centered family.", originalUrl: "https://instagram.com/reel/family-rock", platform: "instagram", thumbnailUrl: "https://picsum.photos/seed/s10/640/360", tags: JSON.stringify(["marriage", "family", "teaching"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: church5.id, title: "Prayer Warriors: The Power of Intercession", description: "Teaching on the transformative power of prayer.", originalUrl: "https://youtube.com/watch?v=prayer-warriors", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s11/640/360", tags: JSON.stringify(["prayer", "intercession", "spiritual warfare"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: church5.id, title: "Community Outreach — Serving the City", description: "Documentary of our church serving the local community.", originalUrl: "https://youtube.com/watch?v=outreach", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/s12/640/360", tags: JSON.stringify(["outreach", "community", "service"]), status: "available" } }),
    // Grace Community
    prisma.video.create({ data: { influencerId: tela.id, title: "The Gospel of Grace — Ephesians Series", description: "Complete teaching series on the book of Ephesians.", originalUrl: "https://youtube.com/watch?v=ephesians", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/g1/640/360", tags: JSON.stringify(["grace", "ephesians", "gospel"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: tela.id, title: "Faith Over Fear — Conquering Anxiety", description: "Powerful message about overcoming anxiety through faith.", originalUrl: "https://youtube.com/watch?v=faith-over-fear", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/g2/640/360", tags: JSON.stringify(["faith", "anxiety", "mental health"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: tela.id, title: "Generosity: The Heart of Giving", description: "Teaching on biblical generosity and stewardship.", originalUrl: "https://youtube.com/watch?v=generosity", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/g3/640/360", tags: JSON.stringify(["generosity", "stewardship", "giving"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: tela.id, title: "Discipleship 101 — Following Jesus Daily", description: "Practical steps for daily discipleship and spiritual growth.", originalUrl: "https://youtube.com/watch?v=discipleship", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/g4/640/360", tags: JSON.stringify(["discipleship", "growth", "daily"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: tela.id, title: "The Great Commission — Go and Make Disciples", description: "Call to action for evangelism and missions.", originalUrl: "https://youtube.com/watch?v=great-commission", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/g5/640/360", tags: JSON.stringify(["evangelism", "missions", "commission"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: tela.id, title: "Praise Night — Live Worship Experience", description: "Full evening of worship, prayer, and praise.", originalUrl: "https://youtube.com/watch?v=praise-night", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/g6/640/360", tags: JSON.stringify(["worship", "praise", "live"]), status: "available" } }),
    // vrt1 & vrt7 → belong to tela (Grace), vrt2-vrt6 → belong to Rede Tela
    prisma.video.create({ data: { influencerId: tela.id,    title: "Special Edition: 2026 Outlook — Where to Invest | With Primo Pobre",                 description: "Where to invest in 2026? Full analysis with Primo Pobre on markets, bitcoin and Kingdom opportunities.", originalUrl: "https://www.youtube.com/watch?v=G6XFgWXT2Js", platform: "youtube", thumbnailUrl: "https://img.youtube.com/vi/G6XFgWXT2Js/hqdefault.jpg", tags: JSON.stringify(["investing", "business", "faith", "2026 outlook"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: redeTela.id, title: "What Is Your Biggest Asset in Your Business? | With Cláudia Rosa",                   description: "CEO of Rede Invest and Shark reveals the biggest asset of any entrepreneur and how to develop it.", originalUrl: "https://www.youtube.com/watch?v=JNNj5zFWst4", platform: "youtube", thumbnailUrl: "https://img.youtube.com/vi/JNNj5zFWst4/hqdefault.jpg", tags: JSON.stringify(["business", "leadership", "christian entrepreneurship"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: redeTela.id, title: "Afrikan Aid: Redemptive Business Transforming Nations | With Marco Yamin",           description: "How a Christian business is impacting African nations and what we can learn from the experience.", originalUrl: "https://www.youtube.com/c/telanegociosemissoes", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/rt3/640/360", tags: JSON.stringify(["missions", "business", "social impact"]), status: "in_campaign" } }),
    prisma.video.create({ data: { influencerId: redeTela.id, title: "Healthy Body, Healthy Business, and the Peptides of Longevity | With Adriano Faustino", description: "The connection between health, longevity and business performance — what science and faith say.", originalUrl: "https://www.youtube.com/c/telanegociosemissoes", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/rt4/640/360", tags: JSON.stringify(["health", "business", "longevity"]), status: "available" } }),
    prisma.video.create({ data: { influencerId: redeTela.id, title: "From the Landfill Book to a Global Business that Blesses Thousands | Matheus Tomoto",  description: "From extreme childhood poverty to Harvard and a global business — a story of faith and purpose.", originalUrl: "https://www.youtube.com/c/telanegociosemissoes", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/rt5/640/360", tags: JSON.stringify(["overcoming", "business", "faith", "missions"]), status: "available" } }),
    prisma.video.create({ data: { influencerId: redeTela.id, title: "The Secret of Biblical Prosperity | With Erick Couto",                                description: "What the Bible truly teaches about prosperity and how to apply biblical principles in business.", originalUrl: "https://www.youtube.com/c/telanegociosemissoes", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/rt6/640/360", tags: JSON.stringify(["prosperity", "faith", "financial stewardship"]), status: "available" } }),
    // vrt7 — latest channel video (belongs to tela, with REAL clips by Muscle Minds)
    prisma.video.create({ data: { influencerId: tela.id, title: "The Messenger of Progress (From Fatherlessness to Success) | With Gabriel Ferraz", description: "From fatherlessness to success — the real story of overcoming, purpose and faith by Gabriel Ferraz.", originalUrl: "https://www.youtube.com/c/telanegociosemissoes", platform: "youtube", thumbnailUrl: "https://picsum.photos/seed/rt7/640/360", tags: JSON.stringify(["overcoming", "fatherhood", "purpose", "business"]), status: "in_campaign" } }),
  ]);

  // ─── Missions (Campaigns) ────────────────────────────────────────────────
  const [miss1, miss2, miss3, miss4, miss5, miss6, miss7,
         missG1, missG2, missG3,
         campJReal, campRT] = await Promise.all([
    prisma.campaign.create({ data: { influencerId: church1.id, name: "Faith in Action — Spring Series", budget: 800, paymentModel: "cpv", cpvRate: 25, platforms: JSON.stringify(["instagram", "tiktok"]), instructions: "30-60s clips. Focus on the most powerful moments. Add captions. Respectful tone.", startDate: new Date("2026-03-01"), endDate: new Date("2026-04-30"), status: "active" } }),
    prisma.campaign.create({ data: { influencerId: church1.id, name: "Philippians Peace Series", budget: 450, paymentModel: "fixed_per_clip", fixedRate: 80, platforms: JSON.stringify(["youtube", "instagram"]), instructions: "Highlight key Scripture passages. 45-90s. Peaceful, contemplative mood.", startDate: new Date("2026-03-15"), endDate: new Date("2026-05-15"), status: "active" } }),
    prisma.campaign.create({ data: { influencerId: church2.id, name: "Youth Revival Week", budget: 600, paymentModel: "fixed_per_clip", fixedRate: 60, platforms: JSON.stringify(["instagram", "tiktok", "youtube"]), instructions: "Energetic 15-45s clips. Show the excitement and purpose! Captions required.", startDate: new Date("2026-04-01"), endDate: new Date("2026-05-15"), status: "active" } }),
    prisma.campaign.create({ data: { influencerId: church2.id, name: "Romans 8 — Spirit Life Clips", budget: 350, paymentModel: "cpv", cpvRate: 18, platforms: JSON.stringify(["tiktok", "instagram"]), instructions: "Extract the most impactful teaching moments. Max 60s.", startDate: new Date("2026-04-05"), endDate: new Date("2026-05-20"), status: "active" } }),
    prisma.campaign.create({ data: { influencerId: church3.id, name: "Easter Resurrection Campaign", budget: 1200, paymentModel: "cpv", cpvRate: 30, platforms: JSON.stringify(["tiktok", "youtube"]), instructions: "Capture the most powerful Easter moments. 15-60s clips.", startDate: new Date("2026-03-20"), endDate: new Date("2026-05-31"), status: "active" } }),
    prisma.campaign.create({ data: { influencerId: church4.id, name: "Worship & Word — Psalm Shorts", budget: 900, paymentModel: "cpv", cpvRate: 22, platforms: JSON.stringify(["instagram", "tiktok"]), instructions: "Beautiful aesthetic. Worship moments + teaching. 15-30s.", startDate: new Date("2026-04-01"), endDate: new Date("2026-06-01"), status: "active" } }),
    prisma.campaign.create({ data: { influencerId: church5.id, name: "Prayer Warriors — Viral Faith", budget: 500, paymentModel: "cpv", cpvRate: 15, platforms: JSON.stringify(["tiktok", "instagram"]), instructions: "Powerful prayer moments and testimonies. Max 45s.", startDate: new Date("2026-04-08"), endDate: new Date("2026-05-30"), status: "active" } }),

    // ── Grace Community (tela) — 3 missions ────────────────────────────────
    prisma.campaign.create({ data: {
      influencerId: tela.id,
      name: "Ephesians Series — March Launch",
      budget: 500,
      paymentModel: "fixed_per_clip",
      fixedRate: 80,
      platforms: JSON.stringify(["instagram", "tiktok", "youtube"]),
      instructions: "Focus on grace and transformation messages. 30-60s clips. Inspirational tone. Captions required.",
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-03-31"),
      status: "completed",
    } }),
    prisma.campaign.create({ data: {
      influencerId: tela.id,
      name: "Faith Over Fear — April Mission",
      budget: 950,
      paymentModel: "cpv",
      cpvRate: 28,
      platforms: JSON.stringify(["instagram", "tiktok", "youtube"]),
      instructions: "Most impactful moments about overcoming fear. 30-90s. Encouraging tone. Captions required. #FaithOverFear #GraceChurch",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-05-31"),
      status: "active",
    } }),
    prisma.campaign.create({ data: {
      influencerId: tela.id,
      name: "Discipleship Series — May",
      budget: 700,
      paymentModel: "cpv",
      cpvRate: 20,
      platforms: JSON.stringify(["tiktok", "youtube"]),
      instructions: "Practical discipleship tips. Up to 60s. Audience: new believers and seekers.",
      startDate: new Date("2026-05-01"),
      endDate: new Date("2026-06-15"),
      status: "draft",
    } }),

    // ── tela — REAL mission with real clips (Muscle Minds + Maria/GeoGlobeTales) ──
    prisma.campaign.create({ data: {
      influencerId: tela.id,
      name: "Rede Tela — Real Campaign",
      budget: 10000,
      paymentModel: "cpv",
      cpvRate: 20,
      platforms: JSON.stringify(["youtube"]),
      instructions: "Clips of the most impactful moments from the episodes. 30-90s. Captions required. Hashtags: #ChristianBusiness #Missions #Entrepreneurship",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-06-30"),
      status: "active",
    } }),

    // ── Rede Tela — active mission ────────────────────────────────────────
    prisma.campaign.create({ data: {
      influencerId: redeTela.id,
      name: "Business & Faith — Viral Clips",
      budget: 4000,
      paymentModel: "cpv",
      cpvRate: 20,
      platforms: JSON.stringify(["youtube", "instagram"]),
      instructions: "Clips of the most impactful moments about business, faith and Christian entrepreneurship. 30-90s. Captions required. Hashtags: #ChristianBusiness #Missions",
      startDate: new Date("2026-04-15"),
      endDate: new Date("2026-06-15"),
      status: "active",
    } }),
  ]);

  // ─── Mission Sermons (Campaign Videos) ────────────────────────────────────
  await prisma.campaignVideo.createMany({
    data: [
      { campaignId: miss1.id, videoId: v1.id },
      { campaignId: miss2.id, videoId: v2.id },
      { campaignId: miss3.id, videoId: v4.id },
      { campaignId: miss3.id, videoId: v6.id },
      { campaignId: miss4.id, videoId: v5.id },
      { campaignId: miss5.id, videoId: v7.id },
      { campaignId: miss5.id, videoId: v8.id },
      { campaignId: miss6.id, videoId: v9.id },
      { campaignId: miss6.id, videoId: v10.id },
      { campaignId: miss7.id, videoId: v11.id },
      // Grace Community
      { campaignId: missG1.id, videoId: vg1.id },
      { campaignId: missG1.id, videoId: vg2.id },
      { campaignId: missG2.id, videoId: vg1.id },
      { campaignId: missG2.id, videoId: vg3.id },
      { campaignId: missG2.id, videoId: vg4.id },
      { campaignId: missG2.id, videoId: vg5.id },
      { campaignId: missG3.id, videoId: vg4.id },
      { campaignId: missG3.id, videoId: vg6.id },
      // tela — REAL campaign (vrt1 = Primo Pobre, vrt7 = Gabriel Ferraz)
      { campaignId: campJReal.id, videoId: vrt1.id },
      { campaignId: campJReal.id, videoId: vrt7.id },
      // Rede Tela — remaining videos
      { campaignId: campRT.id, videoId: vrt2.id },
      { campaignId: campRT.id, videoId: vrt3.id },
    ],
  });

  // ─── Content (Clips) ─────────────────────────────────────────────────────
  type ClipData = {
    clipperId: string; campaignId: string; videoId: string;
    socialAccountId: string; clipUrl: string; platform: string;
    status: string; views: number; likes: number; comments: number;
    shares: number; earnings: number; publishedAt: Date;
  };

  const clips: ClipData[] = [
    // ── Miss1 (Faith in Action) — ppr 25 pts ─────────────────────────────
    { clipperId: cr1.id,  campaignId: miss1.id, videoId: v1.id, socialAccountId: acc[0].id,  clipUrl: "https://instagram.com/reel/faith1",             platform: "instagram", status: "active",           views: 87000,   likes: 5200,  comments: 310,  shares: 890,   earnings: 2175,  publishedAt: daysAgo(25) },
    { clipperId: cr1.id,  campaignId: miss1.id, videoId: v1.id, socialAccountId: acc[1].id,  clipUrl: "https://tiktok.com/@daniel.faith/v/faith1",     platform: "tiktok",    status: "active",           views: 340000,  likes: 22000, comments: 1800, shares: 5600,  earnings: 8500,  publishedAt: daysAgo(22) },
    { clipperId: cr2.id,  campaignId: miss1.id, videoId: v1.id, socialAccountId: acc[3].id,  clipUrl: "https://instagram.com/reel/faith2",             platform: "instagram", status: "active",           views: 123000,  likes: 7800,  comments: 540,  shares: 1200,  earnings: 3075,  publishedAt: daysAgo(20) },
    { clipperId: cr2.id,  campaignId: miss1.id, videoId: v1.id, socialAccountId: acc[4].id,  clipUrl: "https://tiktok.com/@emily.worship/v/faith1",    platform: "tiktok",    status: "metrics_collected", views: 580000, likes: 41000, comments: 3200, shares: 12000, earnings: 14500, publishedAt: daysAgo(18) },
    { clipperId: cr6.id,  campaignId: miss1.id, videoId: v1.id, socialAccountId: acc[12].id, clipUrl: "https://tiktok.com/@hannah.martinez/v/faith1",  platform: "tiktok",    status: "active",           views: 910000,  likes: 68000, comments: 4900, shares: 21000, earnings: 22750, publishedAt: daysAgo(15) },
    // ── Miss2 (Philippians) — fixed 80 pts ───────────────────────────────
    { clipperId: cr3.id,  campaignId: miss2.id, videoId: v2.id, socialAccountId: acc[6].id,  clipUrl: "https://instagram.com/reel/phil1",              platform: "instagram", status: "active",           views: 54000,   likes: 3400,  comments: 280,  shares: 620,   earnings: 80,    publishedAt: daysAgo(20) },
    { clipperId: cr5.id,  campaignId: miss2.id, videoId: v2.id, socialAccountId: acc[9].id,  clipUrl: "https://youtube.com/shorts/phil1",              platform: "youtube",   status: "active",           views: 92000,   likes: 5100,  comments: 430,  shares: 1100,  earnings: 80,    publishedAt: daysAgo(18) },
    // ── Miss3 (Youth Revival) — fixed 60 pts ─────────────────────────────
    { clipperId: cr4.id,  campaignId: miss3.id, videoId: v4.id, socialAccountId: acc[7].id,  clipUrl: "https://tiktok.com/@rachelkim/v/youth1",        platform: "tiktok",    status: "metrics_collected", views: 430000, likes: 31000, comments: 2100, shares: 9800,  earnings: 60,    publishedAt: daysAgo(26) },
    { clipperId: cr2.id,  campaignId: miss3.id, videoId: v4.id, socialAccountId: acc[4].id,  clipUrl: "https://tiktok.com/@emily.worship/v/youth1",    platform: "tiktok",    status: "active",           views: 195000,  likes: 13000, comments: 870,  shares: 4100,  earnings: 60,    publishedAt: daysAgo(10) },
    // ── Miss4 (Romans 8) — ppr 18 pts ────────────────────────────────────
    { clipperId: cr8.id,  campaignId: miss4.id, videoId: v5.id, socialAccountId: acc[15].id, clipUrl: "https://tiktok.com/@gracelee.faith/v/rom1",     platform: "tiktok",    status: "active",           views: 520000,  likes: 35000, comments: 2800, shares: 11000, earnings: 9360,  publishedAt: daysAgo(16) },
    { clipperId: cr10.id, campaignId: miss4.id, videoId: v5.id, socialAccountId: acc[20].id, clipUrl: "https://tiktok.com/@olivia.park/v/rom1",        platform: "tiktok",    status: "active",           views: 145000,  likes: 9800,  comments: 720,  shares: 2900,  earnings: 2610,  publishedAt: daysAgo(12) },
    // ── Miss5 (Easter) — ppr 30 pts ──────────────────────────────────────
    { clipperId: cr7.id,  campaignId: miss5.id, videoId: v7.id, socialAccountId: acc[13].id, clipUrl: "https://youtube.com/@calebworship/v/easter1",   platform: "youtube",   status: "active",           views: 180000,  likes: 12000, comments: 950,  shares: 3400,  earnings: 5400,  publishedAt: daysAgo(20) },
    { clipperId: cr7.id,  campaignId: miss5.id, videoId: v8.id, socialAccountId: acc[14].id, clipUrl: "https://tiktok.com/@caleb.wright/v/easter1",    platform: "tiktok",    status: "metrics_collected", views: 1200000,likes: 89000, comments: 7200, shares: 32000, earnings: 36000, publishedAt: daysAgo(18) },
    // ── Miss6 (Worship & Word) — ppr 22 pts ──────────────────────────────
    { clipperId: cr6.id,  campaignId: miss6.id, videoId: v9.id,  socialAccountId: acc[11].id, clipUrl: "https://instagram.com/reel/psalm1",            platform: "instagram", status: "active",           views: 340000,  likes: 28000, comments: 2100, shares: 8900,  earnings: 7480,  publishedAt: daysAgo(22) },
    { clipperId: cr6.id,  campaignId: miss6.id, videoId: v10.id, socialAccountId: acc[12].id, clipUrl: "https://tiktok.com/@hannah.martinez/v/fam1",   platform: "tiktok",    status: "active",           views: 780000,  likes: 54000, comments: 4200, shares: 19000, earnings: 17160, publishedAt: daysAgo(18) },
    // ── Miss7 (Prayer) — ppr 15 pts ──────────────────────────────────────
    { clipperId: cr2.id,  campaignId: miss7.id, videoId: v11.id, socialAccountId: acc[4].id,  clipUrl: "https://tiktok.com/@emily.worship/v/pray1",    platform: "tiktok",    status: "active",           views: 650000,  likes: 48000, comments: 3800, shares: 15000, earnings: 9750,  publishedAt: daysAgo(15) },
    { clipperId: cr10.id, campaignId: miss7.id, videoId: v11.id, socialAccountId: acc[20].id, clipUrl: "https://tiktok.com/@olivia.park/v/pray1",      platform: "tiktok",    status: "metrics_collected", views: 920000, likes: 71000, comments: 5600, shares: 24000, earnings: 13800, publishedAt: daysAgo(8) },

    // ══ Grace Community — completed mission (March) ══════════════════════
    { clipperId: cr9.id,  campaignId: missG1.id, videoId: vg1.id, socialAccountId: acc[17].id, clipUrl: "https://instagram.com/reel/grace-m1",  platform: "instagram", status: "paid", views: 94000,  likes: 6800,  comments: 520, shares: 1400, earnings: 80, publishedAt: daysAgo(38) },
    { clipperId: cr9.id,  campaignId: missG1.id, videoId: vg2.id, socialAccountId: acc[18].id, clipUrl: "https://youtube.com/shorts/grace-m2",  platform: "youtube",   status: "paid", views: 58000,  likes: 3900,  comments: 310, shares: 880,  earnings: 80, publishedAt: daysAgo(36) },
    { clipperId: cr3.id,  campaignId: missG1.id, videoId: vg1.id, socialAccountId: acc[6].id,  clipUrl: "https://instagram.com/reel/grace-m3",  platform: "instagram", status: "paid", views: 72000,  likes: 5100,  comments: 410, shares: 1100, earnings: 80, publishedAt: daysAgo(34) },
    { clipperId: cr5.id,  campaignId: missG1.id, videoId: vg2.id, socialAccountId: acc[10].id, clipUrl: "https://tiktok.com/@joshua.adams/g1",  platform: "tiktok",    status: "paid", views: 187000, likes: 13000, comments: 980, shares: 3200, earnings: 80, publishedAt: daysAgo(33) },
    { clipperId: cr8.id,  campaignId: missG1.id, videoId: vg1.id, socialAccountId: acc[15].id, clipUrl: "https://tiktok.com/@gracelee.faith/g1",platform: "tiktok",    status: "paid", views: 342000, likes: 24000, comments: 1800,shares: 7600, earnings: 80, publishedAt: daysAgo(31) },
    { clipperId: cr4.id,  campaignId: missG1.id, videoId: vg2.id, socialAccountId: acc[8].id,  clipUrl: "https://instagram.com/reel/grace-m6",  platform: "instagram", status: "paid", views: 118000, likes: 8400,  comments: 640, shares: 2100, earnings: 80, publishedAt: daysAgo(29) },

    // ══ Grace Community — active mission (April) ═════════════════════════
    { clipperId: cr1.id,  campaignId: missG2.id, videoId: vg3.id, socialAccountId: acc[0].id,  clipUrl: "https://instagram.com/reel/grace-a1",   platform: "instagram", status: "active",           views: 145000,  likes: 10200, comments: 780,  shares: 2400,  earnings: 4060,  publishedAt: daysAgo(28) },
    { clipperId: cr2.id,  campaignId: missG2.id, videoId: vg1.id, socialAccountId: acc[4].id,  clipUrl: "https://tiktok.com/@emily.worship/g1",  platform: "tiktok",    status: "active",           views: 410000,  likes: 29000, comments: 2200, shares: 9100,  earnings: 11480, publishedAt: daysAgo(26) },
    { clipperId: cr6.id,  campaignId: missG2.id, videoId: vg4.id, socialAccountId: acc[12].id, clipUrl: "https://tiktok.com/@hannah.martinez/g1",platform: "tiktok",    status: "active",           views: 890000,  likes: 64000, comments: 4800, shares: 22000, earnings: 24920, publishedAt: daysAgo(24) },
    { clipperId: cr8.id,  campaignId: missG2.id, videoId: vg5.id, socialAccountId: acc[15].id, clipUrl: "https://tiktok.com/@gracelee.faith/g2",platform: "tiktok",    status: "active",           views: 560000,  likes: 39000, comments: 3100, shares: 13000, earnings: 15680, publishedAt: daysAgo(22) },
    { clipperId: cr9.id,  campaignId: missG2.id, videoId: vg3.id, socialAccountId: acc[17].id, clipUrl: "https://instagram.com/reel/grace-a5",   platform: "instagram", status: "active",           views: 98000,   likes: 7100,  comments: 540,  shares: 1700,  earnings: 2744,  publishedAt: daysAgo(20) },
    { clipperId: cr3.id,  campaignId: missG2.id, videoId: vg1.id, socialAccountId: acc[5].id,  clipUrl: "https://youtube.com/shorts/grace-a6",   platform: "youtube",   status: "active",           views: 74000,   likes: 5200,  comments: 420,  shares: 1300,  earnings: 2072,  publishedAt: daysAgo(18) },
    { clipperId: cr10.id, campaignId: missG2.id, videoId: vg4.id, socialAccountId: acc[19].id, clipUrl: "https://instagram.com/reel/grace-a7",   platform: "instagram", status: "active",           views: 187000,  likes: 13400, comments: 1020, shares: 3800,  earnings: 5236,  publishedAt: daysAgo(15) },
    { clipperId: cr4.id,  campaignId: missG2.id, videoId: vg5.id, socialAccountId: acc[7].id,  clipUrl: "https://tiktok.com/@rachelkim/g1",      platform: "tiktok",    status: "metrics_collected", views: 720000, likes: 52000, comments: 4100, shares: 18000, earnings: 20160, publishedAt: daysAgo(13) },
    { clipperId: cr5.id,  campaignId: missG2.id, videoId: vg3.id, socialAccountId: acc[9].id,  clipUrl: "https://youtube.com/shorts/grace-a9",   platform: "youtube",   status: "active",           views: 112000,  likes: 7900,  comments: 620,  shares: 2100,  earnings: 3136,  publishedAt: daysAgo(10) },
    { clipperId: cr1.id,  campaignId: missG2.id, videoId: vg4.id, socialAccountId: acc[1].id,  clipUrl: "https://tiktok.com/@daniel.faith/g1",   platform: "tiktok",    status: "active",           views: 234000,  likes: 16800, comments: 1300, shares: 5200,  earnings: 6552,  publishedAt: daysAgo(7)  },
    { clipperId: cr7.id,  campaignId: missG2.id, videoId: vg5.id, socialAccountId: acc[14].id, clipUrl: "https://tiktok.com/@caleb.wright/g1",   platform: "tiktok",    status: "active",           views: 308000,  likes: 22000, comments: 1700, shares: 7100,  earnings: 8624,  publishedAt: daysAgo(4)  },
    { clipperId: cr2.id,  campaignId: missG2.id, videoId: vg1.id, socialAccountId: acc[3].id,  clipUrl: "https://instagram.com/reel/grace-a12",  platform: "instagram", status: "active",           views: 163000,  likes: 11500, comments: 890,  shares: 3100,  earnings: 4564,  publishedAt: daysAgo(2)  },

    // ══ Maria Chen — content across multiple missions ════════════════════
    { clipperId: maria.id, campaignId: miss1.id, videoId: v1.id, socialAccountId: acc[21].id, clipUrl: "https://tiktok.com/@maria.chen/v/faith1",       platform: "tiktok",    status: "active",           views: 470000,  likes: 33000, comments: 2600, shares: 11000, earnings: 11750, publishedAt: daysAgo(21) },
    { clipperId: maria.id, campaignId: miss1.id, videoId: v1.id, socialAccountId: acc[22].id, clipUrl: "https://instagram.com/reel/maria-faith1",        platform: "instagram", status: "active",           views: 156000,  likes: 11200, comments: 840,  shares: 2800,  earnings: 3900,  publishedAt: daysAgo(17) },
    { clipperId: maria.id, campaignId: miss3.id, videoId: v4.id, socialAccountId: acc[21].id, clipUrl: "https://tiktok.com/@maria.chen/v/youth1",       platform: "tiktok",    status: "metrics_collected", views: 310000, likes: 22000, comments: 1700, shares: 7200,  earnings: 60,    publishedAt: daysAgo(14) },
    { clipperId: maria.id, campaignId: miss3.id, videoId: v6.id, socialAccountId: acc[22].id, clipUrl: "https://instagram.com/reel/maria-youth2",        platform: "instagram", status: "active",           views: 89000,   likes: 6400,  comments: 490,  shares: 1500,  earnings: 60,    publishedAt: daysAgo(11) },
    { clipperId: maria.id, campaignId: miss5.id, videoId: v7.id, socialAccountId: acc[21].id, clipUrl: "https://tiktok.com/@maria.chen/v/easter1",      platform: "tiktok",    status: "active",           views: 680000,  likes: 49000, comments: 3800, shares: 16000, earnings: 20400, publishedAt: daysAgo(16) },
    { clipperId: maria.id, campaignId: miss6.id, videoId: v9.id, socialAccountId: acc[22].id, clipUrl: "https://instagram.com/reel/maria-psalm1",        platform: "instagram", status: "active",           views: 245000,  likes: 19000, comments: 1400, shares: 5800,  earnings: 5390,  publishedAt: daysAgo(19) },
    { clipperId: maria.id, campaignId: miss6.id, videoId: v10.id, socialAccountId: acc[21].id, clipUrl: "https://tiktok.com/@maria.chen/v/fam1",        platform: "tiktok",    status: "active",           views: 520000,  likes: 38000, comments: 2900, shares: 13000, earnings: 11440, publishedAt: daysAgo(12) },
    { clipperId: maria.id, campaignId: miss7.id, videoId: v11.id, socialAccountId: acc[21].id, clipUrl: "https://tiktok.com/@maria.chen/v/pray1",       platform: "tiktok",    status: "active",           views: 730000,  likes: 54000, comments: 4200, shares: 18000, earnings: 10950, publishedAt: daysAgo(9)  },
    { clipperId: maria.id, campaignId: missG2.id, videoId: vg3.id, socialAccountId: acc[21].id, clipUrl: "https://tiktok.com/@maria.chen/g1",           platform: "tiktok",    status: "active",           views: 395000,  likes: 28000, comments: 2100, shares: 8500,  earnings: 11060, publishedAt: daysAgo(19) },
    { clipperId: maria.id, campaignId: missG2.id, videoId: vg4.id, socialAccountId: acc[22].id, clipUrl: "https://instagram.com/reel/maria-grace2",     platform: "instagram", status: "active",           views: 210000,  likes: 15200, comments: 1150, shares: 4200,  earnings: 5880,  publishedAt: daysAgo(8)  },

    // ══ Muscle Minds [REAL] — tela's real campaign (Gabriel Ferraz / vrt7) ══
    { clipperId: muscleminds.id, campaignId: campJReal.id, videoId: vrt7.id, socialAccountId: acc[24].id, clipUrl: "https://www.youtube.com/shorts/HtRiKRsAGVg", platform: "youtube", status: "active", views: 19000, likes: 920, comments: 48, shares: 210, earnings: 380, publishedAt: daysAgo(7) },
    { clipperId: muscleminds.id, campaignId: campJReal.id, videoId: vrt7.id, socialAccountId: acc[24].id, clipUrl: "https://www.youtube.com/shorts/yJM5U_F-MO8", platform: "youtube", status: "active", views: 12000, likes: 580, comments: 31, shares: 140, earnings: 240, publishedAt: daysAgo(6) },

    // ══ Maria Chen (@GeoGlobeTales) [REAL] — tela's real campaign (Primo Pobre / vrt1) ══
    { clipperId: maria.id, campaignId: campJReal.id, videoId: vrt1.id, socialAccountId: acc[23].id, clipUrl: "https://www.youtube.com/shorts/HA1hs67ThXc", platform: "youtube", status: "active", views: 2400000, likes: 142000, comments: 4800, shares: 38000, earnings: 48000, publishedAt: daysAgo(14) },
    { clipperId: maria.id, campaignId: campJReal.id, videoId: vrt1.id, socialAccountId: acc[23].id, clipUrl: "https://www.youtube.com/shorts/mB1U5W8nwTg", platform: "youtube", status: "active", views: 1800000, likes: 108000, comments: 3600, shares: 27000, earnings: 36000, publishedAt: daysAgo(10) },
  ];

  await Promise.all(clips.map((c) => prisma.clip.create({ data: c })));

  // ─── Rankings ─────────────────────────────────────────────────────────────
  // Maria (@GeoGlobeTales) [REAL]: 2.4M + 1.8M = 4.2M real views + demo content
  const rankingData = [
    { clipperId: maria.id,       totalViews: 8218000, totalClips: 12, rankPosition: 1,  badge: "top1"  }, // REAL @GeoGlobeTales
    { clipperId: cr6.id,         totalViews: 2030000, totalClips: 4,  rankPosition: 2,  badge: "top3"  },
    { clipperId: cr8.id,         totalViews: 1625000, totalClips: 6,  rankPosition: 3,  badge: "top3"  },
    { clipperId: cr2.id,         totalViews: 1548000, totalClips: 6,  rankPosition: 4,  badge: "top10" },
    { clipperId: cr7.id,         totalViews: 1380000, totalClips: 3,  rankPosition: 5,  badge: "top10" },
    { clipperId: cr4.id,         totalViews: 1268000, totalClips: 5,  rankPosition: 6,  badge: "top10" },
    { clipperId: cr10.id,        totalViews: 1252000, totalClips: 4,  rankPosition: 7,  badge: "top10" },
    { clipperId: cr1.id,         totalViews: 820000,  totalClips: 5,  rankPosition: 8,  badge: "top10" },
    { clipperId: cr5.id,         totalViews: 392000,  totalClips: 3,  rankPosition: 9,  badge: "top10" },
    { clipperId: cr9.id,         totalViews: 330000,  totalClips: 4,  rankPosition: 10, badge: "top10" },
    { clipperId: cr3.id,         totalViews: 204000,  totalClips: 3,  rankPosition: 11, badge: null    },
    { clipperId: muscleminds.id, totalViews: 31000,   totalClips: 2,  rankPosition: 12, badge: null    }, // REAL @muscleminds_1
  ];

  const periodDate = new Date("2026-04-01");
  await prisma.ranking.createMany({
    data: [
      ...rankingData.map((r) => ({ ...r, period: "all_time" })),
      ...rankingData.map((r) => ({ ...r, period: "monthly", periodDate })),
    ],
  });

  console.log("Seed completed!");
  console.log(`  8 churches (Grace + Rede Tela [REAL] + Cariani + 5 demo)`);
  console.log(`  12 creators (Maria Chen [@GeoGlobeTales REAL] + Muscle Minds [REAL] + 10 demo)`);
  console.log(`  25 sermons (vrt1+vrt7 = tela, vrt2-vrt6 = Rede Tela, 18 demo)`);
  console.log(`  12 missions (1 real tela + 1 Rede Tela + 3 Grace + 7 demo)`);
  console.log(`  ${clips.length} content pieces (4 real: 2 Maria/GeoGlobeTales + 2 Muscle Minds)`);
  console.log(`  ${rankingData.length * 2} ranking entries (Maria @GeoGlobeTales #1 REAL)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
