import { z } from 'zod'

// Schema gửi lên API
export const danhGiaSchema = z.object({
  idKhoaHoc: z.number().min(1, { message: 'ID khóa học không hợp lệ' }),
  soDiemDanhGia: z
    .number()
    .min(1, { message: 'Điểm đánh giá phải từ 1' })
    .max(5, { message: 'Điểm đánh giá tối đa là 5' }),
  noiDungDanhGia: z.string().min(5, { message: 'Nhận xét quá ngắn' }).max(500, { message: 'Nhận xét quá dài' })
})

export type DanhGiaRequest = z.infer<typeof danhGiaSchema>
