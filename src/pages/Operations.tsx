import { useMemo, useState } from "react";
import { Wrench, Plus, Droplets, Flame, Zap, Thermometer, Calculator } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
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
import { tenantList, type TenantInfo } from "@/data/tenants";
import { propertyData, utilityRates, calcUtilityCost } from "@/data/properties";
import {
  previousMonth,
  calcConsumption,
  type MeterReading,
} from "@/data/meterReadings";
import { useMeterStore } from "@/data/meterStore";

const formatMNT = (v: number) => Math.round(v).toLocaleString("mn-MN") + "₮";

const months = [
  { value: "2024-04", label: "2024 оны 4-р сар" },
  { value: "2024-05", label: "2024 оны 5-р сар" },
  { value: "2024-06", label: "2024 оны 6-р сар" },
  { value: "2024-07", label: "2024 оны 7-р сар" },
  { value: "2024-08", label: "2024 оны 8-р сар" },
];

function tenantPropertySummary(t: TenantInfo): { object: string; area: number } {
  const props = t.propertyIds
    .map((id) => propertyData.find((p) => p.id === id))
    .filter(Boolean) as typeof propertyData;
  if (props.length === 0) return { object: "—", area: 0 };
  return {
    object: props.map((p) => p.objectName).join(", "),
    area: props.reduce((s, p) => s + p.areaSize, 0),
  };
}

