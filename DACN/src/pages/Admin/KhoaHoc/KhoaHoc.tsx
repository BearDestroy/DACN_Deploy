import { useState, useMemo } from 'react'
import { Trash2, Search, X, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import TooltipTableCell from '@/components/TooltipCell'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useQueryString } from '@/hooks/use-query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import { DeleteModal } from '@/components/Modal/ModalDelete'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import Loading from '@/components/Loading'
import { xoaBaoCaoKhoaHoc } from '@/apis/baocaokhoahoc'
import { FooterTableKhoaHoc } from '@/components/SoLuongHienThi'
import { createURLKhoaHoc } from '@/utils/function'
import { CustomRadioGroupKhoaHoc } from '@/components/CustomRadioInput'
import type { GiangVien } from '@/@types/GiangVien.type'
import { layTatCaDanhMuc } from '@/apis/danhmuc.api'
import { layTatCaChuDe } from '@/apis/chude'
import { layTatCaTheLoai } from '@/apis/theloai'
import { layTatCaMucDich } from '@/apis/mucdich'
import { layTatCaNgheNghiep } from '@/apis/nghenghiep'
import type { NgheNghiep } from '@/@types/NgheNghiep.type'
import type { MucDich } from '@/@types/MucDich.type'
import type { DanhMuc } from '@/@types/DanhMuc.type'
import type { TheLoai } from '@/@types/TheLoai.type'
import type { ChuDe } from '@/@types/ChuDe.type'
import { layTatCaGiangVien } from '@/apis/giangvien'
import { layDSKhoaHoc } from '@/apis/khoahoc'
import KhoaHocForm from '@/components/Form/KhoaHocForm'
import { SelectCustomAPI } from '@/components/Select/SelectCustomAPI'
import { layTatCaTrinhDo } from '@/apis/trinhdo'

