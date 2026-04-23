import { useMemo, useState } from "react";
import { Wrench, Plus, Droplets, Flame, Zap, Thermometer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { canRecordMeters } from "@/lib/permissions";
import { toast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  name: string;
  object: string;
  area: number;
}

interface MeterReading {
  hotWater: number; // m³
  coldWater: number; // m³
  heating: number; // m³
  electricity: number; // kWh
}

const tenants: Tenant[] = [
  { id: "T-01", name: "Бат Дорж", object: "Скай Тауэр", area: 85 },
  { id: "T-02", name: "Болд Сүхбат", object: "Блү Мон Тауэр", area: 120 },
  { id: "T-03", name: "Ган Тулга", object: "Сэнтрал Тауэр", area: 200 },
  { id: "T-04", name: "Нар Мандах", object: "Шангри-Ла Молл", area: 45 },
  { id: "T-05", name: "Оюун Эрдэнэ", object: "Их Монгол Тауэр", area: 150 },
];

const months = [
  { value: "2024-04", label: "2024 оны 4-р сар" },
  { value: "2024-05", label: "2024 оны 5-р сар" },
  { value: "2024-06", label: "2024 оны 6-р сар" },
  { value: "2024-07", label: "2024 оны 7-р сар" },
];

const seedReadings: Record<string, Record<string, MeterReading>> = {
  "2024-06": {
    "T-01": { hotWater: 4.2, coldWater: 6.5, heating: 12.0, electricity: 320 },
    "T-02": { hotWater: 6.0, coldWater: 9.1, heating: 18.5, electricity: 480 },
    "T-03": { hotWater: 9.5, coldWater: 14.2, heating: 28.0, electricity: 720 },
  },
};

const Operations = () => {
  const { user } = useAuth();
  const canRecord = canRecordMeters(user?.role);

  const [selectedMonth, setSelectedMonth] = useState("2024-07");
  const [readings, setReadings] = useState<Record<string, Record<string, MeterReading>>>(seedReadings);
  const [dialogTenant, setDialogTenant] = useState<Tenant | null>(null);
  const [form, setForm] = useState<MeterReading>({ hotWater: 0, coldWater: 0, heating: 0, electricity: 0 });

  const monthReadings = readings[selectedMonth] || {};

  const totals = useMemo(() => {
    return Object.values(monthReadings).reduce(
      (acc, r) => ({
        hotWater: acc.hotWater + r.hotWater,
        coldWater: acc.coldWater + r.coldWater,
        heating: acc.heating + r.heating,
        electricity: acc.electricity + r.electricity,
      }),
      { hotWater: 0, coldWater: 0, heating: 0, electricity: 0 },
    );
  }, [monthReadings]);

  const openDialog = (tenant: Tenant) => {
    const existing = monthReadings[tenant.id];
    setForm(existing || { hotWater: 0, coldWater: 0, heating: 0, electricity: 0 });
    setDialogTenant(tenant);
  };

  const saveReading = () => {
    if (!dialogTenant) return;
    setReadings((prev) => ({
      ...prev,
      [selectedMonth]: {
        ...(prev[selectedMonth] || {}),
        [dialogTenant.id]: form,
      },
    }));
    toast({
      title: "Хадгаллаа",
      description: `${dialogTenant.name} — ${selectedMonth} сарын хэмжүүр бүртгэгдлээ.`,
    });
    setDialogTenant(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ашиглалт</h1>
            <p className="text-sm text-muted-foreground">
              Түрээслэгчийн сарын хэмжүүрийн бүртгэл
              {!canRecord && " • Зөвхөн уншина"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm whitespace-nowrap">Сар:</Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Totals KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Халуун ус</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totals.hotWater.toFixed(1)} м³</div>
            <p className="text-xs text-muted-foreground mt-1">Нийт хэрэглээ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Хүйтэн ус</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totals.coldWater.toFixed(1)} м³</div>
            <p className="text-xs text-muted-foreground mt-1">Нийт хэрэглээ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Халаалт</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totals.heating.toFixed(1)} м³</div>
            <p className="text-xs text-muted-foreground mt-1">Нийт хэрэглээ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Цахилгаан</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totals.electricity.toFixed(0)} kWh</div>
            <p className="text-xs text-muted-foreground mt-1">Нийт хэрэглээ</p>
          </CardContent>
        </Card>
      </div>

      {/* Tenants meter table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Түрээслэгчийн жагсаалт</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Түрээслэгч</TableHead>
                <TableHead className="hidden sm:table-cell">Объект</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Талбай (м²)</TableHead>
                <TableHead className="text-right">Халуун ус</TableHead>
                <TableHead className="text-right">Хүйтэн ус</TableHead>
                <TableHead className="text-right hidden md:table-cell">Халаалт</TableHead>
                <TableHead className="text-right">Цахилгаан</TableHead>
                <TableHead className="text-center">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((t) => {
                const r = monthReadings[t.id];
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">{t.object}</TableCell>
                    <TableCell className="text-right hidden sm:table-cell text-muted-foreground">{t.area}</TableCell>
                    <TableCell className="text-right">{r ? `${r.hotWater} м³` : <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell className="text-right">{r ? `${r.coldWater} м³` : <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell className="text-right hidden md:table-cell">{r ? `${r.heating} м³` : <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell className="text-right">{r ? `${r.electricity} kWh` : <span className="text-muted-foreground">—</span>}</TableCell>
                    <TableCell className="text-center">
                      {canRecord ? (
                        <Button variant="ghost" size="sm" onClick={() => openDialog(t)} className="gap-1">
                          <Plus className="h-3.5 w-3.5" />
                          {r ? "Засах" : "Бүртгэх"}
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-xs">Уншина</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reading dialog */}
      <Dialog open={!!dialogTenant} onOpenChange={(open) => !open && setDialogTenant(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Хэмжүүр бүртгэх — {dialogTenant?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {months.find((m) => m.value === selectedMonth)?.label}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Flame className="h-3.5 w-3.5 text-orange-500" /> Халуун ус (м³)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.hotWater}
                  onChange={(e) => setForm({ ...form, hotWater: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5 text-blue-500" /> Хүйтэн ус (м³)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.coldWater}
                  onChange={(e) => setForm({ ...form, coldWater: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5 text-red-500" /> Халаалт (м³)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.heating}
                  onChange={(e) => setForm({ ...form, heating: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-yellow-500" /> Цахилгаан (kWh)</Label>
                <Input
                  type="number"
                  step="1"
                  value={form.electricity}
                  onChange={(e) => setForm({ ...form, electricity: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogTenant(null)}>Цуцлах</Button>
            <Button onClick={saveReading}>Хадгалах</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Operations;
