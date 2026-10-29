import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    engine: 'SpecForge Accreditation Server v2.4',
  });
});

// Auto-Map CO to PO/PSO endpoint
app.post('/api/gemini/auto-map', async (req, res) => {
  try {
    const {
      courseTitle,
      courseCode,
      courseDescription,
      courseOutcomes,
      programOutcomes,
      programSpecificOutcomes,
    } = req.body;

    if (!courseOutcomes || !Array.isArray(courseOutcomes)) {
      return res.status(400).json({ error: 'Missing courseOutcomes array' });
    }

    if (!ai) {
      // Deterministic engineering heuristic fallback when API key is not configured
      const fallbackMappings: Record<string, Record<string, { weight: number; rationale: string }>> = {};
      
      courseOutcomes.forEach((co: any) => {
        fallbackMappings[co.id] = {};
        const coLower = (co.statement + ' ' + (co.bloomLevel || '')).toLowerCase();
        
        // PO1: Engineering Knowledge
        fallbackMappings[co.id]['PO1'] = {
          weight: coLower.includes('design') || coLower.includes('implement') || coLower.includes('analyze') ? 3 : 2,
          rationale: 'Fundamental mathematical and algorithmic formulations required for this outcome.',
        };
        // PO2: Problem Analysis
        fallbackMappings[co.id]['PO2'] = {
          weight: co.bloomLevel === 'BT4' || co.bloomLevel === 'BT5' || coLower.includes('analyze') ? 3 : 2,
          rationale: 'Requires substantive analysis of problem complexity and operational constraints.',
        };
        // PO3: Design/Development of Solutions
        fallbackMappings[co.id]['PO3'] = {
          weight: co.bloomLevel === 'BT6' || coLower.includes('design') || coLower.includes('construct') ? 3 : (co.bloomLevel === 'BT3' ? 2 : 1),
          rationale: 'Involves architectural component synthesis and data model development.',
        };
        // PO4: Investigations
        fallbackMappings[co.id]['PO4'] = {
          weight: coLower.includes('experiment') || coLower.includes('benchmark') || coLower.includes('evaluate') ? 3 : 1,
          rationale: 'Empirical benchmarking of asymptotic behavior and experimental verification.',
        };
        // PO5: Modern Tool Usage
        fallbackMappings[co.id]['PO5'] = {
          weight: coLower.includes('implement') || coLower.includes('simulate') || coLower.includes('tool') ? 2 : 1,
          rationale: 'Applied profilers, IDE debuggers, and modern development environments.',
        };
        // PO6 - PO10 (Contextual)
        fallbackMappings[co.id]['PO6'] = { weight: 0, rationale: 'Minimal direct societal policy impact.' };
        fallbackMappings[co.id]['PO7'] = {
          weight: coLower.includes('efficiency') || coLower.includes('energy') ? 1 : 0,
          rationale: 'Resource optimization minimizes carbon footprint in large-scale computation.',
        };
        fallbackMappings[co.id]['PO8'] = {
          weight: coLower.includes('security') || coLower.includes('integrity') ? 2 : 0,
          rationale: 'Engineering ethics regarding software reliability, privacy, and integrity.',
        };
        fallbackMappings[co.id]['PO9'] = {
          weight: coLower.includes('team') || coLower.includes('project') ? 2 : 1,
          rationale: 'Collaborative laboratory assignments and code peer review.',
        };
        fallbackMappings[co.id]['PO10'] = {
          weight: coLower.includes('document') || coLower.includes('present') ? 2 : 1,
          rationale: 'Technical specification documentation and algorithmic complexity report.',
        };
        fallbackMappings[co.id]['PO11'] = {
          weight: coLower.includes('project') || coLower.includes('cost') ? 2 : 0,
          rationale: 'Computational budgeting and timeline management.',
        };
        fallbackMappings[co.id]['PO12'] = {
          weight: 2,
          rationale: 'Foundational algorithmic concepts essential for adapting to evolving computer science paradigms.',
        };

        // PSOs
        fallbackMappings[co.id]['PSO1'] = {
          weight: 3,
          rationale: 'Direct alignment with Core Computing Systems & Data Architectures.',
        };
        fallbackMappings[co.id]['PSO2'] = {
          weight: 2,
          rationale: 'Applied distributed computing and enterprise scalability fundamentals.',
        };
        fallbackMappings[co.id]['PSO3'] = {
          weight: 1,
          rationale: 'Algorithmic underpinnings for intelligent machine learning systems.',
        };
      });

      return res.json({
        mappings: fallbackMappings,
        source: 'heuristic',
        summaryRationale: 'Generated using deterministic ABET/NBA curriculum alignment rules and Bloom’s Taxonomy cognitive depth hierarchy.',
      });
    }

    // Call Gemini 3.8 Flash
    const prompt = `You are a Senior ABET & NBA Accreditation Specialist and Engineering Faculty Dean.
Analyze the following Course Outcomes (COs) for "${courseCode}: ${courseTitle}":
Course Description: ${courseDescription || 'N/A'}

Course Outcomes:
${JSON.stringify(courseOutcomes, null, 2)}

Target Outcomes to map:
Program Outcomes: PO1 to PO12
Program Specific Outcomes: PSO1, PSO2, PSO3

Generate a rigorous correlation weighting matrix where:
- 0 = No correlation
- 1 = Low / Slight correlation (introduced or mentioned briefly)
- 2 = Medium / Moderate correlation (actively practiced or reinforced with exercises)
- 3 = High / Substantial correlation (mastered, primary assessment focus)

Return ONLY valid JSON with this exact structure:
{
  "mappings": {
    "CO1": {
      "PO1": { "weight": 3, "rationale": "Directly applies discrete mathematical theory..." },
      "PO2": { "weight": 2, "rationale": "..." },
      ...
      "PO12": { "weight": 1, "rationale": "..." },
      "PSO1": { "weight": 3, "rationale": "..." },
      "PSO2": { "weight": 2, "rationale": "..." },
      "PSO3": { "weight": 1, "rationale": "..." }
    }
  },
  "summaryRationale": "Comprehensive accreditation alignment summary..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text || '{}';
    const parsed = JSON.parse(responseText);

    return res.json({
      mappings: parsed.mappings || {},
      source: 'gemini-3.8-flash',
      summaryRationale: parsed.summaryRationale || 'Curriculum aligned via Gemini AI analysis.',
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/auto-map:', error);
    return res.status(500).json({ error: error.message || 'Auto-mapping failed' });
  }
});

// Refine CO Statement endpoint
app.post('/api/gemini/refine-co', async (req, res) => {
  try {
    const { currentStatement, targetBloomLevel, courseTitle } = req.body;

    if (!currentStatement) {
      return res.status(400).json({ error: 'Missing currentStatement' });
    }

    if (!ai) {
      // Heuristic fallback
      const verbs: Record<string, string[]> = {
        BT1: ['Identify', 'Define', 'Recall', 'List'],
        BT2: ['Explain', 'Paraphrase', 'Illustrate', 'Summarize'],
        BT3: ['Implement', 'Execute', 'Compute', 'Construct'],
        BT4: ['Analyze', 'Deconstruct', 'Differentiate', 'Benchmark'],
        BT5: ['Evaluate', 'Appraise', 'Critique', 'Validate'],
        BT6: ['Synthesize', 'Formulate', 'Design', 'Architect'],
      };
      const suggestedVerb = (verbs[targetBloomLevel || 'BT4'] || ['Analyze'])[0];
      return res.json({
        refinedStatement: `${suggestedVerb} the algorithmic components, performance tradeoffs, and architectural design principles of ${currentStatement.replace(/^(understand|learn|know|be able to)\s+/i, '')}.`,
        actionVerb: suggestedVerb,
        bloomLevel: targetBloomLevel || 'BT4',
        rationale: 'Replaced vague non-action verb with a precise measurable Bloom taxonomy outcome verb.',
      });
    }

    const prompt = `You are an expert in Outcome-Based Education (OBE) and Bloom's Revised Taxonomy.
The user wants to refine this Course Outcome statement for course "${courseTitle || 'Engineering Course'}":
"${currentStatement}"
Target Bloom's Taxonomy Level: ${targetBloomLevel || 'BT4 (Analyze)'}

Rules:
1. Start with an approved measurable Bloom action verb (e.g. Design, Analyze, Implement, Evaluate, Formulate). NEVER start with "Understand", "Learn", "Know", or "Familiarize".
2. Include the content/topic and measurable context/criteria.
3. Be concise (1-2 clear sentences).

Return ONLY valid JSON:
{
  "refinedStatement": "string",
  "actionVerb": "string",
  "bloomLevel": "string",
  "rationale": "string explanation of pedagogical improvement"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/refine-co:', error);
    return res.status(500).json({ error: error.message || 'Refinement failed' });
  }
});

// Gap Analysis endpoint
app.post('/api/gemini/gap-analysis', async (req, res) => {
  try {
    const { courseTitle, matrixAverages, undermappedList } = req.body;

    if (!ai) {
      return res.json({
        gaps: undermappedList?.map((po: string) => ({
          poId: po,
          severity: 'Moderate',
          issue: `${po} correlation average is below target threshold (< 1.5).`,
          recommendation: `Incorporate an end-of-semester design project or ethical case-study module addressing ${po}.`,
        })) || [],
        actionPlan: 'Review curriculum modules 4 and 5 to embed collaborative design documentation and sustainability assessment rubrics.',
      });
    }

    const prompt = `You are an ABET / NBA accreditation evaluator reviewing a course correlation matrix for "${courseTitle}".
Under-mapped outcomes identified:
${JSON.stringify(undermappedList, null, 2)}
Matrix average scores:
${JSON.stringify(matrixAverages, null, 2)}

Provide an actionable accreditation remediation report for the curriculum committee.
Return ONLY JSON:
{
  "gaps": [
    {
      "poId": "string",
      "severity": "High" | "Moderate" | "Low",
      "issue": "string",
      "recommendation": "concrete curriculum or lab addition"
    }
  ],
  "actionPlan": "executive summary for faculty board"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/gap-analysis:', error);
    return res.status(500).json({ error: error.message || 'Gap analysis failed' });
  }
});

// Generate COs from syllabus endpoint
app.post('/api/gemini/generate-cos', async (req, res) => {
  try {
    const { courseTitle, courseCode, syllabusTopics, targetCount } = req.body;

    if (!ai) {
      const sampleCOs = [
        {
          id: 'CO1',
          statement: `Explain and illustrate the fundamental architectural concepts and theoretical foundations of ${courseTitle}.`,
          bloomLevel: 'BT2',
          targetAttainmentPercentage: 70,
        },
        {
          id: 'CO2',
          statement: `Apply appropriate algorithmic principles and core data abstraction techniques to solve computational tasks.`,
          bloomLevel: 'BT3',
          targetAttainmentPercentage: 70,
        },
        {
          id: 'CO3',
          statement: `Analyze time and space complexity tradeoffs across varying system inputs and operational parameters.`,
          bloomLevel: 'BT4',
          targetAttainmentPercentage: 65,
        },
        {
          id: 'CO4',
          statement: `Design and construct robust modular software components that satisfy specified functional requirements.`,
          bloomLevel: 'BT6',
          targetAttainmentPercentage: 65,
        },
        {
          id: 'CO5',
          statement: `Evaluate system performance and benchmark empirical throughput against industry standard baselines.`,
          bloomLevel: 'BT5',
          targetAttainmentPercentage: 60,
        },
      ];
      return res.json({ courseOutcomes: sampleCOs.slice(0, targetCount || 5) });
    }

    const prompt = `You are an engineering curriculum specialist.
Generate ${targetCount || 5} measurable Course Outcomes (CO1 to CO${targetCount || 5}) for:
Course: ${courseCode} - ${courseTitle}
Syllabus / Topics:
${syllabusTopics || 'Core engineering syllabus topics'}

Requirements:
- Follow Bloom's Revised Taxonomy with progression from BT2 (Understand) to BT3 (Apply), BT4 (Analyze), BT5 (Evaluate), and BT6 (Create).
- Use measurable action verbs.
- Each outcome must be 1 clear sentence.

Return ONLY JSON:
{
  "courseOutcomes": [
    {
      "id": "CO1",
      "statement": "string",
      "bloomLevel": "BT2" | "BT3" | "BT4" | "BT5" | "BT6",
      "targetAttainmentPercentage": 70
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/generate-cos:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

// Mount Vite or serve static assets
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`SpecForge server running at http://0.0.0.0:${port}`);
});
