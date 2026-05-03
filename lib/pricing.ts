export const EXPERIENCE_BRACKETS = [
  { value: "under_3",  label: "3年未満",      premiumHours: 3 },
  { value: "3_5",      label: "3〜5年",       premiumHours: 5 },
  { value: "5_10",     label: "5〜10年",      premiumHours: 8 },
  { value: "10_20",    label: "10〜20年",     premiumHours: 10 },
  { value: "over_20",  label: "20年以上",     premiumHours: 12 },
];

export const INCOME_BRACKETS = [
  { value: "under_400",   label: "〜400万円",        hourlyRate: 3000 },
  { value: "400_600",     label: "400〜600万円",     hourlyRate: 4500 },
  { value: "600_800",     label: "600〜800万円",     hourlyRate: 6000 },
  { value: "800_1000",    label: "800〜1,000万円",   hourlyRate: 7500 },
  { value: "1000_1500",   label: "1,000〜1,500万円", hourlyRate: 10000 },
  { value: "over_1500",   label: "1,500万円〜",      hourlyRate: 15000 },
];

export function calcServicePrice(
  baseHours: number,
  experienceYears: string,
  incomeBracket: string
): { price: number; premiumHours: number; hourlyRate: number } {
  const exp = EXPERIENCE_BRACKETS.find(b => b.value === experienceYears);
  const inc = INCOME_BRACKETS.find(b => b.value === incomeBracket);
  const premiumHours = exp?.premiumHours ?? 5;
  const hourlyRate = inc?.hourlyRate ?? 5000;
  const price = Math.round((baseHours + premiumHours) * hourlyRate / 1000) * 1000;
  return { price, premiumHours, hourlyRate };
}
