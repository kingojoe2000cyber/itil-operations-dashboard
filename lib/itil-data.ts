export type ModuleId =
  | "security"
  | "itil-v4"
  | "service-management"
  | "other-templates"
  | "incident"
  | "problem"
  | "release"
  | "disaster-recovery"
  | "configuration"
  | "change"
  | "testing"
  | "asset";

export type ItilModule = {
  id: ModuleId;
  title: string;
  shortTitle: string;
  icon: string;
  description: string;
  metric: string;
  metricLabel: string;
  health: number;
  workType: string;
  items: string[];
  connections: ModuleId[];
};

export type WorkRecord = {
  id: string;
  type: string;
  title: string;
  owner: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Review" | "Monitoring" | "Closed";
  updated: string;
  linked: string[];
};

export type ActivityEntry = {
  id: string;
  action: string;
  detail: string;
  time: string;
};

export const modules: ItilModule[] = [
  {
    id: "security",
    title: "Security Management",
    shortTitle: "Security",
    icon: "shield",
    description:
      "Coordinate cybersecurity controls, information handling, resilience, compliance and secure disposal.",
    metric: "92%",
    metricLabel: "control completion",
    health: 92,
    workType: "Security",
    items: [
      "Cybersecurity checklist",
      "Information Transfer policy",
      "Backup and Recovery",
      "Server Maintenance Checklist",
      "Compliance Management",
      "Password Policy",
      "Disposal and Destruction",
    ],
    connections: ["incident", "disaster-recovery", "asset", "configuration"],
  },
  {
    id: "itil-v4",
    title: "ITIL V4 Templates",
    shortTitle: "ITIL V4",
    icon: "layers",
    description:
      "Plan architecture, availability, suppliers, relationships, business analysis and service strategy.",
    metric: "3.6 / 5",
    metricLabel: "maturity score",
    health: 72,
    workType: "Improvement",
    items: [
      "Architecture Management",
      "Availability Management",
      "Business Analysis",
      "ITIL Maturity Model",
      "ITIL Supplier Management",
      "Relationship management",
      "Strategy Management",
    ],
    connections: ["service-management", "other-templates", "configuration"],
  },
  {
    id: "service-management",
    title: "IT Service Management",
    shortTitle: "ITSM",
    icon: "headset",
    description:
      "Operate the service catalogue, continuity plans, charters, service levels and coordinated delivery.",
    metric: "97.4%",
    metricLabel: "SLA achievement",
    health: 97,
    workType: "Service",
    items: [
      "IT Service Continuity Plan",
      "Design and Coordination",
      "ITSCM Report",
      "Service Catalogue Template",
      "IT Operations Management",
      "Service Charter Template",
      "Service Level Agreement",
    ],
    connections: ["incident", "problem", "disaster-recovery", "itil-v4"],
  },
  {
    id: "other-templates",
    title: "ITIL Other Templates",
    shortTitle: "Operations",
    icon: "grid",
    description:
      "Manage access, operational events, capacity, facilities, knowledge and the application portfolio.",
    metric: "18",
    metricLabel: "active controls",
    health: 84,
    workType: "Operations",
    items: [
      "Access Management",
      "Event Management",
      "Capacity Management",
      "ITIL Facility Management",
      "ITIL Organization Structure",
      "Knowledge management",
      "Application Portfolio Template",
    ],
    connections: ["security", "service-management", "asset"],
  },
  {
    id: "incident",
    title: "Incident Management",
    shortTitle: "Incidents",
    icon: "siren",
    description:
      "Triage, prioritize, assign, restore service and escalate repeat failures into problem management.",
    metric: "14 min",
    metricLabel: "mean response time",
    health: 88,
    workType: "Incident",
    items: [
      "Checklist Incident priority",
      "Incident Catalogue template",
      "Incident Management Guide",
      "Incident Report Template",
      "Intern Incident Report",
      "Structure Damage Incident",
      "ITIL Incident Report",
    ],
    connections: ["problem", "change", "service-management", "security"],
  },
  {
    id: "problem",
    title: "Problem Management",
    shortTitle: "Problems",
    icon: "brain",
    description:
      "Investigate root cause, maintain known errors and coordinate permanent corrective action.",
    metric: "6",
    metricLabel: "known errors",
    health: 76,
    workType: "Problem",
    items: [
      "Problem Catalogue Template",
      "Problem Record Template",
      "KE record template",
      "Problem Management Checklist",
      "Major Problem Report",
      "ITIL MoM Template for Major Problem Review",
    ],
    connections: ["incident", "change", "testing", "other-templates"],
  },
  {
    id: "release",
    title: "Release Management",
    shortTitle: "Releases",
    icon: "rocket",
    description:
      "Plan, assess, schedule and govern releases from approved change through production verification.",
    metric: "96%",
    metricLabel: "release success",
    health: 96,
    workType: "Release",
    items: [
      "ITIL Release Plan",
      "Release Management RACI",
      "Release Status Report",
      "Normal RFC Template",
      "Release Checklist",
      "Release Risk Assessment",
      "Release Schedule Template",
    ],
    connections: ["change", "testing", "configuration"],
  },
  {
    id: "disaster-recovery",
    title: "Disaster Recovery",
    shortTitle: "Recovery",
    icon: "cloud-rain",
    description:
      "Maintain recovery assets, communications, implementation plans, exercises and closure evidence.",
    metric: "2.4 h",
    metricLabel: "tested recovery time",
    health: 81,
    workType: "Recovery",
    items: [
      "DR Asset Register",
      "DR Comms Plan",
      "DR approach document",
      "DR Plan Template",
      "DR Implementation Plan Template",
      "DR Closure Report",
    ],
    connections: ["security", "service-management", "asset", "configuration"],
  },
  {
    id: "configuration",
    title: "Configuration",
    shortTitle: "CMDB",
    icon: "settings",
    description:
      "Control configuration baselines, ownership, policy and plans across service relationships.",
    metric: "1,284",
    metricLabel: "configuration items",
    health: 94,
    workType: "Configuration",
    items: [
      "Configuration Baseline Model",
      "Configuration Management RACI",
      "Configuration Management Policy",
      "Configuration Management Plan Template",
    ],
    connections: ["asset", "change", "release", "incident"],
  },
  {
    id: "change",
    title: "Change Management",
    shortTitle: "Changes",
    icon: "git-branch",
    description:
      "Capture, evaluate, approve, schedule and review normal, standard and emergency changes.",
    metric: "91%",
    metricLabel: "change success",
    health: 91,
    workType: "Change",
    items: [
      "Change Control Form",
      "Change Management Process",
      "ITIL Change Request",
      "Project Change Log",
      "Software Change Request",
      "IT Change Evaluation",
      "RACI for Emergency Change",
    ],
    connections: ["incident", "problem", "release", "testing", "configuration"],
  },
  {
    id: "testing",
    title: "Testing Toolkit",
    shortTitle: "Testing",
    icon: "test-tube",
    description:
      "Track defects, test cases, plans, strategy, daily evidence and quality status before release.",
    metric: "86%",
    metricLabel: "test pass rate",
    health: 86,
    workType: "Test",
    items: [
      "Bug Tracking Excel Template",
      "Test Case Tracker",
      "Test Plan Template",
      "Test Strategy Template",
      "Daily Test Report Email Template",
      "Daily QA Status Email",
    ],
    connections: ["change", "release", "problem"],
  },
  {
    id: "asset",
    title: "Asset Management",
    shortTitle: "Assets",
    icon: "package",
    description:
      "Govern technology assets from acquisition and assignment through maintenance and secure disposal.",
    metric: "98.2%",
    metricLabel: "inventory accuracy",
    health: 98,
    workType: "Asset",
    items: [
      "Asset Management Checklist",
      "Asset Management Procedure",
      "IT Asset Management Best Practices",
      "IT Asset Management Policy Template",
    ],
    connections: ["configuration", "security", "disaster-recovery"],
  },
];

