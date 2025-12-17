import * as z from 'zod'

export const loaiBaiTapSchema = z.object({
  maLoaiBaiTap: z
    .string()
    .min(4, 'Mã loại bài tập phải ít nhất 4 ký tự')
    .max(50, 'Mã loại bài tập không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenLoaiBaiTap: z.string().min(1, 'Tên loại bài tập bắt buộc').max(255, 'Tên loại bài tập không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional()
})

export type loaiBaiTapFormData = z.infer<typeof loaiBaiTapSchema>