export function QuanLyKhoaHoc() {
  const navigate = useNavigate()
  const queryString = useQueryString()
  const location = useLocation()

  const khoaHocFilter: KhoaHocFilter = {
    tuKhoa: queryString.tuKhoa ? String(queryString.tuKhoa) : undefined,
    soTrang: queryString.soTrang ? Number(queryString.soTrang) : 1,
    soLuong: queryString.soLuong ? Number(queryString.soLuong) : 10,
    trangThai: queryString.trangThai ? Number(queryString.trangThai) : 0,
    idGiangVien: queryString.idGiangVien ? Number(queryString.idGiangVien) : undefined,
    idDanhMuc: queryString.idDanhMuc ? Number(queryString.idDanhMuc) : undefined,
    idChuDe: queryString.idChuDe ? Number(queryString.idChuDe) : undefined,
    idTheLoai: queryString.idTheLoai ? Number(queryString.idTheLoai) : undefined,
    idMucDich: queryString.idMucDich ? Number(queryString.idMucDich) : undefined,
    idNgheNghiep: queryString.idNgheNghiep ? Number(queryString.idNgheNghiep) : undefined
  }

  const [searchQuery, setSearchQuery] = useState(khoaHocFilter.tuKhoa || '')

  const [selectedGiangVien, setSelectedGiangVien] = useState<GiangVien | null>(null)
  const [selectedNgheNghiep, setSelectedNgheNghiep] = useState<NgheNghiep | null>(null)
  const [selectedMucDich, setSelectedMucDich] = useState<MucDich | null>(null)

  const [selectedDanhMuc, setSelectedDanhMuc] = useState<DanhMuc | null>(null)
  const [selectedTheLoai, setSelectedTheLoai] = useState<TheLoai | null>(null)
  const [selectedChuDe, setSelectedChuDe] = useState<ChuDe | null>(null)

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['dsKhoaHocs', khoaHocFilter],
    queryFn: () => layDSKhoaHoc(khoaHocFilter)
  })

  const { data: giangviens = [], isLoading: loadingGiangVien } = useQuery({
    queryKey: ['giangviens'],
    queryFn: async () => {
      const res = await layTatCaGiangVien()
      return res.data || []
    }
  })
  const { data: ngheNghieps = [], isLoading: loadingNgheNghiep } = useQuery({
    queryKey: ['ngheNghieps'],
    queryFn: async () => {
      const res = await layTatCaNgheNghiep()
      return res.data || []
    }
  })
  const { data: mucDiches = [], isLoading: loadingMucDich } = useQuery({
    queryKey: ['mucDiches'],
    queryFn: async () => {
      const res = await layTatCaMucDich()
      return res.data || []
    }
  })
  const { data: theLoais = [], isLoading: loadingTheLoai } = useQuery({
    queryKey: ['theLoais'],
    queryFn: async () => {
      const res = await layTatCaTheLoai()
      return res.data || []
    }
  })
  const { data: chuDes = [], isLoading: loadingChuDe } = useQuery({
    queryKey: ['chuDes'],
    queryFn: async () => {
      const res = await layTatCaChuDe()
      return res.data || []
    }
  })
  const { data: danhMucs = [], isLoading: loadingDanhMuc } = useQuery({
    queryKey: ['danhMucs'],
    queryFn: async () => {
      const res = await layTatCaDanhMuc()
      return res.data || []
    }
  })
  const { data: trinhDos = [], isLoading: loadingTrinhDo } = useQuery({
    queryKey: ['trinhDos'],
    queryFn: async () => {
      const res = await layTatCaTrinhDo()
      return res.data || []
    }
  })

  const executeSearch = (overrides: Partial<KhoaHocFilter>) => {
    const params: KhoaHocFilter = {
      ...khoaHocFilter,
      soTrang: 1,
      tuKhoa: searchQuery.trim() !== '' ? searchQuery : undefined,
      idGiangVien: selectedGiangVien?.id,
      idNgheNghiep: selectedNgheNghiep?.id,
      idMucDich: selectedMucDich?.id,
      idDanhMuc: selectedDanhMuc?.id,
      idTheLoai: selectedTheLoai?.id,
      idChuDe: selectedChuDe?.id,
      ...overrides
    }

    navigate(createURLKhoaHoc(location.pathname, params))
  }

  const filteredTheLoais = useMemo(() => {
    if (!selectedDanhMuc) return theLoais
    return theLoais.filter((item: TheLoai) => item.idDanhMuc === selectedDanhMuc.id)
  }, [selectedDanhMuc, theLoais])

  const filteredChuDes = useMemo(() => {
    if (!selectedTheLoai) return chuDes
    return chuDes.filter((item: ChuDe) => item.idTheLoai === selectedTheLoai.id)
  }, [selectedTheLoai, chuDes])
  const handleGiangVienChange = (val: GiangVien | null) => {
    setSelectedGiangVien(val)
    executeSearch({ idGiangVien: val?.id })
  }

  const handleNgheNghiepChange = (val: NgheNghiep | null) => {
    setSelectedNgheNghiep(val)
    executeSearch({ idNgheNghiep: val?.id })
  }

  const handleMucDichChange = (val: MucDich | null) => {
    setSelectedMucDich(val)
    executeSearch({ idMucDich: val?.id })
  }

  const handleDanhMucChange = (val: DanhMuc | null) => {
    setSelectedDanhMuc(val)
    setSelectedTheLoai(null)
    setSelectedChuDe(null)
    executeSearch({
      idDanhMuc: val?.id,
      idTheLoai: undefined,
      idChuDe: undefined
    })
  }

  const handleTheLoaiChange = (val: TheLoai | null) => {
    setSelectedTheLoai(val)
    setSelectedChuDe(null)
    executeSearch({
      idTheLoai: val?.id,
      idChuDe: undefined
    })
  }

  const handleChuDeChange = (val: ChuDe | null) => {
    setSelectedChuDe(val)
    executeSearch({ idChuDe: val?.id })
  }

  const ketQua = data?.data?.ketQua || []
  const tongSoLuong = data?.data?.tongSoLuong || 0
  const soThuTuBatDau = (khoaHocFilter.soTrang! - 1) * khoaHocFilter.soLuong!

  const handleSearch = () => {
    executeSearch({})
  }

  const handleClear = () => {
    setSearchQuery('')
    setSelectedGiangVien(null)
    setSelectedNgheNghiep(null)
    setSelectedMucDich(null)
    setSelectedDanhMuc(null)
    setSelectedTheLoai(null)
    setSelectedChuDe(null)
    navigate(location.pathname)
  }

  const handleFormSuccess = () => {
    setSelectedRowId(null)
    refetch()
  }

  const openDeleteModal = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setIdToDelete(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIdToDelete(null)
  }

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: ({ id }: { id: number }) => xoaBaoCaoKhoaHoc(id),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        showSuccessToast({ message: data.message })
        handleFormSuccess()
      } else {
        showErrorToast({ message: data.message })
      }
      closeModal()
    },
    onError: () => {
      showErrorToast({ message: 'Lỗi máy chủ' })
      closeModal()
    }
  })

  const handleConfirmDelete = () => {
    if (idToDelete !== null) {
      deleteMutate({ id: idToDelete })
    }
  }

  return (
    <div className='relative min-h-screen w-full bg-gray-50 p-1 flex flex-col'>
      {(isLoading || isDeleting) && <Loading />}
      <div className='flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 w-full'>
        <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-3 w-full shadow-sm flex flex-col'>
          <div className='space-y-2'>
            <div className='flex flex-col md:flex-row gap-4 w-full'>
              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium mb-0.5 text-gray-700'>Giảng viên</label>
                <SelectCustomAPI<GiangVien>
                  items={giangviens}
                  selected={selectedGiangVien}
                  setSelected={handleGiangVienChange}
                  loading={loadingGiangVien}
                  labelField='tenGiangVien'
                  placeholder='Chọn giảng viên'
                  khoaHocFilter={khoaHocFilter}
                />
              </div>
              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium mb-0.5 text-gray-700'>Nghề nghiệp</label>
                <SelectCustomAPI<NgheNghiep>
                  items={ngheNghieps}
                  selected={selectedNgheNghiep}
                  setSelected={handleNgheNghiepChange} // Cập nhật handler
                  loading={loadingNgheNghiep}
                  labelField='tenNgheNghiep'
                  placeholder='Chọn nghề nghiệp'
                  khoaHocFilter={khoaHocFilter}
                />
              </div>
              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium mb-0.5 text-gray-700'>Mục đích</label>
                <SelectCustomAPI<MucDich>
                  items={mucDiches}
                  selected={selectedMucDich}
                  setSelected={handleMucDichChange}
                  loading={loadingMucDich}
                  labelField='tenMucDich'
                  placeholder='Chọn mục đích'
                  khoaHocFilter={khoaHocFilter}
                />
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-2'>
              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium mb-0.5 text-gray-700'>Danh mục</label>
                <SelectCustomAPI<DanhMuc>
                  items={danhMucs}
                  selected={selectedDanhMuc}
                  setSelected={handleDanhMucChange}
                  loading={loadingDanhMuc}
                  labelField='tenDanhMuc'
                  placeholder='Chọn danh mục'
                  khoaHocFilter={khoaHocFilter}
                />
              </div>
              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium mb-0.5 text-gray-700'>Thể loại</label>
                <SelectCustomAPI<TheLoai>
                  items={filteredTheLoais}
                  selected={selectedTheLoai}
                  setSelected={handleTheLoaiChange}
                  labelField='tenTheLoai'
                  loading={loadingTheLoai}
                  placeholder={selectedDanhMuc ? 'Chọn thể loại' : 'Chọn danh mục trước'}
                  khoaHocFilter={khoaHocFilter}
                />
              </div>
              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium mb-0.5 text-gray-700'>Chủ đề</label>
                <SelectCustomAPI<ChuDe>
                  items={filteredChuDes}
                  selected={selectedChuDe}
                  setSelected={handleChuDeChange}
                  labelField='tenChuDe'
                  loading={loadingChuDe}
                  placeholder={selectedTheLoai ? 'Chọn chủ đề' : 'Chọn thể loại trước'}
                  khoaHocFilter={khoaHocFilter}
                />
              </div>
            </div>

            <div className='flex flex-col md:flex-row w-full justify-between gap-1'>
              <div className='flex flex-col mt-2'>
                <CustomRadioGroupKhoaHoc
                  options={[
                    { value: '0', label: 'Hoạt động' },
                    { value: '1', label: 'Ngừng' }
                  ]}
                  khoaHocFilter={khoaHocFilter}
                />
              </div>
              <div className='flex flex-col md:flex-row gap-2 items-stretch flex-1 -ml-1.5'>
                <div className='flex flex-3 flex-col md:flex-row gap-2'>
                  <div className='flex-2 flex flex-col'>
                    <Input
                      placeholder='Tìm kiếm theo mã khóa học, tên khóa học, tên giảng,...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className='w-full bg-white text-black border border-gray-300 text-sm font-medium rounded-md px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors duration-200'
                    />
                  </div>
                </div>

                <div className='md:w-9 w-9 self-end'>
                  <Button
                    onClick={handleSearch}
                    className='w-full h-9 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center
        rounded-md transition-colors duration-200'
                  >
                    <Search className='h-5 w-5' />
                  </Button>
                </div>

                <div className='md:w-9 w-9 self-end'>
                  <Button
                    onClick={handleClear}
                    className='w-full h-9 bg-gray-200 hover:bg-gray-300 text-black flex items-center justify-center
        rounded-md transition-colors duration-200'
                  >
                    <X className='h-5 w-5' />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className='flex-1 rounded-lg flex flex-col mb-3 mt-3 overflow-auto max-h-[550px]'>
            <Table className='min-w-full bg-white border-collapse'>
              <TableHeader>
                <TableRow>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black'>
                    #
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black'>
                    Mã khóa học
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black'>
                    Tên khóa học
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black'>
                    Đánh giá
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black'>
                    Tên giảng viên
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ketQua.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center text-gray-500 py-8 text-base'>
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  ketQua.map((s, i) => (
                    <TableRow
                      key={s.id}
                      className={`border-b hover:bg-gray-50 cursor-pointer ${
                        selectedRowId === s.id ? 'bg-orange-100' : ''
                      }`}
                      onClick={() => {
                        setSelectedRowId(s.id)
                      }}
                    >
                      <TableCell className='text-center border text-sm py-1 border-gray-200 border-b'>
                        {soThuTuBatDau + i + 1}
                      </TableCell>
                      <TableCell className='text-center border text-sm py-1 border-gray-200 border-b'>
                        {s.maKhoaHoc ?? ''}
                      </TableCell>
                      <TooltipTableCell text={s.tenKhoaHoc ?? ''} index={i} className='text-sm py-2' />
                      <TableCell className='text-center border text-sm py-0.5 border-gray-200 border-b'>
                        <div className='flex flex-col items-center justify-center gap-1 h-full text-sm'>
                          <div className='flex items-center gap-1'>
                            <span>{s.danhGiaTrungBinh?.toFixed(1) ?? 0}</span>
                            <Star className='w-3 h-3 text-yellow-400' />
                          </div>
                          <div className='text-gray-500 text-xs'>({s.soLuongDanhGia ?? 0} đánh giá)</div>
                        </div>
                      </TableCell>

                      <TableCell className='text-left border text-sm py-1 border-gray-200 border-b'>
                        {s.tenGiangVien ?? ''}
                      </TableCell>

                      <TableCell className='text-center py-1 border-gray-200 border'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='hover:bg-red-50 hover:text-red-600 transition-colors'
                          onClick={(e) => openDeleteModal(e, s.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <FooterTableKhoaHoc khoaHocFilter={khoaHocFilter} tongSoLuong={tongSoLuong} />
        </div>

        <div className='lg:col-span-2 bg-white rounded-lg border p-2 w-full shadow-sm h-full relative'>
          <KhoaHocForm
            selectRowId={selectedRowId}
            setSelectRowId={setSelectedRowId}
            onSuccess={handleFormSuccess}
            chuDe={chuDes}
            giangVien={giangviens}
            loadingChuDe={loadingChuDe}
            loadingGiangVien={loadingGiangVien}
            loadingMucDich={loadingMucDich}
            loadingNgheNghiep={loadingNgheNghiep}
            loadingTrinhDo={loadingTrinhDo}
            mucDich={mucDiches}
            ngheNghiep={ngheNghieps}
            trinhDo={trinhDos}
          />
        </div>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleConfirmDelete}
        title='Xác nhận xóa'
        description='Bạn có chắc chắn muốn xóa mục này không?'
      />
    </div>
  )
}
