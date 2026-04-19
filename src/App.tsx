import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Code2, Cpu, Sparkles, Image as ImageIcon, Send, Instagram, Mail, Smartphone } from 'lucide-react';
import { prdContent, techSpecContent, schemaContent } from './content';

// Simple implementation of the Gemini API for the browser prototype
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [activeTab, setActiveTab] = useState('prd');

  const tabs = [
    { id: 'prd', label: 'Product Strategy & Vision', icon: BookOpen, content: prdContent },
    { id: 'docs', label: 'Technical Architecture', icon: Cpu, content: techSpecContent },
    { id: 'code', label: 'Implementation Plan', icon: Code2, content: schemaContent },
    { id: 'prototype', label: 'Live Prototype', icon: Sparkles, content: null },
  ];

  const activeContent = tabs.find(t => t.id === activeTab)?.content;

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col md:flex-row font-sans text-[#E0E0E0] overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-72 bg-[#121214] border-b md:border-b-0 md:border-r border-[#2A2A2E] flex flex-col relative z-10 h-screen">
        <div className="p-6 border-b border-[#2A2A2E]">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#2A2A2E] p-2 rounded-lg text-[#F1E5D1]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#F1E5D1] font-serif">RetailAgent AI</h1>
          </div>
          <p className="text-[13px] text-[#888888] font-medium tracking-wide">
            Marketing Agentic Workflow
          </p>
        </div>

        <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest pl-3 mb-2">Documentation</p>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#18181B] text-[#D1D1D1] border-l-2 border-[#D19A66] rounded-l-none'
                    : 'text-[#888888] hover:bg-[#18181B] hover:text-[#D1D1D1]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D19A66]' : 'text-[#888888]'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-[#2A2A2E] text-[11px] text-[#888888]">
          Built to demonstrate PM & Architecture capability.
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0B] relative p-4 md:p-10 h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {activeTab === 'prototype' ? (
              <InteractivePrototype />
            ) : (
              <div className="bg-[#121214] border border-[#2A2A2E] rounded-xl p-8 md:p-12 shadow-sm prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-[#F1E5D1] prose-h1:text-3xl prose-h1:tracking-tight prose-a:text-[#D19A66] prose-code:text-[#7CC37C] prose-code:font-mono prose-code:text-[11px] prose-code:bg-[#18181B] prose-code:border prose-code:border-[#2A2A2E] prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-pre:bg-[#18181B] prose-pre:border prose-pre:border-[#2A2A2E] prose-pre:text-[#7CC37C]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {activeContent || ''}
                </ReactMarkdown>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Interactive Prototype Component ---
function InteractivePrototype() {
  const [productDetails, setProductDetails] = useState<{text: string; image: File | null}>({ text: '', image: null });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!productDetails.text.trim() && !productDetails.image) return;
    
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API Key is missing.");

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
      You are an expert retail marketer for a local boutique. 
      Product context: "${productDetails.text}"
      
      Generate a cross-channel marketing campaign. 
      Output MUST be valid JSON only.
      
      Schema:
      {
        "campaignTitle": "string",
        "channels": {
          "instagram": { "caption": "string", "hashtags": ["string"] },
          "email": { "subjectLine": "string", "previewText": "string", "bodyMarkdown": "string" },
          "sms": { "message": "string" }
        }
      }
      `;

      const contents: any[] = [prompt];

      if (productDetails.image) {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(productDetails.image!);
        });
        contents.unshift({
          inlineData: {
            data: base64Data,
            mimeType: productDetails.image.type
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: contents,
        config: {
            responseMimeType: "application/json"
        }
      });

      if (response.text) {
         setResult(JSON.parse(response.text));
      } else {
         throw new Error("Empty response from AI");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate campaign");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* Phone/Simulator Area */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <div className="bg-[#000] rounded-[40px] border-[12px] border-[#2A2A2E] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden h-[800px] flex flex-col relative mx-auto">
          
          <div className="h-full bg-[#F8F9FA] flex flex-col overflow-hidden text-[#1A1A1A]">
            {/* Status Bar Mock */}
            <div className="h-6 bg-[#FFF] border-b border-[#EEE] w-full flex justify-between items-center px-6 pt-2 pb-8">
              <span className="text-[10px] font-extrabold text-[#888]">AGENT STATUS: READY</span>
              <div className="flex gap-1">
                <span className="w-3 h-3 bg-[#1A1A1A] rounded-full"></span>
                <span className="w-3 h-3 bg-[#1A1A1A] rounded-full"></span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col relative z-0 bg-[#FDFDFD]">
              <h2 className="text-[20px] font-sans font-bold mb-6 text-[#1A1A1A]">Campaign Lab</h2>
              
              {/* Real Image Picker */}
              <label className="w-full h-48 bg-[#FFF] rounded-[12px] border-2 border-dashed border-[#EEE] shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-[#666] mb-6 cursor-pointer hover:bg-[#F8F9FA] transition-colors relative overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setProductDetails({ ...productDetails, image: file });
                  }}
                />
                {productDetails.image ? (
                   <img src={URL.createObjectURL(productDetails.image)} alt="Product" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                   <>
                     <ImageIcon className="w-8 h-8 mb-2 text-[#888]" />
                     <p className="font-bold text-sm">Upload Product Photo</p>
                     <p className="text-[11px] mt-1">(Tap to browse)</p>
                   </>
                )}
              </label>

              <div className="mb-6">
                <label className="text-[12px] font-bold text-[#666] mb-2 block uppercase tracking-wider">Simulated Input</label>
                <textarea 
                  value={productDetails.text}
                  onChange={(e) => setProductDetails({ ...productDetails, text: e.target.value })}
                  placeholder="e.g. Vintage denim jacket, $85. Perfect for fall."
                  className="w-full h-24 p-3 bg-[#FFF] border border-[#EEE] rounded-[12px] shadow-[0_2px_4px_rgba(0,0,0,0.02)] resize-none focus:outline-none focus:border-[#1A1A1A] text-[#1A1A1A] font-medium text-[13px]"
                />
              </div>

              <div className="mt-auto">
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || (!productDetails.text.trim() && !productDetails.image)}
                  className="w-full bg-[#1A1A1A] text-[#FFF] font-semibold py-4 rounded-[8px] flex items-center justify-center gap-2 disabled:bg-[#888] disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isGenerating ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                       <Sparkles className="w-5 h-5 text-[#F1E5D1]" />
                    </motion.div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Deploy Multi-Channel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Output / Review Area */}
      <div className="flex-1">
        {error && (
            <div className="p-4 bg-red-900/20 text-red-400 border border-red-900/50 rounded-xl mb-4 font-medium text-sm">
                {error}
            </div>
        )}

        {!result && !isGenerating && !error && (
            <div className="h-full border-[2px] border-dashed border-[#2A2A2E] rounded-3xl flex flex-col items-center justify-center text-[#888888] p-12 text-center">
                <Cpu className="w-12 h-12 mb-4 opacity-50 text-[#D19A66]" />
                <h3 className="text-[20px] font-serif text-[#F1E5D1] mb-2">Agent Awaiting Input</h3>
                <p className="max-w-md text-[13px]">Enter some product details in the mockup to see the agent orchestrate a multi-channel campaign instantly.</p>
            </div>
        )}

        {isGenerating && (
             <div className="h-full border border-[#2A2A2E] bg-[#121214] rounded-3xl p-12 flex flex-col items-center justify-center">
                 <div className="flex gap-2">
                    <span className="w-3 h-3 bg-[#D19A66] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-3 h-3 bg-[#D19A66] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-3 h-3 bg-[#D19A66] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                 </div>
                 <p className="mt-6 font-serif text-[20px] text-[#F1E5D1]">Agentic Drafting in Progress...</p>
                 <p className="text-[#888888] mt-2 text-center text-[13px]">Evaluating against defined brand voice.</p>
             </div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-6"
          >
              <div className="bg-[#121214] border border-[#2A2A2E] rounded-[12px] p-8 shadow-sm">
                 <h3 className="text-[24px] font-serif text-[#F1E5D1] mb-2">{result.campaignTitle}</h3>
                 <div className="text-[12px] font-bold text-[#7CC37C] mb-6 flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> 
                    Approved by Agent Output formatting
                 </div>

                 <div className="space-y-8">
                     {/* IG */}
                     <div>
                         <div className="flex items-center gap-2 mb-3 text-[#D19A66] font-bold text-sm uppercase tracking-wide">
                             <Instagram className="w-5 h-5" />
                             Instagram
                         </div>
                         <div className="bg-[#18181B] p-4 rounded-[12px] text-[#D1D1D1] whitespace-pre-wrap text-[13px] border border-[#2A2A2E]">
                             {result.channels.instagram.caption}
                             <div className="mt-4 flex flex-wrap gap-2">
                                 {result.channels.instagram.hashtags.map((t: string, i: number) => (
                                     <span key={i} className="text-[10px] bg-[#E8F0FE] text-[#1967D2] px-2 py-1 rounded-md lowercase tracking-tight">#{t}</span>
                                 ))}
                             </div>
                         </div>
                     </div>

                     {/* SMS */}
                     <div>
                         <div className="flex items-center gap-2 mb-3 text-[#D19A66] font-bold text-sm uppercase tracking-wide">
                             <Smartphone className="w-5 h-5" />
                             SMS Blast
                         </div>
                         <div className="bg-[#18181B] p-4 rounded-[12px] text-[#D1D1D1] text-[13px] border border-[#2A2A2E] shadow-inner max-w-sm">
                             {result.channels.sms.message}
                         </div>
                     </div>

                     {/* Email */}
                     <div>
                         <div className="flex items-center gap-2 mb-3 text-[#D19A66] font-bold text-sm uppercase tracking-wide">
                             <Mail className="w-5 h-5" />
                             Email Campaign
                         </div>
                         <div className="border border-[#2A2A2E] rounded-[12px] overflow-hidden text-sm">
                             <div className="bg-[#18181B] p-4 border-b border-[#2A2A2E] flex flex-col gap-2">
                                <div className="text-[#D1D1D1]"><span className="text-[#888] w-16 inline-block uppercase text-[10px] font-bold tracking-widest">Subject</span> <span className="font-semibold">{result.channels.email.subjectLine}</span></div>
                                <div className="text-[#A0A0A0]"><span className="text-[#888] w-16 inline-block uppercase text-[10px] font-bold tracking-widest">Preview</span> <span className="text-[13px]">{result.channels.email.previewText}</span></div>
                             </div>
                             <div className="p-6 bg-[#121214] whitespace-pre-wrap text-[#E0E0E0]">
                                 <div className="prose prose-invert prose-sm max-w-none prose-p:text-[#E0E0E0] prose-a:text-[#D19A66]">
                                     <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                         {result.channels.email.bodyMarkdown}
                                     </ReactMarkdown>
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
              </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

