export const prdContent = `
# Retail Marketing AI: Product Requirements Document

## 1. The "Founder-PM" Narrative & Vision
**The Problem:** Small-to-medium retail businesses (SMBs) live and die by their inventory turnover. However, transforming a new arrival into a compelling social media post, an email campaign, and an SMS blast is heavily manual. Store owners are operators, not marketers. They suffer from "seasonal campaign burnout" and friction in moving items from the stockroom to the storefront (digital and physical).

**Our Vision:** To provide an intelligent, agentic marketing partner that reduces the time-to-market for a new product from hours to seconds, bridging the gap between receiving inventory and driving foot traffic/online sales.

### Core User Stories (JTBD)
1. **The "Stockroom to Social" JTBD:** 
   *When* a new shipment of seasonal apparel arrives, *I want to* snap a photo and instantly generate brand-aligned cross-platform marketing content, *so I can* drive weekend foot traffic without spending an hour writing captions.
2. **The "Seasonal Slump" JTBD:** 
   *When* I have excess inventory nearing the end of a season, *I want* the system to proactively suggest discount strategies and draft targeted promotional campaigns, *so I can* clear stock profitably without cheapening my brand.
3. **The "Unified Brand Voice" JTBD:** 
   *When* I am managing multiple channels (Email, SMS, IG, TikTok), *I want* a consistent tone of voice that sounds authentic to my local community, *so I can* build loyalty without sounding corporate or generic.

## 2. Competitive Moat
**Why Agentic AI (Gemini) beats Templates:**
Traditional marketing tools (e.g., Canva, Mailchimp) rely on static templates. The user still has to *do the work*. 
By leveraging an **Agentic Workflow**, our product shifts from a *tool* to a *teammate*:
- **Contextual Awareness:** Gemini multimodal capabilities allow us to analyze a photo of a dress, identify its material, style, and seasonal appropriateness, and dynamically generate copy—something templates cannot do.
- **Self-Refining Output:** Using a multi-step prompt chain, the AI drafts, reviews against the brand's style guide, and refines the copy before the user even sees it.
- **Data-Driven Iteration:** Over time, the agent learns which outputs generate engagement, dynamically tuning its generation parameters. This creates a compounding data moat.
`;

export const techSpecContent = `
# Technical Specification & Architecture

## 1. System Design
Our architecture is designed for low latency, high availability, and seamless multimodal AI processing.

- **Frontend (Mobile):** React Native / Expo (or Flutter). Chosen for rapid cross-platform deployment, focusing on a "Single-Action" UI model (Camera first, one-tap publish).
- **Backend (API Orchestration):** Python (FastAPI). Fast, asynchronous, and native to data/AI ecosystems. Handles routing, rate-limiting, and AI agent orchestration.
- **Database:** PostgreSQL (Supabase/Neon) for relational data (users, campaigns, inventory). Redis for caching prompt contexts and rate limiting.

## 2. Agentic Workflow (Gemini Integration)
We utilize a Retrieval-Augmented Generation (RAG) and Agentic Prompt Chain strategy.

**The Workflow:**
1. **Multimodal Ingestion:** User uploads a product photo + minimal text (e.g., "$45, 20% off").
2. **Context Retrieval:** Backend retrieves the user's "Brand Voice Profile" (tone, emojis, local keywords) from the database.
3. **Vision Processing (Gemini 1.5 Flash/Pro):** The image is parsed to extract metadata (color, material, aesthetic).
4. **Agentic Drafting:**
   - *Agent A (Copywriter):* Drafts Instagram, Email, and SMS text.
   - *Agent B (Editor):* Evaluates the output against the Brand Voice Profile.
5. **Structured Output Verification:** The final output is returned as enforced JSON format to ensure the frontend parses it correctly.

## 3. Scalability Strategy (10,000+ Retailers)
- **Token Optimization:** We aggressively cache Brand Voice models in Redis and append them strategically to limit input tokens.
- **Concurrency & Rate Limiting:** FastAPI async queues manage spikes. Redis handles bucket-rate limiting on a per-tenant basis.
- **Cost Optimization:** We route initial image tagging to Gemini 1.5 Flash (low latency/cost) and reserve Gemini 1.5 Pro solely for complex multi-channel campaign generation when reasoning depth is required.
`;

export const schemaContent = `
# Required JSON Schema & Boilerplate Code

## 1. Structured JSON Output Schema
To ensure frontend stability, Gemini must output strictly structured JSON.

\`\`\`json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "campaignTitle": { "type": "string" },
    "campaignId": { "type": "string" },
    "channels": {
      "type": "object",
      "properties": {
        "instagram": {
          "type": "object",
          "properties": {
            "caption": { "type": "string" },
            "hashtags": { "type": "array", "items": { "type": "string" } }
          },
          "required": ["caption", "hashtags"]
        },
        "email": {
          "type": "object",
          "properties": {
            "subjectLine": { "type": "string" },
            "previewText": { "type": "string" },
            "bodyMarkdown": { "type": "string" }
          },
          "required": ["subjectLine", "previewText", "bodyMarkdown"]
        },
        "sms": {
          "type": "object",
          "properties": {
            "message": { "type": "string", "maxLength": 160 }
          },
          "required": ["message"]
        }
      },
      "required": ["instagram", "email", "sms"]
    }
  },
  "required": ["campaignTitle", "channels"]
}
\`\`\`

## 2. Python FastAPI Backend Structure (Boilerplate)
\`\`\`python
from fastapi import FastAPI, File, UploadFile, Depends
from google.genai import Client
import json

app = FastAPI(title="Retail AI Agent API")
ai_client = Client(api_key="GEMINI_API_KEY")

@app.post("/api/v1/campaigns/generate")
async def generate_campaign(
    image: UploadFile = File(...),
    product_context: str = "New arrival"
):
    # 1. Read Image
    image_bytes = await image.read()
    
    # 2. Retrieve Brand Profile (Mocked)
    brand_profile = "Upbeat, local boutique, uses earthy emojis."
    
    # 3. Agentic Call to Gemini
    prompt = f"""
    You are an expert retail marketer. Analyze this image.
    Product Context: {product_context}
    Brand Voice: {brand_profile}
    
    Generate a highly converting campaign with Instagram, Email, and SMS copy.
    Return strictly as JSON matching the campaign schema.
    """
    
    response = ai_client.models.generate_content(
        model='gemini-1.5-pro',
        contents=[
            {'mime_type': image.content_type, 'data': image_bytes},
            prompt
        ],
        config={'response_mime_type': 'application/json'}
    )
    
    # 4. Parse & Return
    return json.loads(response.text)
\`\`\`

## 3. React Native / Mobile Frontend Structure (Boilerplate)
\`\`\`typescript
// screens/CampaignGeneratorScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
// (Assuming standard image picker and API service)

export const CampaignGeneratorScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
      const result = await api.generateCampaign(photo);
      setCampaign(result);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
       {/* Single-Action UI focus */}
       {!photo ? (
         <TouchableOpacity onPress={takePhoto} style={styles.primaryBtn}>
            <Text>Snap Product Photo</Text>
         </TouchableOpacity>
       ) : (
         <TouchableOpacity onPress={handleGenerate} style={styles.actionBtn}>
            <Text>{isProcessing ? "AI Agent Drafting..." : "Generate Campaign"}</Text>
         </TouchableOpacity>
       )}
       
       {/* Render structured results */}
       {campaign && <CampaignPreview data={campaign} />}
    </View>
  );
};
\`\`\`
`
