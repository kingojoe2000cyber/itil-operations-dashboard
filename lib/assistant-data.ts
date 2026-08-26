import { buildTemplateDocument, modules } from "@/lib/itil-data";

export type GlossaryEntry = {
  term: string;
  full: string;
  category: string;
  explanation: string;
  related: string[];
};

export type PortfolioProject = {
  title: string;
  type: string;
  description: string;
  focus: string[];
  qualification?: string;
};

export const professionalProfile = {
  name: "Richmond Kwadwo Sarpong",
  headline: "Chartered Accountant · ISO Lead Auditor · Finance and IT GRC Leader",
  summary:
    "A finance and governance professional with more than 12 years of experience spanning internal controls, audit coordination, financial risk management, executive reporting, cybersecurity governance and technology assurance.",
  currentRoles: [
    "Head of Finance, Nursing & Midwifery Training College, Atibie, Ghana (2013–present)",
    "Management Committee Member (2026–present)",
  ],
  qualifications: [
    "Chartered Accountant",
    "ISO Lead Auditor",
    "12+ years in finance leadership, controls, audit coordination and executive reporting",
  ],
  capabilities: [
    "Financial governance and executive reporting",
    "Internal controls and audit coordination",
    "PCI DSS v4.0.1 scoping and readiness",
    "IT control testing and access reviews",
    "Risk registers, gap analysis and remediation tracking",
    "Third-party assurance and evidence review",
    "Incident response and service resilience",
    "Business impact analysis, continuity and disaster recovery",
    "Executive dashboards and decision support",
  ],
};

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "PCI DSS v4.0.1 Merchant Readiness Case Study",
    type: "Cybersecurity governance portfolio",
    description:
      "A fictional merchant-readiness engagement demonstrating PCI DSS scoping, cardholder-data-flow analysis, control-gap assessment, evidence planning and remediation governance.",
    focus: ["PCI DSS v4.0.1", "Scope and data flows", "Gap analysis", "Remediation roadmap"],
    qualification:
      "Portfolio simulation only—not a real merchant engagement, Report on Compliance, Attestation of Compliance or QSA assessment.",
  },
  {
    title: "Microsoft 365 Access-Control Audit",
    type: "IT audit portfolio",
    description:
      "A structured review concept for identity governance, privileged access, account lifecycle controls, evidence testing and management reporting in Microsoft 365.",
    focus: ["Identity governance", "Privileged access", "Control testing", "Audit reporting"],
  },
  {
    title: "IT Risk Assessment",
    type: "Risk and compliance portfolio",
    description:
      "A fictional healthcare-oriented IT risk assessment applying recognized control frameworks to asset, threat, vulnerability, likelihood, impact and treatment analysis.",
    focus: ["NIST", "ISO/IEC 27001 and 27005", "NIST SP 800-53", "CIS Controls v8"],
    qualification: "Portfolio simulation only; it does not disclose a real institution’s assessment results.",
  },
  {
    title: "CyberSecure360 GRC Platform Concept",
    type: "Product and dashboard concept",
    description:
      "An integrated governance, risk and compliance concept focused on control visibility, evidence tracking, audit management, vendor risk, continuity and executive decision support.",
    focus: ["GRC workflows", "Evidence tracking", "Risk dashboards", "Executive reporting"],
  },
  {
    title: "AWS Cloud Capability Portfolio",
    type: "Cloud technology portfolio",
    description:
      "Practical cloud capability covering foundational AWS services, Linux administration, static content delivery and cloud-security fundamentals.",
    focus: ["Amazon S3", "Amazon EC2", "CloudFront", "Linux and cloud security"],
  },
];

