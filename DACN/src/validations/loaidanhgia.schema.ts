import * as z from 'zod'

export const loaiDanhGiaSchema = z.object({
  maLoaiDanhGia: z
    .string()
    .min(4, 'Mã loại đánh giá phải ít nhất 4 ký tự')
    .max(50, 'Mã loại đánh giá không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenLoaiDanhGia: z
    .string()
    .min(1, 'Tên loại đánh giá bắt buộc')
    .max(255, 'Tên loại đánh giá không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional()
})

export type loaiDanhGiaFormData = z.infer<typeof loaiDanhGiaSchema>
