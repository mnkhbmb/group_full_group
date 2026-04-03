import { Building2, Users, FileText, DollarSign, AlertCircle, BarChart3, TrendingUp, Home, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";

// Mock data
const monthlyRevenue = [
  { month: "1-р сар", rental: 45000000, management: 8500000, utility: 12000000 },
  { month: "2-р сар", rental: 47000000, management: 8700000, utility: 11500000 },
  { month: "3-р сар", rental: 46500000, management: 8600000, utility: 13000000 },
  { month: "4-р сар", rental: 48000000, management: 9000000, utility: 12500000 },
  { month: "5-р сар", rental: 49500000, management: 9200000, utility: 11800000 },
  { month: "6-р сар", rental: 51000000, management: 9500000, utility: 12200000 },
];

const invoiceData = [
  { month: "1-р сар", sent: 120, paid: 105, unpaid: 15 },
  { month: "2-р сар", sent: 125, paid: 110, unpaid: 15 },
  { month: "3-р сар", sent: 118, paid: 100, unpaid: 18 },
  { month: "4-р сар", sent: 130, paid: 118, unpaid: 12 },
  { month: "5-р сар", sent: 128, paid: 115, unpaid: 13 },
  { month: "6-р сар", sent: 135, paid: 120, unpaid: 15 },
];

const occupancyData = [
  { name: "Түрээслэсэн", value: 78, fill: "hsl(var(--primary))" },
  { name: "Сул", value: 22, fill: "hsl(var(--muted-foreground) / 0.3)" },
];

const feedbackData = [
  { type: "Засвар үйлчилгээ", count: 24 },
  { type: "Цэвэрлэгээ", count: 12 },
  { type: "Аюулгүй байдал", count: 8 },
  { type: "Зогсоол", count: 15 },
  { type: "Бусад", count: 6 },
];

const revenueChartConfig: ChartConfig = {
  rental: { label: "Түрээсийн орлого", color: "hsl(var(--primary))" },
  management: { label: "Менежментийн орлого", color: "hsl(210 70% 50%)" },
  utility: { label: "Ашиглалтын төлбөр", color: "hsl(150 60% 45%)" },
};

const invoiceChartConfig: ChartConfig = {
  sent: { label: "Илгээсэн", color: "hsl(var(--primary))" },
  paid: { label: "Төлөгдсөн", color: "hsl(150 60% 45%)" },
  unpaid: { label: "Төлөгдөөгүй", color: "hsl(0 70% 55%)" },
};

const feedbackChartConfig: ChartConfig = {
  count: { label: "Тоо", color: "hsl(var(--primary))" },
};

const formatMNT = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}сая`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}мянга`;
  return value.toString();
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
    </CardContent>
  </Card>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Хөрөнгийн Менежмент</h1>
              <p className="text-xs text-muted-foreground">Хяналтын самбар</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">2024 оны 6-р сар</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* KPI Cards Row 1 - Property */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Home className="h-5 w-5" /> Объект & Талбайн мэдээлэл
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard title="Объектын тоо" value={12} icon={Building2} subtitle="Нийт бүртгэлтэй" />
            <StatCard title="Түрээслэсэн талбай" value={156} icon={BarChart3} subtitle="24,800 м²" />
            <StatCard title="Түрээслэсэн хэмжээ" value="24,800 м²" icon={TrendingUp} trend="+3.2%" />
            <StatCard title="Сул талбай" value={44} icon={AlertCircle} subtitle="6,200 м²" />
            <StatCard title="Сул талбайн хэмжээ" value="6,200 м²" icon={Home} />
          </div>
        </div>

        {/* KPI Cards Row 2 - Tenants & Finance */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" /> Түрээслэгч & Санхүү
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard title="Түрээслэгчдийн тоо" value={143} icon={Users} trend="+5 шинэ" />
            <StatCard title="Санал хүсэлт" value={65} icon={MessageSquare} subtitle="Энэ сард" />
            <StatCard title="Түрээсийн орлого" value="51.0 сая₮" icon={DollarSign} trend="+4.2%" />
            <StatCard title="Менежментийн орлого" value="9.5 сая₮" icon={DollarSign} trend="+3.3%" />
            <StatCard title="Ашиглалтын төлбөр" value="12.2 сая₮" icon={FileText} />
          </div>
        </div>

        {/* Invoice summary + Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Илгээгдсэн нэхэмжлэл</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">135</div>
              <p className="text-xs text-muted-foreground">Нийт дүн: 72.7 сая₮</p>
              <Progress value={89} className="mt-2 h-2" />
              <p className="text-xs text-muted-foreground mt-1">89% төлөгдсөн</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Төлөгдөөгүй нэхэмжлэл</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">15</div>
              <p className="text-xs text-muted-foreground">Нийт дүн: 8.2 сая₮</p>
              <Progress value={11} className="mt-2 h-2" />
              <p className="text-xs text-destructive mt-1">11% төлөгдөөгүй</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Санал хүсэлт
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">65</div>
              <p className="text-xs text-muted-foreground">Энэ сард ирсэн</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Засвар үйлчилгээ</span>
                  <span className="font-medium text-foreground">24</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Зогсоол</span>
                  <span className="font-medium text-foreground">15</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Цэвэрлэгээ</span>
                  <span className="font-medium text-foreground">12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Орлогын график</TabsTrigger>
            <TabsTrigger value="invoices">Нэхэмжлэл</TabsTrigger>
            <TabsTrigger value="occupancy">Ашиглалт</TabsTrigger>
            <TabsTrigger value="feedback">Санал хүсэлт</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Сарын орлогын харьцуулалт</CardTitle>
                <CardDescription>Түрээс, менежмент, ашиглалтын орлого (₮)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={revenueChartConfig} className="h-[350px] w-full">
                  <AreaChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatMNT} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="rental" stackId="1" fill="var(--color-rental)" stroke="var(--color-rental)" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="management" stackId="1" fill="var(--color-management)" stroke="var(--color-management)" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="utility" stackId="1" fill="var(--color-utility)" stroke="var(--color-utility)" fillOpacity={0.6} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Нэхэмжлэлийн статистик</CardTitle>
                <CardDescription>Илгээсэн, төлөгдсөн, төлөгдөөгүй</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={invoiceChartConfig} className="h-[350px] w-full">
                  <BarChart data={invoiceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="sent" fill="var(--color-sent)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="paid" fill="var(--color-paid)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="unpaid" fill="var(--color-unpaid)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="occupancy">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Талбайн ашиглалт</CardTitle>
                  <CardDescription>Түрээслэсэн vs Сул талбай</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ChartContainer config={{ occupied: { label: "Түрээслэсэн", color: "hsl(var(--primary))" }, vacant: { label: "Сул", color: "hsl(var(--muted))" } }} className="h-[250px] w-[250px]">
                    <PieChart>
                      <Pie data={occupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                        {occupancyData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ашиглалтын хувь</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Объект 1 - Оффис", pct: 92 },
                    { name: "Объект 2 - Худалдааны төв", pct: 85 },
                    { name: "Объект 3 - Агуулах", pct: 70 },
                    { name: "Объект 4 - Оффис", pct: 95 },
                    { name: "Объект 5 - Худалдааны төв", pct: 60 },
                  ].map((obj) => (
                    <div key={obj.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{obj.name}</span>
                        <span className="text-muted-foreground">{obj.pct}%</span>
                      </div>
                      <Progress value={obj.pct} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Түрээслэгчдийн санал хүсэлт</CardTitle>
                <CardDescription>Ангилал тус бүрээр</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={feedbackChartConfig} className="h-[300px] w-full">
                  <BarChart data={feedbackData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
