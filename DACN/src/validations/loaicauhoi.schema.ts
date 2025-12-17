import * as z from 'zod'

export const loaiCauHoiSchema = z.object({
  maLoaiCauHoi: z
    .string()
    .min(4, 'Mã loại câu hỏi phải ít nhất 4 ký tự')
    .max(50, 'Mã loại câu hỏi không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenLoaiCauHoi: z.string().min(1, 'Tên loại câu hỏi bắt buộc').max(255, 'Tên loại câu hỏi không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional()
})

export type loaiCauHoiFormData = z.infer<typeof loaiCauHoiSchema>
