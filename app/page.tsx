"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  CloudRainWind,
  Download,
  FileDown,
  FileText,
  FolderKanban,
  Gauge,
  GitBranch,
  GraduationCap,
  Grid2X2,
  Headphones,
  Layers3,
  LayoutDashboard,
  Link2,
  ListChecks,
  ListTodo,
  LockKeyhole,
  MessageCircle,
  PackageCheck,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Siren,
  Sparkles,
  TestTube2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import {
  answerOfflineQuestion,
  assistantQuickPrompts,
  buildCompleteTemplatePack,
  buildGlossaryDocument,
  buildPortfolioDocument,
  buildProfessionalProfileDocument,
  glossary,
  portfolioProjects,
  professionalProfile,
} from "@/lib/assistant-data";
import {
  buildTemplateDocument,
  getModule,
  initialActivity,
  initialRecords,
  ItilModule,
  ModuleId,
  modules,
  prefixByType,
  WorkRecord,
} from "@/lib/itil-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

type ViewId = "overview" | "work" | "templates" | "reports" | "glossary" | "downloads" | "profile";
type SelectedTemplate = { module: ItilModule; name: string } | null;
type AssistantMessage = { id: string; role: "assistant" | "user"; text: string };

const iconMap: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  layers: Layers3,
  headset: Headphones,
  grid: Grid2X2,
  siren: Siren,
  brain: BrainCircuit,
  rocket: Rocket,
  "cloud-rain": CloudRainWind,
  settings: Settings2,
  "git-branch": GitBranch,
  "test-tube": TestTube2,
  package: PackageCheck,
};

const navItems: { id: ViewId; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Command overview", icon: LayoutDashboard },
  { id: "work", label: "Connected work", icon: ListTodo },
  { id: "templates", label: "Template library", icon: FileText },
  { id: "reports", label: "Assurance reports", icon: BarChart3 },
  { id: "glossary", label: "Abbreviation glossary", icon: BookOpen },
  { id: "downloads", label: "Download center", icon: Download },
  { id: "profile", label: "Profile & projects", icon: UserRound },
];

const priorities = ["Critical", "High", "Medium", "Low"] as const;
const statuses = ["Open", "In Progress", "Review", "Monitoring", "Closed"] as const;

