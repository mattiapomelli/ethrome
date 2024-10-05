## AlphaCast
The easiest way to share and monetize your content to your existing network. Alpha or otherwise ;)

-----
AlphaCast is a **private, censorship resistant [Farcaster](https://farcaster.xyz/) client** that allows creators to **monetize their content** for their existing Farcaster network. 

### Table of Contents
- [For Creators](#for-creators)
- [For Consumers](#for-consumers)
- [How to Use](#how-to-use)
- [Deploy it yourself](#deploy-it-yourself)
- [Extensions](#possible-extensions)

### For Creators
Creators can create casts that contain private embedded content. This private content is encrypted and stored on the Bellecour chain using the [IExec](https://www.iex.ec/) SDK. Users can rent this content by making a payment through IExec. This gives them temporary access for the duration set by the creator.

This model **gives creators full control of the sharing of their content.** AlphaCast simply acts as a marketplace; we never store any the creators' keys or data.

### For Consumers
Users can easily sign into AlphaCast with their Farcaster accounts using [Privy](https://www.privy.io/). This lets them **import their existing network** and gives them a **seamless onboarding experience.** 

AlphaCast gives users an engaging TikTok like feed for discovering creators and content. We rerank posts using ['mbd](https://mbd.xyz) to **personalize the user's feed** based on their interests and interaction history. Each time a user makes a purchase, their feed will be curated to show them similar content in the future.

### How to use
AlphaCast is a deployed dApp that you can accessed at [alphacast.vercel.app](https://alphacast.vercel.app). 

**Steps:**
1. Visit the [website](https://alphacast.vercel.app)
2. Scan the QR code to link your Farcaster account
3. Start scrolling the feed and purchasing content
4. Or, become a creator and monetize your "alpha" ;)

### Deploy it yourself
Alphacast is fully open source. If you wish, you can deploy and host the client yourself.

**Steps:**
1. Clone the Github repo: `git clone https://github.com/mattiapomelli/ethrome.git`
2. Install the dependencies: `cd ethrome && npm install`
3. Build and run the project: `npm run build && npm run start`
4. Visit the dApp running locally at [https://localhost:3000](https://localhost:3000)
5. (Optional) Deploy and host the dApp using your suite (vercel, heroku etc.)
 
### Possible Extensions
- Creator/content discovery based on metadata (semantic search)
- Add subscriptions that give users access to all of a creators' posts
- Add support for video content
- Allow creators to delete content