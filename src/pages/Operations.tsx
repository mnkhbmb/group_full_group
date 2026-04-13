import { useState } from "react";
import {
  Wrench,
  Zap,
  Thermometer,
  Droplets,
  Wind,
  Flame,
  Cable,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Gauge,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// Energy consumption data (monthly kWh)
const energyData = [
  { month: "1-р сар", electricity: 45200, heating: 32100, water: 8500 },
  { month: "2-р сар", electricity: 43800, heating: 35600, water: 8200 },
  { month: "3-р сар", electricity: 41500, heating: 28900, water: 8800 },
  { month: "4-р сар", electricity: 39200, heating: 18500, water: 9100 },
  { month: "5-р сар", electricity: 38100, heating: 8200, water: 9500 },
  { month: "6-р сар", electricity: 42300, heating: 0, water: 10200 },
];

// Temperature & humidity data (daily averages)
const tempHumidityData = [
  { date: "04/01", temp: 21.5, humidity: 45 },
  { date: "04/02", temp: 22.0, humidity: 43 },
  { date: "04/03", temp: 21.8, humidity: 47 },
  { date: "04/04", temp: 22.3, humidity: 42 },
  { date: "04/05", temp: 21.2, humidity: 48 },
  { date: "04/06", temp: 22.1, humidity: 44 },
  { date: "04/07", temp: 21.7, humidity: 46 },
  { date: "04/08", temp: 22.5, humidity: 41 },
  { date: "04/09", temp: 21.9, humidity: 45 },
  { date: "04/10", temp: 22.2, humidity: 43 },
];

// Smoke detection events
const smokeEvents = [
  { id: "SM-001", location: "3-р давхар, Зүүн жигүүр", date: "2024-04-08 14:23", severity: "warning" as const, resolved: true },
  { id: "SM-002", location: "B1 давхар, Паркинг", date: "2024-04-05 09:15", severity: "critical" as const, resolved: true },
  { id: "SM-003", location: "7-р давхар, Серверийн өрөө", date: "2024-04-03 22:41", severity: "warning" as const, resolved: true },
  { id: "SM-004", location: "1-р давхар, Лобби", date: "2024-03-28 16:55", severity: "info" as const, resolved: true },
  { id: "SM-005", location: "5-р давхар, Гал тогоо", date: "2024-03-25 12:30", severity: "critical" as const, resolved: true },
];

// Electrical panel cable heating data
const cableHeatData = [
  { panel: "Үндсэн самбар A", maxTemp: 42, avgTemp: 38, status: "normal" as const, lastCheck: "2024-04-10" },
  { panel: "Үндсэн самбар B", maxTemp: 55, avgTemp: 48, status: "warning" as const, lastCheck: "2024-04-10" },
  { panel: "Давхрын самбар 1-3", maxTemp: 35, avgTemp: 32, status: "normal" as const, lastCheck: "2024-04-09" },
  { panel: "Давхрын самбар 4-6", maxTemp: 38, avgTemp: 34, status: "normal" as const, lastCheck: "2024-04-09" },
  { panel: "Давхрын самбар 7-9", maxTemp: 61, avgTemp: 52, status: "critical" as const, lastCheck: "2024-04-08" },
  { panel: "Нөөц генератор самбар", maxTemp: 44, avgTemp: 40, status: "normal" as const, lastCheck: "2024-04-10" },
];

// Water pressure monitoring
const waterPressureData = [
  { zone: "А блок", pressure: 3.2, standard: 3.0, status: "normal" as const },
  { zone: "Б блок", pressure: 2.8, standard: 3.0, status: "warning" as const },
  { zone: "Паркинг", pressure: 3.1, standard: 3.0, status: "normal" as const },
  { zone: "Дээвэр", pressure: 2.5, standard: 3.0, status: "warning" as const },
];

// Elevator status
const elevatorData = [
  { id: "Лифт #1", floor: 5, status: "running" as const, lastMaintenance: "2024-03-15", nextMaintenance: "2024-06-15" },
  { id: "Лифт #2", floor: 1, status: "idle" as const, lastMaintenance: "2024-03-20", nextMaintenance: "2024-06-20" },
  { id: "Лифт #3", floor: 8, status: "maintenance" as const, lastMaintenance: "2024-04-10", nextMaintenance: "2024-07-10" },
];

// HVAC status
const hvacData = [
  { zone: "1-3 давхар", mode: "Хөргөлт", setTemp: 22, currentTemp: 23.1, status: "running" as const },
  { zone: "4-6 давхар", mode: "Хөргөлт", setTemp: 22, currentTemp: 22.4, status: "running" as const },
  { zone: "7-9 давхар", mode: "Автомат", setTemp: 22, currentTemp: 21.8, status: "idle" as const },
  { zone: "Паркинг", mode: "Агааржуулалт", setTemp: 0, currentTemp: 18.5, status: "running" as const },
];

const Operations = () => {
  const [energyOpen, setEnergyOpen] = useState(true);
  const [tempOpen, setTempOpen] = useState(true);
  const [smokeOpen, setSmokeOpen] = useState(true);
  const [cableOpen, setCableOpen] = useState(true);
  const [waterOpen, setWaterOpen] = useState(true);
  const [elevatorOpen, setElevatorOpen] = useState(false);
  const [hvacOpen, setHvacOpen] = useState(false);

  const totalSmokeEvents = smokeEvents.length;
  const criticalCableCount = cableHeatData.filter((c) => c.status === "critical").length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Wrench className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ашиглалтын дашбоард</h1>
          <p className="text-sm text-muted-foreground">Барилгын инженерийн системүүдийн хяналт</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Цахилгаан хэрэглээ</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">42,300 kWh</div>
            <p className="text-xs text-muted-foreground mt-1">Энэ сарын</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingDown className="h-3 w-3" /> -3.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Дундаж температур</CardTitle>
            <Thermometer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">22.1°C</div>
            <p className="text-xs text-muted-foreground mt-1">Норм: 20-24°C</p>
            <p className="text-xs text-green-600 mt-1">Хэвийн</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Дундаж чийгшил</CardTitle>
            <Droplets className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">44.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Норм: 40-60%</p>
            <p className="text-xs text-green-600 mt-1">Хэвийн</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Утаа мэдрэгч</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{totalSmokeEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Нийт дохиолол</p>
            <p className="text-xs text-green-600 mt-1">Бүгд шийдвэрлэгдсэн</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Кабелийн халалт</CardTitle>
            <Cable className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${criticalCableCount > 0 ? "text-destructive" : ""}`}>
              {criticalCableCount} анхааруулга
            </div>
            <p className="text-xs text-muted-foreground mt-1">{cableHeatData.length} самбар хянагдаж байна</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Усны даралт</CardTitle>
            <Gauge className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">3.0 бар</div>
            <p className="text-xs text-muted-foreground mt-1">Дундаж</p>
            <p className="text-xs text-orange-500 mt-1">{waterPressureData.filter(w => w.status === "warning").length} бүсэд анхаарал</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {/* Energy Consumption */}
        <Collapsible open={energyOpen} onOpenChange={setEnergyOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Эрчим хүчний хэрэглээ
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {energyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={energyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="electricity" name="Цахилгаан (kWh)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="heating" name="Халаалт (kWh)" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="water" name="Ус (м³)" fill="hsl(210 100% 50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Temperature & Humidity */}
        <Collapsible open={tempOpen} onOpenChange={setTempOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    Дундаж температур & чийгшил
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {tempOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tempHumidityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis yAxisId="temp" domain={[18, 26]} className="text-xs" />
                      <YAxis yAxisId="humidity" orientation="right" domain={[30, 60]} className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="temp" type="monotone" dataKey="temp" name="Температур (°C)" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={{ r: 3 }} />
                      <Line yAxisId="humidity" type="monotone" dataKey="humidity" name="Чийгшил (%)" stroke="hsl(210 100% 50%)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Smoke Detection */}
        <Collapsible open={smokeOpen} onOpenChange={setSmokeOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Утаа мэдрэгчийн дохиолол
                    <Badge variant="outline" className="text-xs">{smokeEvents.length}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {smokeOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                      <TableHead>Байршил</TableHead>
                      <TableHead>Огноо/Цаг</TableHead>
                      <TableHead className="text-center">Зэрэглэл</TableHead>
                      <TableHead className="text-center">Төлөв</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {smokeEvents.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell><Badge variant="outline" className="font-mono text-xs">{e.id}</Badge></TableCell>
                        <TableCell className="font-medium">{e.location}</TableCell>
                        <TableCell className="text-muted-foreground">{e.date}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={e.severity === "critical" ? "destructive" : e.severity === "warning" ? "secondary" : "outline"} className="text-xs">
                            {e.severity === "critical" ? "Шуурхай" : e.severity === "warning" ? "Анхааруулга" : "Мэдээлэл"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" /> Шийдвэрлэсэн
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

        {/* Cable Heating */}
        <Collapsible open={cableOpen} onOpenChange={setCableOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Cable className="h-4 w-4 text-destructive" />
                    Цахилгааны самбарын кабелийн халалт
                    {criticalCableCount > 0 && <Badge variant="destructive" className="text-xs">{criticalCableCount} анхааруулга</Badge>}
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {cableOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Самбар</TableHead>
                      <TableHead className="text-right">Дээд °C</TableHead>
                      <TableHead className="text-right">Дундаж °C</TableHead>
                      <TableHead className="text-center">Төлөв</TableHead>
                      <TableHead>Шалгасан огноо</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cableHeatData.map((c) => (
                      <TableRow key={c.panel}>
                        <TableCell className="font-medium">{c.panel}</TableCell>
                        <TableCell className={`text-right font-medium ${c.status === "critical" ? "text-destructive" : c.status === "warning" ? "text-orange-500" : ""}`}>
                          {c.maxTemp}°C
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{c.avgTemp}°C</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={c.status === "critical" ? "destructive" : c.status === "warning" ? "secondary" : "outline"} className="text-xs">
                            {c.status === "critical" ? "Аюултай" : c.status === "warning" ? "Анхааруулга" : "Хэвийн"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{c.lastCheck}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Water Pressure */}
        <Collapsible open={waterOpen} onOpenChange={setWaterOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    Усны даралтын хяналт
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {waterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {waterPressureData.map((w) => (
                    <Card key={w.zone} className="border">
                      <CardContent className="p-4 text-center">
                        <p className="text-sm font-medium">{w.zone}</p>
                        <p className={`text-2xl font-bold mt-2 ${w.status === "warning" ? "text-orange-500" : "text-green-600"}`}>
                          {w.pressure} бар
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Норм: {w.standard} бар</p>
                        <Progress value={(w.pressure / w.standard) * 100} className="h-2 mt-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Elevator Status */}
        <Collapsible open={elevatorOpen} onOpenChange={setElevatorOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Лифтний төлөв
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {elevatorOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Лифт</TableHead>
                      <TableHead className="text-center">Давхар</TableHead>
                      <TableHead className="text-center">Төлөв</TableHead>
                      <TableHead>Сүүлийн засвар</TableHead>
                      <TableHead>Дараагийн засвар</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {elevatorData.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-medium">{e.id}</TableCell>
                        <TableCell className="text-center font-bold">{e.floor}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={e.status === "running" ? "default" : e.status === "maintenance" ? "destructive" : "secondary"} className="text-xs">
                            {e.status === "running" ? "Ажиллаж байна" : e.status === "maintenance" ? "Засвар" : "Зогссон"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{e.lastMaintenance}</TableCell>
                        <TableCell className="text-muted-foreground">{e.nextMaintenance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* HVAC */}
        <Collapsible open={hvacOpen} onOpenChange={setHvacOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wind className="h-4 w-4 text-primary" />
                    HVAC / Агааржуулалт
                  </CardTitle>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {hvacOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Бүс</TableHead>
                      <TableHead>Горим</TableHead>
                      <TableHead className="text-right">Тохируулга °C</TableHead>
                      <TableHead className="text-right">Одоо °C</TableHead>
                      <TableHead className="text-center">Төлөв</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hvacData.map((h) => (
                      <TableRow key={h.zone}>
                        <TableCell className="font-medium">{h.zone}</TableCell>
                        <TableCell className="text-muted-foreground">{h.mode}</TableCell>
                        <TableCell className="text-right">{h.setTemp > 0 ? `${h.setTemp}°C` : "—"}</TableCell>
                        <TableCell className="text-right font-medium">{h.currentTemp}°C</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={h.status === "running" ? "default" : "secondary"} className="text-xs">
                            {h.status === "running" ? "Ажиллаж байна" : "Зогссон"}
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
      </div>
    </div>
  );
};

export default Operations;
