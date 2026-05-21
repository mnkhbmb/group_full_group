import { useState, useEffect } from "react";
import { Building2, Users, AlertCircle, BarChart3, TrendingUp, Home, CalendarClock, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { propertiesApi, tenantsApi } from "@/lib/api";

function getInvoiceCountdown() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const nextSend = day < 5 ? new Date(year, month, 5) : new Date(year, month + 1, 5);
  const nextReminder = day < 20 ? new Date(year, month, 20) : new Date(year, month + 1, 20);

  const diffSend = Math.ceil((nextSend.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const diffReminder = Math.ceil((nextReminder.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return { diffSend, diffReminder };
}

const StatCard = ({
  title, value, subtitle, icon: Icon,
}: { title: string; value: string | number; subtitle?: string; icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </CardContent>
  </Card>
);

const Index = () => {
  const [countdown, setCountdown] = useState(getInvoiceCountdown());
  const [stats, setStats] = useState({
    propertyCount: 0,
    rentedCount: 0,
    vacantCount: 0,
    rentedArea: 0,
    vacantArea: 0,
    tenantCount: 0,
    totalRental: 0,
    totalManagement: 0,
  });
  const [objectCount, setObjectCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getInvoiceCountdown()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [properties, tenants] = await Promise.all([
          propertiesApi.getAll(),
          tenantsApi.getAll(),
        ]);
        const rented = properties.filter((p: any) => p.status === "rented");
        const vacant = properties.filter((p: any) => p.status === "vacant");
        const uniqueObjects = new Set(properties.map((p: any) => p.objectName));

        setObjectCount(uniqueObjects.size);
        setStats({
          propertyCount: properties.length,
          rentedCount: rented.length,
          vacantCount: vacant.length,
          rentedArea: rented.reduce((s: number, p: any) => s + (p.areaSize || 0), 0),
          vacantArea: vacant.reduce((s: number, p: any) => s + (p.areaSize || 0), 0),
          tenantCount: tenants.length,
          totalRental: rented.reduce((s: number, p: any) => s + (p.rentalAmount || 0), 0),
          totalManagement: rented.reduce(
            (s: number, p: any) => s + (p.managementFeePerSqm || 0) * (p.areaSize || 0),
            0
          ),
        });
      } catch {
        // ignore
      }
    })();
  }, []);

  const formatMNT = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} сая₮`;
    if (v >= 1000) return `${(v / 1000).toFixed(0)} мян₮`;
    return `${v}₮`;
  };

  const monthLabel = new Date().toLocaleDateString("mn-MN", { year: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">Хөрөнгийн Менежмент</h1>
              <p className="text-xs text-muted-foreground">Хяналтын самбар</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">{monthLabel}</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Invoice schedule countdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-primary" />
                Нэхэмжлэх илгээх хуваарь
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{countdown.diffSend} хоног</div>
              <p className="text-xs text-muted-foreground mt-1">Дараагийн илгээх огноо: Сар бүрийн 5-нд</p>
              <p className="text-xs text-muted-foreground mt-0.5">1-5-ны хооронд тооцоо хийгдэнэ</p>
            </CardContent>
          </Card>
          <Card className="border-orange-500/30 bg-orange-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4 text-orange-500" />
                Төлбөрийн сануулга
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-500">{countdown.diffReminder} хоног</div>
              <p className="text-xs text-muted-foreground mt-1">Дараагийн сануулга: Сар бүрийн 20-нд</p>
              <p className="text-xs text-muted-foreground mt-0.5">Төлөгдөөгүй нэхэмжлэхийг сануулна</p>
            </CardContent>
          </Card>
        </div>

        {/* Property stats */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Home className="h-5 w-5" /> Объект & Талбайн мэдээлэл
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard title="Объектын тоо" value={objectCount} icon={Building2} subtitle="Нийт бүртгэлтэй" />
            <StatCard title="Түрээслэсэн талбай" value={stats.rentedCount} icon={BarChart3} subtitle={`${stats.rentedArea.toLocaleString()} м²`} />
            <StatCard title="Түрээслэсэн хэмжээ" value={`${stats.rentedArea.toLocaleString()} м²`} icon={TrendingUp} />
            <StatCard title="Сул талбай" value={stats.vacantCount} icon={AlertCircle} subtitle={`${stats.vacantArea.toLocaleString()} м²`} />
            <StatCard title="Сул талбайн хэмжээ" value={`${stats.vacantArea.toLocaleString()} м²`} icon={Home} />
          </div>
        </div>

        {/* Tenants & Finance */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" /> Түрээслэгч & Санхүү
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Түрээслэгчдийн тоо" value={stats.tenantCount} icon={Users} />
            <StatCard title="Түрээсийн орлого" value={formatMNT(stats.totalRental)} icon={TrendingUp} />
            <StatCard title="Менежментийн орлого" value={formatMNT(stats.totalManagement)} icon={BarChart3} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
