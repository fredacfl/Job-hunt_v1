
import { GoogleGenAI, Type } from "@google/genai";
import { SearchFilters, Job } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchJobs = async (filters: SearchFilters): Promise<Job[]> => {
  const prompt = `
    Find 20-30 CURRENTLY ACTIVE and OPEN job openings in Taiwan based on these criteria:
    - Job Title Scope: ${filters.jobTitle}
    - Industries: ${filters.industries.join(', ')}
    - Locations: ${filters.locations.join(', ')}
    - Experience Levels: ${filters.experienceLevels.join(', ')}

    Search sources MUST include: LinkedIn, 104 Job Bank, 1111 Job Bank, CakeResume, and Yourator.
    CRITICAL: Only provide jobs that are confirmed to be currently hiring. Avoid expired listings.
    
    For each job, provide: id, title, company, location, salary (clean numeric range or clear text in TWD, avoid redundant labels), years of experience required, industry, source, description, requirements, and direct application link.
    
    SPECIAL REQUIREMENTS:
    1. LinkedIn Mentors: Provide 3 simulated LinkedIn Profiles (name, role, url).
    2. Mentor Analysis: Provide a brief analysis (30-50 words) of the common skills, education backgrounds, or traits shared by successful people in this role at this company.
    3. Company Evaluation: Provide a summary of the company's reputation and employee evaluations based on public info from forums (e.g. PTT, Dcard, Job Sky Eye/求職天眼通). Be objective.

    Ensure the data looks authentic and professional. Use Traditional Chinese for all textual content.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              salary: { type: Type.STRING },
              experience: { type: Type.STRING },
              industry: { type: Type.STRING },
              source: { type: Type.STRING },
              description: { type: Type.STRING },
              requirements: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              postedAt: { type: Type.STRING },
              link: { type: Type.STRING },
              linkedInEmployees: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    url: { type: Type.STRING }
                  },
                  required: ["name", "role", "url"]
                }
              },
              mentorAnalysis: { type: Type.STRING },
              companyReviews: { type: Type.STRING }
            },
            required: ["id", "title", "company", "source", "description", "requirements", "link", "mentorAnalysis", "companyReviews"]
          }
        }
      }
    });

    const jobs = JSON.parse(response.text || "[]") as Job[];
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs from Gemini:", error);
    throw error;
  }
};
