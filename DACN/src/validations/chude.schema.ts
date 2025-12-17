import * as z from 'zod'

export const chuDeSchema = z.object({
  maChuDe: z
    .string()
    .min(4, 'Mã chủ đề phải ít nhất 4 ký tự')
    .max(50, 'Mã chủ đề không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenChuDe: z.string().min(1, 'Tên chủ đề bắt buộc').max(255, 'Tên chủ đề không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional(),
  idTheLoai: z.number().min(1, 'Chủ đề phải thuộc một thể loại')
})

export type chuDeFormData = z.infer<typeof chuDeSchema>
