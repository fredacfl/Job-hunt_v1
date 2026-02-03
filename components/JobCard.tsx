
import React, { useState } from 'react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  isApplied: boolean;
  onToggleSave: () => void;
  onToggleApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isSaved, isApplied, onToggleSave, onToggleApply }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'LinkedIn': return 'bg-blue-600';
      case '104': return 'bg-orange-400';
      case '1111': return 'bg-red-500';
      case 'CakeResume': return 'bg-slate-800';
      case 'Yourator': return 'bg-pink-500';
      default: return 'bg-slate-400';
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="perspective-1000 w-full min-h-[550px] cursor-pointer group">
      <div className={`relative w-full h-full duration-700 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Side */}
        <div 
          className="absolute inset-0 backface-hidden bg-white border border-slate-100 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-blue-200 transition-all"
          onClick={handleFlip}
        >
          <div className="relative">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-white ${getSourceBadgeColor(job.source)}`}>
                {job.source}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
                  className={`p-1.5 rounded-full transition-all ${isSaved ? 'text-blue-500 bg-blue-50' : 'text-slate-300 hover:text-blue-400 hover:bg-slate-50'}`}
                >
                  <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleApply(); }}
                  className={`p-1.5 rounded-full transition-all ${isApplied ? 'text-emerald-500 bg-emerald-50' : 'text-slate-300 hover:text-emerald-500 hover:bg-slate-50'}`}
                >
                  <svg className="w-5 h-5" fill={isApplied ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-blue-500 font-semibold mt-1.5">{job.company}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-slate-500 text-sm">
              <svg className="w-4 h-4 mr-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {job.location}
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <svg className="w-4 h-4 mr-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {job.experience}
            </div>
            <div className="flex items-center text-emerald-600 text-sm font-bold bg-emerald-50 w-fit px-3 py-1 rounded-lg">
              {job.salary}
            </div>
          </div>
          
          <div className="text-slate-400 text-[10px] text-center mt-4 uppercase tracking-widest font-bold border-t border-slate-50 pt-4">
            點擊翻面查看深度 AI 分析
          </div>
        </div>

        {/* Back Side - Consolidated Single Page */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180 bg-white border border-blue-400 rounded-2xl p-6 flex flex-col shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3 flex-shrink-0">
            <span className="text-sm font-black text-blue-600 uppercase tracking-widest">職缺深度資訊</span>
            <button onClick={handleFlip} className="text-slate-400 hover:text-slate-600 p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar pr-3 space-y-8">
            {/* Section: Description */}
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">職務內容</h4>
              <p className="text-slate-700 text-base leading-relaxed">{job.description}</p>
            </section>

            {/* Section: Requirements */}
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">應徵條件</h4>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="text-slate-600 text-sm flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span> {r}
                  </li>
                ))}
              </ul>
            </section>

            {/* Section: Mentors */}
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">LinkedIn 職場前輩</h4>
              <div className="space-y-3">
                {job.linkedInEmployees?.map((emp, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => window.open(emp.url, '_blank')}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">{emp.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                        <p className="text-xs text-slate-400">{emp.role}</p>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                ))}
              </div>
            </section>

            {/* Section: Analysis */}
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">前輩特徵與技能分析</h4>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 italic text-slate-700 text-sm leading-relaxed">
                "{job.mentorAnalysis}"
              </div>
            </section>

            {/* Section: Reviews */}
            <section>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2.5">論壇與求職天眼通評鑑</h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-sm leading-relaxed">
                {job.companyReviews}
              </div>
            </section>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2 flex-shrink-0">
            <button 
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-base"
              onClick={() => window.open(job.link, '_blank')}
            >
              前往應徵
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
            <button 
              onClick={onToggleApply}
              className={`px-5 py-3.5 rounded-xl border transition-all ${isApplied ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-400 hover:text-emerald-500'}`}
            >
              <svg className="w-6 h-6" fill={isApplied ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobCard;