const Operations = () => {
  const { user } = useAuth();
  const canRecord = canRecordMeters(user?.role);

  const [selectedMonth, setSelectedMonth] = useState("2024-07");
  const { store: readings, setReading } = useMeterStore();
  const [dialogTenant, setDialogTenant] = useState<TenantInfo | null>(null);
  const [form, setForm] = useState<MeterReading>({ hotWater: 0, coldWater: 0, heating: 0, electricity: 0 });

  const prevPeriod = previousMonth(selectedMonth);

  /** Тухайн саранд тооцоологдсон зарцуулалт + үнэ */
  const consumptionByTenant = useMemo(() => {
    const monthReadings = readings[selectedMonth] || {};
    const out: Record<
      string,
      { usage: ReturnType<typeof calcConsumption>; cost: number; hasReading: boolean }
    > = {};
    for (const t of tenantList) {
      const cur = monthReadings[t.id];
      const prev = readings[prevPeriod]?.[t.id];
      const usage = calcConsumption(cur, prev);
      out[t.id] = {
        usage,
        cost: calcUtilityCost(usage),
        hasReading: !!cur,
      };
    }
    return out;
  }, [readings, selectedMonth, prevPeriod]);

  const monthReadings = readings[selectedMonth] || {};

  const totals = useMemo(() => {
    return Object.values(consumptionByTenant).reduce(
      (acc, r) => ({
        hotWater: acc.hotWater + r.usage.hotWater,
        coldWater: acc.coldWater + r.usage.coldWater,
        heating: acc.heating + r.usage.heating,
        electricity: acc.electricity + r.usage.electricity,
        cost: acc.cost + r.cost,
      }),
      { hotWater: 0, coldWater: 0, heating: 0, electricity: 0, cost: 0 },
    );
  }, [consumptionByTenant]);

  const openDialog = (tenant: TenantInfo) => {
    const existing = monthReadings[tenant.id];
    setForm(existing || { hotWater: 0, coldWater: 0, heating: 0, electricity: 0 });
    setDialogTenant(tenant);
  };

  const dialogPrev = dialogTenant ? readings[prevPeriod]?.[dialogTenant.id] : undefined;
  const dialogConsumption = dialogTenant ? calcConsumption(form, dialogPrev) : null;
  const dialogCost = dialogConsumption ? calcUtilityCost(dialogConsumption) : 0;

  const saveReading = () => {
    if (!dialogTenant) return;
    setReading(dialogTenant.id, selectedMonth, form);
    toast({
      title: "Хадгаллаа",
      description: `${dialogTenant.name} — ${selectedMonth}: ашиглалтын төлбөр ${formatMNT(dialogCost)}`,
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
              Хэмжүүрийн уншилт → өмнөх сартай харьцуулан зөрүү бодно
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

      {/* Tariff card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            Нэгж тариф
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2"><Flame className="h-3.5 w-3.5 text-orange-500" /> Халуун ус: <span className="font-medium">{formatMNT(utilityRates.hotWater)}/м³</span></div>
            <div className="flex items-center gap-2"><Droplets className="h-3.5 w-3.5 text-blue-500" /> Хүйтэн ус: <span className="font-medium">{formatMNT(utilityRates.coldWater)}/м³</span></div>
            <div className="flex items-center gap-2"><Thermometer className="h-3.5 w-3.5 text-red-500" /> Халаалт: <span className="font-medium">{formatMNT(utilityRates.heating)}/м³</span></div>
            <div className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-yellow-500" /> Цахилгаан: <span className="font-medium">{formatMNT(utilityRates.electricity)}/kWh</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Totals KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Халуун ус</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totals.hotWater.toFixed(1)} м³</div>
            <p className="text-xs text-muted-foreground mt-1">Сарын зарцуулалт</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Хүйтэн ус</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totals.coldWater.toFixed(1)} м³</div>
            <p className="text-xs text-muted-foreground mt-1">Сарын зарцуулалт</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Халаалт</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totals.heating.toFixed(1)} м³</div>
            <p className="text-xs text-muted-foreground mt-1">Сарын зарцуулалт</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Цахилгаан</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totals.electricity.toFixed(0)} kWh</div>
            <p className="text-xs text-muted-foreground mt-1">Сарын зарцуулалт</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Нийт төлбөр</CardTitle>
            <Calculator className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">{formatMNT(totals.cost)}</div>
            <p className="text-xs text-muted-foreground mt-1">Тариф × зарцуулалт</p>
          </CardContent>
        </Card>
      </div>

      {/* Tenants meter table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Түрээслэгчийн жагсаалт</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Түрээслэгч</TableHead>
                  <TableHead className="hidden lg:table-cell">Объект</TableHead>
                  <TableHead className="text-right">Халуун ус</TableHead>
                  <TableHead className="text-right">Хүйтэн ус</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Халаалт</TableHead>
                  <TableHead className="text-right">Цахилгаан</TableHead>
                  <TableHead className="text-right">Төлбөр</TableHead>
                  <TableHead className="text-center">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantList.map((t) => {
                  const summary = tenantPropertySummary(t);
                  const c = consumptionByTenant[t.id];
                  return (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-muted-foreground lg:hidden">{summary.object}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">{summary.object}</TableCell>
                      <TableCell className="text-right">
                        {c.hasReading ? `${c.usage.hotWater.toFixed(1)} м³` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        {c.hasReading ? `${c.usage.coldWater.toFixed(1)} м³` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {c.hasReading ? `${c.usage.heating.toFixed(1)} м³` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        {c.hasReading ? `${c.usage.electricity.toFixed(0)} kWh` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {c.hasReading ? formatMNT(c.cost) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {canRecord ? (
                          <Button variant="ghost" size="sm" onClick={() => openDialog(t)} className="gap-1">
                            <Plus className="h-3.5 w-3.5" />
                            {c.hasReading ? "Засах" : "Бүртгэх"}
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
          </div>
        </CardContent>
      </Card>

      {/* Reading dialog */}
      <Dialog open={!!dialogTenant} onOpenChange={(open) => !open && setDialogTenant(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Хэмжүүр бүртгэх — {dialogTenant?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {months.find((m) => m.value === selectedMonth)?.label} • Хэмжүүрийн нийт уншилтыг (cumulative) оруулна уу
            </p>

            {dialogPrev && (
              <div className="rounded-md border bg-muted/30 p-3 text-xs space-y-1">
                <div className="font-medium text-foreground">Өмнөх сарын уншилт ({prevPeriod}):</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
                  <span>Халуун ус: {dialogPrev.hotWater} м³</span>
                  <span>Хүйтэн ус: {dialogPrev.coldWater} м³</span>
                  <span>Халаалт: {dialogPrev.heating} м³</span>
                  <span>Цахилгаан: {dialogPrev.electricity} kWh</span>
                </div>
              </div>
            )}
            {!dialogPrev && (
              <div className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                Өмнөх сарын уншилт олдсонгүй — оруулсан утгыг бүхэлд нь зарцуулалт гэж тооцоолно.
              </div>
            )}

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

            {/* Auto-calc preview */}
            {dialogConsumption && (
              <>
                <Separator />
                <div className="rounded-md border bg-primary/5 p-3 space-y-2">
                  <div className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Calculator className="h-3.5 w-3.5 text-primary" />
                    Автомат тооцоолол (зөрүү × тариф)
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span className="text-muted-foreground">Халуун ус: {dialogConsumption.hotWater.toFixed(1)} м³</span>
                    <span className="text-right">{formatMNT(dialogConsumption.hotWater * utilityRates.hotWater)}</span>
                    <span className="text-muted-foreground">Хүйтэн ус: {dialogConsumption.coldWater.toFixed(1)} м³</span>
                    <span className="text-right">{formatMNT(dialogConsumption.coldWater * utilityRates.coldWater)}</span>
                    <span className="text-muted-foreground">Халаалт: {dialogConsumption.heating.toFixed(1)} м³</span>
                    <span className="text-right">{formatMNT(dialogConsumption.heating * utilityRates.heating)}</span>
                    <span className="text-muted-foreground">Цахилгаан: {dialogConsumption.electricity.toFixed(0)} kWh</span>
                    <span className="text-right">{formatMNT(dialogConsumption.electricity * utilityRates.electricity)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Нийт ашиглалтын төлбөр</span>
                    <span className="text-primary">{formatMNT(dialogCost)}</span>
                  </div>
                </div>
              </>
            )}
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
