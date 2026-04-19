const baseOutputFormat = `
Each concept must include:
- Brand Name
- Tagline
- Value Proposition
- Target Audience
- Brand Tone
- SEO Title
- SEO Description
- Domain Ideas (max 3)

STRICT RULES:
- Do NOT include explanations
- Do NOT use markdown
- Do NOT number items
- Output ONLY structured blocks

OUTPUT FORMAT:

=== BLOCK START ===
Brand Name: ...
Tagline: ...
Value Proposition: ...
Target Audience: ...
Brand Tone: ...
SEO Title: ...
SEO Description: ...
Domain Ideas: name.com, name.io
=== BLOCK END ===

Repeat 5 times exactly.
`;

const promptTemplates = {

    // 🔹 SAAS
    saas: {
        title: "SaaS Startup Generator",
        fields: [
            { key: "product", placeholder: "Product idea" },
            { key: "audience", placeholder: "Target audience" },
            { key: "tone", placeholder: "Tone (modern, playful...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS SAAS BRAND STRATEGIST.

Generate 5 SaaS startup brand concepts.

CONTEXT:
Product: ${data.product}
Audience: ${data.audience}
Tone: ${data.tone}

${baseOutputFormat}
`
    },

    // 🔹 ECOMMERCE
    ecommerce: {
        title: "Ecommerce Brand Builder",
        fields: [
            { key: "productType", placeholder: "Product type" },
            { key: "audience", placeholder: "Target audience" },
            { key: "style", placeholder: "Brand style (luxury, minimal...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS ECOMMERCE BRAND STRATEGIST.

Generate 5 ecommerce brand concepts.

CONTEXT:
Product Type: ${data.productType}
Audience: ${data.audience}
Style: ${data.style}

${baseOutputFormat}
`
    },

    // 🔹 FINTECH
    fintech: {
        title: "Fintech Startup Generator",
        fields: [
            { key: "solution", placeholder: "Financial solution (payments, lending...)" },
            { key: "audience", placeholder: "Target users" },
            { key: "region", placeholder: "Target region (India, global...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS FINTECH BRAND STRATEGIST.

Generate 5 fintech startup brand concepts.

CONTEXT:
Solution: ${data.solution}
Audience: ${data.audience}
Region: ${data.region}

${baseOutputFormat}
`
    },

    // 🔹 AI TOOL
    aiTool: {
        title: "AI Product Generator",
        fields: [
            { key: "problem", placeholder: "Problem solved" },
            { key: "user", placeholder: "Target user" },
            { key: "tone", placeholder: "Tone (futuristic, minimal...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS AI PRODUCT STRATEGIST.

Generate 5 AI startup brand concepts.

CONTEXT:
Problem: ${data.problem}
User: ${data.user}
Tone: ${data.tone}

${baseOutputFormat}
`
    },

    // 🔹 HEALTH / FITNESS
    health: {
        title: "Health & Fitness Brand",
        fields: [
            { key: "focus", placeholder: "Fitness goal (weight loss, muscle...)" },
            { key: "audience", placeholder: "Target audience" },
            { key: "style", placeholder: "Brand tone (energetic, premium...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS HEALTH & FITNESS BRAND STRATEGIST.

Generate 5 health/fitness brand concepts.

CONTEXT:
Focus: ${data.focus}
Audience: ${data.audience}
Style: ${data.style}

${baseOutputFormat}
`
    },

    // 🔹 EDTECH
    edtech: {
        title: "EdTech Platform Generator",
        fields: [
            { key: "subject", placeholder: "Learning subject (coding, UPSC...)" },
            { key: "audience", placeholder: "Students / professionals" },
            { key: "mode", placeholder: "Learning mode (app, platform...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS EDTECH BRAND STRATEGIST.

Generate 5 edtech startup brand concepts.

CONTEXT:
Subject: ${data.subject}
Audience: ${data.audience}
Mode: ${data.mode}

${baseOutputFormat}
`
    },

    // 🔹 CREATOR / PERSONAL BRAND
    creator: {
        title: "Personal Brand Builder",
        fields: [
            { key: "niche", placeholder: "Your niche (tech, fitness...)" },
            { key: "audience", placeholder: "Target audience" },
            { key: "personality", placeholder: "Personality (bold, fun...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS PERSONAL BRAND STRATEGIST.

Generate 5 personal brand identities.

CONTEXT:
Niche: ${data.niche}
Audience: ${data.audience}
Personality: ${data.personality}

${baseOutputFormat}
`
    },

    // 🔹 AGENCY
    agency: {
        title: "Agency Name Generator",
        fields: [
            { key: "service", placeholder: "Service (marketing, design...)" },
            { key: "clients", placeholder: "Target clients" },
            { key: "tone", placeholder: "Tone (corporate, edgy...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS AGENCY BRAND STRATEGIST.

Generate 5 agency brand concepts.

CONTEXT:
Service: ${data.service}
Clients: ${data.clients}
Tone: ${data.tone}

${baseOutputFormat}
`
    },

    // 🔹 WEB3 / CRYPTO
    web3: {
        title: "Web3 / Crypto Startup",
        fields: [
            { key: "usecase", placeholder: "Use case (DeFi, NFT...)" },
            { key: "audience", placeholder: "Crypto users / traders" },
            { key: "tone", placeholder: "Tone (futuristic, rebellious...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS WEB3 BRAND STRATEGIST.

Generate 5 Web3 startup brand concepts.

CONTEXT:
Use Case: ${data.usecase}
Audience: ${data.audience}
Tone: ${data.tone}

${baseOutputFormat}
`
    },

    // 🔹 MOBILE APP
    mobileApp: {
        title: "Mobile App Idea Generator",
        fields: [
            { key: "purpose", placeholder: "App purpose" },
            { key: "users", placeholder: "Target users" },
            { key: "style", placeholder: "App style (simple, addictive...)" }
        ],
        template: (data) => `
You are a WORLD-CLASS MOBILE APP STRATEGIST.

Generate 5 mobile app brand concepts.

CONTEXT:
Purpose: ${data.purpose}
Users: ${data.users}
Style: ${data.style}

${baseOutputFormat}
`
    },


    // 🔹 D2C BRAND (NEW 🔥)
    d2c: {
        title: "D2C Brand Builder",
        fields: [
            { key: "product", placeholder: "Product (skincare, snacks...)" },
            { key: "usp", placeholder: "Unique selling point" },
            { key: "audience", placeholder: "Target audience" },
            { key: "pricePosition", placeholder: "Pricing (budget, premium...)" },
            { key: "vibe", placeholder: "Brand vibe (luxury, fun, clean...)" }
        ],
        template: (d) => `
You are a WORLD-CLASS D2C BRAND STRATEGIST.

Generate 5 direct-to-consumer brand concepts.

CONTEXT:
Product: ${d.product}
USP: ${d.usp}
Audience: ${d.audience}
Pricing: ${d.pricePosition}
Vibe: ${d.vibe}

${baseOutputFormat}
`
    },

    // 🔹 MARKETPLACE (NEW 🔥)
    marketplace: {
        title: "Marketplace Startup",
        fields: [
            { key: "buyers", placeholder: "Who are buyers?" },
            { key: "sellers", placeholder: "Who are sellers?" },
            { key: "category", placeholder: "Marketplace category" },
            { key: "region", placeholder: "Target region" },
            { key: "tone", placeholder: "Tone (trustworthy, modern...)" }
        ],
        template: (d) => `
You are a WORLD-CLASS MARKETPLACE STRATEGIST.

Generate 5 marketplace brand concepts.

CONTEXT:
Buyers: ${d.buyers}
Sellers: ${d.sellers}
Category: ${d.category}
Region: ${d.region}
Tone: ${d.tone}

${baseOutputFormat}
`
    },

    // 🔹 B2B STARTUP (NEW 🔥)
    b2b: {
        title: "B2B Startup Generator",
        fields: [
            { key: "solution", placeholder: "Business solution" },
            { key: "industry", placeholder: "Target industry" },
            { key: "decisionMaker", placeholder: "Buyer persona (CTO, HR...)" },
            { key: "painPoint", placeholder: "Main pain point" },
            { key: "tone", placeholder: "Tone (professional, authoritative...)" }
        ],
        template: (d) => `
You are a WORLD-CLASS B2B BRAND STRATEGIST.

Generate 5 B2B startup brand concepts.

CONTEXT:
Solution: ${d.solution}
Industry: ${d.industry}
Decision Maker: ${d.decisionMaker}
Pain Point: ${d.painPoint}
Tone: ${d.tone}

${baseOutputFormat}
`
    },

    // 🔹 FINTECH (IMPROVED)
    fintech: {
        title: "Fintech Startup Generator",
        fields: [
            { key: "solution", placeholder: "Solution (payments, lending...)" },
            { key: "audience", placeholder: "Target users" },
            { key: "region", placeholder: "Region" },
            { key: "trustFactor", placeholder: "Trust angle (secure, fast...)" }
        ],
        template: (d) => `
You are a WORLD-CLASS FINTECH BRAND STRATEGIST.

Generate 5 fintech brand concepts.

CONTEXT:
Solution: ${d.solution}
Audience: ${d.audience}
Region: ${d.region}
Trust Factor: ${d.trustFactor}

${baseOutputFormat}
`
    },

    // 🔹 AI TOOL (IMPROVED)
    aiTool: {
        title: "AI Product Generator",
        fields: [
            { key: "problem", placeholder: "Problem solved" },
            { key: "user", placeholder: "Target user" },
            { key: "output", placeholder: "AI output (text, image...)" },
            { key: "tone", placeholder: "Tone (futuristic, minimal...)" }
        ],
        template: (d) => `
You are a WORLD-CLASS AI PRODUCT STRATEGIST.

Generate 5 AI startup brand concepts.

CONTEXT:
Problem: ${d.problem}
User: ${d.user}
Output Type: ${d.output}
Tone: ${d.tone}

${baseOutputFormat}
`
    },

    // 🔹 CONTENT / MEDIA BRAND (NEW 🔥)
    media: {
        title: "Content / Media Brand",
        fields: [
            { key: "platform", placeholder: "Platform (YouTube, blog...)" },
            { key: "niche", placeholder: "Content niche" },
            { key: "audience", placeholder: "Audience" },
            { key: "style", placeholder: "Style (educational, entertaining...)" }
        ],
        template: (d) => `
You are a WORLD-CLASS MEDIA BRAND STRATEGIST.

Generate 5 content/media brand concepts.

CONTEXT:
Platform: ${d.platform}
Niche: ${d.niche}
Audience: ${d.audience}
Style: ${d.style}

${baseOutputFormat}
`
    },

    // 🔹 STARTUP IDEA VALIDATOR (NEW 🔥)
    startup: {
        title: "Startup Idea Generator",
        fields: [
            { key: "idea", placeholder: "Startup idea" },
            { key: "problem", placeholder: "Problem" },
            { key: "audience", placeholder: "Target users" },
            { key: "edge", placeholder: "Unique advantage" }
        ],
        template: (d) => `
You are a WORLD-CLASS STARTUP STRATEGIST.

Generate 5 startup brand concepts.

CONTEXT:
Idea: ${d.idea}
Problem: ${d.problem}
Audience: ${d.audience}
Edge: ${d.edge}

${baseOutputFormat}
`
    }

};

export default promptTemplates;