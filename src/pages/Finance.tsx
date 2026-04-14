import { useState, useMemo } from "react";
import {
  Receipt,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Eye,
  Plus,
  Search,
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
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface MiniStat {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color?: string;
  trend?: string;
}

const kpiData: MiniStat[] = [
  { title: "Илгээгдсэн нэхэмжлэл", value: 135, subtitle: "Нийт дүн: 72.7 сая₮", icon: FileText, trend: "+12 энэ сард" },
  { title: "Төлөгдсөн нэхэмжлэл", value: 120, subtitle: "Нийт дүн: 64.5 сая₮", icon: CheckCircle2, color: "text-green-600" },
  { title: "Төлөгдөөгүй нэхэмжлэл", value: 15, subtitle: "Нийт дүн: 8.2 сая₮", icon: AlertTriangle, color: "text-destructive" },
  { title: "Хугацаа хэтэрсэн", value: 7, subtitle: "Нийт дүн: 4.1 сая₮", icon: Clock, color: "text-orange-500" },
  { title: "Авлагын бүртгэл", value: "12.3 сая₮", subtitle: "23 түрээслэгч", icon: TrendingUp, color: "text-primary" },
  { title: "Өглөгийн бүртгэл", value: "3.8 сая₮", subtitle: "5 нийлүүлэгч", icon: TrendingDown, color: "text-orange-500" },
];

const initialInvoices: SentInvoice[] = [
  { id: "INV-0081", tenant: "Бат Дорж", amount: 2550000, date: "2024-04-01", status: "paid", breakdown: { rent: 1800000, management: 450000, utility: 300000 }, paidAmount: 2550000, paidBreakdown: { rent: 1800000, management: 450000, utility: 300000 } },
  { id: "INV-0082", tenant: "Болд Сүхбат", amount: 4200000, date: "2024-04-01", status: "paid", breakdown: { rent: 3000000, management: 720000, utility: 480000 }, paidAmount: 4200000, paidBreakdown: { rent: 3000000, management: 720000, utility: 480000 } },
  { id: "INV-0083", tenant: "Ган Тулга", amount: 7000000, date: "2024-04-01", status: "paid", breakdown: { rent: 5000000, management: 1200000, utility: 800000 }, paidAmount: 7000000, paidBreakdown: { rent: 5000000, management: 1200000, utility: 800000 } },
  { id: "INV-0084", tenant: "Нар Мандах", amount: 2250000, date: "2024-04-01", status: "paid", breakdown: { rent: 1600000, management: 390000, utility: 260000 }, paidAmount: 2250000, paidBreakdown: { rent: 1600000, management: 390000, utility: 260000 } },
  { id: "INV-0085", tenant: "Оюун Эрдэнэ", amount: 4500000, date: "2024-04-01", status: "paid", breakdown: { rent: 3200000, management: 780000, utility: 520000 }, paidAmount: 4500000, paidBreakdown: { rent: 3200000, management: 780000, utility: 520000 } },
  { id: "INV-0087", tenant: "Бат Дорж", amount: 850000, date: "2024-05-01", status: "overdue", breakdown: { rent: 600000, management: 150000, utility: 100000 } },
  { id: "INV-0092", tenant: "Болд Сүхбат", amount: 1200000, date: "2024-05-01", status: "overdue", breakdown: { rent: 850000, management: 210000, utility: 140000 } },
  { id: "INV-0095", tenant: "Ган Тулга", amount: 650000, date: "2024-05-01", status: "unpaid", breakdown: { rent: 460000, management: 114000, utility: 76000 } },
  { id: "INV-0101", tenant: "Нар Мандах", amount: 780000, date: "2024-05-01", status: "unpaid", breakdown: { rent: 550000, management: 138000, utility: 92000 } },
  { id: "INV-0103", tenant: "Оюун Эрдэнэ", amount: 620000, date: "2024-05-01", status: "unpaid", breakdown: { rent: 440000, management: 108000, utility: 72000 } },
  { id: "INV-0110", tenant: "Бат Дорж", amount: 2550000, date: "2024-06-01", status: "paid", breakdown: { rent: 1800000, management: 450000, utility: 300000 }, paidAmount: 2550000, paidBreakdown: { rent: 1800000, management: 450000, utility: 300000 } },
  { id: "INV-0111", tenant: "Болд Сүхбат", amount: 4200000, date: "2024-06-01", status: "paid", breakdown: { rent: 3000000, management: 720000, utility: 480000 }, paidAmount: 4200000, paidBreakdown: { rent: 3000000, management: 720000, utility: 480000 } },
  { id: "INV-0112", tenant: "Ган Тулга", amount: 7000000, date: "2024-06-01", status: "paid", breakdown: { rent: 5000000, management: 1200000, utility: 800000 }, paidAmount: 7000000, paidBreakdown: { rent: 5000000, management: 1200000, utility: 800000 } },
  { id: "INV-0113", tenant: "Нар Мандах", amount: 2250000, date: "2024-06-01", status: "unpaid", breakdown: { rent: 1600000, management: 390000, utility: 260000 } },
  { id: "INV-0114", tenant: "Оюун Эрдэнэ", amount: 4500000, date: "2024-06-01", status: "paid", breakdown: { rent: 3200000, management: 780000, utility: 520000 }, paidAmount: 4500000, paidBreakdown: { rent: 3200000, management: 780000, utility: 520000 } },
];

const overdueInvoices = [
  { id: "INV-0087", tenant: "Бат Дорж", amount: 850000, dueDate: "2024-05-15", days: 21 },
  { id: "INV-0092", tenant: "Болд Сүхбат", amount: 1200000, dueDate: "2024-05-20", days: 16 },
  { id: "INV-0095", tenant: "Ган Тулга", amount: 650000, dueDate: "2024-05-25", days: 11 },
  { id: "INV-0101", tenant: "Нар Мандах", amount: 780000, dueDate: "2024-05-28", days: 8 },
  { id: "INV-0103", tenant: "Оюун Эрдэнэ", amount: 620000, dueDate: "2024-06-01", days: 4 },
];

const receivables = [
  { tenant: "Бат Дорж", total: 2550000, paid: 1700000, remaining: 850000 },
  { tenant: "Болд Сүхбат", total: 4200000, paid: 3000000, remaining: 1200000 },
  { tenant: "Ган Тулга", total: 7000000, paid: 6350000, remaining: 650000 },
  { tenant: "Нар Мандах", total: 2250000, paid: 1470000, remaining: 780000 },
];

const payables = [
  { supplier: "Цахилгаан ХХК", total: 1200000, paid: 800000, remaining: 400000 },
  { supplier: "Цэвэрлэгээ Сервис", total: 950000, paid: 0, remaining: 950000 },
  { supplier: "Лифт Засвар ХХК", total: 2450000, paid: 2450000, remaining: 0 },
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

function StackedBar({ breakdown, amount }: { breakdown: InvoiceBreakdown; amount: number }) {
  const rentPct = (breakdown.rent / amount) * 100;
  const mgmtPct = (breakdown.management / amount) * 100;
  const utilPct = (breakdown.utility / amount) * 100;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-3 w-full min-w-[120px] rounded-full overflow-hidden bg-muted cursor-pointer">
            <div className="h-full bg-primary" style={{ width: `${rentPct}%` }} />
            <div className="h-full" style={{ width: `${mgmtPct}%`, backgroundColor: "hsl(210 70% 50%)" }} />
            <div className="h-full" style={{ width: `${utilPct}%`, backgroundColor: "hsl(150 60% 45%)" }} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Түрээс: {formatMNT(breakdown.rent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(210 70% 50%)" }} />
              <span>Менежмент: {formatMNT(breakdown.management)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(150 60% 45%)" }} />
              <span>Ашиглалт: {formatMNT(breakdown.utility)}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const Finance = () => {
  const [invoicesOpen, setInvoicesOpen] = useState(true);
  const [overdueOpen, setOverdueOpen] = useState(true);
  const [receivablesOpen, setReceivablesOpen] = useState(true);
  const [payablesOpen, setPayablesOpen] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<SentInvoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [invoices, setInvoices] = useState<SentInvoice[]>(initialInvoices);

  // Create invoice form
  const [newTenant, setNewTenant] = useState("");
  const [newRent, setNewRent] = useState("");
  const [newMgmt, setNewMgmt] = useState("");
  const [newUtil, setNewUtil] = useState("");

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

  const handleCreateInvoice = () => {
    const rent = Number(newRent) || 0;
    const mgmt = Number(newMgmt) || 0;
    const util = Number(newUtil) || 0;
    if (!newTenant || (rent + mgmt + util) === 0) return;

    const newInv: SentInvoice = {
      id: `INV-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      tenant: newTenant,
      amount: rent + mgmt + util,
      date: new Date().toISOString().split("T")[0],
      status: "unpaid",
      breakdown: { rent, management: mgmt, utility: util },
    };

    setInvoices((prev) => [newInv, ...prev]);
    setCreateOpen(false);
    setNewTenant("");
    setNewRent("");
    setNewMgmt("");
    setNewUtil("");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Receipt className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Санхүү бүртгэл</h1>
            <p className="text-sm text-muted-foreground">
              Нэхэмжлэл, авлага, өглөгийн нэгдсэн хяналт • 1-5-нд тооцоо, 5-нд илгээнэ, 20-нд сануулга
            </p>
          </div>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Нэхэмжлэх үүсгэх
        </Button>
      </div>

      {/* Mini Dashboard KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

      {/* Collapsible sections */}
      <div className="space-y-4">
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
                {/* Search */}
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

                {/* Legend */}
                <div className="px-4 pb-2 flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary" /> Түрээс</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(210 70% 50%)" }} /> Менежмент</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(150 60% 45%)" }} /> Ашиглалт</span>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дугаар</TableHead>
                      <TableHead>Түрээслэгч</TableHead>
                      <TableHead>Задаргаа</TableHead>
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
                        <TableCell className="min-w-[140px]">
                          <StackedBar breakdown={inv.breakdown} amount={inv.amount} />
                        </TableCell>
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

        {/* Overdue */}
        <Collapsible open={overdueOpen} onOpenChange={setOverdueOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    Хугацаа хэтэрсэн нэхэмжлэлүүд
                    <Badge variant="destructive" className="text-xs">{overdueInvoices.length}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {overdueOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дугаар</TableHead>
                      <TableHead>Түрээслэгч</TableHead>
                      <TableHead className="text-right">Дүн</TableHead>
                      <TableHead className="hidden sm:table-cell">Хугацаа</TableHead>
                      <TableHead className="text-right">Хэтэрсэн</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overdueInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell><Badge variant="outline" className="font-mono text-xs">{inv.id}</Badge></TableCell>
                        <TableCell className="font-medium">{inv.tenant}</TableCell>
                        <TableCell className="text-right">{formatMNT(inv.amount)}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{inv.dueDate}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={inv.days > 14 ? "destructive" : "secondary"} className="text-xs">
                            {inv.days} хоног
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Receivables */}
        <Collapsible open={receivablesOpen} onOpenChange={setReceivablesOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Авлагын бүртгэл
                    <Badge variant="outline" className="text-xs">{receivables.length}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {receivablesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Түрээслэгч</TableHead>
                      <TableHead className="text-right">Нийт</TableHead>
                      <TableHead className="text-right">Төлсөн</TableHead>
                      <TableHead className="text-right">Үлдэгдэл</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivables.map((r) => (
                      <TableRow key={r.tenant}>
                        <TableCell className="font-medium">{r.tenant}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatMNT(r.total)}</TableCell>
                        <TableCell className="text-right text-green-600">{formatMNT(r.paid)}</TableCell>
                        <TableCell className="text-right font-medium text-destructive">{formatMNT(r.remaining)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Payables */}
        <Collapsible open={payablesOpen} onOpenChange={setPayablesOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-orange-500" />
                    Өглөгийн бүртгэл
                    <Badge variant="outline" className="text-xs">{payables.length}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {payablesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Нийлүүлэгч</TableHead>
                      <TableHead className="text-right">Нийт</TableHead>
                      <TableHead className="text-right">Төлсөн</TableHead>
                      <TableHead className="text-right">Үлдэгдэл</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payables.map((p) => (
                      <TableRow key={p.supplier}>
                        <TableCell className="font-medium">{p.supplier}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatMNT(p.total)}</TableCell>
                        <TableCell className="text-right text-green-600">{formatMNT(p.paid)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {p.remaining === 0 ? (
                            <Badge variant="secondary" className="text-xs">Төлөгдсөн</Badge>
                          ) : (
                            <span className="text-destructive">{formatMNT(p.remaining)}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-lg">
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

              {selectedInvoice.status === "paid" && selectedInvoice.paidBreakdown && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-green-600">Төлсөн дүнгийн задаргаа</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Түрээсийн төлбөр</span>
                        <span className="text-green-600">{formatMNT(selectedInvoice.paidBreakdown.rent)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Менежментийн төлбөр</span>
                        <span className="text-green-600">{formatMNT(selectedInvoice.paidBreakdown.management)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ашиглалтын төлбөр</span>
                        <span className="text-green-600">{formatMNT(selectedInvoice.paidBreakdown.utility)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Нийт төлсөн</span>
                        <span className="text-green-600">{formatMNT(selectedInvoice.paidAmount || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Үлдэгдэл</span>
                        <span className={selectedInvoice.amount - (selectedInvoice.paidAmount || 0) > 0 ? "text-destructive" : "text-green-600"}>
                          {formatMNT(selectedInvoice.amount - (selectedInvoice.paidAmount || 0))}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
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
            <div className="space-y-2">
              <Label>Түрээслэгч</Label>
              <Select value={newTenant} onValueChange={setNewTenant}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Цуцлах</Button>
            <Button onClick={handleCreateInvoice}>Үүсгэх</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;
