import { useState, useMemo, useEffect } from "react";
import {
  Receipt,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Plus,
  Search,
  Printer,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { canManageInvoices } from "@/lib/permissions";
import { findTenantByName } from "@/data/tenants";
import { propertyData, calcUtilityCost } from "@/data/properties";
import { previousMonth, calcConsumption } from "@/data/meterReadings";
import { useMeterStore } from "@/data/meterStore";

const formatMNT = (v: number) => v.toLocaleString("mn-MN") + "₮";

interface InvoiceBreakdown {
  rent: number;
  management: number;
  utility: number;
}

interface SentInvoice {
  id: string;
  tenant: string;
  amount: number;
  date: string;
  status: "paid" | "overdue" | "unpaid";
  breakdown: InvoiceBreakdown;
  paidAmount?: number;
  paidBreakdown?: InvoiceBreakdown;
}

interface ReadyInvoice {
  id: string;
  tenant: string;
  amount: number;
  breakdown: InvoiceBreakdown;
  period: string;
}

interface MiniStat {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color?: string;
  trend?: string;
}

/** Төлсөн дүнг түрээс → менежмент → ашиглалт дарааллаар суутган тооцоолно */
function computePaidBreakdown(paidAmount: number, breakdown: InvoiceBreakdown): InvoiceBreakdown {
  let remaining = paidAmount;
  const rentPaid = Math.min(remaining, breakdown.rent);
  remaining -= rentPaid;
  const mgmtPaid = Math.min(remaining, breakdown.management);
  remaining -= mgmtPaid;
  const utilPaid = Math.min(remaining, breakdown.utility);
  return { rent: rentPaid, management: mgmtPaid, utility: utilPaid };
}

const kpiData: MiniStat[] = [
  { title: "Илгээгдсэн нэхэмжлэл", value: 135, subtitle: "Нийт дүн: 72.7 сая₮", icon: FileText, trend: "+12 энэ сард" },
  { title: "Төлөгдсөн нэхэмжлэл", value: 120, subtitle: "Нийт дүн: 64.5 сая₮", icon: CheckCircle2, color: "text-green-600" },
  { title: "Төлөгдөөгүй нэхэмжлэл", value: 15, subtitle: "Нийт дүн: 8.2 сая₮", icon: AlertTriangle, color: "text-destructive" },
  { title: "Хугацаа хэтэрсэн", value: 7, subtitle: "Нийт дүн: 4.1 сая₮", icon: Clock, color: "text-orange-500" },
];

const initialReady: ReadyInvoice[] = [
  { id: "INV-0120", tenant: "Бат Дорж", amount: 2550000, breakdown: { rent: 1800000, management: 450000, utility: 300000 }, period: "2024-07" },
  { id: "INV-0121", tenant: "Болд Сүхбат", amount: 4200000, breakdown: { rent: 3000000, management: 720000, utility: 480000 }, period: "2024-07" },
  { id: "INV-0122", tenant: "Ган Тулга", amount: 7000000, breakdown: { rent: 5000000, management: 1200000, utility: 800000 }, period: "2024-07" },
  { id: "INV-0123", tenant: "Нар Мандах", amount: 2250000, breakdown: { rent: 1600000, management: 390000, utility: 260000 }, period: "2024-07" },
  { id: "INV-0124", tenant: "Оюун Эрдэнэ", amount: 4500000, breakdown: { rent: 3200000, management: 780000, utility: 520000 }, period: "2024-07" },
];

const initialInvoices: SentInvoice[] = [
  { id: "INV-0081", tenant: "Бат Дорж", amount: 2550000, date: "2024-04-01", status: "paid", breakdown: { rent: 1800000, management: 450000, utility: 300000 }, paidAmount: 2550000 },
  { id: "INV-0082", tenant: "Болд Сүхбат", amount: 4200000, date: "2024-04-01", status: "paid", breakdown: { rent: 3000000, management: 720000, utility: 480000 }, paidAmount: 4200000 },
  { id: "INV-0083", tenant: "Ган Тулга", amount: 7000000, date: "2024-04-01", status: "paid", breakdown: { rent: 5000000, management: 1200000, utility: 800000 }, paidAmount: 7000000 },
  { id: "INV-0084", tenant: "Нар Мандах", amount: 2250000, date: "2024-04-01", status: "paid", breakdown: { rent: 1600000, management: 390000, utility: 260000 }, paidAmount: 2250000 },
  { id: "INV-0085", tenant: "Оюун Эрдэнэ", amount: 4500000, date: "2024-04-01", status: "paid", breakdown: { rent: 3200000, management: 780000, utility: 520000 }, paidAmount: 4500000 },
  { id: "INV-0087", tenant: "Бат Дорж", amount: 850000, date: "2024-05-01", status: "overdue", breakdown: { rent: 600000, management: 150000, utility: 100000 }, paidAmount: 400000 },
  { id: "INV-0092", tenant: "Болд Сүхбат", amount: 1200000, date: "2024-05-01", status: "overdue", breakdown: { rent: 850000, management: 210000, utility: 140000 }, paidAmount: 700000 },
  { id: "INV-0095", tenant: "Ган Тулга", amount: 650000, date: "2024-05-01", status: "unpaid", breakdown: { rent: 460000, management: 114000, utility: 76000 } },
  { id: "INV-0101", tenant: "Нар Мандах", amount: 780000, date: "2024-05-01", status: "unpaid", breakdown: { rent: 550000, management: 138000, utility: 92000 } },
  { id: "INV-0103", tenant: "Оюун Эрдэнэ", amount: 620000, date: "2024-05-01", status: "unpaid", breakdown: { rent: 440000, management: 108000, utility: 72000 } },
  { id: "INV-0110", tenant: "Бат Дорж", amount: 2550000, date: "2024-06-01", status: "paid", breakdown: { rent: 1800000, management: 450000, utility: 300000 }, paidAmount: 2550000 },
  { id: "INV-0111", tenant: "Болд Сүхбат", amount: 4200000, date: "2024-06-01", status: "paid", breakdown: { rent: 3000000, management: 720000, utility: 480000 }, paidAmount: 4200000 },
  { id: "INV-0112", tenant: "Ган Тулга", amount: 7000000, date: "2024-06-01", status: "paid", breakdown: { rent: 5000000, management: 1200000, utility: 800000 }, paidAmount: 7000000 },
  { id: "INV-0113", tenant: "Нар Мандах", amount: 2250000, date: "2024-06-01", status: "unpaid", breakdown: { rent: 1600000, management: 390000, utility: 260000 } },
  { id: "INV-0114", tenant: "Оюун Эрдэнэ", amount: 4500000, date: "2024-06-01", status: "paid", breakdown: { rent: 3200000, management: 780000, utility: 520000 }, paidAmount: 4500000 },
];

const tenantNames = ["Бат Дорж", "Болд Сүхбат", "Ган Тулга", "Нар Мандах", "Оюун Эрдэнэ"];

const statusMap: Record<string, string> = {
  paid: "төлөгдсөн",
  overdue: "хугацаа хэтэрсэн",
  unpaid: "төлөгдөөгүй",
};

function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function PaymentBreakdownBars({ breakdown, paidBreakdown }: { breakdown: InvoiceBreakdown; paidBreakdown: InvoiceBreakdown }) {
  const items = [
    { label: "Түрээс", total: breakdown.rent, paid: paidBreakdown.rent, color: "bg-primary" },
    { label: "Менежмент", total: breakdown.management, paid: paidBreakdown.management, color: "bg-blue-500" },
    { label: "Ашиглалт", total: breakdown.utility, paid: paidBreakdown.utility, color: "bg-green-500" },
  ];
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const pct = item.total > 0 ? Math.round((item.paid / item.total) * 100) : 0;
        const unpaid = item.total - item.paid;
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{pct}% — {formatMNT(item.paid)} / {formatMNT(item.total)}</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden bg-muted">
              <div className={`h-full ${item.color} transition-all`} style={{ width: `${pct}%` }} />
            </div>
            {unpaid > 0 && (
              <div className="text-xs text-destructive">Үлдэгдэл: {formatMNT(unpaid)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const Finance = () => {
  const { user } = useAuth();
  const canManage = canManageInvoices(user?.role);
  const { store: meterStore } = useMeterStore();

  const [invoicesOpen, setInvoicesOpen] = useState(true);
  const [readyOpen, setReadyOpen] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<SentInvoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [invoices, setInvoices] = useState<SentInvoice[]>(initialInvoices);
  const [readyInvoices, setReadyInvoices] = useState<ReadyInvoice[]>(initialReady);

  const [newTenant, setNewTenant] = useState("");
  const [newRent, setNewRent] = useState("");
  const [newMgmt, setNewMgmt] = useState("");
  const [newUtil, setNewUtil] = useState("");
  const [newPeriod, setNewPeriod] = useState(() => new Date().toISOString().slice(0, 7));
  const [autoFillNote, setAutoFillNote] = useState<string | null>(null);

  // Send-all progress state
  const [sendOpen, setSendOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendIndex, setSendIndex] = useState(0);
  const [sendTotal, setSendTotal] = useState(0);
  const [currentSending, setCurrentSending] = useState<ReadyInvoice | null>(null);
  const [sendDone, setSendDone] = useState(false);

  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices;
    return invoices.filter((inv) => {
      const searchable = [
        inv.id,
        inv.tenant,
        formatMNT(inv.amount),
        inv.date,
        statusMap[inv.status] || inv.status,
      ].join(" ");
      return fuzzyMatch(searchable, searchQuery);
    });
  }, [invoices, searchQuery]);

  /** Түрээслэгч сонгоход түрээс/менежмент/ашиглалтын тоо хэмжээг автоматаар бөглөнө. */
  const handleSelectTenant = (tenantName: string) => {
    setNewTenant(tenantName);
    const tenant = findTenantByName(tenantName);
    if (!tenant) return;

    const props = tenant.propertyIds
      .map((id) => propertyData.find((p) => p.id === id))
      .filter(Boolean) as typeof propertyData;

    // Түрээс + менежмент = property data-аас
    const rentSum = props.reduce((s, p) => s + p.rentalAmount, 0);
    const mgmtSum = props.reduce((s, p) => s + p.managementFeePerSqm * p.areaSize, 0);

    // Ашиглалт = (тухайн сар - өмнөх сар) × тариф (meter store-оос)
    const prev = previousMonth(newPeriod);
    const cur = meterStore[newPeriod]?.[tenant.id];
    const prv = meterStore[prev]?.[tenant.id];
    const usage = calcConsumption(cur, prv);
    const utilSum = calcUtilityCost(usage);

    setNewRent(String(rentSum));
    setNewMgmt(String(mgmtSum));
    setNewUtil(String(Math.round(utilSum)));

    const notes: string[] = [];
    if (props.length > 0) notes.push(`${props.length} объектын түрээс/менежмент`);
    if (cur && prv) notes.push(`${newPeriod} ашиглалт зөрүү`);
    else if (cur) notes.push(`${newPeriod} анхны уншилт`);
    else notes.push("ашиглалтын уншилт олдсонгүй — 0₮");
    setAutoFillNote(notes.join(" • "));
  };

  const handleCreateInvoice = () => {
    const rent = Number(newRent) || 0;
    const mgmt = Number(newMgmt) || 0;
    const util = Number(newUtil) || 0;
    if (!newTenant || (rent + mgmt + util) === 0) return;

    const newReady: ReadyInvoice = {
      id: `INV-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      tenant: newTenant,
      amount: rent + mgmt + util,
      breakdown: { rent, management: mgmt, utility: util },
      period: newPeriod,
    };
    setReadyInvoices((prev) => [newReady, ...prev]);
    setCreateOpen(false);
    setNewTenant("");
    setNewRent("");
    setNewMgmt("");
    setNewUtil("");
    setAutoFillNote(null);
  };

  const handleSendAll = () => {
    if (readyInvoices.length === 0) return;
    const queue = [...readyInvoices];
    setSendTotal(queue.length);
    setSendIndex(0);
    setSendDone(false);
    setSendOpen(true);
    setSending(true);

    let i = 0;
    const today = new Date().toISOString().split("T")[0];

    const tick = () => {
      if (i >= queue.length) {
        setSending(false);
        setSendDone(true);
        setCurrentSending(null);
        return;
      }
      const inv = queue[i];
      setCurrentSending(inv);
      setSendIndex(i + 1);

      // Move from ready → sent
      setReadyInvoices((prev) => prev.filter((r) => r.id !== inv.id));
      setInvoices((prev) => [
        {
          id: inv.id,
          tenant: inv.tenant,
          amount: inv.amount,
          date: today,
          status: "unpaid",
          breakdown: inv.breakdown,
        },
        ...prev,
      ]);

      i++;
      setTimeout(tick, 1000);
    };

    setTimeout(tick, 400);
  };

  const closeSendDialog = () => {
    if (sending) return;
    setSendOpen(false);
    setSendDone(false);
    setCurrentSending(null);
  };

  const selectedPaidBreakdown = useMemo(() => {
    if (!selectedInvoice) return null;
    const paid = selectedInvoice.paidAmount ?? 0;
    if (paid === 0) return null;
    return computePaidBreakdown(paid, selectedInvoice.breakdown);
  }, [selectedInvoice]);

  const handlePrint = () => window.print();

  const sendProgressPct = sendTotal > 0 ? Math.round((sendIndex / sendTotal) * 100) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Receipt className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Санхүү бүртгэл</h1>
            <p className="text-sm text-muted-foreground">
              Нэхэмжлэл, төлбөрийн нэгдсэн хяналт
              {!canManage && " • Зөвхөн уншина"}
            </p>
          </div>
        </div>
        {canManage && (
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Нэхэмжлэх үүсгэх
          </Button>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${kpi.color || ""}`}>{kpi.value}</div>
              {kpi.subtitle && <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>}
              {kpi.trend && <p className="text-xs text-green-600 mt-1">{kpi.trend}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Төлбөрийн явц</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Нийт нэхэмжлэл: 72.7 сая₮</span>
            <span className="font-medium text-foreground">89% төлөгдсөн</span>
          </div>
          <Progress value={89} className="h-3" />
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-600" /> Төлөгдсөн: 64.5 сая₮</span>
            <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-destructive" /> Төлөгдөөгүй: 8.2 сая₮</span>
          </div>
        </CardContent>
      </Card>

      {/* Ready to Send Invoices */}
      <Collapsible open={readyOpen} onOpenChange={setReadyOpen}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Илгээхэд бэлэн нэхэмжлэхүүд
                    <Badge variant="outline" className="text-xs">{readyInvoices.length}</Badge>
                  </CardTitle>
                  {readyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </CollapsibleTrigger>
              {canManage && readyInvoices.length > 0 && (
                <Button onClick={handleSendAll} size="sm" className="gap-2">
                  <Send className="h-4 w-4" />
                  Бүгдийг илгээх ({readyInvoices.length})
                </Button>
              )}
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-0">
              {readyInvoices.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  Илгээхэд бэлэн нэхэмжлэх алга байна.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дугаар</TableHead>
                      <TableHead>Түрээслэгч</TableHead>
                      <TableHead className="text-right">Нийт дүн</TableHead>
                      <TableHead className="hidden sm:table-cell">Хугацаа</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Түрээс</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Менежмент</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Ашиглалт</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {readyInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell><Badge variant="outline" className="font-mono text-xs">{inv.id}</Badge></TableCell>
                        <TableCell className="font-medium">{inv.tenant}</TableCell>
                        <TableCell className="text-right font-medium">{formatMNT(inv.amount)}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{inv.period}</TableCell>
                        <TableCell className="text-right text-muted-foreground hidden sm:table-cell">{formatMNT(inv.breakdown.rent)}</TableCell>
                        <TableCell className="text-right text-muted-foreground hidden sm:table-cell">{formatMNT(inv.breakdown.management)}</TableCell>
                        <TableCell className="text-right text-muted-foreground hidden sm:table-cell">{formatMNT(inv.breakdown.utility)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Sent Invoices */}
      <Collapsible open={invoicesOpen} onOpenChange={setInvoicesOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Илгээгдсэн нэхэмжлэлүүд
                  <Badge variant="outline" className="text-xs">{filteredInvoices.length}</Badge>
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  {invoicesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="p-0">
              <div className="px-4 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Хайх... (дугаар, нэр, дүн, огноо, төлөв)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дугаар</TableHead>
                    <TableHead>Түрээслэгч</TableHead>
                    <TableHead className="text-right">Нийт дүн</TableHead>
                    <TableHead className="hidden sm:table-cell">Огноо</TableHead>
                    <TableHead className="text-right">Төлөв</TableHead>
                    <TableHead className="text-center">Дэлгэрэнгүй</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((inv) => (
                    <TableRow key={inv.id + inv.date}>
                      <TableCell><Badge variant="outline" className="font-mono text-xs">{inv.id}</Badge></TableCell>
                      <TableCell className="font-medium">{inv.tenant}</TableCell>
                      <TableCell className="text-right font-medium">{formatMNT(inv.amount)}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{inv.date}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={inv.status === "paid" ? "default" : inv.status === "overdue" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {inv.status === "paid" ? "Төлөгдсөн" : inv.status === "overdue" ? "Хугацаа хэтэрсэн" : "Төлөгдөөгүй"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedInvoice(inv)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-lg print:shadow-none print:border-none">
          <div id="invoice-print-area">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Нэхэмжлэл {selectedInvoice?.id}
              </DialogTitle>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Түрээслэгч:</span>
                  <span className="font-medium">{selectedInvoice.tenant}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Огноо:</span>
                  <span>{selectedInvoice.date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Төлөв:</span>
                  <Badge
                    variant={selectedInvoice.status === "paid" ? "default" : selectedInvoice.status === "overdue" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {selectedInvoice.status === "paid" ? "Төлөгдсөн" : selectedInvoice.status === "overdue" ? "Хугацаа хэтэрсэн" : "Төлөгдөөгүй"}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-3">Нэхэмжлэлийн задаргаа</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Түрээсийн төлбөр</span>
                      <span>{formatMNT(selectedInvoice.breakdown.rent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Менежментийн төлбөр</span>
                      <span>{formatMNT(selectedInvoice.breakdown.management)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ашиглалтын төлбөр</span>
                      <span>{formatMNT(selectedInvoice.breakdown.utility)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Нийт дүн</span>
                      <span>{formatMNT(selectedInvoice.amount)}</span>
                    </div>
                  </div>
                </div>

                {selectedPaidBreakdown && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Төлсөн дүнгийн суутган задаргаа</h4>
                      <p className="text-xs text-muted-foreground mb-3">Дараалал: Түрээс → Менежмент → Ашиглалт</p>
                      <PaymentBreakdownBars
                        breakdown={selectedInvoice.breakdown}
                        paidBreakdown={selectedPaidBreakdown}
                      />
                      <Separator className="my-3" />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Нийт төлсөн</span>
                        <span className="text-green-600">{formatMNT(selectedInvoice.paidAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold mt-1">
                        <span>Үлдэгдэл</span>
                        <span className={selectedInvoice.amount - (selectedInvoice.paidAmount || 0) > 0 ? "text-destructive" : "text-green-600"}>
                          {formatMNT(selectedInvoice.amount - (selectedInvoice.paidAmount || 0))}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="print:hidden">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Хэвлэх / PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Нэхэмжлэх үүсгэх
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Түрээслэгч</Label>
                <Select value={newTenant} onValueChange={handleSelectTenant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Түрээслэгч сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenantNames.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Хугацаа</Label>
                <Input
                  type="month"
                  value={newPeriod}
                  onChange={(e) => {
                    setNewPeriod(e.target.value);
                    if (newTenant) handleSelectTenant(newTenant);
                  }}
                />
              </div>
            </div>

            {autoFillNote && (
              <div className="rounded-md border border-primary/30 bg-primary/5 p-2 text-xs text-foreground">
                <span className="font-medium text-primary">Автомат бөглөгдсөн:</span> {autoFillNote}
              </div>
            )}

            <div className="space-y-2">
              <Label>Түрээсийн төлбөр (₮)</Label>
              <Input type="number" value={newRent} onChange={(e) => setNewRent(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Менежментийн төлбөр (₮)</Label>
              <Input type="number" value={newMgmt} onChange={(e) => setNewMgmt(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Ашиглалтын төлбөр (₮)</Label>
              <Input type="number" value={newUtil} onChange={(e) => setNewUtil(e.target.value)} placeholder="0" />
            </div>
            {(Number(newRent) + Number(newMgmt) + Number(newUtil)) > 0 && (
              <div className="text-sm font-medium text-foreground">
                Нийт: {formatMNT(Number(newRent) + Number(newMgmt) + Number(newUtil))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Түрээслэгч сонгоход дүн автоматаар бөглөгдөнө. Үүсгэсэн нэхэмжлэх "Илгээхэд бэлэн" хэсэгт орно.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Цуцлах</Button>
            <Button onClick={handleCreateInvoice}>Үүсгэх</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send-all Progress Dialog */}
      <Dialog open={sendOpen} onOpenChange={(o) => !o && closeSendDialog()}>
        <DialogContent className="max-w-md" onInteractOutside={(e) => sending && e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              {sendDone ? "Илгээж дуусгалаа" : "Нэхэмжлэх илгээж байна..."}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Явц</span>
              <span className="font-medium">{sendIndex} / {sendTotal}</span>
            </div>
            <Progress value={sendProgressPct} className="h-3" />
            <div className="text-xs text-muted-foreground text-center">{sendProgressPct}%</div>

            {currentSending && !sendDone && (
              <div className="rounded-md border bg-muted/30 p-3 space-y-1">
                <div className="text-xs text-muted-foreground">Одоо илгээж байна:</div>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline" className="font-mono text-xs">{currentSending.id}</Badge>
                  <span className="font-medium">{currentSending.tenant}</span>
                  <span className="text-foreground">{formatMNT(currentSending.amount)}</span>
                </div>
              </div>
            )}

            {sendDone && (
              <div className="flex items-center gap-2 text-sm text-green-600 justify-center">
                <CheckCircle2 className="h-4 w-4" />
                {sendTotal} нэхэмжлэх амжилттай илгээгдлээ.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={closeSendDialog} disabled={sending}>
              Хаах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;
