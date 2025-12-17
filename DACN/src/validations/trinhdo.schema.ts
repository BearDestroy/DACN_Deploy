import * as z from 'zod'

export const trinhDoSchema = z.object({
  maTrinhDo: z
    .string()
    .min(4, 'Mã trình độ phải ít nhất 4 ký tự')
    .max(50, 'Mã trình độ không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenTrinhDo: z.string().min(1, 'Tên trình độ bắt buộc').max(255, 'Tên trình độ không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional()
})

export type trinhDoFormData = z.infer<typeof trinhDoSchema>
