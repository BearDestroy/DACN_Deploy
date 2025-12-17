import { useState } from 'react'
import { Trash2, Search, ChevronsUpDownIcon, Check } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table'
import TooltipTableCell from '@/components/TooltipCell'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useQueryString } from '@/hooks/use-query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import { DeleteModal } from '@/components/Modal/ModalDelete'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import Loading from '@/components/Loading'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { layDSBaoCaoKhoaHoc, xoaBaoCaoKhoaHoc } from '@/apis/baocaokhoahoc'
import { FooterTableBaoCaoDG } from '@/components/SoLuongHienThi'
import { createURLBaoCaoDanhGia } from '@/utils/function'
import { CustomRadioInputBaoCaoDG } from '@/components/CustomRadioInput'
import { layTatCaLoaiDanhGia } from '@/apis/loaidanhgia'
import type { LoaiDanhGia } from '@/@types/LoaiDanhGia.type'
import DatePicker from '@/components/Calendar'
import BaoCaoKhoaHocForm from '@/components/Form/BaoCaoKhoaHocForm'
export function QuanLyBaoCaoKhoaHoc() {
  const navigate = useNavigate()
  const queryString = useQueryString()
  const tuKhoa = queryString.tuKhoa || ''
  const soTrang = Number(queryString.soTrang || 1)
  const soLuong = Number(queryString.soLuong || 10)
  const trangThai = queryString.trangThai || '0'
  const ngayBatDauQuery = queryString.ngayBatDau || ''
  const ngayKetThucQuery = queryString.ngayKetThuc || ''
  const idLoaiBaoCao = queryString.idLoaiBaoCao || ''

  const { data, refetch, isLoading } = useQuery({
    queryKey: [
      'dsBaoCaoKhoaHocs',
      soTrang,
      soLuong,
      tuKhoa,
      ngayBatDauQuery,
      ngayKetThucQuery,
      idLoaiBaoCao,
      trangThai
    ],
    queryFn: () =>
      layDSBaoCaoKhoaHoc(soTrang, soLuong, tuKhoa, ngayBatDauQuery, ngayKetThucQuery, idLoaiBaoCao, trangThai)
  })

  const location = useLocation()
  const ketQua = data?.data?.ketQua || []
  const tongSoLuong = data?.data?.tongSoLuong || 0
  const soThuTuBatDau = (soTrang - 1) * soLuong
  const [ngayBatDau, setNgayBatDau] = useState<Date | null>()
  const [ngayKetThuc, setNgayKetThuc] = useState<Date | null>()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    const url = createURLBaoCaoDanhGia(
      location.pathname,
      soTrang,
      soLuong,
      trangThai,
      searchQuery,
      ngayBatDau,
      ngayKetThuc,
      idLoaiBaoCao
    )
    navigate(url)
  }

  const handlePicker1 = (ngayBatDau: Date | null) => {
    if (ngayBatDau === null) {
      return
    }
    const url = createURLBaoCaoDanhGia(
      location.pathname,
      soTrang,
      soLuong,
      trangThai,
      tuKhoa,
      ngayBatDau,
      ngayKetThuc,
      idLoaiBaoCao
    )
    navigate(url)
  }
  const handlePicker2 = (ngayKetThuc: Date | null) => {
    if (ngayKetThuc === null) {
      return
    }
    const url = createURLBaoCaoDanhGia(
      location.pathname,
      soTrang,
      soLuong,
      trangThai,
      tuKhoa,
      ngayBatDau,
      ngayKetThuc,
      idLoaiBaoCao
    )
    navigate(url)
  }
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  const handleFormSuccess = () => {
    setSelectedRowId(null)
    refetch()
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)
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
  const [open, setOpen] = useState(false)
  const [selectedLoaiDanhGia, setSelectedLoaiKhoaHoc] = useState<LoaiDanhGia | null>(null)
  const { data: loaidanhgias = [], isLoading: loadingDM } = useQuery({
    queryKey: ['loaidanhgias'],
    queryFn: async () => {
      const res = await layTatCaLoaiDanhGia()
      return res.data || []
    }
  })

  return (
    <div className='relative min-h-screen w-full bg-gray-50 p-4 flex flex-col'>
      {(isLoading || isDeleting) && <Loading />}
      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full'>
        <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 w-full shadow-sm flex flex-col'>
          <div className='space-y-3'>
            <div className='flex flex-col md:flex-row gap-4 w-full'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1 flex flex-col'>
                  <label className='text-sm font-medium mb-1 text-gray-700'>Ngày bắt đầu</label>
                  <DatePicker
                    value={ngayBatDau ? new Date(ngayBatDau) : null}
                    maxDate={ngayKetThuc ? new Date(ngayKetThuc) : null}
                    onChange={(date) => {
                      setNgayBatDau(date)
                      if (ngayKetThuc && date && date > ngayKetThuc) {
                        setNgayKetThuc(null)
                      }
                    }}
                    onSubmit={handlePicker1}
                  />
                </div>

                <div className='flex-1 flex flex-col'>
                  <label className='text-sm font-medium mb-1 text-gray-700'>Ngày kết thúc</label>
                  <DatePicker
                    value={ngayKetThuc ? new Date(ngayKetThuc) : null}
                    minDate={ngayBatDau ? new Date(ngayBatDau) : null}
                    onChange={(date) => setNgayKetThuc(date)}
                    onSubmit={handlePicker2}
                  />
                </div>
              </div>

              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium mb-0.5 text-gray-700'>Loại đánh giá</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      aria-expanded={open}
                      className='w-full justify-between rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500'
                      disabled={loadingDM}
                    >
                      {loadingDM
                        ? 'Đang tải...'
                        : selectedLoaiDanhGia
                          ? selectedLoaiDanhGia.tenLoaiDanhGia
                          : 'Chọn loại đánh giá'}
                      <ChevronsUpDownIcon className='opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-70 p-0'>
                    <Command>
                      <CommandInput placeholder='Tìm loại đánh giá...' className='h-9' />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy loại đánh giá.</CommandEmpty>
                        <CommandGroup>
                          {loaidanhgias.map((tl) => (
                            <CommandItem
                              key={tl.id}
                              value={tl.id.toString()}
                              onSelect={() => {
                                setSelectedLoaiKhoaHoc(tl)
                                setOpen(false)
                                const url = createURLBaoCaoDanhGia(
                                  location.pathname,
                                  soTrang,
                                  soLuong,
                                  trangThai,
                                  tuKhoa,
                                  null,
                                  null,
                                  tl.id
                                )
                                navigate(url)
                              }}
                              className={`cursor-pointer ${
                                selectedLoaiDanhGia?.id === tl.id
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'hover:bg-orange-50'
                              }`}
                            >
                              {tl.tenLoaiDanhGia}
                              <Check
                                className={`ml-auto text-orange-500 ${
                                  selectedLoaiDanhGia?.id === tl.id ? 'opacity-100' : 'opacity-0'
                                }`}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-2 items-stretch'>
              <div className='flex-2'>
                <Input
                  placeholder='Tìm kiếm theo tên người báo cáo, tên người đánh giá...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className='w-full bg-white text-black border border-gray-300 text-sm font-medium rounded-md px-3 py-2
        focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors duration-200'
                />
              </div>

              <div className='flex-0.5'>
                <Button
                  onClick={handleSearch}
                  className='w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium flex items-center justify-center gap-2
        border border-transparent transition-colors duration-200 px-3'
                >
                  <Search className='h-4 w-4' /> Tìm kiếm
                </Button>
              </div>
              <div className='flex-0.5'>
                <Button
                  onClick={() => {
                    navigate(location.pathname)
                    setTimeout(() => {
                      setSearchQuery('')
                      setNgayBatDau(null)
                      setNgayKetThuc(null)
                      setSelectedLoaiKhoaHoc(null)
                    }, 0)
                  }}
                  className='w-full bg-gray-200 hover:bg-gray-300 text-black text-sm font-medium flex items-center justify-center
        rounded-md transition-colors duration-200 px-3'
                >
                  Xóa trắng
                </Button>
              </div>
              {/* Radio */}
              <div className='flex-2 flex items-center'>
                <CustomRadioInputBaoCaoDG
                  options={[
                    { value: '0', label: 'Chưa duyệt' },
                    { value: '1', label: 'Đã duyệt' }
                  ]}
                  value={String(trangThai)}
                  soTrangHienTai={soTrang}
                  soLuongMoiTrang={soLuong}
                  tuKhoa={searchQuery}
                  idLoaiBaoCao={idLoaiBaoCao}
                  ngayBatDau={ngayBatDau}
                  ngayKetThuc={ngayKetThuc}
                />
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
                    Tên người báo cáo
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black'>
                    Nội dung báo cáo
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black'>
                    Mã khóa học
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black'>
                    Tên khóa học
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
                    <TableCell colSpan={7} className='text-center text-gray-500 py-8 text-base'>
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
                        {s.tenNguoiBaoCaoKhoaHoc ?? ''}
                      </TableCell>
                      <TooltipTableCell text={s.noiDungBaoCao ?? ''} index={i} className='text-sm py-2' />
                      <TableCell className='text-center border text-sm py-1 border-gray-200 border-b'>
                        {s.maKhoaHoc}
                      </TableCell>
                      <TooltipTableCell text={s.tenKhoaHoc ?? ''} index={i} className='text-sm py-2' />
                      <TableCell className='text-center border text-sm py-1 border-gray-200 border-b'>
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

          <FooterTableBaoCaoDG
            soTrangHienTai={soTrang}
            soLuongMoiTrang={soLuong}
            tongSoLuong={tongSoLuong}
            trangThai={trangThai}
            tuKhoa={searchQuery}
            idLoaiBaoCao={idLoaiBaoCao}
            ngayBatDau={ngayBatDau}
            ngayKetThuc={ngayKetThuc}
          />
        </div>

        <div className='bg-white rounded-lg border p-2 w-full shadow-sm h-full relative '>
          <BaoCaoKhoaHocForm
            selectRowId={selectedRowId}
            setSelectRowId={setSelectedRowId}
            onSuccess={handleFormSuccess}
            loaiDanhGia={loaidanhgias}
            loadingDM={loadingDM}
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
