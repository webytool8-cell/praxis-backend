import Anthropic from "@anthropic-ai/sdk";
import type { FileContent } from "./analyzeCodebase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface SecurityFinding {
  file: string;
  line?: number;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  description: string;
  recommendation: string;
}

interface RegexPattern {
  type: string;
  severity: SecurityFinding["severity"];
  regex: RegExp;
  description: string;
  recommendation: string;
}

const PATTERNS: RegexPattern[] = [
  {
    type: "hardcoded_secret",
    severity: "critical",
    regex: /(sk_live_|sk_test_|api_key\s*=\s*["'][^"']+["']|apikey\s*[:=]\s*["'][^"']+["']|secret\s*[:=]\s*["'][A-Za-z0-9+/]{20,}["'])/i,
    description: "Hardcoded secret or API key detected",
    recommendation: "Move secrets to environment variables and rotate the exposed key immediately",
  },
  {
    type: "hardcoded_secret",
    severity: "critical",
    regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    description: "Private key embedded in source code",
    recommendation: "Remove the private key from source code and store it securely (e.g., secrets manager)",
  },
  {
    type: "sql_injection",
    severity: "high",
    regex: /query\s*\(\s*[`'"]\s*SELECT.*\$\{|execute\s*\(\s*[`'"]\s*(SELECT|INSERT|UPDATE|DELETE).*\+/i,
    description: "Potential SQL injection via string concatenation",
    recommendation: "Use parameterized queries or a query builder (e.g., Prisma, Knex)",
  },
  {
    type: "eval_usage",
    severity: "high",
    regex: /\beval\s*\(/,
    description: "Use of eval() which can execute arbitrary code",
    recommendation: "Replace eval() with safer alternatives like JSON.parse() or Function constructors with input validation",
  },
  {
    type: "dangerouslySetInnerHTML",
    severity: "high",
    regex: /dangerouslySetInnerHTML\s*=\s*\{/,
    description: "dangerouslySetInnerHTML usage can lead to XSS",
    recommendation: "Sanitize HTML with DOMPurify before setting innerHTML, or use safer React patterns",
  },
  {
    type: "exposed_env_client",
    severity: "medium",
    regex: /process\.env\.(?!NEXT_PUBLIC_)[A-Z_]+/,
    description: "Server-side environment variable potentially accessed in client code",
    recommendation: "Only expose environment variables prefixed with NEXT_PUBLIC_ to the client",
  },
  {
    type: "missing_auth",
    severity: "medium",
    regex: /export\s+(async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(/,
    description: "API route handler without visible authentication check",
    recommendation: "Verify that this route validates the user session/token before processing requests",
  },
  {
    type: "console_log_sensitive",
    severity: "low",
    regex: /console\.(log|debug|info)\s*\([^)]*(?:password|token|secret|key|auth)/i,
    description: "Potentially sensitive data being logged to console",
    recommendation: "Remove console.log statements containing sensitive data from production code",
  },
];

function scanFileWithRegex(file: FileContent): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const lines = file.content.split("\n");

  lines.forEach((line, lineIndex) => {
    PATTERNS.forEach((pattern) => {
      if (pattern.regex.test(line)) {
        findings.push({
          file: file.name,
          line: lineIndex + 1,
          severity: pattern.severity,
          type: pattern.type,
          description: pattern.description,
          recommendation: pattern.recommendation,
        });
      }
    });
  });

  return findings;
}

export async function runSecurityScan(files: FileContent[]): Promise<SecurityFinding[]> {
  const regexFindings: SecurityFinding[] = [];

  // Phase 1: Fast regex scan
  files.forEach((file) => {
    regexFindings.push(...scanFileWithRegex(file));
  });

  // Phase 2: AI-powered semantic analysis (only on high-risk files)
  const highRiskFiles = files
    .filter((f) => /auth|login|payment|token|secret|user|admin/i.test(f.name))
    .slice(0, 5);

  let aiFindings: SecurityFinding[] = [];

  if (highRiskFiles.length > 0) {
    const fileContext = highRiskFiles
      .map((f) => `### ${f.name}\n${f.content.split("\n").slice(0, 150).join("\n")}`)
      .join("\n\n");

    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: `Perform a security review of these source files and identify vulnerabilities:

${fileContext}

Look for:
- Missing authentication/authorization checks
- IDOR (insecure direct object reference) vulnerabilities
- Unvalidated user input
- Insecure data storage
- Missing rate limiting on sensitive endpoints

Return a JSON array of findings (empty array if none found):
[{"file":"path/to/file","severity":"high","type":"idor","description":"...","recommendation":"..."}]

Return ONLY valid JSON. Severity must be: critical | high | medium | low`,
          },
        ],
      });

      const raw = (response.content[0] as { text: string }).text.trim();
      const jsonStr = raw.startsWith("[") ? raw : raw.substring(raw.indexOf("["), raw.lastIndexOf("]") + 1);
      aiFindings = JSON.parse(jsonStr);
    } catch {
      // AI scan failed, rely on regex findings only
    }
  }

  // Deduplicate by file + type + line
  const all = [...regexFindings, ...aiFindings];
  const seen = new Set<string>();
  return all.filter((f) => {
    const key = `${f.file}:${f.type}:${f.line ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
