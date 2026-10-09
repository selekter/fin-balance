import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], {
    error: "กรุณาเลือกประเภทรายการ",
  }),
  title: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อรายการ")
    .max(120, "ชื่อรายการต้องไม่เกิน 120 ตัวอักษร"),
  amount: z
    .string()
    .trim()
    .regex(/^\d+(?:\.\d{1,2})?$/, "กรุณากรอกจำนวนเงินไม่เกิน 2 ตำแหน่ง")
    .refine((value) => {
      const amount = Number(value);
      return Number.isFinite(amount) && amount > 0 && amount <= 9_999_999_999.99;
    }, "จำนวนเงินต้องมากกว่า 0 และไม่เกิน 9,999,999,999.99 บาท"),
  category: z
    .string()
    .trim()
    .min(1, "กรุณาเลือกหมวดหมู่")
    .max(60, "หมวดหมู่ต้องไม่เกิน 60 ตัวอักษร"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "กรุณาเลือกวันที่ให้ถูกต้อง")
    .refine((value) => {
      const parsedDate = new Date(`${value}T00:00:00.000Z`);
      return (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === value
      );
    }, "วันที่ไม่ถูกต้อง"),
});
