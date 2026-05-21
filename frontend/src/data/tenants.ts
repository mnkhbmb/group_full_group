/**
 * Түрээслэгч → объект (areaId/property) холболт.
 * Санхүү, ашиглалт, нэхэмжлэлийн автомат тооцоололд ашиглана.
 */
export interface TenantInfo {
  id: string;
  name: string;
  /** Property records-аас сонгосон propertyIds */
  propertyIds: string[];
}

export const tenantList: TenantInfo[] = [
  { id: "T-01", name: "Бат Дорж", propertyIds: ["1"] },
  { id: "T-02", name: "Болд Сүхбат", propertyIds: ["2"] },
  { id: "T-03", name: "Ган Тулга", propertyIds: ["3"] },
  { id: "T-04", name: "Нар Мандах", propertyIds: ["4"] },
  { id: "T-05", name: "Оюун Эрдэнэ", propertyIds: ["5"] },
];

export function findTenantByName(name: string): TenantInfo | undefined {
  return tenantList.find((t) => t.name === name);
}
