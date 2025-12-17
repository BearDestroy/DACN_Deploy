import { useState, useEffect } from 'react'
import { Trash2, Search, X } from 'lucide-react'
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

// --- COMPONENTS ---
import { SelectCustomAPI } from '@/components/Select/SelectCustomAPI'
import { SelectCustomSingle } from '@/components/Select/SelectCustom' // Component bạn gửi
import BaiTapForm from '@/components/Form/BaiTapForm'

// --- APIS ---
import { layDanhSachBaiTap, xoaBaiTap } from '@/apis/baitap' // Nhớ import xoaBaiTap
import { layTatCaKhoaHoc } from '@/apis/loTrinhHoc'
import { layTatCaLoaiBaiTap } from '@/apis/loaibaitap'
import { layTatCaBaiHoc } from '@/apis/khoahoc'

// --- TYPES ---
import type { BaiTap } from '@/@types/BaiTap'
import type { KhoaHocOption } from '@/components/KhoaHocCarousel/KhoaHocCarousel' // Hoặc type tương ứng
import type { BaiHocOption } from '@/@types/KhoaHoc' // Type trả về từ layTatCaBaiHoc
import type { LoaiBaiTap } from '@/@types/LoaiBaiTap.type'

// Mock data cho các danh mục chưa có API (để truyền vào Form)
const MOCK_LOAI_CAUHOI = [
  { id: 1, tenLoaiCauHoi: 'Một đáp án' },
  { id: 2, tenLoaiCauHoi: 'Nhiều đáp án' }
]
const MOCK_DO_KHO = [
  { id: 1, tenDoKho: 'Dễ' },
  { id: 2, tenDoKho: 'Trung bình' },
  { id: 3, tenDoKho: 'Khó' }
]

