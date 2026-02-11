
import { GoogleGenAI, Type } from "@google/genai";
import { SearchFilters, Job } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchJobs = async (filters: SearchFilters): Promise<Job[]> => {
  const prompt = `
    Task: Find 20-30 REAL, CURRENTLY ACTIVE, and OPEN job openings in Taiwan.
    
    CRITICAL INSTRUCTION FOR URLS:
    - You MUST provide the ACTUAL, REAL direct application links for each job.
    - DO NOT generate simulated, example, or placeholder URLs (e.g., avoid "example.com", "link-to-job-123", or pattern-based fake IDs).
    - Use your Google Search tool to find the live listings on these specific platforms: LinkedIn, 104 Job Bank, 1111 Job Bank, CakeResume, and Yourator.
    - If you cannot find a direct link to the specific job, find the most relevant real search results page on that platform for that job title and company.
    
    Search Criteria:
    - Job Title Scope: ${filters.jobTitle}
    - Industries: ${filters.industries.join(', ')}
    - Locations: ${filters.locations.join(', ')}
    - Experience Levels: ${filters.experienceLevels.join(', ')}

    For each job, provide:
    1. id: A unique string identifier.
    2. title: The actual job title.
    3. company: The real hiring company name.
    4. location: City/District in Taiwan.
    5. salary: Real salary range or "面議" as stated in the listing. Clean TWD text.
    6. experience: Real experience requirements.
    7. source: One of: LinkedIn, 104, 1111, CakeResume, Yourator.
    8. description: A clear summary in Traditional Chinese.
    9. requirements: Key points from the actual listing.
    10. link: THE ACTUAL VERIFIED URL to the job posting.
    11. linkedInEmployees: Real names (if possible) or highly realistic profiles of people currently in similar roles at that company, with REAL or highly accurate LinkedIn search/profile URLs.
    12. mentorAnalysis: A professional analysis in Traditional Chinese of successful profiles for this role.
    13. companyReviews: Accurate reputation summary from PTT/Dcard/Job Sky Eye.

    Output Language: Traditional Chinese (zh-TW).
    Response Format: Strictly valid JSON.
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
              link: { type: Type.STRING, description: "REAL verified URL to the job listing" },
              linkedInEmployees: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    url: { type: Type.STRING, description: "REAL LinkedIn profile or search URL" }
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