function downloadText(filename: string, text: string, type = "text/plain") {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function filenameFor(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function priorityClass(priority: WorkRecord["priority"]) {
  return {
    Critical: "border-red-500/30 bg-red-500/10 text-red-300",
    High: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    Medium: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    Low: "border-slate-500/30 bg-slate-500/10 text-slate-300",
  }[priority];
}

function statusClass(status: WorkRecord["status"]) {
  return {
    Open: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    "In Progress": "border-violet-500/30 bg-violet-500/10 text-violet-300",
    Review: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    Monitoring: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
    Closed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  }[status];
}

function healthTone(value: number) {
  if (value >= 90) return "text-emerald-300";
  if (value >= 80) return "text-cyan-300";
  return "text-amber-300";
}

function WorkspaceMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-red-400/30 bg-red-500/10 text-sm font-black text-red-300">
        RK<span className="absolute inset-x-0 bottom-0 h-1 bg-red-500" />
      </div>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="truncate text-sm font-semibold text-white">Richmond K. Sarpong</p>
        <p className="truncate text-[10px] uppercase tracking-[0.16em] text-slate-500">ITIL command center</p>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  note,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <Card className="dashboard-surface relative gap-0 overflow-hidden py-0">
      <div className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
      <CardContent className="flex items-center justify-between gap-4 px-5 py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{note}</p>
        </div>
        <div className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<WorkRecord[]>(initialRecords);
  const [activityLog, setActivityLog] = useState(initialActivity);
  const [selectedModule, setSelectedModule] = useState<ItilModule | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedTemplate>(null);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [recordType, setRecordType] = useState("Incident");
  const [recordTitle, setRecordTitle] = useState("");
  const [recordOwner, setRecordOwner] = useState("Richmond Kwadwo Sarpong");
  const [recordPriority, setRecordPriority] = useState<WorkRecord["priority"]>("Medium");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [glossaryCategory, setGlossaryCategory] = useState("All");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      text: `Welcome. I’m Richmond’s offline knowledge assistant. I can explain his public professional profile and projects, all ${modules.length} dashboard domains, ${modules.reduce((total, module) => total + module.items.length, 0)} resources, abbreviations, workflows, downloads and GitHub deployment. No API key or external chat service is used.`,
    },
  ]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const savedRecords = window.localStorage.getItem("rks-itil-records-v1");
        const savedActivity = window.localStorage.getItem("rks-itil-activity-v1");
        if (savedRecords) setRecords(JSON.parse(savedRecords));
        if (savedActivity) setActivityLog(JSON.parse(savedActivity));
      } catch {
        toast.warning("Saved data could not be loaded. Demonstration data is active.");
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("rks-itil-records-v1", JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    window.localStorage.setItem("rks-itil-activity-v1", JSON.stringify(activityLog));
  }, [activityLog]);

  const allTemplates = useMemo(
    () => modules.flatMap((module) => module.items.map((name) => ({ module, name }))),
    [],
  );
  const query = searchQuery.trim().toLowerCase();
  const filteredModules = modules.filter(
    (module) =>
      !query ||
      module.title.toLowerCase().includes(query) ||
      module.description.toLowerCase().includes(query) ||
      module.items.some((item) => item.toLowerCase().includes(query)),
  );
  const filteredRecords = records.filter((record) => {
    const matchesQuery =
      !query ||
      [record.id, record.title, record.owner, record.type].some((value) => value.toLowerCase().includes(query));
    return (
      matchesQuery &&
      (statusFilter === "All" || record.status === statusFilter) &&
      (priorityFilter === "All" || record.priority === priorityFilter)
    );
  });
  const glossaryCategories = ["All", ...Array.from(new Set(glossary.map((entry) => entry.category))).sort()];
  const filteredGlossary = glossary.filter((entry) => {
    const matchesQuery =
      !query ||
      [entry.term, entry.full, entry.category, entry.explanation, ...entry.related].some((value) =>
        value.toLowerCase().includes(query),
      );
    return matchesQuery && (glossaryCategory === "All" || entry.category === glossaryCategory);
  });
  const openRecords = records.filter((record) => record.status !== "Closed").length;
  const urgentRecords = records.filter(
    (record) => record.status !== "Closed" && ["Critical", "High"].includes(record.priority),
  ).length;
  const averageHealth = Math.round(modules.reduce((sum, module) => sum + module.health, 0) / modules.length);

  function addActivity(action: string, detail: string) {
    setActivityLog((current) => [
      { id: `AUD-${String(Date.now()).slice(-6)}`, action, detail, time: "Just now" },
      ...current,
    ]);
  }

  function startRecord(module?: ItilModule, title = "") {
    setRecordType(module?.workType ?? "Incident");
    setRecordTitle(title);
    setRecordOwner("Richmond Kwadwo Sarpong");
    setRecordPriority(module?.id === "incident" || module?.id === "security" ? "High" : "Medium");
    setRecordDialogOpen(true);
  }

  function createRecord() {
    if (!recordTitle.trim()) {
      toast.error("Enter a clear record title before saving.");
      return;
    }
    const prefix = prefixByType[recordType] ?? "WRK";
    const nextNumber =
      records
        .filter((record) => record.id.startsWith(`${prefix}-`))
        .reduce((max, record) => Math.max(max, Number(record.id.split("-")[1]) || 0), 0) + 1;
    const id = `${prefix}-${String(nextNumber).padStart(4, "0")}`;
    const record: WorkRecord = {
      id,
      type: recordType,
      title: recordTitle.trim(),
      owner: recordOwner.trim() || "Unassigned",
      priority: recordPriority,
      status: "Open",
      updated: new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
      linked: [],
    };
    setRecords((current) => [record, ...current]);
    addActivity("Record created", `${id} created in ${recordType} management.`);
    setRecordDialogOpen(false);
    setRecordTitle("");
    toast.success(`${id} created and added to connected work.`);
  }

  function advanceRecord(record: WorkRecord) {
    const next: Record<WorkRecord["status"], WorkRecord["status"]> = {
      Open: "In Progress",
      "In Progress": "Review",
      Review: "Monitoring",
      Monitoring: "Closed",
      Closed: "Closed",
    };
    const nextStatus = next[record.status];
    if (nextStatus === record.status) return;
    setRecords((current) =>
      current.map((item) => (item.id === record.id ? { ...item, status: nextStatus, updated: "Just now" } : item)),
    );
    addActivity("Workflow advanced", `${record.id} moved from ${record.status} to ${nextStatus}.`);
    toast.success(`${record.id} is now ${nextStatus}.`);
  }

  function exportWorkspace() {
    downloadText(
      "richmond-sarpong-itil-workspace.json",
      JSON.stringify({ exportedAt: new Date().toISOString(), owner: "Richmond Kwadwo Sarpong", records, activityLog, modules }, null, 2),
      "application/json",
    );
    toast.success("Workspace data exported as JSON.");
  }

  function exportReportCsv() {
    const rows = [
      ["Record ID", "Type", "Title", "Owner", "Priority", "Status", "Updated", "Linked Records"],
      ...records.map((record) => [
        record.id,
        record.type,
        record.title,
        record.owner,
        record.priority,
        record.status,
        record.updated,
        record.linked.join(" | "),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    downloadText("richmond-sarpong-itil-register.csv", csv, "text/csv");
    toast.success("Connected work register exported as CSV.");
  }

  function askAssistant(prompt?: string) {
    const question = (prompt ?? assistantInput).trim();
    if (!question) return;
    const answer = answerOfflineQuestion(question);
    setAssistantMessages((current) => {
      const suffix = current.length;
      return [
        ...current,
        { id: `user-${suffix}`, role: "user", text: question },
        { id: `assistant-${suffix + 1}`, role: "assistant", text: answer },
      ];
    });
    setAssistantInput("");
  }

  function clearAssistant() {
    setAssistantMessages([
      {
        id: "assistant-welcome-cleared",
        role: "assistant",
        text: "Conversation cleared. Ask me about Richmond’s public professional profile, his projects, the dashboard, ITIL abbreviations, workflows, downloads or GitHub deployment.",
      },
    ]);
  }

  function downloadPack(filename: string, content: string, message: string) {
    downloadText(filename, content, "text/markdown");
    toast.success(message);
  }

  function resetWorkspace() {
    setRecords(initialRecords);
    setActivityLog(initialActivity);
    window.localStorage.removeItem("rks-itil-records-v1");
    window.localStorage.removeItem("rks-itil-activity-v1");
    toast.success("Demonstration workspace restored.");
  }

  function selectConnection(id: ModuleId) {
    const connected = getModule(id);
    if (connected) setSelectedModule(connected);
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-white/10 bg-[#07111f]">
        <SidebarHeader className="border-b border-white/10 p-4">
          <WorkspaceMark />
        </SidebarHeader>
        <SidebarContent className="bg-[#07111f]">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Operations
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={activeView === item.id}
                      onClick={() => setActiveView(item.id)}
                      className="text-slate-300 hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-red-500/15 data-[active=true]:text-red-200"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Ask offline assistant"
                    onClick={() => setAssistantOpen(true)}
                    className="text-cyan-200 hover:bg-cyan-400/[0.08] hover:text-cyan-100"
                  >
                    <Bot />
                    <span>Ask offline assistant</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator className="bg-white/10" />
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Live pulse
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2 group-data-[collapsible=icon]:hidden">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                  Workspace healthy
                </div>
                <p className="mt-2 text-[11px] leading-5 text-slate-400">
                  {modules.length} domains connected · {allTemplates.length} controlled resources
                </p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-white/10 bg-[#07111f] p-3">
          <div className="flex items-center gap-3 rounded-lg p-2 text-slate-300 group-data-[collapsible=icon]:justify-center">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-800 text-xs font-bold">RS</div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-xs font-semibold text-white">Workspace owner</p>
              <p className="truncate text-[10px] text-slate-500">Device-saved demonstration</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0 bg-[#081320] text-slate-100">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-[#081320]/92 px-4 backdrop-blur-xl md:px-6">
          <SidebarTrigger className="text-slate-300 hover:bg-white/5 hover:text-white" />
          <Separator orientation="vertical" className="h-5 bg-white/10" />
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-xs font-semibold text-white">Richmond Kwadwo Sarpong</p>
            <p className="truncate text-[10px] uppercase tracking-[0.14em] text-slate-500">
              {navItems.find((item) => item.id === activeView)?.label}
            </p>
          </div>
          <div className="relative ml-auto w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search modules, resources, records or terms…"
              aria-label="Search the ITIL workspace"
              className="h-9 border-white/10 bg-white/[0.04] pl-9 text-sm text-white placeholder:text-slate-500 focus-visible:border-red-400/60 focus-visible:ring-red-500/20"
            />
          </div>
          <Button
            size="sm"
            onClick={() => startRecord()}
            className="hidden bg-red-500 text-white hover:bg-red-400 sm:inline-flex"
          >
            <Plus className="size-4" /> New record
          </Button>
          <Button variant="ghost" size="icon" className="relative text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Notifications">
            <Bell className="size-4" />
            {urgentRecords > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500" />}
          </Button>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
          {activeView === "overview" && (
            <div className="mx-auto max-w-[1600px] space-y-6">
              <section className="command-hero overflow-hidden rounded-2xl border border-white/10 px-5 py-6 md:px-7 md:py-7">
                <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                  <div className="max-w-3xl">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge className="border-red-400/25 bg-red-500/10 text-red-200">ITIL operations</Badge>
                      <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-slate-300">
                        <span className="mr-1.5 size-1.5 rounded-full bg-emerald-400" /> Device-saved workspace
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">
                      ITIL Operations <span className="text-red-400">Command Center</span>
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                      One connected operating surface for service resilience, cybersecurity, incidents, problems,
                      changes, releases, recovery, configuration, testing and asset assurance.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={exportWorkspace} className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white">
                      <Download className="size-4" /> Export workspace
                    </Button>
                    <Button onClick={() => setActiveView("work")} className="bg-white text-slate-950 hover:bg-slate-200">
                      Open work queue <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </section>

              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Key performance indicators">
                <KpiCard label="Open work" value={openRecords} note={`${records.length} total controlled records`} icon={ListChecks} accent="bg-cyan-400" />
                <KpiCard label="Urgent attention" value={urgentRecords} note="Critical and high-priority items" icon={AlertTriangle} accent="bg-red-500" />
                <KpiCard label="Control health" value={`${averageHealth}%`} note="Across all twelve ITIL domains" icon={Gauge} accent="bg-emerald-400" />
                <KpiCard label="Resource library" value={allTemplates.length} note="Templates, policies and checklists" icon={FileText} accent="bg-violet-400" />
              </section>

              <section className="flex flex-col gap-4 rounded-xl border border-red-400/20 bg-red-500/[0.06] px-4 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-red-500/15 text-red-300"><Siren className="size-5" /></div>
                  <div>
                    <p className="text-sm font-semibold text-white">Priority control point</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      INC-0042 is linked through problem, change, configuration, testing and release records for end-to-end traceability.
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setActiveView("work")} className="border-red-400/25 bg-red-500/10 text-red-100 hover:bg-red-500/20 hover:text-white">
                  Review linked chain <ChevronRight className="size-4" />
                </Button>
              </section>

              <section>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="section-kicker">Templates &amp; documents</p>
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-white">Operational domains</h2>
                    <p className="mt-1 text-sm text-slate-400">Open any card to use its resources, records and connected workflows.</p>
                  </div>
                  {query && <p className="text-xs text-slate-400">Showing {filteredModules.length} of {modules.length} domains</p>}
                </div>
                {filteredModules.length ? (
                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {filteredModules.map((module, index) => {
                      const Icon = iconMap[module.icon] ?? Boxes;
                      const relatedOpen = records.filter((record) => record.type === module.workType && record.status !== "Closed").length;
                      return (
                        <Card key={module.id} className="module-card dashboard-surface group gap-0 overflow-hidden py-0">
                          <CardHeader className="gap-0 px-5 pb-4 pt-5">
                            <div className="flex items-start gap-4">
                              <div className={`module-icon module-icon-${(index % 6) + 1}`}><Icon className="size-6" /></div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <CardTitle className="text-base text-white">{module.title}</CardTitle>
                                  <Badge variant="outline" className="shrink-0 border-white/10 bg-white/[0.03] text-[10px] text-slate-300">{relatedOpen} open</Badge>
                                </div>
                                <CardDescription className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{module.description}</CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="px-5 pb-4">
                            <div className="mb-3 flex items-end justify-between">
                              <div><p className={`text-lg font-bold ${healthTone(module.health)}`}>{module.metric}</p><p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{module.metricLabel}</p></div>
                              <span className="text-xs font-semibold text-slate-400">{module.health}%</span>
                            </div>
                            <Progress value={module.health} className="h-1.5 bg-white/10" />
                            <ul className="mt-4 space-y-2">
                              {module.items.slice(0, 3).map((item) => (
                                <li key={item} className="flex min-w-0 items-center gap-2 text-xs text-slate-300">
                                  <span className="size-1.5 shrink-0 rounded-full bg-red-400" />
                                  <button className="truncate text-left hover:text-white hover:underline" onClick={() => setSelectedTemplate({ module, name: item })}>{item}</button>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                          <CardFooter className="mt-auto justify-between border-t border-white/10 px-5 py-3">
                            <span className="text-[11px] text-slate-500">{module.items.length} resources</span>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedModule(module)} className="h-8 text-xs text-slate-200 hover:bg-white/[0.06] hover:text-white">
                              Open workspace <ChevronRight className="size-3.5" />
                            </Button>
                          </CardFooter>
                          <div className="h-1 bg-gradient-to-r from-red-500 via-red-400 to-transparent opacity-80" />
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-12 text-center">
                    <Search className="mx-auto size-7 text-slate-600" />
                    <p className="mt-3 text-sm font-semibold text-white">No domains match “{searchQuery}”</p>
                    <button onClick={() => setSearchQuery("")} className="mt-2 text-xs text-red-300 hover:underline">Clear search</button>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeView === "work" && (
            <div className="mx-auto max-w-[1600px] space-y-5">
              <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="section-kicker">Cross-practice traceability</p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Connected work queue</h1>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">Advance controlled records while preserving links between incidents, causes, changes, releases, tests, assets and configuration items.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-white/10 bg-white/[0.04] text-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="All">All statuses</SelectItem>{statuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="border-white/10 bg-white/[0.04] text-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="All">All priorities</SelectItem>{priorities.map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button variant="outline" onClick={exportReportCsv} className="border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"><FileDown className="size-4" /> Export CSV</Button>
                  <Button onClick={() => startRecord()} className="bg-red-500 text-white hover:bg-red-400"><Plus className="size-4" /> New record</Button>
                </div>
              </section>
              <Card className="dashboard-surface gap-0 overflow-hidden py-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow className="border-white/10 bg-white/[0.025] hover:bg-white/[0.025]"><TableHead className="text-slate-400">Record</TableHead><TableHead className="min-w-72 text-slate-400">Summary</TableHead><TableHead className="text-slate-400">Owner</TableHead><TableHead className="text-slate-400">Priority</TableHead><TableHead className="text-slate-400">Status</TableHead><TableHead className="text-slate-400">Links</TableHead><TableHead className="text-right text-slate-400">Workflow</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id} className="border-white/10 hover:bg-white/[0.025]">
                          <TableCell><p className="font-mono text-xs font-bold text-red-300">{record.id}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{record.type}</p></TableCell>
                          <TableCell><p className="text-sm font-medium text-white">{record.title}</p><p className="mt-1 text-[11px] text-slate-500">Updated {record.updated}</p></TableCell>
                          <TableCell className="text-xs text-slate-300">{record.owner}</TableCell>
                          <TableCell><Badge variant="outline" className={priorityClass(record.priority)}>{record.priority}</Badge></TableCell>
                          <TableCell><Badge variant="outline" className={statusClass(record.status)}>{record.status}</Badge></TableCell>
                          <TableCell><div className="flex max-w-44 flex-wrap gap-1">{record.linked.length ? record.linked.map((id) => <span key={id} className="rounded bg-white/[0.05] px-1.5 py-1 font-mono text-[9px] text-slate-400">{id}</span>) : <span className="text-[11px] text-slate-600">None</span>}</div></TableCell>
                          <TableCell className="text-right"><Button size="sm" variant="outline" disabled={record.status === "Closed"} onClick={() => advanceRecord(record)} className="h-8 border-white/10 bg-white/[0.03] text-xs text-slate-200 hover:bg-white/10 hover:text-white">{record.status === "Closed" ? <CheckCircle2 className="size-3.5" /> : <ArrowRight className="size-3.5" />}{record.status === "Closed" ? "Complete" : "Advance"}</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {!filteredRecords.length && <div className="border-t border-white/10 px-6 py-12 text-center text-sm text-slate-400">No records match the active filters.</div>}
              </Card>
            </div>
          )}

          {activeView === "templates" && (
            <div className="mx-auto max-w-[1600px] space-y-5">
              <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div><p className="section-kicker">Controlled resources</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-white">ITIL template library</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">Preview, tailor and download all {allTemplates.length} resources from the supplied reference in editable Markdown format.</p></div>
                <Badge variant="outline" className="w-fit border-white/10 bg-white/[0.03] px-3 py-1.5 text-slate-300">{allTemplates.filter(({ module, name }) => !query || name.toLowerCase().includes(query) || module.title.toLowerCase().includes(query)).length} visible resources</Badge>
              </section>
              <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {modules.map((module) => ({ module, items: module.items.filter((name) => !query || name.toLowerCase().includes(query) || module.title.toLowerCase().includes(query)) })).filter(({ items }) => items.length).map(({ module, items }) => {
                  const Icon = iconMap[module.icon] ?? FileText;
                  return (
                    <Card key={module.id} className="dashboard-surface gap-0 py-0">
                      <CardHeader className="border-b border-white/10 px-5 py-4"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-red-500/10 text-red-300"><Icon className="size-4" /></div><div><CardTitle className="text-sm text-white">{module.title}</CardTitle><CardDescription className="mt-1 text-[11px] text-slate-500">{items.length} matching resources</CardDescription></div></div></CardHeader>
                      <CardContent className="divide-y divide-white/10 px-0">{items.map((name) => (
                        <div key={name} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.025]"><FileText className="size-4 shrink-0 text-slate-500" /><button onClick={() => setSelectedTemplate({ module, name })} className="min-w-0 flex-1 truncate text-left text-xs font-medium text-slate-200 hover:text-white hover:underline">{name}</button><Button variant="ghost" size="icon" className="size-7 text-slate-500 hover:bg-white/[0.06] hover:text-white" aria-label={`Download ${name}`} onClick={() => { downloadText(`${filenameFor(name)}.md`, buildTemplateDocument(module, name), "text/markdown"); toast.success(`${name} downloaded.`); }}><Download className="size-3.5" /></Button></div>
                      ))}</CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeView === "reports" && (
            <div className="mx-auto max-w-[1600px] space-y-5">
              <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><p className="section-kicker">Management assurance</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Service control report</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">Live management view calculated from the connected records and all twelve operating domains.</p></div><div className="flex gap-2"><Button variant="outline" onClick={exportReportCsv} className="border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"><FileDown className="size-4" /> Export register</Button><Button onClick={exportWorkspace} className="bg-white text-slate-950 hover:bg-slate-200"><Download className="size-4" /> Export evidence</Button></div></section>
              <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
                <Card className="dashboard-surface gap-0 py-0"><CardHeader className="border-b border-white/10 px-5 py-4"><CardTitle className="flex items-center gap-2 text-sm text-white"><Activity className="size-4 text-cyan-300" /> Domain health</CardTitle><CardDescription className="text-xs text-slate-500">Control completeness, maturity and operational effectiveness</CardDescription></CardHeader><CardContent className="grid gap-x-6 gap-y-4 px-5 py-5 md:grid-cols-2">{modules.map((module) => <button key={module.id} onClick={() => setSelectedModule(module)} className="group text-left"><div className="mb-2 flex items-center justify-between gap-3"><span className="truncate text-xs font-medium text-slate-300 group-hover:text-white">{module.title}</span><span className={`text-xs font-bold ${healthTone(module.health)}`}>{module.health}%</span></div><Progress value={module.health} className="h-2 bg-white/10" /></button>)}</CardContent></Card>
                <Card className="dashboard-surface gap-0 py-0"><CardHeader className="border-b border-white/10 px-5 py-4"><CardTitle className="flex items-center gap-2 text-sm text-white"><Gauge className="size-4 text-red-300" /> Priority exposure</CardTitle><CardDescription className="text-xs text-slate-500">Open work by current control priority</CardDescription></CardHeader><CardContent className="space-y-4 px-5 py-5">{priorities.map((priority) => { const count = records.filter((record) => record.status !== "Closed" && record.priority === priority).length; const percent = openRecords ? Math.round((count / openRecords) * 100) : 0; return <div key={priority}><div className="mb-2 flex items-center justify-between text-xs"><span className="text-slate-300">{priority}</span><span className="font-semibold text-white">{count} · {percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className={`${priority === "Critical" ? "bg-red-500" : priority === "High" ? "bg-orange-400" : priority === "Medium" ? "bg-amber-300" : "bg-slate-400"} h-full rounded-full`} style={{ width: `${percent}%` }} /></div></div>; })}</CardContent></Card>
                <Card className="dashboard-surface gap-0 py-0 xl:col-span-2"><CardHeader className="border-b border-white/10 px-5 py-4"><CardTitle className="flex items-center gap-2 text-sm text-white"><ClipboardCheck className="size-4 text-violet-300" /> Audit trail</CardTitle><CardDescription className="text-xs text-slate-500">Recent governance and workflow activity</CardDescription></CardHeader><CardContent className="grid gap-3 px-5 py-5 md:grid-cols-2">{activityLog.slice(0, 6).map((entry) => <div key={entry.id} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4"><div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300"><CheckCircle2 className="size-4" /></div><div><p className="text-xs font-semibold text-white">{entry.action}</p><p className="mt-1 text-xs leading-5 text-slate-400">{entry.detail}</p><p className="mt-2 text-[10px] uppercase tracking-wider text-slate-600">{entry.time} · {entry.id}</p></div></div>)}</CardContent></Card>
              </div>
            </div>
          )}

          {activeView === "glossary" && (
            <div className="mx-auto max-w-[1600px] space-y-5">
              <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="section-kicker">Plain-language reference</p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">ITIL &amp; cybersecurity abbreviation glossary</h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    Search {glossary.length} service management, security, continuity, governance, change and testing terms. Related terms make connected concepts easier to follow.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={glossaryCategory} onValueChange={setGlossaryCategory}>
                    <SelectTrigger className="min-w-48 border-white/10 bg-white/[0.04] text-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent>{glossaryCategories.map((category) => <SelectItem key={category} value={category}>{category === "All" ? "All categories" : category}</SelectItem>)}</SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => downloadPack("itil-cybersecurity-abbreviation-glossary.md", buildGlossaryDocument(), "Abbreviation glossary downloaded.")}
                    className="border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
                  >
                    <Download className="size-4" /> Download glossary
                  </Button>
                </div>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] px-4 py-3">
                <p className="text-xs text-cyan-100"><BookOpen className="mr-2 inline size-4" />{filteredGlossary.length} terms match the active search and category.</p>
                {(query || glossaryCategory !== "All") && <button onClick={() => { setSearchQuery(""); setGlossaryCategory("All"); }} className="text-xs font-semibold text-cyan-300 hover:underline">Clear glossary filters</button>}
              </div>

              {filteredGlossary.length ? (
                <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredGlossary.map((entry) => (
                    <Card key={entry.term} className="dashboard-surface gap-0 py-0">
                      <CardHeader className="border-b border-white/10 px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-xl text-red-300">{entry.term}</CardTitle>
                            <CardDescription className="mt-1 text-xs font-medium leading-5 text-slate-200">{entry.full}</CardDescription>
                          </div>
                          <Badge variant="outline" className="shrink-0 border-white/10 bg-white/[0.03] text-[10px] text-slate-400">{entry.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-5 py-4">
                        <p className="text-xs leading-6 text-slate-400">{entry.explanation}</p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {entry.related.map((term) => (
                            <button key={term} onClick={() => setSearchQuery(term)} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-cyan-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.08]">{term}</button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
                  <Search className="mx-auto size-7 text-slate-600" />
                  <p className="mt-3 text-sm font-semibold text-white">No abbreviations match the active filters</p>
                  <button onClick={() => { setSearchQuery(""); setGlossaryCategory("All"); }} className="mt-2 text-xs text-red-300 hover:underline">Clear glossary filters</button>
                </div>
              )}
            </div>
          )}

          {activeView === "downloads" && (
            <div className="mx-auto max-w-[1600px] space-y-5">
              <section>
                <p className="section-kicker">Portable working files</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Download center</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  Generate editable governance resources and portable workspace evidence directly in this browser. No document content is uploaded to an external service.
                </p>
              </section>

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                <Card className="dashboard-surface gap-0 py-0">
                  <CardHeader className="px-5 pb-3 pt-5"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-red-500/10 text-red-300"><FolderKanban className="size-5" /></div><div><CardTitle className="text-sm text-white">Complete ITIL template pack</CardTitle><CardDescription className="mt-1 text-xs text-slate-500">Markdown · {allTemplates.length} resources</CardDescription></div></div></CardHeader>
                  <CardContent className="px-5 pb-4"><p className="text-xs leading-5 text-slate-400">One combined editable file containing every checklist, policy, plan, report and working template in the dashboard.</p></CardContent>
                  <CardFooter className="border-t border-white/10 px-5 py-3"><Button onClick={() => downloadPack("richmond-sarpong-complete-itil-template-pack.md", buildCompleteTemplatePack(), "Complete ITIL template pack downloaded.")} className="w-full bg-red-500 text-white hover:bg-red-400"><Download className="size-4" /> Download template pack</Button></CardFooter>
                </Card>

                <Card className="dashboard-surface gap-0 py-0">
                  <CardHeader className="px-5 pb-3 pt-5"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><BookOpen className="size-5" /></div><div><CardTitle className="text-sm text-white">Abbreviation glossary</CardTitle><CardDescription className="mt-1 text-xs text-slate-500">Markdown · {glossary.length} terms</CardDescription></div></div></CardHeader>
                  <CardContent className="px-5 pb-4"><p className="text-xs leading-5 text-slate-400">Plain-language ITIL, ITSM, cybersecurity, continuity, governance, change and testing definitions.</p></CardContent>
                  <CardFooter className="border-t border-white/10 px-5 py-3"><Button variant="outline" onClick={() => downloadPack("itil-cybersecurity-abbreviation-glossary.md", buildGlossaryDocument(), "Abbreviation glossary downloaded.")} className="w-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"><Download className="size-4" /> Download glossary</Button></CardFooter>
                </Card>

                <Card className="dashboard-surface gap-0 py-0">
                  <CardHeader className="px-5 pb-3 pt-5"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-violet-400/10 text-violet-300"><UserRound className="size-5" /></div><div><CardTitle className="text-sm text-white">Professional profile</CardTitle><CardDescription className="mt-1 text-xs text-slate-500">Markdown · public-safe</CardDescription></div></div></CardHeader>
                  <CardContent className="px-5 pb-4"><p className="text-xs leading-5 text-slate-400">Richmond’s professional headline, leadership experience, qualifications and core capabilities.</p></CardContent>
                  <CardFooter className="border-t border-white/10 px-5 py-3"><Button variant="outline" onClick={() => downloadPack("richmond-kwadwo-sarpong-professional-profile.md", buildProfessionalProfileDocument(), "Professional profile downloaded.")} className="w-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"><Download className="size-4" /> Download profile</Button></CardFooter>
                </Card>

                <Card className="dashboard-surface gap-0 py-0">
                  <CardHeader className="px-5 pb-3 pt-5"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><BriefcaseBusiness className="size-5" /></div><div><CardTitle className="text-sm text-white">Project portfolio</CardTitle><CardDescription className="mt-1 text-xs text-slate-500">Markdown · {portfolioProjects.length} projects</CardDescription></div></div></CardHeader>
                  <CardContent className="px-5 pb-4"><p className="text-xs leading-5 text-slate-400">A concise public portfolio covering IT audit, PCI DSS, risk, GRC platform and AWS cloud work.</p></CardContent>
                  <CardFooter className="border-t border-white/10 px-5 py-3"><Button variant="outline" onClick={() => downloadPack("richmond-kwadwo-sarpong-project-portfolio.md", buildPortfolioDocument(), "Project portfolio downloaded.")} className="w-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"><Download className="size-4" /> Download portfolio</Button></CardFooter>
                </Card>

                <Card className="dashboard-surface gap-0 py-0">
                  <CardHeader className="px-5 pb-3 pt-5"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><FileDown className="size-5" /></div><div><CardTitle className="text-sm text-white">Connected work register</CardTitle><CardDescription className="mt-1 text-xs text-slate-500">CSV · {records.length} current records</CardDescription></div></div></CardHeader>
                  <CardContent className="px-5 pb-4"><p className="text-xs leading-5 text-slate-400">A spreadsheet-ready register containing owners, priorities, statuses, timestamps and linked records.</p></CardContent>
                  <CardFooter className="border-t border-white/10 px-5 py-3"><Button variant="outline" onClick={exportReportCsv} className="w-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"><FileDown className="size-4" /> Download CSV register</Button></CardFooter>
                </Card>

                <Card className="dashboard-surface gap-0 py-0">
                  <CardHeader className="px-5 pb-3 pt-5"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-sky-400/10 text-sky-300"><Boxes className="size-5" /></div><div><CardTitle className="text-sm text-white">Workspace evidence export</CardTitle><CardDescription className="mt-1 text-xs text-slate-500">JSON · records and audit activity</CardDescription></div></div></CardHeader>
                  <CardContent className="px-5 pb-4"><p className="text-xs leading-5 text-slate-400">A machine-readable snapshot of modules, connected records, workflow status and the local activity trail.</p></CardContent>
                  <CardFooter className="border-t border-white/10 px-5 py-3"><Button variant="outline" onClick={exportWorkspace} className="w-full border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"><Download className="size-4" /> Download JSON evidence</Button></CardFooter>
                </Card>
              </div>

              <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-amber-200"><LockKeyhole className="size-4" /> Browser-generated and private by design</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">Downloads are assembled on this device. Review and tailor every template to your organization’s approved policies, legal obligations, records rules and risk appetite before production use.</p>
              </div>
            </div>
          )}

          {activeView === "profile" && (
            <div className="mx-auto max-w-[1600px] space-y-5">
              <section className="command-hero overflow-hidden rounded-2xl border border-white/10 px-5 py-7 md:px-7">
                <div className="relative z-10 grid gap-6 xl:grid-cols-[1.5fr_1fr] xl:items-end">
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2"><Badge className="border-red-400/25 bg-red-500/10 text-red-200">Public professional profile</Badge><Badge variant="outline" className="border-white/10 bg-white/[0.03] text-slate-300">Privacy reviewed</Badge></div>
                    <h1 className="text-3xl font-bold tracking-[-0.03em] text-white md:text-4xl">{professionalProfile.name}</h1>
                    <p className="mt-2 text-sm font-semibold text-red-300 md:text-base">{professionalProfile.headline}</p>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">{professionalProfile.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 xl:justify-end">
                    <Button variant="outline" onClick={() => downloadPack("richmond-kwadwo-sarpong-professional-profile.md", buildProfessionalProfileDocument(), "Professional profile downloaded.")} className="border-white/15 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"><Download className="size-4" /> Download profile</Button>
                    <Button onClick={() => setAssistantOpen(true)} className="bg-white text-slate-950 hover:bg-slate-200"><MessageCircle className="size-4" /> Ask about Richmond</Button>
                  </div>
                </div>
              </section>

              <div className="grid gap-4 xl:grid-cols-2">
                <Card className="dashboard-surface gap-0 py-0">
                  <CardHeader className="border-b border-white/10 px-5 py-4"><CardTitle className="flex items-center gap-2 text-sm text-white"><BriefcaseBusiness className="size-4 text-cyan-300" /> Current leadership</CardTitle></CardHeader>
                  <CardContent className="space-y-3 px-5 py-5">{professionalProfile.currentRoles.map((role) => <div key={role} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-cyan-400" /><p className="text-xs leading-5 text-slate-300">{role}</p></div>)}</CardContent>
                </Card>
                <Card className="dashboard-surface gap-0 py-0">
                  <CardHeader className="border-b border-white/10 px-5 py-4"><CardTitle className="flex items-center gap-2 text-sm text-white"><GraduationCap className="size-4 text-violet-300" /> Qualifications &amp; experience</CardTitle></CardHeader>
                  <CardContent className="space-y-3 px-5 py-5">{professionalProfile.qualifications.map((qualification) => <div key={qualification} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" /><p className="text-xs leading-5 text-slate-300">{qualification}</p></div>)}</CardContent>
                </Card>
              </div>

              <Card className="dashboard-surface gap-0 py-0">
                <CardHeader className="border-b border-white/10 px-5 py-4"><CardTitle className="flex items-center gap-2 text-sm text-white"><Sparkles className="size-4 text-amber-300" /> Core professional capabilities</CardTitle><CardDescription className="text-xs text-slate-500">Finance, governance, cybersecurity, continuity and executive decision support</CardDescription></CardHeader>
                <CardContent className="grid gap-3 px-5 py-5 sm:grid-cols-2 xl:grid-cols-3">{professionalProfile.capabilities.map((capability) => <div key={capability} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3"><ShieldCheck className="size-4 shrink-0 text-red-300" /><p className="text-xs text-slate-300">{capability}</p></div>)}</CardContent>
              </Card>

              <section>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="section-kicker">Selected work</p><h2 className="mt-1 text-xl font-bold tracking-tight text-white">Professional project portfolio</h2><p className="mt-1 text-sm text-slate-400">Public-safe case studies and platform concepts demonstrating applied governance and technology capability.</p></div><Button variant="outline" onClick={() => downloadPack("richmond-kwadwo-sarpong-project-portfolio.md", buildPortfolioDocument(), "Project portfolio downloaded.")} className="w-fit border-white/10 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"><Download className="size-4" /> Download portfolio</Button></div>
                <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                  {portfolioProjects.map((project) => (
                    <Card key={project.title} className="dashboard-surface gap-0 py-0">
                      <CardHeader className="px-5 pb-3 pt-5"><Badge variant="outline" className="mb-3 w-fit border-white/10 bg-white/[0.03] text-[10px] text-slate-400">{project.type}</Badge><CardTitle className="text-base leading-6 text-white">{project.title}</CardTitle></CardHeader>
                      <CardContent className="px-5 pb-5"><p className="text-xs leading-6 text-slate-400">{project.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{project.focus.map((item) => <span key={item} className="rounded-md bg-red-500/[0.08] px-2 py-1 text-[10px] font-medium text-red-200">{item}</span>)}</div>{project.qualification && <p className="mt-4 rounded-lg border border-amber-400/15 bg-amber-400/[0.04] p-3 text-[10px] leading-5 text-amber-100/80">{project.qualification}</p>}</CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold text-emerald-200"><LockKeyhole className="size-4" /> Public-safe information boundary</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">This dashboard intentionally excludes private contact details, family or household information, access credentials, confidential assessment results and financial, payroll or tax records.</p>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>

      <Sheet open={Boolean(selectedModule)} onOpenChange={(open) => !open && setSelectedModule(null)}>
        {selectedModule && (
          <SheetContent className="w-full overflow-y-auto border-white/10 bg-[#0b1726] p-0 text-slate-100 sm:max-w-xl">
            <SheetHeader className="border-b border-white/10 px-5 py-5 text-left">
              <div className="mb-3 flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-xl bg-red-500/12 text-red-300">{(() => { const Icon = iconMap[selectedModule.icon] ?? Boxes; return <Icon className="size-5" />; })()}</div>
                <div><SheetTitle className="text-lg text-white">{selectedModule.title}</SheetTitle><SheetDescription className="mt-1 text-xs text-slate-400">{selectedModule.description}</SheetDescription></div>
              </div>
              <div className="grid grid-cols-2 gap-3"><div className="rounded-lg border border-white/10 bg-white/[0.03] p-3"><p className={`text-xl font-bold ${healthTone(selectedModule.health)}`}>{selectedModule.metric}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">{selectedModule.metricLabel}</p></div><div className="rounded-lg border border-white/10 bg-white/[0.03] p-3"><p className="text-xl font-bold text-white">{selectedModule.items.length}</p><p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">Controlled resources</p></div></div>
            </SheetHeader>
            <Tabs defaultValue="resources" className="p-5">
              <TabsList className="w-full bg-white/[0.05]"><TabsTrigger value="resources">Resources</TabsTrigger><TabsTrigger value="records">Records</TabsTrigger><TabsTrigger value="connections">Connections</TabsTrigger></TabsList>
              <TabsContent value="resources" className="mt-5 space-y-2">{selectedModule.items.map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3"><div className="grid size-8 shrink-0 place-items-center rounded-lg bg-red-500/10 font-mono text-[10px] font-bold text-red-300">{String(index + 1).padStart(2, "0")}</div><button className="min-w-0 flex-1 text-left text-xs font-medium text-slate-200 hover:text-white hover:underline" onClick={() => setSelectedTemplate({ module: selectedModule, name: item })}>{item}</button><Button variant="ghost" size="icon" className="size-8 text-slate-500 hover:bg-white/[0.06] hover:text-white" onClick={() => { downloadText(`${filenameFor(item)}.md`, buildTemplateDocument(selectedModule, item), "text/markdown"); toast.success(`${item} downloaded.`); }}><Download className="size-3.5" /></Button></div>)}</TabsContent>
              <TabsContent value="records" className="mt-5 space-y-3">{records.filter((record) => record.type === selectedModule.workType).map((record) => <div key={record.id} className="rounded-xl border border-white/10 bg-white/[0.025] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[11px] font-bold text-red-300">{record.id}</p><p className="mt-1 text-xs font-medium text-white">{record.title}</p></div><Badge variant="outline" className={statusClass(record.status)}>{record.status}</Badge></div><div className="mt-3 flex items-center justify-between text-[11px] text-slate-500"><span>{record.owner}</span><span>{record.updated}</span></div></div>)}{!records.some((record) => record.type === selectedModule.workType) && <p className="rounded-xl border border-dashed border-white/15 p-6 text-center text-xs text-slate-500">No records are registered in this workspace yet.</p>}<Button onClick={() => startRecord(selectedModule)} className="w-full bg-red-500 text-white hover:bg-red-400"><Plus className="size-4" /> Create {selectedModule.workType.toLowerCase()} record</Button></TabsContent>
              <TabsContent value="connections" className="mt-5 space-y-3"><div className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4"><p className="flex items-center gap-2 text-xs font-semibold text-cyan-200"><Link2 className="size-4" /> Connected workflow</p><p className="mt-2 text-xs leading-5 text-slate-400">These links preserve service context and evidence as work moves across ITIL practices.</p></div>{selectedModule.connections.map((id) => { const connected = getModule(id); if (!connected) return null; const Icon = iconMap[connected.icon] ?? Boxes; return <button key={id} onClick={() => selectConnection(id)} className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-left hover:border-red-400/25 hover:bg-white/[0.045]"><div className="grid size-9 place-items-center rounded-lg bg-white/[0.05] text-slate-300"><Icon className="size-4" /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-white">{connected.title}</p><p className="mt-1 truncate text-[11px] text-slate-500">{connected.metric} {connected.metricLabel}</p></div><ChevronRight className="size-4 text-slate-600" /></button>; })}</TabsContent>
            </Tabs>
          </SheetContent>
        )}
      </Sheet>

      <Dialog open={Boolean(selectedTemplate)} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
        {selectedTemplate && (
          <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-[#0c1827] text-slate-100 sm:max-w-3xl">
            <DialogHeader><div className="mb-2 flex items-center gap-2"><Badge className="bg-red-500/10 text-red-200">{selectedTemplate.module.title}</Badge><Badge variant="outline" className="border-white/10 text-slate-400">Editable Markdown</Badge></div><DialogTitle className="text-xl text-white">{selectedTemplate.name}</DialogTitle><DialogDescription className="text-sm text-slate-400">A ready-to-tailor governance template linked to the surrounding ITIL workflow.</DialogDescription></DialogHeader>
            <div className="rounded-xl border border-white/10 bg-[#07111f] p-5"><pre className="max-h-[48vh] overflow-auto whitespace-pre-wrap font-sans text-xs leading-6 text-slate-300">{buildTemplateDocument(selectedTemplate.module, selectedTemplate.name)}</pre></div>
            <DialogFooter className="gap-2 sm:justify-between"><Button variant="outline" onClick={() => { const source = selectedTemplate; setSelectedTemplate(null); startRecord(source.module, `${source.name} action`); }} className="border-white/10 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"><Plus className="size-4" /> Create linked record</Button><Button onClick={() => { downloadText(`${filenameFor(selectedTemplate.name)}.md`, buildTemplateDocument(selectedTemplate.module, selectedTemplate.name), "text/markdown"); toast.success(`${selectedTemplate.name} downloaded.`); }} className="bg-red-500 text-white hover:bg-red-400"><Download className="size-4" /> Download template</Button></DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={recordDialogOpen} onOpenChange={setRecordDialogOpen}>
        <DialogContent className="border-white/10 bg-[#0c1827] text-slate-100 sm:max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Create controlled record</DialogTitle><DialogDescription className="text-slate-400">Register work in the connected ITIL queue. The record will be saved on this device.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label htmlFor="record-type" className="text-xs text-slate-300">Practice</Label><Select value={recordType} onValueChange={setRecordType}><SelectTrigger id="record-type" className="w-full border-white/10 bg-white/[0.04] text-white"><SelectValue /></SelectTrigger><SelectContent>{Array.from(new Set(modules.map((module) => module.workType))).map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid gap-2"><Label htmlFor="record-title" className="text-xs text-slate-300">Record title</Label><Textarea id="record-title" value={recordTitle} onChange={(event) => setRecordTitle(event.target.value)} placeholder="Describe the service issue, change, test or control activity…" className="min-h-24 border-white/10 bg-white/[0.04] text-white placeholder:text-slate-600" /></div>
            <div className="grid gap-4 sm:grid-cols-2"><div className="grid gap-2"><Label htmlFor="record-owner" className="text-xs text-slate-300">Owner</Label><Input id="record-owner" value={recordOwner} onChange={(event) => setRecordOwner(event.target.value)} className="border-white/10 bg-white/[0.04] text-white" /></div><div className="grid gap-2"><Label htmlFor="record-priority" className="text-xs text-slate-300">Priority</Label><Select value={recordPriority} onValueChange={(value) => setRecordPriority(value as WorkRecord["priority"])}><SelectTrigger id="record-priority" className="w-full border-white/10 bg-white/[0.04] text-white"><SelectValue /></SelectTrigger><SelectContent>{priorities.map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}</SelectContent></Select></div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setRecordDialogOpen(false)} className="border-white/10 bg-transparent text-slate-300 hover:bg-white/[0.06] hover:text-white">Cancel</Button><Button onClick={createRecord} className="bg-red-500 text-white hover:bg-red-400"><Plus className="size-4" /> Create record</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={assistantOpen} onOpenChange={setAssistantOpen}>
        <SheetContent className="flex w-full flex-col border-white/10 bg-[#0b1726] p-0 text-slate-100 sm:max-w-xl">
          <SheetHeader className="border-b border-white/10 px-5 py-5 text-left">
            <div className="flex items-start gap-3 pr-8">
              <div className="relative grid size-11 shrink-0 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                <Bot className="size-5" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#0b1726] bg-emerald-400" />
              </div>
              <div>
                <SheetTitle className="text-lg text-white">Richmond’s Knowledge Assistant</SheetTitle>
                <SheetDescription className="mt-1 text-xs leading-5 text-slate-400">Public professional profile, projects and complete dashboard guidance.</SheetDescription>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-200"><LockKeyhole className="mr-1 size-3" /> Offline · no API key</Badge>
              <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-slate-400">Private on this device</Badge>
              <button onClick={clearAssistant} className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-slate-500 hover:text-white">Clear chat</button>
            </div>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5" aria-live="polite" aria-label="Assistant conversation">
            <div className="space-y-4">
              {assistantMessages.map((message) => (
                <div key={message.id} className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300"><Bot className="size-3.5" /></div>}
                  <div className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-xs leading-6 ${message.role === "user" ? "rounded-br-md bg-red-500 text-white" : "rounded-bl-md border border-white/10 bg-white/[0.04] text-slate-300"}`}>
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Suggested questions</p>
              <div className="flex flex-wrap gap-2">
                {assistantQuickPrompts.map((prompt) => (
                  <button key={prompt} onClick={() => askAssistant(prompt)} className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-[10px] text-slate-300 hover:border-cyan-400/25 hover:bg-cyan-400/[0.06] hover:text-cyan-100">{prompt}</button>
                ))}
              </div>
            </div>
          </div>

          <form
            className="border-t border-white/10 bg-[#091522] p-4"
            onSubmit={(event) => {
              event.preventDefault();
              askAssistant();
            }}
          >
            <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-2 focus-within:border-cyan-400/30">
              <Textarea
                value={assistantInput}
                onChange={(event) => setAssistantInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    askAssistant();
                  }
                }}
                placeholder="Ask about Richmond, a module, abbreviation or feature…"
                aria-label="Message Richmond’s offline knowledge assistant"
                className="max-h-32 min-h-11 resize-none border-0 bg-transparent px-2 py-2 text-xs text-white shadow-none placeholder:text-slate-600 focus-visible:ring-0"
              />
              <Button type="submit" size="icon" disabled={!assistantInput.trim()} className="size-9 shrink-0 bg-cyan-400 text-slate-950 hover:bg-cyan-300" aria-label="Send message"><Send className="size-4" /></Button>
            </div>
            <p className="mt-2 text-center text-[9px] leading-4 text-slate-600">Curated offline responses—not a generative AI service. Verify templates before operational use.</p>
          </form>
        </SheetContent>
      </Sheet>

      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="hidden border-white/10 bg-[#0b1726]/95 text-xs text-slate-400 shadow-xl backdrop-blur hover:bg-white/10 hover:text-white md:inline-flex"><RefreshCw className="size-3.5" /> Reset demo</Button></AlertDialogTrigger>
          <AlertDialogContent className="border-white/10 bg-[#0c1827] text-slate-100"><AlertDialogHeader><AlertDialogTitle className="text-white">Restore the demonstration workspace?</AlertDialogTitle><AlertDialogDescription className="text-slate-400">This removes records and workflow changes saved on this device and restores the original connected sample data.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white">Keep my data</AlertDialogCancel><AlertDialogAction onClick={resetWorkspace} className="bg-red-500 text-white hover:bg-red-400">Restore demo</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
        </AlertDialog>
        <Button onClick={() => setAssistantOpen(true)} className="h-10 rounded-full bg-cyan-400 px-3 text-slate-950 shadow-[0_14px_40px_rgba(34,211,238,0.22)] hover:bg-cyan-300 md:px-4"><MessageCircle className="size-4" /><span className="hidden sm:inline">Ask assistant</span><span className="sr-only sm:hidden">Ask offline assistant</span></Button>
      </div>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  );
}
