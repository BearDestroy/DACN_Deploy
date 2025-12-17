import { useState } from 'react'
import { Trash2, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FooterNguoiDung } from '@/components/SoLuongHienThi'
import TooltipTableCell from '@/components/TooltipCell'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useQueryString } from '@/hooks/use-query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import { createURLNguoiDung } from '@/utils/function'
import { DeleteModal } from '@/components/Modal/ModalDelete'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import Loading from '@/components/Loading'
import { layDSNguoiDung, xoaNguoiDung } from '@/apis/nguoidung'
import NguoiDungForm from '@/components/Form/NguoiDungForm'

export function QuanLyNguoiDung() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryString = useQueryString()

  const soTrang = Number(queryString.soTrang || 1)
  const soLuong = Number(queryString.soLuong || 10)
  const tuKhoa = queryString.tuKhoa || ''

  const [searchQuery, setSearchQuery] = useState(tuKhoa)
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['dsNguoiDungs', soTrang, soLuong, tuKhoa],
    queryFn: () => layDSNguoiDung(soTrang, soLuong, tuKhoa)
  })

  const ketQua = data?.data?.ketQua || []
  const tongSoLuong = data?.data?.tongSoLuong || 0
  const soThuTuBatDau = (soTrang - 1) * soLuong

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: ({ id }: { id: number }) => xoaNguoiDung(id),
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

  const handleSearch = () => {
    const url = createURLNguoiDung(location.pathname, 1, soLuong, searchQuery)
    navigate(url)
  }

  const handleClear = () => {
    setSearchQuery('')
    setSelectedRowId(null)
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

  const handleConfirmDelete = () => {
    if (idToDelete !== null) {
      deleteMutate({ id: idToDelete })
    }
  }

  return (
    <div className='relative min-h-screen w-full bg-gray-50 p-4 flex flex-col'>
      {(isLoading || isDeleting) && <Loading />}

      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full'>
        <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 w-full shadow-sm flex flex-col'>
          <div className='space-y-2 mb-3'>
            <div className='flex gap-2 items-end'>
              <div className='flex-1'>
                <label className='text-sm font-medium mb-1 text-gray-700 block'>Từ khóa</label>
                <Input
                  placeholder='Tìm kiếm theo tên, email...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className='w-full h-9 bg-white text-black border border-gray-300 text-sm font-medium rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors duration-200'
                />
              </div>

              <div className='w-auto'>
                <Button
                  onClick={handleSearch}
                  className='h-9 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium flex items-center justify-center gap-2 border border-transparent transition-colors duration-200 px-3'
                >
                  <Search className='h-4 w-4' />
                </Button>
              </div>

              <div className='w-auto'>
                <Button
                  onClick={handleClear}
                  className='h-9 bg-gray-200 hover:bg-gray-300 text-black text-sm font-medium flex items-center justify-center rounded-md transition-colors duration-200 px-3'
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className='flex-1 rounded-lg flex flex-col mb-3 overflow-auto max-h-[600px]'>
            <Table className='min-w-full bg-white border-collapse'>
              <TableHeader>
                <TableRow>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black w-12 py-2'>
                    #
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black py-2'>
                    Tên người dùng
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black py-2'>
                    Email
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black py-2'>
                    Nghề nghiệp
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black py-2'>
                    Mục đích
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black w-16 py-2'></TableHead>
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
                      onClick={() => setSelectedRowId(s.id)}
                    >
                      <TableCell className='text-center border text-sm py-2 border-gray-200 border-b'>
                        {soThuTuBatDau + i + 1}
                      </TableCell>
                      <TooltipTableCell text={s.tenNguoiDung ?? ''} index={i} className='text-sm py-2' />
                      <TooltipTableCell text={s.email ?? ''} index={i} className='text-sm py-2' />
                      <TableCell className='text-left border text-sm py-2 border-gray-200 border-b'>
                        {s.tenNgheNghiep ?? ''}
                      </TableCell>
                      <TableCell className='text-left border text-sm py-2 border-gray-200 border-b'>
                        {s.tenMucDich ?? ''}
                      </TableCell>
                      <TableCell className='text-center py-2 border-gray-200 border'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors'
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

          <FooterNguoiDung
            soLuongMoiTrang={soLuong}
            soTrangHienTai={soTrang}
            tongSoLuong={tongSoLuong}
            tuKhoa={searchQuery}
          />
        </div>
        <div className='bg-white rounded-lg border p-3 w-full shadow-sm h-full relative'>
          <NguoiDungForm selectRowId={selectedRowId} setSelectRowId={setSelectedRowId} onSuccess={handleFormSuccess} />
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleConfirmDelete}
        title='Xác nhận xóa'
        description='Bạn có chắc chắn muốn xóa người dùng này không?'
      />
    </div>
  )
}
