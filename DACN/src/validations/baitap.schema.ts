import { z } from 'zod'

export const dapAnSchema = z.object({
  noiDung: z.string().min(1, 'Nội dung đáp án không được để trống'),
  dapAnDung: z.boolean().default(false)
})

export const cauHoiSchema = z.object({
  id: z.number().optional(), // ID dùng khi sửa
  maCauHoi: z.string().optional().nullable(),
  noiDung: z.string().min(1, 'Nội dung câu hỏi không được để trống'),
  idLoaiCauHoi: z.number().min(1, 'Chọn loại câu hỏi'),
  idLoaiDoKho: z.number().min(1, 'Chọn độ khó'),
  listQLDapAn: z.array(dapAnSchema).min(2, 'Cần ít nhất 2 đáp án')
})

export const baiTapSchema = z.object({
  maBaiTap: z.string().optional().nullable(),
  tenBaiTap: z.string().min(1, 'Tên bài tập là bắt buộc'),
  moTa: z.string().optional().nullable(),
  thoiGianLam: z.number().min(1, 'Thời gian làm phải lớn hơn 0'),
  idBaiHoc: z.number().min(1, 'Vui lòng chọn bài học'),
  idLoaiBaiTap: z.number().min(1, 'Vui lòng chọn loại bài tập'),
  trangThai: z.boolean().default(true),
  listCauHoi: z.array(cauHoiSchema).optional().default([])
})

export type BaiTapFormData = z.infer<typeof baiTapSchema>