export const initialRecords: WorkRecord[] = [
  {
    id: "INC-0042",
    type: "Incident",
    title: "Authentication service intermittent outage",
    owner: "Service Desk",
    priority: "Critical",
    status: "In Progress",
    updated: "26 Aug 2026, 14:18",
    linked: ["PRB-0018", "CHG-0091", "CFG-0188"],
  },
  {
    id: "PRB-0018",
    type: "Problem",
    title: "Recurring identity gateway saturation",
    owner: "Platform Team",
    priority: "High",
    status: "Review",
    updated: "26 Aug 2026, 13:42",
    linked: ["INC-0042", "CHG-0091"],
  },
  {
    id: "CHG-0091",
    type: "Change",
    title: "Scale authentication gateway pool",
    owner: "Change Manager",
    priority: "High",
    status: "Review",
    updated: "26 Aug 2026, 12:55",
    linked: ["INC-0042", "PRB-0018", "REL-0034"],
  },
  {
    id: "REL-0034",
    type: "Release",
    title: "Identity resilience release 3.4",
    owner: "Release Lead",
    priority: "Medium",
    status: "Open",
    updated: "26 Aug 2026, 11:30",
    linked: ["CHG-0091", "TST-0074"],
  },
  {
    id: "TST-0074",
    type: "Test",
    title: "Authentication failover regression pack",
    owner: "QA Lead",
    priority: "High",
    status: "In Progress",
    updated: "26 Aug 2026, 10:48",
    linked: ["CHG-0091", "REL-0034"],
  },
  {
    id: "SEC-0027",
    type: "Security",
    title: "Quarterly privileged access review",
    owner: "Security Manager",
    priority: "High",
    status: "Monitoring",
    updated: "25 Aug 2026, 16:22",
    linked: ["CFG-0188", "AST-0432"],
  },
  {
    id: "DR-0011",
    type: "Recovery",
    title: "Core services recovery exercise",
    owner: "Continuity Lead",
    priority: "Medium",
    status: "Review",
    updated: "25 Aug 2026, 15:05",
    linked: ["CFG-0188", "AST-0432"],
  },
  {
    id: "CFG-0188",
    type: "Configuration",
    title: "Identity service production baseline",
    owner: "Configuration Manager",
    priority: "Medium",
    status: "In Progress",
    updated: "25 Aug 2026, 13:17",
    linked: ["AST-0432", "CHG-0091"],
  },
  {
    id: "AST-0432",
    type: "Asset",
    title: "Gateway cluster lifecycle review",
    owner: "Asset Manager",
    priority: "Low",
    status: "Open",
    updated: "24 Aug 2026, 17:46",
    linked: ["CFG-0188", "SEC-0027"],
  },
  {
    id: "SVC-0021",
    type: "Service",
    title: "Identity service SLA monthly review",
    owner: "Service Owner",
    priority: "Medium",
    status: "Closed",
    updated: "24 Aug 2026, 09:30",
    linked: ["INC-0042", "PRB-0018"],
  },
  {
    id: "OPS-0108",
    type: "Operations",
    title: "Capacity threshold tuning",
    owner: "Operations Lead",
    priority: "Medium",
    status: "In Progress",
    updated: "23 Aug 2026, 15:14",
    linked: ["PRB-0018", "CFG-0188"],
  },
  {
    id: "IMP-0009",
    type: "Improvement",
    title: "ITIL maturity assessment action plan",
    owner: "CSI Lead",
    priority: "Low",
    status: "Open",
    updated: "22 Aug 2026, 12:10",
    linked: ["SVC-0021"],
  },
];

