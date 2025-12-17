import * as z from 'zod'

export const baiHocSchema = z.object({
  idBaiHoc: z.number().optional().nullable(),
  tenBaiHoc: z.string().min(1, 'Tên bài học bắt buộc').max(255, 'Tên bài học không vượt quá 255 ký tự'),
  taiNguyenUrl: z.string().optional().nullable(),
  taiNguyenFile: z.instanceof(File).nullable(),
  taiLieuKemTheo: z.instanceof(File).nullable(),
  thuTu: z.number().min(0, 'Thứ tự phải lớn hơn hoặc bằng 0'),
  tenTaiLieu: z.string().optional().nullable()
})

export type BaiHocFormData = z.infer<typeof baiHocSchema>
