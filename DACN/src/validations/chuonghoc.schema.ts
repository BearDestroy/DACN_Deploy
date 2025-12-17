import * as z from 'zod'
import { baiHocSchema } from './baihoc.schema'

export const chuongHocSchema = z.object({
  idChuongHoc: z.number().optional().nullable(),
  tenChuongHoc: z.string().min(1, 'Tên chương học bắt buộc').max(255, 'Tên chương học không vượt quá 255 ký tự'),
  thuTu: z.number().min(1, 'Thứ tự phải lớn hơn hoặc bằng 0'),
  danhSachBaiHoc: z.array(baiHocSchema).optional().nullable()
})

export type ChuongHocFormData = z.infer<typeof chuongHocSchema>
