import { useResumeStore } from '../store/useResumeStore';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function parseResumeWithGemini(file: File) {
    if (!API_KEY) {
        throw new Error("Gemini API Key is missing! Check your .env.local file.");
    }

    // Convert file to base64
    const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });

    const mimeType = file.type || 'application/pdf';

    // Strict instructions for structured JSON output
    const prompt = `
    You are an expert ATS AI resume parser. I am providing a document (resume).
    Please extract the information and return ONLY a strict JSON object that matches exactly this structure:
    {
      "name": "Full Name",
      "role": "Current or Target Professional Role",
      "summary": "Professional summary (write a highly impactful 2-3 sentence summary using action verbs based on the resume content)",
      "skills": ["Skill 1", "Skill 2"],
      "experience": [
        { "id": "1", "company": "Company Name", "role": "Job Title", "date": "Jan 2020 - Present", "description": "Bullet points combined into a concise, impactful paragraph." }
      ],
      "education": [
        { "id": "1", "school": "University Name", "degree": "Degree Name", "date": "Graduation Year" }
      ],
      "projects": [
        { "id": "1", "title": "Project Name", "description": "Short description of project and technologies", "link": "#", "tags": ["Tech1", "Tech2"] }
      ]
    }
    
    CRITICAL: 
    1. If any field is missing, infer it gracefully or leave it empty, but the keys must exist.
    2. ONLY output pure JSON format, DO NOT wrap it in \`\`\`json markdown tags. Just the raw JSON curly braces.
  `;

    const requestBody = {
        contents: [
            {
                parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: prompt }
                ]
            }
        ]
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini Error:", errText);
        let errorMessage = response.statusText || "Unknown Error";
        try {
            const parsedNode = JSON.parse(errText);
            if (parsedNode.error && parsedNode.error.message) {
                errorMessage = parsedNode.error.message;
            }
        } catch (e) { }
        throw new Error('Gemini API Error: ' + errorMessage);
    }

    const result = await response.json();
    const textResponse = result.candidates[0].content.parts[0].text;

    // Clean up any markdown syntax if Gemini unexpectedly ignores the prompt rule
    const cleanJsonStr = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

    try {
        const parsedData = JSON.parse(cleanJsonStr);

        // Mutate the Zustand store directly with the AI parsed real data
        const { updateField } = useResumeStore.getState();

        if (parsedData.name) updateField('name', parsedData.name);
        if (parsedData.role) updateField('role', parsedData.role);
        if (parsedData.summary) updateField('summary', parsedData.summary);
        if (parsedData.skills) updateField('skills', parsedData.skills);

        // Ensure IDs exist for map lists
        if (parsedData.experience) {
            updateField('experience', parsedData.experience.map((e: any, i: number) => ({ ...e, id: String(i) })));
        }
        if (parsedData.education) {
            updateField('education', parsedData.education.map((e: any, i: number) => ({ ...e, id: String(i) })));
        }
        if (parsedData.projects) {
            updateField('projects', parsedData.projects.map((e: any, i: number) => ({ ...e, id: String(i) })));
        }

        return parsedData;
    } catch (e) {
        console.error("JSON Parsing Error from LLM Output:", textResponse);
        throw new Error("Failed to parse the LLM JSON response.");
    }
}
