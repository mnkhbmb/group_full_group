import { useState, useMemo } from "react";
import { Building2, Plus, Search, X } from "lucide-react";
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
  contractNumber: string;
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  objectName: string;
  floor: string;
  areaId: string;
  areaSize: number;
  rentalAmount: number;
  pricePerSqm: number;
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
    contractNumber: "GR-2024-001",
    lastName: "Бат",
    firstName: "Дорж",
    phone: "99112233",
    email: "bat.dorj@mail.mn",
    objectName: "Скай Тауэр",
    floor: "12",
    areaId: "A-1201",
    areaSize: 85,
    rentalAmount: 2550000,
    pricePerSqm: 30000,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    contractNumber: "GR-2024-002",
    lastName: "Болд",
    firstName: "Сүхбат",
    phone: "88001122",
    email: "bold.s@mail.mn",
    objectName: "Блү Мон Тауэр",
    floor: "5",
    areaId: "B-0503",
    areaSize: 120,
    rentalAmount: 4200000,
    pricePerSqm: 35000,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    contractNumber: "GR-2024-003",
    lastName: "Ган",
    firstName: "Тулга",
    phone: "95553344",
    email: "gan.tulga@mail.mn",
    objectName: "Сэнтрал Тауэр",
    floor: "8",
    areaId: "C-0801",
    areaSize: 200,
    rentalAmount: 7000000,
    pricePerSqm: 35000,
    createdAt: "2024-02-20",
  },
  {
    id: "4",
    contractNumber: "GR-2024-004",
    lastName: "Нар",
    firstName: "Мандах",
    phone: "80112233",
    email: "nar.m@mail.mn",
    objectName: "Шангри-Ла Молл",
    floor: "1",
    areaId: "D-0105",
    areaSize: 45,
    rentalAmount: 2250000,
    pricePerSqm: 50000,
    createdAt: "2024-03-10",
  },
  {
    id: "5",
    contractNumber: "GR-2024-005",
    lastName: "Оюун",
    firstName: "Эрдэнэ",
    phone: "99887766",
    email: "oyun.e@mail.mn",
    objectName: "Их Монгол Тауэр",
    floor: "15",
    areaId: "E-1502",
    areaSize: 150,
    rentalAmount: 4500000,
    pricePerSqm: 30000,
    createdAt: "2024-03-25",
  },
];

const emptyForm = {
  contractNumber: "",
  lastName: "",
  firstName: "",
  phone: "",
  email: "",
  objectName: "",
  floor: "",
  areaId: "",
  areaSize: "",
  rentalAmount: "",
  pricePerSqm: "",
};

const formatMNT = (v: number) => v.toLocaleString("mn-MN") + "₮";

const Property = () => {
  const [records, setRecords] = useState<PropertyRecord[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        r.contractNumber.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.firstName.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.objectName.toLowerCase().includes(q) ||
        r.areaId.toLowerCase().includes(q)
    );
  }, [search, records]);

  const handleSubmit = () => {
    if (!form.contractNumber || !form.firstName || !form.objectName) {
      toast({ title: "Алдаа", description: "Заавал бөглөх талбаруудыг бөглөнө үү", variant: "destructive" });
      return;
    }
    const newRecord: PropertyRecord = {
      id: Date.now().toString(),
      contractNumber: form.contractNumber,
      lastName: form.lastName,
      firstName: form.firstName,
      phone: form.phone,
      email: form.email,
      objectName: form.objectName,
      floor: form.floor,
      areaId: form.areaId,
      areaSize: Number(form.areaSize) || 0,
      rentalAmount: Number(form.rentalAmount) || 0,
      pricePerSqm: Number(form.pricePerSqm) || 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setRecords((prev) => [newRecord, ...prev]);
    setForm(emptyForm);
    setDialogOpen(false);
    toast({ title: "Амжилттай", description: "Хөрөнгө амжилттай бүртгэгдлээ" });
  };

  const updateField = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Хөрөнгө</h1>
            <p className="text-sm text-muted-foreground">Нийт {records.length} бүртгэл</p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Шинээр бүртгэх
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Хайлт... (нэр, гэрээ, утас, и-мэйл, объект)"
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

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Бүртгэлийн жагсаалт</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Гэрээний дугаар</TableHead>
                  <TableHead>Овог Нэр</TableHead>
                  <TableHead>Утас</TableHead>
                  <TableHead className="hidden md:table-cell">Объект</TableHead>
                  <TableHead className="hidden lg:table-cell">Давхар</TableHead>
                  <TableHead className="hidden lg:table-cell">Талбай ID</TableHead>
                  <TableHead className="hidden md:table-cell">Хэмжээ</TableHead>
                  <TableHead className="text-right">Түрээсийн дүн</TableHead>
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
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{r.contractNumber}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{r.lastName} {r.firstName}</TableCell>
                      <TableCell>{r.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">{r.objectName}</TableCell>
                      <TableCell className="hidden lg:table-cell">{r.floor}-р давхар</TableCell>
                      <TableCell className="hidden lg:table-cell">{r.areaId}</TableCell>
                      <TableCell className="hidden md:table-cell">{r.areaSize} м²</TableCell>
                      <TableCell className="text-right font-medium">{formatMNT(r.rentalAmount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Registration Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Хөрөнгө шинээр бүртгэх</DialogTitle>
            <DialogDescription>Бүх шаардлагатай мэдээллийг бөглөнө үү</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Гэрээний дугаар *</Label>
              <Input placeholder="GR-2024-006" value={form.contractNumber} onChange={(e) => updateField("contractNumber", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Овог</Label>
              <Input placeholder="Овог" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Нэр *</Label>
              <Input placeholder="Нэр" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Утасны дугаар</Label>
              <Input placeholder="99112233" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>И-мэйл хаяг</Label>
              <Input type="email" placeholder="email@mail.mn" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>
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
              <Label>Талбайн дугаарлалт (ID)</Label>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Болих</Button>
            <Button onClick={handleSubmit}>Бүртгэх</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Property;
