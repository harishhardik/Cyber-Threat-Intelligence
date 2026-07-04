import axios from 'axios';

// Set up default axios client
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Rich mockup data for dashboard statistics, logs, predictions, AI chat, and reports
const MOCK_DATA = {
  dashboard: {
    metrics: {
      totalThreats: { count: 1482, increase: 12.4, trend: [40, 50, 45, 60, 55, 70, 85, 80, 95] },
      criticalThreats: { count: 34, increase: 5.2, trend: [2, 4, 3, 5, 4, 6, 7, 5, 8] },
      highSeverity: { count: 189, increase: -2.1, trend: [20, 18, 22, 19, 17, 21, 25, 23, 20] },
      mediumSeverity: { count: 456, increase: 8.7, trend: [30, 35, 32, 40, 38, 42, 45, 48, 52] },
      lowSeverity: { count: 803, increase: 15.1, trend: [60, 65, 70, 75, 80, 85, 90, 95, 102] },
      resolvedThreats: { count: 1294, increase: 14.2, trend: [35, 42, 40, 55, 50, 68, 80, 78, 92] }
    },
    charts: {
      threatDistribution: [
        { name: 'Phishing', value: 420, color: '#3B82F6' },
        { name: 'Malware', value: 310, color: '#EF4444' },
        { name: 'SQL Injection', value: 240, color: '#F59E0B' },
        { name: 'DDoS', value: 180, color: '#10B981' },
        { name: 'Brute Force', value: 152, color: '#8B5CF6' },
        { name: 'Others', value: 180, color: '#6B7280' },
      ],
      attackTimeline: [
        { time: '00:00', threats: 12, critical: 1 },
        { time: '03:00', threats: 8, critical: 0 },
        { time: '06:00', threats: 15, critical: 2 },
        { time: '09:00', threats: 45, critical: 4 },
        { time: '12:00', threats: 62, critical: 5 },
        { time: '15:00', threats: 55, critical: 3 },
        { time: '18:00', threats: 38, critical: 2 },
        { time: '21:00', threats: 24, critical: 1 },
      ],
      threatSeverity: [
        { name: 'Mon', Critical: 4, High: 15, Medium: 35, Low: 60 },
        { name: 'Tue', Critical: 2, High: 18, Medium: 42, Low: 72 },
        { name: 'Wed', Critical: 5, High: 22, Medium: 39, Low: 68 },
        { name: 'Thu', Critical: 7, High: 25, Medium: 48, Low: 85 },
        { name: 'Fri', Critical: 3, High: 20, Medium: 52, Low: 90 },
        { name: 'Sat', Critical: 1, High: 10, Medium: 25, Low: 40 },
        { name: 'Sun', Critical: 2, High: 8, Medium: 22, Low: 35 },
      ],
      confidenceScores: [
        { range: '50-60%', count: 120 },
        { range: '60-70%', count: 240 },
        { range: '70-80%', count: 380 },
        { range: '80-90%', count: 520 },
        { range: '90-100%', count: 222 },
      ],
      dailyActivity: [
        { day: 'Day 1', active: 110, resolved: 90 },
        { day: 'Day 2', active: 125, resolved: 105 },
        { day: 'Day 3', active: 140, resolved: 115 },
        { day: 'Day 4', active: 135, resolved: 130 },
        { day: 'Day 5', active: 155, resolved: 140 },
        { day: 'Day 6', active: 120, resolved: 125 },
        { day: 'Day 7', active: 95, resolved: 110 },
      ],
      topCategories: [
        { category: 'Credential Access', count: 310 },
        { category: 'Initial Access', count: 280 },
        { category: 'Execution', count: 240 },
        { category: 'Persistence', count: 190 },
        { category: 'Exfiltration', count: 150 },
        { category: 'Defense Evasion', count: 120 },
      ]
    },
    threats: [
      { id: 'TR-8902', attackType: 'SQL Injection', severity: 'Critical', confidence: 0.98, status: 'Active', timestamp: '2026-07-04 11:15:22' },
      { id: 'TR-8903', attackType: 'Phishing Campaign', severity: 'High', confidence: 0.94, status: 'Investigating', timestamp: '2026-07-04 11:08:45' },
      { id: 'TR-8904', attackType: 'Ransomware Payload', severity: 'Critical', confidence: 0.97, status: 'Active', timestamp: '2026-07-04 10:52:10' },
      { id: 'TR-8905', attackType: 'Brute Force SSH', severity: 'Medium', confidence: 0.89, status: 'Resolved', timestamp: '2026-07-04 10:30:15' },
      { id: 'TR-8906', attackType: 'DDoS SYN Flood', severity: 'High', confidence: 0.91, status: 'Investigating', timestamp: '2026-07-04 09:45:00' },
      { id: 'TR-8907', attackType: 'XSS Injection', severity: 'Medium', confidence: 0.85, status: 'Resolved', timestamp: '2026-07-04 09:12:33' },
      { id: 'TR-8908', attackType: 'Port Scanning API', severity: 'Low', confidence: 0.76, status: 'Resolved', timestamp: '2026-07-04 08:30:12' },
      { id: 'TR-8909', attackType: 'Data Exfiltration HTTP', severity: 'High', confidence: 0.93, status: 'Active', timestamp: '2026-07-04 08:15:00' },
      { id: 'TR-8910', attackType: 'DNS Tunneling', severity: 'High', confidence: 0.87, status: 'Investigating', timestamp: '2026-07-04 07:44:21' },
      { id: 'TR-8911', attackType: 'Credential Stuffing', severity: 'Medium', confidence: 0.82, status: 'Resolved', timestamp: '2026-07-04 06:12:05' }
    ]
  },
  prediction: {
    'sql_injection.json': {
      attackCategory: 'SQL Injection',
      confidenceScore: 0.98,
      threatLevel: 'Critical',
      predictionTime: '124ms',
      status: 'Active',
      explanation: {
        description: 'An injection attack wherein SQL queries are injected into input fields, bypass authentication layers, and trigger illegal database reads and writes.',
        businessImpact: 'Unauthorized extraction of personally identifiable information (PII), loss of customer trust, regulatory fines, and database server manipulation.',
        riskAssessment: 'Critical. Direct path to core databases. Attack bypasses basic web application firewall (WAF) rule sets.',
        technicalDetails: 'Payload detected: `1\' UNION SELECT NULL, username, password FROM users --`. Target API: `/api/v1/auth/login`. Response payload includes SQL schema structural data indicators.',
        mitigationSteps: 'Implement parameterized SQL queries. Enforce strict input validation using whitelist patterns. Update WAF signatures to intercept SQL keywords.',
        recommendedActions: {
          immediate: [
            'Revoke read privileges for target database connection user.',
            'Block source IP address (198.51.100.42) on perimeter firewall.',
            'Trigger emergency patch deployment on `/api/v1/auth/login` endpoint.'
          ],
          longTerm: [
            'Migrate database queries to modern Object-Relational Mapping (ORM) modules.',
            'Establish automated SAST/DAST testing within the CI/CD pipeline.',
            'Conduct quarterly internal security training on secure database coding guidelines.'
          ],
          bestPractices: [
            'Apply the Principle of Least Privilege across all database instances.',
            'Enable full database query audit logging.',
            'Perform weekly vulnerability scans on web-facing APIs.'
          ]
        }
      }
    },
    'phishing_log.csv': {
      attackCategory: 'Phishing Campaign',
      confidenceScore: 0.92,
      threatLevel: 'High',
      predictionTime: '98ms',
      status: 'Investigating',
      explanation: {
        description: 'Social engineering campaign utilizing spoofed domains targeting enterprise users to acquire corporate directory authentication tokens.',
        businessImpact: 'Unauthorized lateral access into enterprise SaaS tools, potential email compromise, and credentials leak.',
        riskAssessment: 'High. Risk of executive account takeover.',
        technicalDetails: 'Spoofed Domain: `accounts-secur-google.com`. Sender address: `support@accounts-secur-google.com`. Subscribed users clicked through internal redirect email alerts.',
        mitigationSteps: 'Add SPF/DKIM validation. Update email spam filters to blacklist domain. Force password resets for affected users.',
        recommendedActions: {
          immediate: [
            'Force logout of all sessions for the 14 identified employees.',
            'Add `accounts-secur-google.com` to DNS resolver blocklists.',
            'Purge identical messages from internal exchange queues.'
          ],
          longTerm: [
            'Enforce hardware FIDO2 security keys for corporate email authentication.',
            'Enroll all employees in mandatory automated security awareness training.',
            'Integrate email gateways with threat feeds for live URL inspections.'
          ],
          bestPractices: [
            'Disable external URL auto-previews in client mail software.',
            'Establish an easy single-click "Report Phishing" button in Outlook/Gmail.',
            'Run quarterly mock phishing simulations.'
          ]
        }
      }
    }
  },
  chatAnswers: [
    {
      keywords: ['today', 'attacks', 'dashboard'],
      response: `### Summary of Today's Security Incidents

Here is a summary of the security incidents detected over the last 24 hours:

*   **Critical Severity (3 Alerts)**:
    1.  **TR-8902**: SQL Injection attack originating from IP \`198.51.100.42\` targeting the login API interface.
    2.  **TR-8904**: Ransomware Payload execution attempts on local domain workstation \`FIN-WS-09\`. Intercepted by endpoint protection (EDR).
*   **High Severity (4 Alerts)**:
    *   **TR-8903**: A phishing email campaign targeting financial staff redirecting them to \`accounts-secur-google.com\`.
    *   **TR-8906**: DDoS SYN Flood spike reaching 45,000 requests per second. Mitigation triggered successfully on Cloudflare WAF.
*   **Medium/Low Severity (3 Alerts)**:
    *   Brute-force SSH attempts and API port scanning. Automatically blocked by fail2ban policy rules.

Would you like me to generate a detailed **Incident Report** for the SQL Injection attack or the Phishing campaign?`
    },
    {
      keywords: ['why', 'dangerous', 'sql injection', 'injection'],
      response: `### Risk Profile: SQL Injection (SQLi)

SQL Injection is considered extremely dangerous because it allows attackers to bypass application security barriers and interface directly with backend databases.

#### Primary Risks:
1.  **Data Exfiltration**: Attackers can download database tables including customer credentials, passwords, PII, and financial records.
2.  **Identity Spoofing**: By query manipulation, attackers can bypass login inputs without valid passwords, logging in as administrators.
3.  **Data Deletion & Manipulation**: Command execution like \`DROP TABLE\` or \`UPDATE\` can wipe transaction histories or tamper with ledger audits.
4.  **Remote Code Execution (RCE)**: On poorly-configured database servers, features like MS SQL's \`xp_cmdshell\` can grant terminal access.

#### Target Query Example:
\`\`\`sql
-- Vulnerable code implementation
SELECT * FROM users WHERE email = '` + "input_email" + `' AND password = '` + "input_password" + `';

-- Exploited payload injected as: admin' OR '1'='1
SELECT * FROM users WHERE email = 'admin' OR '1'='1' AND password = '';
-- Result: Logic always evaluates to TRUE, bypassing authentication checks.
\`\`\`

Would you like to examine standard mitigation steps for SQL injection vulnerabilities?`
    },
    {
      keywords: ['report', 'incident', 'generate'],
      response: `### Incident Report Generated Successfully

I have compiled the formal Incident Report for **TR-8902 (SQL Injection)**. 

#### Document Meta:
*   **Incident ID**: TR-8902
*   **Attack Category**: SQL Injection
*   **Severity**: Critical
*   **Confidence**: 98%
*   **Timestamp**: 2026-07-04 11:15:22 UTC

You can review this document in detail or trigger a PDF download directly using the **Incident Reports** panel on the sidebar. Let me know if you would like me to draft a notification email for the security compliance officer.`
    },
    {
      keywords: ['prevent', 'phishing', 'phish'],
      response: `### Strategy Guide: Phishing Prevention

To safeguard against modern spear-phishing and email credentials harvesting, we recommend a multi-layered security approach:

#### 1. Identity & Mail Hygiene
*   **Enforce SPF, DKIM, and DMARC**: Enforce \`DMARC reject\` policies to block domain spoofing.
*   **External Sender Banners**: Append warnings to incoming emails from external addresses to raise employee caution.

#### 2. Strong Multi-Factor Authentication (MFA)
*   **FIDO2 WebAuthn Keys**: Standard SMS or Authenticator app codes are vulnerable to proxy-based phishing (e.g. Evilginx). Hardware keys (YubiKey) are fully immune.

#### 3. Endpoint Mitigation
*   **Secure DNS Resolvers**: Route enterprise traffic through DNS protection suites (Cisco Umbrella, Cloudflare Gateway) to block domain resolution of newly registered or suspicious sites.

Would you like me to write a checklist for setting up DNS Filtering rules?`
    }
  ]
};

