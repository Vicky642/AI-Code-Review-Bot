export interface OwaspCategory {
  id: string;
  name: string;
  description: string;
  url: string;
}

const OWASP_TOP_10: Record<string, OwaspCategory> = {
  'A01': {
    id: 'A01:2021',
    name: 'Broken Access Control',
    description: 'Restrictions on what authenticated users are allowed to do are often not properly enforced.',
    url: 'https://owasp.org/Top10/A01_2021-Broken_Access_Control/'
  },
  'A02': {
    id: 'A02:2021',
    name: 'Cryptographic Failures',
    description: 'Failures related to cryptography which often lead to sensitive data exposure.',
    url: 'https://owasp.org/Top10/A02_2021-Cryptographic_Failures/'
  },
  'A03': {
    id: 'A03:2021',
    name: 'Injection',
    description: 'SQL, NoSQL, OS, and LDAP injection when untrusted data is sent to an interpreter.',
    url: 'https://owasp.org/Top10/A03_2021-Injection/'
  },
  'A04': {
    id: 'A04:2021',
    name: 'Insecure Design',
    description: 'Missing or ineffective control design — not implementation flaws, but design failures.',
    url: 'https://owasp.org/Top10/A04_2021-Insecure_Design/'
  },
  'A05': {
    id: 'A05:2021',
    name: 'Security Misconfiguration',
    description: 'Missing appropriate security hardening, improper permissions, or unnecessary features enabled.',
    url: 'https://owasp.org/Top10/A05_2021-Security_Misconfiguration/'
  },
  'A06': {
    id: 'A06:2021',
    name: 'Vulnerable and Outdated Components',
    description: 'Using components with known vulnerabilities that may undermine application defenses.',
    url: 'https://owasp.org/Top10/A06_2021-Vulnerable_and_Outdated_Components/'
  },
  'A07': {
    id: 'A07:2021',
    name: 'Identification and Authentication Failures',
    description: 'Weaknesses in authentication mechanisms that can lead to account compromise.',
    url: 'https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/'
  },
  'A08': {
    id: 'A08:2021',
    name: 'Software and Data Integrity Failures',
    description: 'Code and infrastructure that does not protect against integrity violations.',
    url: 'https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/'
  },
  'A09': {
    id: 'A09:2021',
    name: 'Security Logging and Monitoring Failures',
    description: 'Insufficient logging and monitoring, allowing attackers to go undetected.',
    url: 'https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/'
  },
  'A10': {
    id: 'A10:2021',
    name: 'Server-Side Request Forgery (SSRF)',
    description: 'SSRF flaws occur when a web application fetches a remote resource without validating the user-supplied URL.',
    url: 'https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/'
  }
};

/**
 * Maps a security finding to the most relevant OWASP Top 10 category,
 * and appends an educational footer to the comment body.
 */
export function enrichWithOwasp(body: string, type: string): string {
  const lowerBody = body.toLowerCase();
  let category: OwaspCategory | null = null;

  if (lowerBody.includes('injection') || lowerBody.includes('sql') || lowerBody.includes('xss') || lowerBody.includes('command')) {
    category = OWASP_TOP_10['A03']!;
  } else if (lowerBody.includes('secret') || lowerBody.includes('password') || lowerBody.includes('api key') || lowerBody.includes('token') || lowerBody.includes('hardcoded')) {
    category = OWASP_TOP_10['A02']!;
  } else if (lowerBody.includes('auth') || lowerBody.includes('permission') || lowerBody.includes('access control') || lowerBody.includes('unauthorized')) {
    category = OWASP_TOP_10['A01']!;
  } else if (lowerBody.includes('ssrf') || lowerBody.includes('server-side request') || lowerBody.includes('fetch') || lowerBody.includes('url')) {
    category = OWASP_TOP_10['A10']!;
  } else if (lowerBody.includes('log') || lowerBody.includes('monitor') || lowerBody.includes('audit')) {
    category = OWASP_TOP_10['A09']!;
  } else if (lowerBody.includes('misconfigur') || lowerBody.includes('default') || lowerBody.includes('expose')) {
    category = OWASP_TOP_10['A05']!;
  }

  if (category) {
    return `${body}\n\n---\n> 🛡️ **OWASP Reference:** [${category.id} — ${category.name}](${category.url})\n> ${category.description}`;
  }

  return body;
}
