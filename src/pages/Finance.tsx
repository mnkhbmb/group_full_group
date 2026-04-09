import { useState } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const formatMNT = (v: number) => v.toLocaleString("mn-MN") + "₮";

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

const sentInvoices = [
  { id: "INV-0081", tenant: "Бат Дорж", amount: 2550000, date: "2024-04-01", status: "paid" as const },
  { id: "INV-0082", tenant: "Болд Сүхбат", amount: 4200000, date: "2024-04-01", status: "paid" as const },
  { id: "INV-0083", tenant: "Ган Тулга", amount: 7000000, date: "2024-04-01", status: "paid" as const },
  { id: "INV-0084", tenant: "Нар Мандах", amount: 2250000, date: "2024-04-01", status: "paid" as const },
  { id: "INV-0085", tenant: "Оюун Эрдэнэ", amount: 4500000, date: "2024-04-01", status: "paid" as const },
  { id: "INV-0087", tenant: "Бат Дорж", amount: 850000, date: "2024-05-01", status: "overdue" as const },
  { id: "INV-0092", tenant: "Болд Сүхбат", amount: 1200000, date: "2024-05-01", status: "overdue" as const },
  { id: "INV-0095", tenant: "Ган Тулга", amount: 650000, date: "2024-05-01", status: "unpaid" as const },
  { id: "INV-0101", tenant: "Нар Мандах", amount: 780000, date: "2024-05-01", status: "unpaid" as const },
  { id: "INV-0103", tenant: "Оюун Эрдэнэ", amount: 620000, date: "2024-05-01", status: "unpaid" as const },
  { id: "INV-0110", tenant: "Бат Дорж", amount: 2550000, date: "2024-06-01", status: "paid" as const },
  { id: "INV-0111", tenant: "Болд Сүхбат", amount: 4200000, date: "2024-06-01", status: "paid" as const },
  { id: "INV-0112", tenant: "Ган Тулга", amount: 7000000, date: "2024-06-01", status: "paid" as const },
  { id: "INV-0113", tenant: "Нар Мандах", amount: 2250000, date: "2024-06-01", status: "unpaid" as const },
  { id: "INV-0114", tenant: "Оюун Эрдэнэ", amount: 4500000, date: "2024-06-01", status: "paid" as const },
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

const Finance = () => {
  const [invoicesOpen, setInvoicesOpen] = useState(true);
  const [overdueOpen, setOverdueOpen] = useState(true);
  const [receivablesOpen, setReceivablesOpen] = useState(true);
  const [payablesOpen, setPayablesOpen] = useState(true);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Receipt className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Санхүү бүртгэл</h1>
          <p className="text-sm text-muted-foreground">Нэхэмжлэл, авлага, өглөгийн нэгдсэн хяналт</p>
        </div>
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
    </div>
  );
};

export default Finance;
