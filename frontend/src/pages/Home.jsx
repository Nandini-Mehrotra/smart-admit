import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, FileCheck2, Target, TrendingUp, Sparkles, GraduationCap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* --- PREMIUM NAVBAR --- */}
      <nav className="flex justify-between items-center p-6 lg:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">SmartAdmit</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
            Log in
          </Link>
          <Link to="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 hover:shadow-md transition-all">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        {/* Background Glowing Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 ring-1 ring-inset ring-indigo-200 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">SmartAdmit AI Engine 2.0 Live</span>
        </div>

        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Your Dream College, <br className="hidden lg:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
            Decoded by AI.
          </span>
        </h1>

        <p className="text-lg lg:text-xl text-slate-600 max-w-2xl mb-10 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Drop your resume into our AI parser. Get instant admission probabilities, dynamic skill-gap analysis, and tailored university matches based on real data.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <Link to="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center">
            Start Parsing Now <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <a href="#features" className="w-full sm:w-auto bg-white text-slate-700 px-8 py-4 rounded-2xl text-lg font-bold ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 transition-all text-center">
            See How It Works
          </a>
        </div>
      </section>

      {/* --- APP DASHBOARD PREVIEW --- */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="relative rounded-[2rem] bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="rounded-[1.5rem] bg-white ring-1 ring-slate-200 overflow-hidden shadow-sm flex items-center justify-center p-8 lg:p-12">
            {/* Fake Dashboard UI just for the hero image effect */}
            <div className="w-full max-w-3xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-3xl p-12 text-center">
              <BrainCircuit className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Drop your resume PDF here</h3>
              <p className="text-sm text-slate-500 font-medium">Our Gemini-powered engine will instantly extract your profile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="bg-white border-t border-slate-200 py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Stop guessing. Start strategizing.
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              We transformed the black box of college admissions into a clear, actionable data dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 ring-1 ring-inset ring-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 ring-1 ring-inset ring-blue-200">
                <FileCheck2 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Instant Resume Parsing</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Upload your PDF and let our LLM pipeline extract your GPA, test scores, projects, and top skills in seconds. No manual data entry required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 rounded-3xl p-8 ring-1 ring-inset ring-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 ring-1 ring-inset ring-indigo-200">
                <BrainCircuit className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Matchmaking</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Our machine learning models compare your extracted profile against historical admissions data to categorize schools into Safe, Target, and Dream tiers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 rounded-3xl p-8 ring-1 ring-inset ring-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6 ring-1 ring-inset ring-emerald-200">
                <Target className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Skill Gap Analysis</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Don't just get rejected. Know *why*. We identify the exact skills or projects you are missing to hit the admission thresholds of your Dream schools.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-50 rounded-3xl p-8 ring-1 ring-inset ring-slate-200 hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6 ring-1 ring-inset ring-amber-200">
                <TrendingUp className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">"What-If" Scenario Engine</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Wondering if that summer internship will move the needle? Use our dynamic sliders to simulate how changes to your profile impact your admission odds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="bg-slate-900 py-20 text-center px-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-6">
          Ready to build your college strategy?
        </h2>
        <Link to="/signup" className="inline-flex items-center justify-center bg-indigo-500 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:bg-indigo-400 hover:-translate-y-1 transition-all">
          Create your free account
        </Link>
        <p className="text-slate-400 font-medium mt-8 text-sm">
          © {new Date().getFullYear()} SmartAdmit AI. Built for future innovators.
        </p>
      </section>
      
    </div>
  );
}