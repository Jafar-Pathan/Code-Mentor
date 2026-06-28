# System Design — Topics & Framework

## System Design Interview Framework

### Step 1: Understand Requirements (5 min)
- **Functional requirements:** What does the system do?
- **Non-functional requirements:** Scale, latency, availability, consistency
- **Scope clarification:** What's in scope vs out of scope?

### Step 2: Propose High-Level Design (10 min)
- Sketch the architecture (client → API → services → DB)
- Identify 3-5 major components
- Choose communication patterns (REST, gRPC, message queue)

### Step 3: Deep Dive into Components (15 min)
- Pick 2-3 components for detailed design
- Discuss data models, APIs, algorithms
- Address scalability and reliability

### Step 4: Wrap-Up (5 min)
- Identify bottlenecks and solutions
- Discuss trade-offs
- Summary of design

---

## Common Topics to Prepare

### 1. URL Shortener (bit.ly)
- **Core:** Generate short key → store mapping → redirect
- **Key generation:** Base62 encoding of auto-increment ID, or hash
- **Storage:** NoSQL (Cassandra/DynamoDB) for high write throughput
- **Caching:** Redis for hot URLs (90%+ of traffic is reads)
- **Analytics:** Async logging to Kafka → analytics DB

### 2. Chat System (WhatsApp/Messenger)
- **Real-time:** WebSocket connections via load balancer
- **Message delivery:** Online → direct push, Offline → push notification
- **Storage:** Sharded SQL for messages, user profiles
- **Media:** Upload to S3/CDN, send only URL in message
- **Group chats:** Fan-out to all members
- **Message queue:** Kafka for reliable delivery

### 3. Notification System
- **Push:** Firebase/APNs for mobile, WebSocket for web
- **Queue:** Kafka for buffering, priority queues for urgency
- **Rate limiting:** Per-user, per-device throttling
- **Template engine:** Personalized notification content

### 4. Feed/Timeline (Twitter/Instagram)
- **Fan-out on write:** Pre-compute feed for each follower (expensive write, fast read)
- **Fan-out on read:** Compute feed on request (cheap write, slow read)
- **Hybrid:** Fan-out on write for < 1M followers, on read for celebrities
- **Ranking:** Score = recency + engagement + relevance
- **Pagination:** Cursor-based (not offset-based) for consistent scrolling

### 5. Rate Limiter
- **Algorithms:** Token bucket, Leaky bucket, Sliding window, Fixed window
- **Distributed:** Redis with Lua scripts for atomicity
- **Placement:** API Gateway or middleware
- **Types:** Per-user, per-IP, per-endpoint

### 6. Search Autocomplete (Google Search)
- **Trie:** In-memory trie with top-K results per node
- **Scale:** Sharded trie across servers, prefix-based routing
- **Ranking:** Frequency + recency + personalization
- **Cache:** Redis for popular prefixes
- **Update:** Async rebuild, A/B test new ranking

### 7. File Storage/Sharing (Google Drive/Dropbox)
- **Upload:** Chunking, resumable upload, deduplication (hash-based)
- **Storage:** S3-compatible object storage, block storage for metadata
- **Sync:** Conflict resolution (last-write-wins or operational transforms)
- **Sharing:** Access control lists (ACL), signed URLs

### 8. Web Crawler
- **Seed URLs:** Start with a curated list
- **Queue:** Priority queue (BFS) with URL frontier
- **Politeness:** Respect robots.txt, rate limit per domain
- **Dedup:** Bloom filter for seen URLs
- **Storage:** Document store, inverted index for search
- **Scale:** Distributed crawler with master-worker architecture

---

## Key Concepts to Know

### Scalability
- **Vertical scaling** (bigger machine) vs **Horizontal scaling** (more machines)
- **Load balancing:** Round-robin, least connections, consistent hashing
- **Caching:** Cache-aside, write-through, write-behind, cache invalidation strategies
- **Database sharding:** Hash-based, range-based, directory-based
- **Replication:** Master-slave (read scaling), Multi-master (write scaling)

### Reliability
- **Redundancy:** Active-active, active-passive
- **Failover:** Automatic detection and recovery
- **Circuit breaker:** Prevent cascading failures
- **Retry with exponential backoff**
- **Health checks and monitoring**

### Data Consistency
- **Strong consistency:** Reads always return latest write
- **Eventual consistency:** Reads may return stale data temporarily
- **CAP theorem:** Consistency, Availability, Partition tolerance — pick 2
- **ACID** (SQL) vs **BASE** (NoSQL)

### Estimation
- **QPS estimation:** Daily active users × requests per user / 86400
- **Storage:** (data size per item × items per day) × 365 × retention years
- **Bandwidth:** (request size × QPS) for both upload and download