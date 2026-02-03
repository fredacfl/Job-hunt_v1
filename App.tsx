
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FilterBar from './components/FilterBar';
import JobCard from './components/JobCard';
import { SearchFilters, Job, LoadingState } from './types';
import { fetchJobs } from './services/geminiService';

const App: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    jobTitle: '',
    industries: [],
    locations: [],
    experienceLevels: []
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  // Local storage states
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('savedJobIds') || '[]')
  );
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('appliedJobIds') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('savedJobIds', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('appliedJobIds', JSON.stringify(appliedJobIds));
  }, [appliedJobIds]);

  const handleSearch = useCallback(async () => {
    setLoadingState(LoadingState.LOADING);
    setError(null);
    try {
      const results = await fetchJobs(filters);
      setJobs(results);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setError("無法取得職缺資訊。請檢查網路或稍後再試。");
      setLoadingState(LoadingState.ERROR);
    }
  }, [filters]);

  useEffect(() => {
    handleSearch();
  }, []);

  const toggleSave = (id: string) => {
    setSavedJobIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleApply = (id: string) => {
    setAppliedJobIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Filter out applied jobs from the view
  const visibleJobs = useMemo(() => {
    return jobs.filter(job => !appliedJobIds.includes(job.id));
  }, [jobs, appliedJobIds]);

  // Jobs metadata for sidebar
  const savedJobsDetails = useMemo(() => 
    jobs.filter(j => savedJobIds.includes(j.id)), [jobs, savedJobIds]);
  
  const appliedJobsDetails = useMemo(() => 
    jobs.filter(j => appliedJobIds.includes(j.id)), [jobs, appliedJobIds]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Header */}
      <header className="bg-white pt-10 pb-6 border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-100">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Taiwan Job Hub</h1>
              <p className="text-slate-400 text-sm font-medium mt-1">AI 驅動的全台職缺深度聚合平台</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">目前狀態</span>
              <span className="text-emerald-500 font-black text-sm">串聯全台 5 大平台</span>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Area */}
      <FilterBar 
        filters={filters} 
        onFilterChange={setFilters} 
        onSearch={handleSearch}
        isSearching={loadingState === LoadingState.LOADING}
      />

      {/* Main Content Layout with Sidebar */}
      <div className="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Main Section */}
        <main className="flex-grow lg:w-3/4">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
               <h2 className="text-4xl font-black text-slate-900">
                {loadingState === LoadingState.SUCCESS ? `精選職缺` : "正在載入..."}
              </h2>
              {loadingState === LoadingState.SUCCESS && (
                <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                  找到 {visibleJobs.length} 個項目
                </span>
              )}
            </div>
            <p className="text-slate-400 font-medium">AI 已自動過濾已應徵或過期的職缺資訊</p>
          </div>

          {loadingState === LoadingState.LOADING && (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6"></div>
              <p className="text-xl font-black text-slate-800 tracking-tight">AI 正在各平台搜尋與分析...</p>
              <p className="text-slate-400 mt-2">尋找符合「{filters.jobTitle || '最新熱門'}」的職缺</p>
            </div>
          )}

          {loadingState === LoadingState.ERROR && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">搜尋遇到一點困難</h3>
              <p className="text-slate-500 mb-8">{error}</p>
              <button 
                onClick={handleSearch}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-100"
              >
                再試一次
              </button>
            </div>
          )}

          {loadingState === LoadingState.SUCCESS && visibleJobs.length === 0 && (
            <div className="text-center py-40">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <h3 className="text-3xl font-black text-slate-800 mb-2">目前沒有匹配的職缺</h3>
              <p className="text-slate-400">請嘗試更換關鍵字或擴大搜尋條件</p>
            </div>
          )}

          {loadingState === LoadingState.SUCCESS && visibleJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  isSaved={savedJobIds.includes(job.id)}
                  isApplied={appliedJobIds.includes(job.id)}
                  onToggleSave={() => toggleSave(job.id)}
                  onToggleApply={() => toggleApply(job.id)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Sidebar Section */}
        <aside className="lg:w-1/4 flex flex-col gap-8">
          {/* Saved Jobs List */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                已儲存職缺
              </h3>
              <span className="text-sm bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-400 font-bold">
                {savedJobIds.length}
              </span>
            </div>
            {savedJobsDetails.length > 0 ? (
              <ul className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {savedJobsDetails.map(job => (
                  <li key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
                    <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{job.title}</p>
                    <p className="text-xs text-blue-500 mt-1.5 font-medium">{job.company}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-slate-400">{job.location}</span>
                      <button 
                        onClick={() => toggleSave(job.id)}
                        className="text-xs text-red-400 hover:text-red-600 font-bold"
                      >
                        移除
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 text-center py-10 italic">尚無儲存職缺</p>
            )}
          </div>

          {/* Applied Jobs List */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                應徵歷史
              </h3>
              <span className="text-sm bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-400 font-bold">
                {appliedJobIds.length}
              </span>
            </div>
            {appliedJobsDetails.length > 0 ? (
              <ul className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                {appliedJobsDetails.map(job => (
                  <li key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm opacity-70">
                    <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{job.title}</p>
                    <p className="text-xs text-emerald-600 mt-1.5 font-medium italic">{job.company} - 已應徵</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-slate-400">{job.location}</span>
                      <button 
                        onClick={() => toggleApply(job.id)}
                        className="text-xs text-blue-400 hover:text-blue-600 font-bold"
                      >
                        重新顯示
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400 text-center py-10 italic">尚無應徵記錄</p>
            )}
          </div>
        </aside>

      </div>

      <footer className="bg-slate-50 py-16 mt-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
             <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg">T</div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">Taiwan Job Hub</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              您的台灣在地求職專家。結合 Gemini AI 技術與大數據分析，為您即時匯總 CakeResume, Yourator, 104, 1111 及 LinkedIn 全台最具競爭力的職缺資訊與企業評價。
            </p>
          </div>
          <div className="md:col-span-2 flex flex-col items-center md:items-end justify-center">
            <div className="text-slate-300 text-xs font-bold uppercase tracking-[0.2em] mb-4">Powered By Gemini Pro API</div>
            <div className="flex gap-12 text-slate-400 font-bold text-sm">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">隱私政策</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">服務條款</span>
              <span className="hover:text-blue-600 cursor-pointer transition-colors">聯繫支援</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs font-medium">
          © 2024 Taiwan Job Hub Aggregator. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
