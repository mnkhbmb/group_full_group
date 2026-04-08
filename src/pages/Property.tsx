import { useState, useMemo } from "react";
import { Building2, Plus, Search, X, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface PropertyRecord {
  id: string;
  objectName: string;
  floor: string;
  areaId: string;
  areaSize: number;
  rentalAmount: number;
  pricePerSqm: number;
  status: "rented" | "vacant";
  createdAt: string;
}

const mainObjects = [
  "Скай Тауэр",
  "Блү Мон Тауэр",
  "Сэнтрал Тауэр",
  "Шангри-Ла Молл",
  "Их Монгол Тауэр",
];

const initialData: PropertyRecord[] = [
  {
    id: "1",
    objectName: "Скай Тауэр",
    floor: "12",
    areaId: "A-1201",
    areaSize: 85,
    rentalAmount: 2550000,
    pricePerSqm: 30000,
    status: "rented",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    objectName: "Блү Мон Тауэр",
    floor: "5",
    areaId: "B-0503",
    areaSize: 120,
    rentalAmount: 4200000,
    pricePerSqm: 35000,
    status: "rented",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    objectName: "Сэнтрал Тауэр",
    floor: "8",
    areaId: "C-0801",
    areaSize: 200,
    rentalAmount: 7000000,
    pricePerSqm: 35000,
    status: "rented",
    createdAt: "2024-02-20",
  },
  {
    id: "4",
    objectName: "Шангри-Ла Молл",
    floor: "1",
    areaId: "D-0105",
    areaSize: 45,
    rentalAmount: 2250000,
    pricePerSqm: 50000,
    status: "vacant",
    createdAt: "2024-03-10",
  },
  {
    id: "5",
    objectName: "Их Монгол Тауэр",
    floor: "15",
    areaId: "E-1502",
    areaSize: 150,
    rentalAmount: 4500000,
    pricePerSqm: 30000,
    status: "rented",
    createdAt: "2024-03-25",
  },
];

const emptyForm = {
  objectName: "",
  floor: "",
  areaId: "",
  areaSize: "",
  rentalAmount: "",
  pricePerSqm: "",
  status: "vacant" as "rented" | "vacant",
};

const formatMNT = (v: number) => v.toLocaleString("mn-MN") + "₮";

const Property = () => {
  const [records, setRecords] = useState<PropertyRecord[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.objectName.toLowerCase().includes(q) ||
        r.areaId.toLowerCase().includes(q) ||
        r.floor.includes(q)
    );
  }, [search, records]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (r: PropertyRecord) => {
    setEditingId(r.id);
    setForm({
      objectName: r.objectName,
      floor: r.floor,
      areaId: r.areaId,
      areaSize: String(r.areaSize),
      rentalAmount: String(r.rentalAmount),
      pricePerSqm: String(r.pricePerSqm),
      status: r.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.objectName || !form.areaId) {
      toast({ title: "Алдаа", description: "Заавал бөглөх талбаруудыг бөглөнө үү", variant: "destructive" });
      return;
    }

    if (editingId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                objectName: form.objectName,
                floor: form.floor,
                areaId: form.areaId,
                areaSize: Number(form.areaSize) || 0,
                rentalAmount: Number(form.rentalAmount) || 0,
                pricePerSqm: Number(form.pricePerSqm) || 0,
                status: form.status,
              }
            : r
        )
      );
      toast({ title: "Амжилттай", description: "Хөрөнгийн мэдээлэл шинэчлэгдлээ" });
    } else {
      const newRecord: PropertyRecord = {
        id: Date.now().toString(),
        objectName: form.objectName,
        floor: form.floor,
        areaId: form.areaId,
        areaSize: Number(form.areaSize) || 0,
        rentalAmount: Number(form.rentalAmount) || 0,
        pricePerSqm: Number(form.pricePerSqm) || 0,
        status: form.status,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRecords((prev) => [newRecord, ...prev]);
      toast({ title: "Амжилттай", description: "Хөрөнгө амжилттай бүртгэгдлээ" });
    }

    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(false);
  };

  const updateField = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Хөрөнгө</h1>
            <p className="text-sm text-muted-foreground">Нийт {records.length} бүртгэл</p>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Шинээр бүртгэх
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Хайлт... (объект, талбай ID, давхар)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Хөрөнгийн жагсаалт</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Объект</TableHead>
                  <TableHead>Давхар</TableHead>
                  <TableHead>Талбай ID</TableHead>
                  <TableHead>Хэмжээ</TableHead>
                  <TableHead>МКВ дүн</TableHead>
                  <TableHead>Түрээсийн дүн</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Илэрц олдсонгүй
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.objectName}</TableCell>
                      <TableCell>{r.floor}-р давхар</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{r.areaId}</Badge>
                      </TableCell>
                      <TableCell>{r.areaSize} м²</TableCell>
                      <TableCell>{formatMNT(r.pricePerSqm)}</TableCell>
                      <TableCell className="font-medium">{formatMNT(r.rentalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "rented" ? "default" : "secondary"}>
                          {r.status === "rented" ? "Түрээслэсэн" : "Сул"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Хөрөнгө засварлах" : "Хөрөнгө шинээр бүртгэх"}</DialogTitle>
            <DialogDescription>Бүх шаардлагатай мэдээллийг бөглөнө үү</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Объект *</Label>
              <Select value={form.objectName} onValueChange={(v) => updateField("objectName", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Объект сонгох" />
                </SelectTrigger>
                <SelectContent>
                  {mainObjects.map((obj) => (
                    <SelectItem key={obj} value={obj}>{obj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Давхар</Label>
              <Input placeholder="12" value={form.floor} onChange={(e) => updateField("floor", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Талбайн дугаарлалт (ID) *</Label>
              <Input placeholder="A-1201" value={form.areaId} onChange={(e) => updateField("areaId", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Талбайн хэмжээ (м²)</Label>
              <Input type="number" placeholder="85" value={form.areaSize} onChange={(e) => updateField("areaSize", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Түрээсийн дүн (₮)</Label>
              <Input type="number" placeholder="2550000" value={form.rentalAmount} onChange={(e) => updateField("rentalAmount", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>МКВ дүн (₮/м²)</Label>
              <Input type="number" placeholder="30000" value={form.pricePerSqm} onChange={(e) => updateField("pricePerSqm", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Төлөв</Label>
              <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rented">Түрээслэсэн</SelectItem>
                  <SelectItem value="vacant">Сул</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Болих</Button>
            <Button onClick={handleSubmit}>{editingId ? "Хадгалах" : "Бүртгэх"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Property;