export const glossary: GlossaryEntry[] = [
  { term: "API", full: "Application Programming Interface", category: "Technology", explanation: "A defined way for software systems to exchange requests and data.", related: ["IAM", "SLA"] },
  { term: "BCM", full: "Business Continuity Management", category: "Continuity", explanation: "The management discipline used to prepare an organization to continue priority activities during disruption.", related: ["BIA", "BCP", "DR"] },
  { term: "BCP", full: "Business Continuity Plan", category: "Continuity", explanation: "Documented arrangements for sustaining or restoring priority business activities after disruption.", related: ["BCM", "BIA", "DRP"] },
  { term: "BIA", full: "Business Impact Analysis", category: "Continuity", explanation: "Analysis that identifies critical activities, disruption impacts, dependencies and recovery priorities.", related: ["RTO", "RPO", "MTPD"] },
  { term: "CAB", full: "Change Advisory Board", category: "Change", explanation: "A group that assesses significant changes and advises the change authority on authorization and scheduling.", related: ["RFC", "ECAB", "PIR"] },
  { term: "CI", full: "Configuration Item", category: "Configuration", explanation: "A component that must be managed to deliver an IT service, such as a server, application or document.", related: ["CMDB", "CMS"] },
  { term: "CIS", full: "Center for Internet Security", category: "Security", explanation: "Publisher of the CIS Controls and technical benchmarks used to improve cybersecurity posture.", related: ["NIST", "ISO", "GRC"] },
  { term: "CMDB", full: "Configuration Management Database", category: "Configuration", explanation: "A repository that stores configuration items and the relationships between them.", related: ["CI", "CMS"] },
  { term: "CMS", full: "Configuration Management System", category: "Configuration", explanation: "The tools, data and supporting information used to manage configuration knowledge across services.", related: ["CI", "CMDB"] },
  { term: "CSF", full: "Cybersecurity Framework", category: "Security", explanation: "A structured set of cybersecurity outcomes and practices; commonly refers to the NIST CSF.", related: ["NIST", "CIS", "ISMS"] },
  { term: "CSI", full: "Continual Service Improvement", category: "ITIL", explanation: "The ongoing practice of aligning and improving services, processes and controls as needs change.", related: ["KPI", "CSF"] },
  { term: "DR", full: "Disaster Recovery", category: "Continuity", explanation: "The capability to restore technology services and data after a major disruption.", related: ["DRP", "RTO", "RPO"] },
  { term: "DRP", full: "Disaster Recovery Plan", category: "Continuity", explanation: "A documented sequence of roles, procedures and resources for restoring technology after a disaster.", related: ["DR", "BCP", "RTO"] },
  { term: "ECAB", full: "Emergency Change Advisory Board", category: "Change", explanation: "A small decision group convened to assess and authorize urgent emergency changes.", related: ["CAB", "RFC"] },
  { term: "GRC", full: "Governance, Risk and Compliance", category: "Governance", explanation: "An integrated approach for directing the organization, managing uncertainty and meeting obligations.", related: ["ISMS", "KRI", "PCI DSS"] },
  { term: "IAM", full: "Identity and Access Management", category: "Security", explanation: "Processes and technology that control digital identities and access to systems and information.", related: ["MFA", "RBAC"] },
  { term: "ISMS", full: "Information Security Management System", category: "Security", explanation: "A systematic approach to managing information-security risk, controls and continual improvement.", related: ["ISO", "GRC", "NIST"] },
  { term: "ISO", full: "International Organization for Standardization", category: "Governance", explanation: "The international body that publishes standards including the ISO/IEC 27000 information-security family.", related: ["ISMS", "NIST"] },
  { term: "ITIL", full: "Information Technology Infrastructure Library", category: "ITIL", explanation: "A widely used body of guidance for managing digital products and services through value-focused practices.", related: ["ITSM", "CSI", "SLA"] },
  { term: "ITSCM", full: "IT Service Continuity Management", category: "Continuity", explanation: "The IT service management practice that ensures technology services can meet agreed continuity requirements.", related: ["BCM", "BIA", "DR"] },
  { term: "ITSM", full: "IT Service Management", category: "ITIL", explanation: "The organizational capabilities and activities used to design, deliver, support and improve IT services.", related: ["ITIL", "SLA", "SLM"] },
  { term: "KE", full: "Known Error", category: "Problem", explanation: "A problem that has been analyzed but not resolved, usually with a documented workaround or cause.", related: ["KEDB", "RCA"] },
  { term: "KEDB", full: "Known Error Database", category: "Problem", explanation: "A repository of known errors and workarounds used to speed incident diagnosis and restoration.", related: ["KE", "RCA"] },
  { term: "KPI", full: "Key Performance Indicator", category: "Governance", explanation: "A measurable value that shows how effectively an objective or target is being achieved.", related: ["KRI", "CSF"] },
  { term: "KRI", full: "Key Risk Indicator", category: "Governance", explanation: "A measure that signals increasing exposure to a specific risk or risk category.", related: ["KPI", "GRC"] },
  { term: "MFA", full: "Multi-Factor Authentication", category: "Security", explanation: "Authentication that requires two or more independent verification factors.", related: ["IAM", "RBAC"] },
  { term: "MTBF", full: "Mean Time Between Failures", category: "Availability", explanation: "The average operating time between repairable service or component failures.", related: ["MTTR", "SLA"] },
  { term: "MTPD", full: "Maximum Tolerable Period of Disruption", category: "Continuity", explanation: "The longest time an activity can be unavailable before the impact becomes unacceptable.", related: ["BIA", "RTO", "RPO"] },
  { term: "MTPO", full: "Maximum Tolerable Period of Outage", category: "Continuity", explanation: "An alternative continuity term for the maximum acceptable duration of an outage.", related: ["MTPD", "RTO"] },
  { term: "MTTR", full: "Mean Time to Restore", category: "Availability", explanation: "The average time required to restore a service after failure; some organizations use the term for repair or resolution.", related: ["MTBF", "SLA"] },
  { term: "NIST", full: "National Institute of Standards and Technology", category: "Security", explanation: "A US standards body whose cybersecurity publications and frameworks are widely used internationally.", related: ["CSF", "CIS", "ISO"] },
  { term: "OLA", full: "Operational Level Agreement", category: "Service", explanation: "An internal agreement describing how supporting teams contribute to an external service target.", related: ["SLA", "UC"] },
  { term: "PCI DSS", full: "Payment Card Industry Data Security Standard", category: "Security", explanation: "A global security standard designed to protect payment-account data environments.", related: ["GRC", "ISMS"] },
  { term: "PIR", full: "Post-Implementation Review", category: "Change", explanation: "A review that checks whether a change met objectives without unacceptable impact and captures lessons learned.", related: ["RFC", "CAB"] },
  { term: "QA", full: "Quality Assurance", category: "Testing", explanation: "Planned activities that provide confidence that processes and deliverables meet quality requirements.", related: ["UAT", "KPI"] },
  { term: "RACI", full: "Responsible, Accountable, Consulted and Informed", category: "Governance", explanation: "A matrix that clarifies participation and decision ownership for activities or deliverables.", related: ["SOP", "GRC"] },
  { term: "RBAC", full: "Role-Based Access Control", category: "Security", explanation: "An access model in which permissions are assigned to roles and users receive access through those roles.", related: ["IAM", "MFA"] },
  { term: "RCA", full: "Root Cause Analysis", category: "Problem", explanation: "A structured investigation used to identify underlying causes and prevent recurrence.", related: ["KE", "KEDB", "PIR"] },
  { term: "RFC", full: "Request for Change", category: "Change", explanation: "A formal proposal to add, modify or remove something that could affect services.", related: ["CAB", "ECAB", "PIR"] },
  { term: "RPO", full: "Recovery Point Objective", category: "Continuity", explanation: "The maximum acceptable amount of data loss measured backward in time from a disruption.", related: ["RTO", "BIA", "DRP"] },
  { term: "RTO", full: "Recovery Time Objective", category: "Continuity", explanation: "The targeted time for restoring an activity, service or resource after disruption.", related: ["RPO", "BIA", "DRP"] },
  { term: "SIEM", full: "Security Information and Event Management", category: "Security", explanation: "Technology that aggregates and analyzes security events to support detection, investigation and response.", related: ["SOC", "KRI"] },
  { term: "SLA", full: "Service Level Agreement", category: "Service", explanation: "A documented agreement between a service provider and customer defining services and measurable targets.", related: ["SLM", "OLA", "UC"] },
  { term: "SLM", full: "Service Level Management", category: "Service", explanation: "The practice of setting, monitoring and improving business-based targets for service performance.", related: ["SLA", "OLA"] },
  { term: "SOC", full: "Security Operations Center", category: "Security", explanation: "A function that monitors, detects, investigates and responds to cybersecurity events.", related: ["SIEM", "SOP"] },
  { term: "SOP", full: "Standard Operating Procedure", category: "Governance", explanation: "An approved, repeatable set of steps for carrying out an operational activity consistently.", related: ["RACI", "KPI"] },
  { term: "UAT", full: "User Acceptance Testing", category: "Testing", explanation: "Testing by representative users to confirm a solution meets business needs and acceptance criteria.", related: ["QA", "PIR"] },
  { term: "UC", full: "Underpinning Contract", category: "Service", explanation: "A supplier contract supporting the service provider’s ability to meet an agreed service level.", related: ["SLA", "OLA"] },
];

