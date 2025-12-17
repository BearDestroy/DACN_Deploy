import * as z from 'zod'

export const theLoaiSchema = z.object({
  maTheLoai: z
    .string()
    .min(4, 'Mã thể loại phải ít nhất 4 ký tự')
    .max(50, 'Mã thể loại không vượt quá 50 ký tự')
    .optional()
    .or(z.literal('')),
  tenTheLoai: z.string().min(1, 'Tên thể loại bắt buộc').max(255, 'Tên thể loại không vượt quá 255 ký tự'),
  trangThai: z.boolean().optional(),
  idDanhMuc: z.number().min(1, 'Thể loại phải thuộc một danh mục')
})

export type theLoaiFormData = z.infer<typeof theLoaiSchema>
