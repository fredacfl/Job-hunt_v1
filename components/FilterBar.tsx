
import React, { useState } from 'react';
import { SearchFilters } from '../types';
import { INDUSTRIES, REGIONS, EXPERIENCE_LEVELS } from '../constants';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(i => i !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="relative space-y-1">
      <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-sm focus:ring-2 focus:ring-blue-100 outline-none text-left flex justify-between items-center transition-all hover:border-blue-300 min-h-[42px]"
      >
        <span className="break-words">
          {selected.length === 0 ? `請選擇${label}` : 
           selected.length === options.length ? '全部' : 
           selected.join(', ')}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar p-1">
            {options.map(opt => (
              <div 
                key={opt}
                onClick={() => toggleOption(opt)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-blue-50 cursor-pointer rounded-lg transition-colors group"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selected.includes(opt) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                  {selected.includes(opt) && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                </div>
                <span className={`text-sm ${selected.includes(opt) ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>{opt}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

interface FilterBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isSearching: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onSearch, isSearching }) => {
  return (
    <div className="bg-white border-b border-slate-100 p-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input
              type="text"
              name="jobTitle"
              placeholder="輸入欲搜尋的職稱範疇 (例如: 前端工程師, 產品經理...)"
              className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all"
              value={filters.jobTitle}
              onChange={(e) => onFilterChange({ ...filters, jobTitle: e.target.value })}
            />
          </div>
          <button
            onClick={onSearch}
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-12 rounded-xl transition-all shadow-md flex items-center justify-center min-w-[160px]"
          >
            {isSearching ? (
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "搜尋職缺"}
          </button>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MultiSelect 
            label="產業類別" 
            options={INDUSTRIES} 
            selected={filters.industries} 
            onChange={(val) => onFilterChange({ ...filters, industries: val })} 
          />
          <MultiSelect 
            label="工作地區" 
            options={REGIONS} 
            selected={filters.locations} 
            onChange={(val) => onFilterChange({ ...filters, locations: val })} 
          />
          <MultiSelect 
            label="工作年資" 
            options={EXPERIENCE_LEVELS} 
            selected={filters.experienceLevels} 
            onChange={(val) => onFilterChange({ ...filters, experienceLevels: val })} 
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