// Helper to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const securityService = {
  // GET /dashboard
  getDashboardData: async () => {
    try {
      const response = await API.get('/dashboard');
      return response.data;
    } catch (error) {
      console.warn('Backend API `/dashboard` unavailable. Loading mock database.');
      await delay(800);
      return MOCK_DATA.dashboard;
    }
  },

  // POST /predict
  predictLog: async (filename, logContent) => {
    try {
      const response = await API.post('/predict', { filename, logContent });
      return response.data;
    } catch (error) {
      console.warn('Backend API `/predict` unavailable. Running mock ML classifier.');
      await delay(1500); // simulate ML processing
      
      // Fallback matching logic
      const key = filename.toLowerCase().includes('csv') ? 'phishing_log.csv' : 'sql_injection.json';
      const mockResult = MOCK_DATA.prediction[key] || MOCK_DATA.prediction['sql_injection.json'];
      
      return {
        filename,
        attackCategory: mockResult.attackCategory,
        confidenceScore: mockResult.confidenceScore,
        threatLevel: mockResult.threatLevel,
        predictionTime: mockResult.predictionTime,
        status: mockResult.status,
      };
    }
  },

  // POST /gemini-analysis
  getGeminiAnalysis: async (attackCategory, filename) => {
    try {
      const response = await API.post('/gemini-analysis', { attackCategory, filename });
      return response.data;
    } catch (error) {
      console.warn('Backend API `/gemini-analysis` unavailable. Requesting Gemini emulation.');
      await delay(2000); // simulate LLM reasoning
      
      const key = filename?.toLowerCase()?.includes('csv') ? 'phishing_log.csv' : 'sql_injection.json';
      const mockResult = MOCK_DATA.prediction[key] || MOCK_DATA.prediction['sql_injection.json'];
      
      return mockResult.explanation;
    }
  },

  // POST /chat
  sendChatMessage: async (message, history = []) => {
    try {
      const response = await API.post('/chat', { message, history });
      return response.data;
    } catch (error) {
      console.warn('Backend API `/chat` unavailable. Resolving locally.');
      await delay(1200);
      
      // Search keywords in user message
      const query = message.toLowerCase();
      const match = MOCK_DATA.chatAnswers.find(answer => 
        answer.keywords.some(keyword => query.includes(keyword))
      );

      if (match) {
        return {
          response: match.response,
          model: 'Gemini 1.5 Pro (Emulated)',
        };
      }

      // Default response if no keywords match
      return {
        response: `### Security Assistant Connected

I am your SOC Security Copilot powered by Google Gemini. I can assist you with monitoring, threat modeling, and incident remediation.

I noticed your question: "${message}".

Here are some suggested prompts I am trained on:
1.  **Explain today's attacks** - Get a summary of active indicators.
2.  **Why is this attack dangerous?** - Read a threat assessment on SQL Injection.
3.  **Generate Incident Report** - View a structured report draft.
4.  **How do I prevent phishing?** - Read recommendations on blocking social engineering campaigns.

Let me know how you would like to proceed.`,
        model: 'Gemini 1.5 Pro (Emulated)',
      };
    }
  },

  // POST /incident-report
  getIncidentReport: async (incidentId) => {
    try {
      const response = await API.post('/incident-report', { incidentId });
      return response.data;
    } catch (error) {
      console.warn('Backend API `/incident-report` unavailable. Drafting standard response.');
      await delay(1000);
      
      const dashboardThreats = MOCK_DATA.dashboard.threats;
      const matched = dashboardThreats.find(t => t.id === incidentId) || dashboardThreats[0];
      
      return {
        incidentId: matched.id,
        date: matched.timestamp.split(' ')[0],
        attackCategory: matched.attackType,
        severity: matched.severity,
        summary: `The system detected unauthorized attempts corresponding to ${matched.attackType}. The event triggered a security alert with a confidence rating of ${(matched.confidence * 100).toFixed(0)}%. Perimeter defenses automatically logged the IP coordinates and temporarily suspended active sessions. Investigation is currently logged as ${matched.status.toUpperCase()}.`,
        recommendation: `1. Enforce perimeter IP firewalls to blacklist source address.\n2. Revoke and refresh all credentials that were active during the breach timeline.\n3. Conduct full log auditting of associated database servers and adjacent application gateways.`,
      };
    }
  }
};