export const initialActivity: ActivityEntry[] = [
  {
    id: "AUD-0105",
    action: "Priority escalated",
    detail: "INC-0042 moved to Critical after impact assessment.",
    time: "12 minutes ago",
  },
  {
    id: "AUD-0104",
    action: "Change linked",
    detail: "CHG-0091 linked to PRB-0018 and release REL-0034.",
    time: "38 minutes ago",
  },
  {
    id: "AUD-0103",
    action: "Test evidence added",
    detail: "TST-0074 failover results attached to the release gate.",
    time: "1 hour ago",
  },
  {
    id: "AUD-0102",
    action: "Recovery review completed",
    detail: "DR-0011 achieved a tested recovery time of 2.4 hours.",
    time: "Yesterday",
  },
];

export const prefixByType: Record<string, string> = {
  Incident: "INC",
  Problem: "PRB",
  Change: "CHG",
  Release: "REL",
  Recovery: "DR",
  Security: "SEC",
  Configuration: "CFG",
  Test: "TST",
  Asset: "AST",
  Service: "SVC",
  Operations: "OPS",
  Improvement: "IMP",
};

export function getModule(id: ModuleId) {
  return modules.find((module) => module.id === id);
}

export function buildTemplateDocument(module: ItilModule, templateName: string) {
  const reviewDate = new Date();
  reviewDate.setMonth(reviewDate.getMonth() + 12);

  return `# ${templateName}

**ITIL domain:** ${module.title}  
**Document owner:** [Assign accountable owner]  
**Version:** 1.0  
**Status:** Draft  
**Prepared for:** Richmond Kwadwo Sarpong — ITIL Operations Command Center  
**Next review:** ${reviewDate.toISOString().slice(0, 10)}

## 1. Purpose

Define the governance, operating steps, evidence and decision rights required for ${templateName.toLowerCase()} within ${module.title.toLowerCase()}.

## 2. Scope

- Services, systems, locations and teams covered
- Explicit exclusions and assumptions
- Upstream and downstream dependencies

## 3. Roles and responsibilities

| Role | Responsibility | Accountable/Responsible |
| --- | --- | --- |
| Process owner | Approves scope, policy and performance targets | Accountable |
| Process manager | Coordinates operation and reporting | Responsible |
| Control owner | Performs assigned control activities | Responsible |
| Reviewer | Independently verifies evidence and effectiveness | Consulted |

## 4. Operating workflow

1. Register the request, event, asset or control activity.
2. Validate scope, ownership, priority and dependencies.
3. Assess risk, business impact and required approvals.
4. Execute the approved activity and retain evidence.
5. Verify results, link related records and communicate status.
6. Close only after acceptance criteria and lessons learned are recorded.

## 5. Control checklist

- [ ] Owner and approver identified
- [ ] Scope and affected services confirmed
- [ ] Risks and dependencies assessed
- [ ] Required evidence attached or linked
- [ ] Security, continuity and compliance impacts considered
- [ ] Outcome independently reviewed where required
- [ ] Record linked to related incident/problem/change/release/configuration items
- [ ] Closure criteria satisfied

## 6. Measures and reporting

| Measure | Target | Actual | Evidence source |
| --- | --- | --- | --- |
| Completion within agreed time | [Target] | [Actual] | [Link/reference] |
| Quality / success rate | [Target] | [Actual] | [Link/reference] |
| Exceptions overdue | 0 | [Actual] | [Link/reference] |

## 7. Approvals

| Name / role | Decision | Date | Comments |
| --- | --- | --- | --- |
| [Approver] | Pending | [Date] | [Comments] |

## 8. Related records

Linked domains: ${module.connections
    .map((id) => getModule(id)?.title)
    .filter(Boolean)
    .join(", ")}.

---

This working template supports internal IT service management. It should be tailored to the organization's policies, regulatory obligations and approved ITIL practices before production use.
`;
}