export const assistantQuickPrompts = [
  "Who is Richmond?",
  "What are his qualifications?",
  "Show his professional experience",
  "Show his portfolio projects",
  "What can this dashboard do?",
  "Explain common ITIL abbreviations",
  "How do the connected workflows operate?",
  "What files can I download?",
  "How do I deploy it to GitHub Pages?",
];

function list(items: string[]) {
  return items.map((item) => `• ${item}`).join("\n");
}

export function answerOfflineQuestion(question: string) {
  const query = question.toLowerCase().trim();
  const upperWords: string[] = question.toUpperCase().match(/[A-Z][A-Z0-9/ -]{1,12}/g) ?? [];
  const directTerm = glossary.find(
    (entry) =>
      upperWords.some((word) => word.trim() === entry.term) ||
      query === entry.term.toLowerCase() ||
      query.includes(` ${entry.term.toLowerCase()} `),
  );

  if (/who is|about richmond|profile|tell me about/.test(query)) {
    return `${professionalProfile.name}\n${professionalProfile.headline}\n\n${professionalProfile.summary}\n\nCurrent leadership:\n${list(professionalProfile.currentRoles)}`;
  }

  if (/qualification|certification|credential|education|skill/.test(query)) {
    return `Public professional qualifications and strengths:\n${list(professionalProfile.qualifications)}\n\nCore capabilities:\n${list(professionalProfile.capabilities)}`;
  }

  if (/experience|employment|work history|current role|head of finance|leadership/.test(query)) {
    return `Richmond’s public professional experience includes:\n${list(professionalProfile.currentRoles)}\n\nHis work spans finance leadership, governance, internal controls, audit coordination, risk management, executive reporting and IT assurance.`;
  }

  if (/project|portfolio|case study|cybersecure|microsoft 365|aws/.test(query)) {
    return `Public portfolio projects:\n${portfolioProjects
      .map((project) => `• ${project.title} — ${project.description}${project.qualification ? ` ${project.qualification}` : ""}`)
      .join("\n")}`;
  }

  if (/abbreviation|acronym|glossary|what does/.test(query) || directTerm) {
    if (directTerm) {
      return `${directTerm.term} — ${directTerm.full}\n${directTerm.explanation}\nRelated terms: ${directTerm.related.join(", ")}.`;
    }
    return `The glossary contains ${glossary.length} ITIL, cybersecurity, continuity, governance and testing terms. Common examples include:\n${list(
      glossary
        .filter((entry) => ["ITIL", "ITSM", "SLA", "RACI", "RFC", "CMDB", "RTO", "RPO", "GRC", "ISMS"].includes(entry.term))
        .map((entry) => `${entry.term}: ${entry.full}`),
    )}\n\nOpen Abbreviation glossary from the sidebar to search every definition.`;
  }

  if (/download|export|file|markdown|csv|json/.test(query)) {
    return `The Download Center provides:\n• A combined Markdown pack containing all ${modules.reduce((total, module) => total + module.items.length, 0)} working templates\n• Individual editable Markdown templates\n• ITIL abbreviation glossary in Markdown\n• Richmond’s public professional profile and project portfolio in Markdown\n• Connected work register in CSV\n• Complete device workspace and audit activity in JSON\n\nAll files are generated locally in the browser; no data is uploaded.`;
  }

  if (/deploy|github|pages|publish|hosting/.test(query)) {
    return "GitHub Pages deployment: push the complete project to a GitHub repository, open Settings → Pages, choose GitHub Actions as the source, then run the included Deploy ITIL dashboard to GitHub Pages workflow. The build automatically detects the repository name and configures its base path.";
  }

  if (/workflow|connect|trace|link|incident.*problem|problem.*change/.test(query)) {
    return "The dashboard preserves end-to-end traceability. A service incident can link to a problem investigation, approved change, configuration item, test evidence and production release. Recovery, security and asset records connect where they provide supporting context. Record status advances through Open → In Progress → Review → Monitoring → Closed, with each action added to the local audit trail.";
  }

  if (/privacy|private|offline|api|security|data/.test(query)) {
    return "This is an offline knowledge assistant. It uses a curated public professional profile and dashboard documentation stored in the application—there is no AI API, API key or external chat service. Workspace records remain in this browser’s localStorage. Private contact, family, credential and confidential institutional information are intentionally excluded.";
  }

  const moduleMatch = modules.find((module) => {
    const tokens = [module.title.toLowerCase(), module.shortTitle.toLowerCase(), module.id.replaceAll("-", " ")];
    return tokens.some((token) => token.length > 3 && query.includes(token));
  });
  if (moduleMatch) {
    return `${moduleMatch.title}\n${moduleMatch.description}\n\nResources (${moduleMatch.items.length}):\n${list(moduleMatch.items)}\n\nConnected domains: ${moduleMatch.connections
      .map((id) => modules.find((module) => module.id === id)?.title)
      .filter(Boolean)
      .join(", ")}.`;
  }

  if (/feature|function|capabilit|dashboard|help|what can/.test(query)) {
    return `This dashboard provides:\n• 12 connected ITIL and technology-control domains\n• ${modules.reduce((total, module) => total + module.items.length, 0)} editable templates, policies, reports and checklists\n• Search, filtering and module workspaces\n• New-record creation and status advancement\n• Cross-practice record links and a local audit trail\n• Health, priority and workload reporting\n• Markdown, CSV and JSON downloads\n• A searchable abbreviation glossary\n• Richmond’s professional profile and portfolio\n• This private-on-device offline knowledge assistant\n• GitHub Pages deployment automation`;
  }

  return "I can explain Richmond’s public professional profile, qualifications, experience and portfolio projects, or help with dashboard features, ITIL modules, abbreviations, connected workflows, downloads, privacy and GitHub deployment. Choose a suggested question below or ask using one of those topics.";
}

