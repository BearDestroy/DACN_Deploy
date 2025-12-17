import * as z from 'zod'
import { chuongHocSchema } from './chuonghoc.schema'

export const khoaHocSchema = z.object({
  maKhoaHoc: z.string().max(100, 'Mã khóa học không vượt quá 100 ký tự').optional().or(z.literal('')),
  tenKhoaHoc: z.string().min(1, 'Tên khóa học bắt buộc').max(255, 'Tên khóa học không vượt quá 255 ký tự'),
  moTaNgan: z.string().min(1, 'Mô tả ngắ bắt buộc'),
  noiDungHocDuoc: z.string().min(1, 'Nội dung học được bắt buộc'),
  yeuCauKhoaHoc: z.string().optional().nullable(),
  noiDungKhoaHoc: z.string().min(1, 'Nội dung khóa học bắt buộc'),
  doiTuongKhoaHoc: z.string().optional().nullable(),

  idTrinhDo: z.number().int().min(1, 'Trình độ bắt buộc'),
  idGiangVien: z.number().int().min(1, 'Giảng viên bắt buộc'),
  idMucDich: z.number().int().min(1, 'Mục đích khóa học bắt buộc'),
  idNgheNghiep: z.number().int().min(1, 'Nghề nghiệp bắt buộc'),
  idChuDe: z.array(z.number().int()).min(1, 'Chủ đề bắt buộc'),

  anhDaiDien: z.string().optional().nullable(),
  trangThai: z.boolean().optional(),
  anhDaiDienFile: z.instanceof(File).nullable(),
  danhSachChuongHoc: z.array(chuongHocSchema).optional()
})

export type KhoaHocFormData = z.infer<typeof khoaHocSchema>