export function QuanLyBaiTap() {
  const navigate = useNavigate()
  const queryString = useQueryString()
  const location = useLocation()

  // --- STATE ---
  const [tuKhoa, setTuKhoa] = useState<string>(String(queryString.tuKhoa || ''))

  // State Filter (Đã định nghĩa Type cụ thể, không dùng any)
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState<KhoaHocOption | null>(null)
  const [selectedBaiHoc, setSelectedBaiHoc] = useState<BaiHocOption | null>(null)
  const [selectedLoaiBaiTap, setSelectedLoaiBaiTap] = useState<LoaiBaiTap | null>(null)

  // State Modal & Action
  const [selectRowId, setSelectRowId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)

  const { data: resKhoaHoc } = useQuery({
    queryKey: ['tatCaKhoaHoc'],
    queryFn: () => layTatCaKhoaHoc()
  })
  const dsKhoaHoc = resKhoaHoc?.data || []

  const { data: resLoaiBaiTap } = useQuery({
    queryKey: ['tatCaLoaiBaiTap'],
    queryFn: () => layTatCaLoaiBaiTap()
  })
  const dsLoaiBaiTap = resLoaiBaiTap?.data || []

  const { data: resBaiHoc, isFetching: loadingBaiHoc } = useQuery({
    queryKey: ['tatCaBaiHocTheoKhoaHoc', selectedKhoaHoc?.id],
    queryFn: async () => {
      if (!selectedKhoaHoc?.id) return []
      const res = await layTatCaBaiHoc(selectedKhoaHoc.id)
      return res.data || []
    },
    enabled: !!selectedKhoaHoc?.id
  })
  const dsBaiHoc = resBaiHoc || []

  useEffect(() => {
    const urlIdKhoaHoc = Number(queryString.idKhoaHoc)
    const urlIdBaiHoc = Number(queryString.idBaiHoc)
    const urlIdLoaiBaiTap = Number(queryString.idLoaiBaiTap)

    // Sync Khóa học
    if (urlIdKhoaHoc && dsKhoaHoc.length > 0 && !selectedKhoaHoc) {
      const found = dsKhoaHoc.find((x) => x.id === urlIdKhoaHoc)
      if (found) {
        setTimeout(() => {
          setSelectedKhoaHoc(found)
        }, 0)
      }
    }

    // Sync Bài học (Chạy khi dsBaiHoc đã load xong)
    if (urlIdBaiHoc && dsBaiHoc.length > 0 && !selectedBaiHoc) {
      const found = dsBaiHoc.find((x) => x.id === urlIdBaiHoc)
      if (found) {
        setTimeout(() => {
          setSelectedBaiHoc(found)
        }, 0)
      }
    }

    // Sync Loại bài tập
    if (urlIdLoaiBaiTap && dsLoaiBaiTap.length > 0 && !selectedLoaiBaiTap) {
      const found = dsLoaiBaiTap.find((x) => x.id === urlIdLoaiBaiTap)
      if (found) {
        setTimeout(() => {
          setSelectedLoaiBaiTap(found)
        }, 0)
      }
    }
  }, [dsKhoaHoc, dsBaiHoc, dsLoaiBaiTap, queryString, selectedKhoaHoc, selectedBaiHoc, selectedLoaiBaiTap])

  // --- 4. MAIN QUERY (DANH SÁCH BÀI TẬP) ---
  const pageIndex = Number(queryString.soTrang) || 1
  const pageSize = Number(queryString.soLuong) || 10
  const trangThaiFilter = queryString.trangThai ? Number(queryString.trangThai) : 0

  // Điều kiện để fetch bài tập: Phải chọn bài học
  const canFetchBaiTap = !!selectedBaiHoc?.id

  const {
    data,
    refetch,
    isLoading: loadingTable
  } = useQuery({
    queryKey: [
      'dsBaiTap',
      pageIndex,
      pageSize,
      trangThaiFilter,
      queryString.tuKhoa,
      selectedBaiHoc?.id,
      queryString.idLoaiBaiTap
    ],
    queryFn: () =>
      layDanhSachBaiTap(
        pageIndex,
        pageSize,
        trangThaiFilter,
        queryString.tuKhoa ? String(queryString.tuKhoa) : null,
        selectedBaiHoc?.id ? Number(selectedBaiHoc.id) : null,
        queryString.idLoaiBaiTap ? Number(queryString.idLoaiBaiTap) : null
      ),
    enabled: canFetchBaiTap
  })

  const ketQua = data?.data?.ketQua || []
  const tongSoLuong = data?.data?.tongSoLuong || 0
  const updateURL = (newParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams(location.search)
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    params.set('soTrang', '1') // Reset về trang 1 khi filter
    navigate(`${location.pathname}?${params.toString()}`)
  }

  const handleKhoaHocChange = (val: KhoaHocOption | null) => {
    setSelectedKhoaHoc(val)
    setSelectedBaiHoc(null) // Reset bài học
    updateURL({
      idKhoaHoc: val?.id?.toString(),
      idBaiHoc: undefined // Xóa idBaiHoc trên URL
    })
  }

  const handleBaiHocChange = (val: BaiHocOption | null) => {
    setSelectedBaiHoc(val)
    updateURL({ idBaiHoc: val?.id?.toString() })
  }

  const handleLoaiBaiTapChange = (val: LoaiBaiTap | null) => {
    setSelectedLoaiBaiTap(val)
    updateURL({ idLoaiBaiTap: val?.id?.toString() })
  }

  const handleSearch = () => updateURL({ tuKhoa: tuKhoa })

  const handleClear = () => {
    setTuKhoa('')
    setSelectedKhoaHoc(null)
    setSelectedBaiHoc(null)
    setSelectedLoaiBaiTap(null)
    navigate(location.pathname)
  }

  // --- DELETE MUTATION (Đã thêm mới) ---
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => xoaBaiTap(id),
    onSuccess: (res) => {
      // Giả sử API trả về statusCode 200
      if (res?.statusCode === 200) {
        showSuccessToast({ message: 'Xoá bài tập thành công' })
        refetch()
      } else {
        showErrorToast({ message: res?.message || 'Có lỗi xảy ra' })
      }
      setIsModalOpen(false)
      setIdToDelete(null)
    },
    onError: (error: Error) => {
      showErrorToast({ message: error?.message || 'Lỗi máy chủ đã xảy ra' })
      setIsModalOpen(false)
    }
  })

  const handleConfirmDelete = () => {
    if (idToDelete) deleteMutate(idToDelete)
  }

  return (
    <div className='relative min-h-screen w-full bg-gray-50 p-3 flex flex-col'>
      {(loadingTable || isDeleting) && <Loading />}

      <div className='flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 w-full h-[calc(100vh-2rem)]'>
        {/* --- LEFT SIDE: TABLE (Chiếm 7 phần) --- */}
        <div className='lg:col-span-7 bg-white rounded-lg border border-gray-200 p-3 shadow-sm flex flex-col h-full'>
          <div className='space-y-3 mb-3'>
            {/* Hàng 1: Khóa học & Bài học */}
            <div className='grid grid-cols-2 gap-2'>
              <div className='flex flex-col'>
                <label className='text-xs font-bold text-gray-500 mb-1'>1. Chọn Khóa học</label>
                <SelectCustomSingle<KhoaHocOption>
                  items={dsKhoaHoc}
                  selected={selectedKhoaHoc}
                  onChange={handleKhoaHocChange}
                  labelField='tenKhoaHoc'
                  placeholder='-- Chọn khóa học --'
                />
              </div>
              <div className='flex flex-col'>
                <label className='text-xs font-bold text-gray-500 mb-1'>2. Chọn Bài học</label>
                <SelectCustomSingle<BaiHocOption>
                  items={dsBaiHoc}
                  selected={selectedBaiHoc}
                  onChange={handleBaiHocChange}
                  labelField='tenBaiHoc'
                  placeholder={selectedKhoaHoc ? '-- Chọn bài học --' : 'Vui lòng chọn khóa học trước'}
                  loading={loadingBaiHoc}
                  errors={!selectedKhoaHoc}
                  disabled={Boolean(selectedKhoaHoc)}
                />
              </div>
            </div>

            <div className='flex gap-2 items-end'>
              <div className='w-1/3'>
                <SelectCustomSingle<LoaiBaiTap>
                  items={dsLoaiBaiTap}
                  selected={selectedLoaiBaiTap}
                  onChange={handleLoaiBaiTapChange}
                  labelField='tenLoaiBaiTap'
                  placeholder='Loại bài tập'
                />
              </div>
              <div className='flex-1 flex gap-2'>
                <Input
                  placeholder='Tìm mã, tên bài tập...'
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className='bg-white'
                />
                <Button onClick={handleSearch} className='bg-orange-500 hover:bg-orange-600 text-white w-9 h-9 p-0'>
                  <Search className='h-4 w-4' />
                </Button>
                <Button onClick={handleClear} className='bg-gray-200 text-black w-9 h-9 p-0'>
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {!canFetchBaiTap && (
              <div className='text-amber-600 text-xs italic bg-amber-50 p-2 rounded border border-amber-200'>
                * Vui lòng chọn <b>Khóa học</b> và <b>Bài học</b> để xem danh sách bài tập.
              </div>
            )}
          </div>

          {/* Table */}
          <div className='flex-1 overflow-auto border rounded-md'>
            <Table className='min-w-full bg-white table-fixed'>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-[10%] text-center'>#</TableHead>
                  <TableHead className='w-[15%]'>Mã</TableHead>
                  <TableHead className='w-[35%]'>Tên bài tập</TableHead>
                  <TableHead className='w-[15%] text-center'>Số câu</TableHead>
                  <TableHead className='w-[15%] text-center'>Thời gian</TableHead>
                  <TableHead className='w-[10%]'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!canFetchBaiTap ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-10 text-gray-400'>
                      Vui lòng chọn bài học
                    </TableCell>
                  </TableRow>
                ) : ketQua.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center py-8 text-gray-500'>
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  ketQua.map((item: BaiTap, idx: number) => (
                    <TableRow
                      key={item.id}
                      className={`cursor-pointer hover:bg-gray-50 ${selectRowId === item.id ? 'bg-orange-50' : ''}`}
                      onClick={() => setSelectRowId(item.id)}
                    >
                      <TableCell className='text-center'>{(pageIndex - 1) * pageSize + idx + 1}</TableCell>
                      <TableCell className='font-medium'>{item.maBaiTap}</TableCell>
                      <TooltipTableCell text={item.tenBaiTap} index={idx} className='py-2' />
                      <TableCell className='text-center'>{item.soLuongCauHoi}</TableCell>
                      <TableCell className='text-center'>{item.thoiGianLam}p</TableCell>
                      <TableCell className='text-center'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='hover:bg-red-50 hover:text-red-600'
                          onClick={(e) => {
                            e.stopPropagation()
                            setIdToDelete(item.id)
                            setIsModalOpen(true)
                          }}
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
          {/* Pagination Footer here */}
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className='lg:col-span-5 w-full h-full'>
          <BaiTapForm
            selectRowId={selectRowId}
            setSelectRowId={setSelectRowId}
            onSuccess={() => refetch()}
            dsKhoaHoc={dsKhoaHoc}
            dsLoaiBaiTap={dsLoaiBaiTap}
            dsLoaiCauHoi={dsLoaiCauHoi}
            dsLoaiDoKho={dsDoKho}
          />
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleConfirmDelete}
        title='Xác nhận xoá'
        description='Bạn có chắc chắn muốn xoá bài tập này? Hành động này không thể hoàn tác.'
      />
    </div>
  )
}