export function buildProfessionalProfileDocument() {
  return `# ${professionalProfile.name}\n\n## Professional headline\n\n${professionalProfile.headline}\n\n## Profile\n\n${professionalProfile.summary}\n\n## Current leadership\n\n${list(professionalProfile.currentRoles)}\n\n## Qualifications\n\n${list(professionalProfile.qualifications)}\n\n## Core capabilities\n\n${list(professionalProfile.capabilities)}\n\n---\n\nThis public portfolio profile intentionally excludes private contact, family, credential and confidential institutional information.\n`;
}

export function buildPortfolioDocument() {
  return `# ${professionalProfile.name} — Project Portfolio\n\n${portfolioProjects
    .map(
      (project) =>
        `## ${project.title}\n\n**Type:** ${project.type}\n\n${project.description}\n\n**Focus:** ${project.focus.join(" · ")}\n${project.qualification ? `\n**Important qualification:** ${project.qualification}\n` : ""}`,
    )
    .join("\n")}\n---\n\nPrepared for public portfolio use.\n`;
}

export function buildGlossaryDocument() {
  return `# ITIL, ITSM and Cybersecurity Abbreviation Glossary\n\n${glossary
    .map(
      (entry) =>
        `## ${entry.term} — ${entry.full}\n\n**Category:** ${entry.category}\n\n${entry.explanation}\n\n**Related:** ${entry.related.join(", ")}\n`,
    )
    .join("\n")}\n`;
}

export function buildCompleteTemplatePack() {
  return `# Richmond Kwadwo Sarpong — Complete ITIL Working Template Pack\n\n${modules.length} domains · ${modules.reduce((total, module) => total + module.items.length, 0)} resources\n\n${modules
    .flatMap((module) =>
      module.items.map(
        (name) =>
          `\n---\n\n${buildTemplateDocument(module, name).replace(/^# /, "# ")}\n`,
      ),
    )
    .join("\n")}\n`;
}
