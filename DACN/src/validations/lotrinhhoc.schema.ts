import * as z from 'zod'

export const khoaHocLoTrinhSchema = z.object({
  idKhoaHoc: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return undefined
      return Number(val)
    },
    z
      .number({
        message: 'Vui lòng chọn khóa học'
      })
      .int()
      .min(1, { message: 'Vui lòng chọn khóa học' })
  ),

  idKhoaHocLoTrinh: z.number().optional(),

  thuTu: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === '') return undefined
      return Number(val)
    },
    z
      .number({
        message: 'Thứ tự phải là số'
      })
      .int()
      .min(1, { message: 'Thứ tự phải lớn hơn 0' })
  )
})

export type KhoaHocLoTrinhFormData = z.infer<typeof khoaHocLoTrinhSchema>

export const loTrinhHocSchema = z.object({
  tenLoTrinhHoc: z
    .string()
    .min(1, { message: 'Tên lộ trình bắt buộc' })
    .max(255, { message: 'Tên lộ trình không vượt quá 255 ký tự' }),

  maLoTrinhHoc: z
    .string()
    .max(100, { message: 'Mã lộ trình không vượt quá 100 ký tự' })
    .optional()
    .nullable()
    .or(z.literal('')),

  moTaNgan: z.string().min(1, { message: 'Mô tả ngắn bắt buộc' }),
  noiDungHocDuoc: z.string().min(1, { message: 'Nội dung học được bắt buộc' }),
  idTrinhDo: z.number().int().min(1, { message: 'Trình độ bắt buộc' }),
  idMucDich: z.number().int().min(1, { message: 'Mục đích lộ trình học bắt buộc' }),
  idNgheNghiep: z.number().int().min(1, { message: 'Nghề nghiệp bắt buộc' }),

  trangThai: z.boolean().optional(),

  anhDaiDien: z.string().optional().nullable(),
  anhDaiDienFile: z.any().nullable(),
  danhSachKhoaHoc: z.array(khoaHocLoTrinhSchema).optional()
})

export type LoTrinhHocFormData = z.infer<typeof loTrinhHocSchema>
