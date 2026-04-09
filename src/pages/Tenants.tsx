import { useState, useMemo } from "react";
import { Users, Plus, Search, X, Pencil, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { propertyData } from "@/data/properties";

interface TenantRecord {
  id: string;
  contractNumber: string;
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  company: string;
  registerNumber: string;
  propertyIds: string[];
  status: "active" | "inactive";
  createdAt: string;
}

const initialData: TenantRecord[] = [
  {
    id: "1",
    contractNumber: "GR-2024-001",
    lastName: "Бат",
    firstName: "Дорж",
    phone: "99112233",
    email: "bat.dorj@mail.mn",
    company: "Бат Дорж ХХК",
    registerNumber: "УБ12345678",
    propertyIds: ["1"],
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    contractNumber: "GR-2024-002",
    lastName: "Болд",
    firstName: "Сүхбат",
    phone: "88001122",
    email: "bold.s@mail.mn",
    company: "Болд Трейд ХХК",
    registerNumber: "УБ87654321",
    propertyIds: ["2", "3"],
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    contractNumber: "GR-2024-003",
    lastName: "Ган",
    firstName: "Тулга",
    phone: "95553344",
    email: "gan.tulga@mail.mn",
    company: "Тулга Групп ХХК",
    registerNumber: "УБ11223344",
    propertyIds: ["3"],
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "4",
    contractNumber: "GR-2024-004",
    lastName: "Нар",
    firstName: "Мандах",
    phone: "80112233",
    email: "nar.m@mail.mn",
    company: "",
    registerNumber: "АА99887766",
    propertyIds: [],
    status: "inactive",
    createdAt: "2024-03-10",
  },
  {
    id: "5",
    contractNumber: "GR-2024-005",
    lastName: "Оюун",
    firstName: "Эрдэнэ",
    phone: "99887766",
    email: "oyun.e@mail.mn",
    company: "Оюун Эрдэнэ ХХК",
    registerNumber: "УБ55667788",
    propertyIds: ["5"],
    status: "active",
    createdAt: "2024-03-25",
  },
];

const emptyForm = {
  contractNumber: "",
  lastName: "",
  firstName: "",
  phone: "",
  email: "",
  company: "",
  registerNumber: "",
};

const Tenants = () => {
  const [records, setRecords] = useState<TenantRecord[]>(initialData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredProperties = useMemo(() => {
    if (!propertySearch.trim()) return propertyData;
    const q = propertySearch.toLowerCase();
    return propertyData.filter(
      (p) =>
        p.objectName.toLowerCase().includes(q) ||
        p.areaId.toLowerCase().includes(q) ||
        p.floor.includes(q)
    );
  }, [propertySearch]);

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
        r.company.toLowerCase().includes(q) ||
        r.registerNumber.toLowerCase().includes(q)
    );
  }, [search, records]);

  const toggleProperty = (propertyId: string) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const getPropertyLabel = (id: string) => {
    const p = propertyData.find((pr) => pr.id === id);
    return p ? `${p.objectName} / ${p.areaId} (${p.floor}-р давхар)` : id;
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedPropertyIds([]);
    setDialogOpen(true);
  };

  const openEdit = (r: TenantRecord) => {
    setEditingId(r.id);
    setForm({
      contractNumber: r.contractNumber,
      lastName: r.lastName,
      firstName: r.firstName,
      phone: r.phone,
      email: r.email,
      company: r.company,
      registerNumber: r.registerNumber,
    });
    setSelectedPropertyIds(r.propertyIds);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.contractNumber || !form.firstName) {
      toast({ title: "Алдаа", description: "Заавал бөглөх талбаруудыг бөглөнө үү", variant: "destructive" });
      return;
    }

    if (editingId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, ...form, propertyIds: selectedPropertyIds }
            : r
        )
      );
      toast({ title: "Амжилттай", description: "Түрээслэгчийн мэдээлэл шинэчлэгдлээ" });
    } else {
      const newRecord: TenantRecord = {
        id: Date.now().toString(),
        ...form,
        propertyIds: selectedPropertyIds,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setRecords((prev) => [newRecord, ...prev]);
      toast({ title: "Амжилттай", description: "Түрээслэгч амжилттай бүртгэгдлээ" });
    }

    setForm(emptyForm);
    setSelectedPropertyIds([]);
    setEditingId(null);
    setDialogOpen(false);
  };

  const updateField = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Түрээслэгч</h1>
            <p className="text-sm text-muted-foreground">Нийт {records.length} түрээслэгч</p>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Шинээр бүртгэх
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Хайлт... (нэр, гэрээ, утас, и-мэйл, компани)"
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
          <CardTitle className="text-base">Түрээслэгчдийн жагсаалт</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Гэрээний дугаар</TableHead>
                  <TableHead>Овог Нэр</TableHead>
                  <TableHead>Утас</TableHead>
                  <TableHead className="hidden md:table-cell">И-мэйл</TableHead>
                  <TableHead className="hidden lg:table-cell">Компани</TableHead>
                  <TableHead className="hidden md:table-cell">Хөрөнгө</TableHead>
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
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{r.contractNumber}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{r.lastName} {r.firstName}</TableCell>
                      <TableCell>{r.phone}</TableCell>
                      <TableCell className="hidden md:table-cell">{r.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">{r.company || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {r.propertyIds.length === 0 ? (
                            <span className="text-muted-foreground text-xs">—</span>
                          ) : (
                            r.propertyIds.map((pid) => {
                              const p = propertyData.find((pr) => pr.id === pid);
                              return (
                                <Badge key={pid} variant="secondary" className="text-xs">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  {p ? p.areaId : pid}
                                </Badge>
                              );
                            })
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.status === "active" ? "default" : "secondary"}>
                          {r.status === "active" ? "Идэвхтэй" : "Идэвхгүй"}
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
            <DialogTitle>{editingId ? "Түрээслэгч засварлах" : "Түрээслэгч шинээр бүртгэх"}</DialogTitle>
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
              <Label>Компанийн нэр</Label>
              <Input placeholder="ХХК нэр" value={form.company} onChange={(e) => updateField("company", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Регистрийн дугаар</Label>
              <Input placeholder="УБ12345678" value={form.registerNumber} onChange={(e) => updateField("registerNumber", e.target.value)} />
            </div>
          </div>

          {/* Property multi-select */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Хөрөнгө сонгох (олон сонголт)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Хөрөнгө хайх... (нэр, дугаар, давхар)"
                value={propertySearch}
                onChange={(e) => setPropertySearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {filteredProperties.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Илэрц олдсонгүй</p>
              ) : (
                filteredProperties.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                  >
                    <Checkbox
                      checked={selectedPropertyIds.includes(p.id)}
                      onCheckedChange={() => toggleProperty(p.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.objectName}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.areaId} · {p.floor}-р давхар · {p.areaSize} м²
                      </p>
                    </div>
                    <Badge variant={p.status === "rented" ? "default" : "secondary"} className="text-xs shrink-0">
                      {p.status === "rented" ? "Түрээслэсэн" : "Сул"}
                    </Badge>
                  </label>
                ))
              )}
            </div>
            {selectedPropertyIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedPropertyIds.length} хөрөнгө сонгогдсон
              </p>
            )}
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

export default Tenants;
