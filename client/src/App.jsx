import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Code2, ChevronRight, Loader2, Copy, Terminal, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

// --- TYPEWRITER COMPONENT (Fixed Overflow) ---
const Typewriter = ({ content, speed = 2 }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  
  useEffect(() => {
    if (!content) return;
    setDisplayedContent('');
    let i = 0;
    const timer = setInterval(() => {
      const chunk = content.substring(0, i + 10);
      setDisplayedContent(chunk);
      i += 10;
      if (i > content.length) {
        setDisplayedContent(content);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [content, speed]);

  return (
    <div className="prose prose-invert prose-sm md:prose-base w-full max-w-none break-words whitespace-pre-wrap
      prose-headings:text-cyan-400 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
      prose-p:text-slate-300 prose-p:leading-relaxed 
      prose-li:text-slate-300 prose-li:marker:text-cyan-500
      prose-code:text-cyan-300 prose-code:bg-slate-900/80 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:break-all
      prose-strong:text-white prose-strong:font-bold">
      <ReactMarkdown>{displayedContent}</ReactMarkdown>
    </div>
  );
};

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [depth, setDepth] = useState('advanced');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('explanation');
  
  const editorRef = useRef(null);

  const scrollToEditor = () => {
    editorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExplain = async () => {
    if (!code) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 🔥 UPDATED LIVE BACKEND URL 🔥
      const response = await fetch('https://day35-aicodereviewer.onrender.com/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, depth })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.details || "Failed to fetch analysis");
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* BACKGROUND EFFECTS */}
      <div className="aurora-bg fixed inset-0 z-[-1]">
        <div className="absolute top-0 left-0 w-full h-full bg-[#000212]"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* --- SECTION 1: HERO LANDING --- */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-sm font-medium text-cyan-200">AI Architect v2.0 Live</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-white">
            Decode the <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Matrix.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing. Get a CPU-level runtime trace, variable analysis, and architectural breakdown instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToEditor}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              Start analyzing <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- SECTION 2: FEATURES --- */}
      <section className="py-24 px-4 bg-black/40 backdrop-blur-sm border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Cpu className="text-cyan-400" />, title: "Runtime Trace", desc: "Simulates CPU execution line-by-line." },
              { icon: <Terminal className="text-purple-400" />, title: "Logic Mapping", desc: "Breaks down complex recursive functions." },
              { icon: <Zap className="text-yellow-400" />, title: "Optimization", desc: "Finds bottlenecks before deployment." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl"
              >
                <div className="bg-slate-900 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 3: EDITOR --- */}
      <section ref={editorRef} className="min-h-screen py-24 px-4 relative bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-1 bg-cyan-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-white">Code Analysis Engine</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[800px]">
            
            {/* LEFT: INPUT */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-1 flex flex-col h-full"
            >
              {/* Window Header */}
              <div className="p-4 border-b border-white/10 flex flex-wrap gap-4 justify-between items-center bg-black/40 rounded-t-xl">
                 <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                 </div>

                 {/* DROPDOWNS (FIXED VISIBILITY) */}
                 <div className="flex gap-3">
                    <div className="relative">
                        <select 
                          value={language} 
                          onChange={(e) => setLanguage(e.target.value)} 
                          className="appearance-none bg-slate-800 border border-slate-700 text-xs md:text-sm text-cyan-100 rounded-lg px-4 py-2 outline-none focus:border-cyan-500 hover:bg-slate-700 cursor-pointer min-w-[120px]"
                        >
                          <option value="javascript" className="bg-[#0f172a] text-slate-300">JavaScript</option>
                          <option value="python" className="bg-[#0f172a] text-slate-300">Python</option>
                          <option value="cpp" className="bg-[#0f172a] text-slate-300">C++</option>
                          <option value="java" className="bg-[#0f172a] text-slate-300">Java</option>
                        </select>
                    </div>

                    <div className="relative">
                        <select 
                          value={depth} 
                          onChange={(e) => setDepth(e.target.value)} 
                          className="appearance-none bg-slate-800 border border-slate-700 text-xs md:text-sm text-cyan-100 rounded-lg px-4 py-2 outline-none focus:border-cyan-500 hover:bg-slate-700 cursor-pointer min-w-[140px]"
                        >
                          <option value="advanced" className="bg-[#0f172a] text-slate-300">Deep Trace</option>
                          <option value="intermediate" className="bg-[#0f172a] text-slate-300">Overview</option>
                        </select>
                    </div>
                 </div>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste complex code here..."
                className="flex-1 w-full bg-[#0b1121]/80 p-6 font-mono text-sm text-cyan-100/90 resize-none outline-none placeholder:text-slate-600 custom-scrollbar leading-relaxed"
                spellCheck="false"
              ></textarea>

              <div className="p-4 border-t border-white/10 bg-black/20">
                <button 
                  onClick={handleExplain}
                  disabled={loading || !code}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-cyan-900/20"
                >
                  {loading ? (
                    <> <Loader2 className="animate-spin" /> Tracing Execution... </>
                  ) : (
                    <> <Brain size={20} /> Initialize Deep Scan </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* RIGHT: OUTPUT */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col h-full overflow-hidden relative"
            >
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-sm">
                   <div className="w-16 h-16 border-4 border-t-cyan-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-6"></div>
                   <h3 className="text-xl font-bold text-white tracking-widest">ANALYZING TOPOLOGY</h3>
                   <div className="mt-2 text-cyan-400/70 font-mono text-xs text-center space-y-1">
                      <p>Tracing function calls...</p>
                      <p>Inspecting API payloads...</p>
                      <p>Mapping variable mutations...</p>
                   </div>
                </div>
              ) : null}

              {/* Tabs */}
              <div className="flex border-b border-white/10 bg-black/20">
                <button 
                  onClick={() => setActiveTab('explanation')}
                  className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${activeTab === 'explanation' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/5' : 'text-slate-500 hover:text-white'}`}
                >
                  EXECUTION TRACE
                </button>
                <button 
                  onClick={() => setActiveTab('suggestions')}
                  className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${activeTab === 'suggestions' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-white/5' : 'text-slate-500 hover:text-white'}`}
                >
                  OPTIMIZATION
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-black/40 w-full">
                {result ? (
                   activeTab === 'explanation' ? (
                     <Typewriter content={result.explanation} />
                   ) : (
                     <Typewriter content={result.suggestions} />
                   )
                ) : error ? (
                   <div className="h-full flex flex-col items-center justify-center text-red-400 p-8 text-center">
                     <Zap size={48} className="mb-4" />
                     <p>{error}</p>
                   </div>
                ) : !loading && (
                   <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                     <Terminal size={64} className="mb-4" />
                     <p>Awaiting Input Stream</p>
                   </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/10 bg-black/40 flex justify-between items-center text-xs text-slate-500">
                <span>AI Model: Llama 3 405B</span>
                {result && (
                  <button className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
                    <Copy size={12} /> Copy Report
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 bg-black text-center text-slate-600">
        <p className="text-xs">© 2026 AI Architect Systems.</p>
      </footer>
    </div>
  );
}

export default App;