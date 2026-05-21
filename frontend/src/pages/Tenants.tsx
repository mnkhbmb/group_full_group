import { useState, useMemo, useEffect } from "react";
import { Users, Plus, Search, X, Pencil, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { tenantsApi, propertiesApi } from "@/lib/api";

interface TenantRecord {
  _id: string;
  contractNumber: string;
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  company: string;
  registerNumber: string;
  propertyIds: string[];
  status: "active" | "inactive";
}

interface PropertyRecord {
  _id: string;
  objectName: string;
  floor: string;
  areaId: string;
  areaSize: number;
  status: "rented" | "vacant";
}

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
  const [records, setRecords] = useState<TenantRecord[]>([]);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [propertySearch, setPropertySearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const [t, p] = await Promise.all([tenantsApi.getAll(), propertiesApi.getAll()]);
      setRecords(t);
      setProperties(p);
    } catch (err: any) {
      toast({ title: "Алдаа", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filteredProperties = useMemo(() => {
    if (!propertySearch.trim()) return properties;
    const q = propertySearch.toLowerCase();
    return properties.filter(
      (p) =>
        p.objectName.toLowerCase().includes(q) ||
        p.areaId.toLowerCase().includes(q) ||
        p.floor.includes(q)
    );
  }, [propertySearch, properties]);

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

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedPropertyIds([]);
    setDialogOpen(true);
  };

  const openEdit = (r: TenantRecord) => {
    setEditingId(r._id);
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

  const handleSubmit = async () => {
    if (!form.contractNumber || !form.firstName) {
      toast({ title: "Алдаа", description: "Заавал бөглөх талбаруудыг бөглөнө үү", variant: "destructive" });
      return;
    }
    const data = { ...form, propertyIds: selectedPropertyIds, status: "active" as const };
    try {
      if (editingId) {
        await tenantsApi.update(editingId, data);
        toast({ title: "Амжилттай", description: "Шинэчлэгдлээ" });
      } else {
        await tenantsApi.create(data);
        toast({ title: "Амжилттай", description: "Түрээслэгч бүртгэгдлээ" });
      }
      setForm(emptyForm);
      setSelectedPropertyIds([]);
      setEditingId(null);
      setDialogOpen(false);
      load();
    } catch (err: any) {
      toast({ title: "Алдаа", description: err.message, variant: "destructive" });
    }
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Уншиж байна...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Бүртгэл байхгүй байна
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">{r.contractNumber}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{r.lastName} {r.firstName}</TableCell>
                      <TableCell>{r.phone || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell">{r.email || "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell">{r.company || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {r.propertyIds.length === 0 ? (
                            <span className="text-muted-foreground text-xs">—</span>
                          ) : (
                            r.propertyIds.map((pid) => {
                              const p = properties.find((pr) => pr._id === pid);
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
                <p className="text-sm text-muted-foreground text-center py-4">
                  {properties.length === 0 ? "Эхлээд хөрөнгө бүртгэнэ үү" : "Илэрц олдсонгүй"}
                </p>
              ) : (
                filteredProperties.map((p) => (
                  <label
                    key={p._id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                  >
                    <Checkbox
                      checked={selectedPropertyIds.includes(p._id)}
                      onCheckedChange={() => toggleProperty(p._id)}
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
