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

import { layDSGiangVien, xoaGiangVien } from '@/apis/giangvien'
import GiangVienForm from '@/components/Form/GiangVienForm'

export function QuanLyGiangVien() {
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
    queryKey: ['dsGiangVien', soTrang, soLuong, tuKhoa],
    queryFn: () => layDSGiangVien(soTrang, soLuong, tuKhoa)
  })

  const ketQua = data?.data?.ketQua || []
  const tongSoLuong = data?.data?.tongSoLuong || 0
  const soThuTuBatDau = (soTrang - 1) * soLuong

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: ({ id }: { id: number }) => xoaGiangVien(id),
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
    <div className='relative min-h-screen w-full bg-gray-50 p-3 flex flex-col'>
      {(isLoading || isDeleting) && <Loading />}

      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 w-full'>
        {/* LEFT: TABLE */}
        <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 w-full shadow-sm flex flex-col'>
          {/* SEARCH BAR */}
          <div className='space-y-2 mb-3'>
            <div className='flex gap-2 items-end'>
              <div className='flex-1'>
                <label className='text-sm font-medium mb-1 text-gray-700 block'>Từ khóa</label>
                <Input
                  placeholder='Tìm kiếm giảng viên...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className='w-full h-9 bg-white text-black border text-sm rounded-md px-3 py-1 focus:ring-2 focus:ring-orange-400'
                />
              </div>

              <Button
                onClick={handleSearch}
                className='h-9 bg-orange-500 hover:bg-orange-600 text-white text-sm flex items-center px-3'
              >
                <Search className='h-4 w-4' />
              </Button>

              <Button onClick={handleClear} className='h-9 bg-gray-200 hover:bg-gray-300 text-black text-sm px-3'>
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
          <div className='flex-1 rounded-lg flex flex-col mb-1 overflow-auto max-h-[580px]'>
            <Table className='min-w-full bg-white border border-gray-200 border-collapse'>
              <TableHeader className='border border-gray-200'>
                <TableRow className='border border-gray-200'>
                  <TableHead className='sticky top-0 bg-gray-200 text-center font-bold text-sm w-12 border border-gray-300 text-black'>
                    #
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 text-center font-bold text-sm border border-gray-300 text-black'>
                    Mã GV
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 text-center font-bold text-sm border border-gray-300 text-black'>
                    Tên giảng viên
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 text-center font-bold text-sm border border-gray-300 text-black'>
                    Email
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 text-center font-bold text-sm border border-gray-300 text-black'>
                    Chuyên môn
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 text-center font-bold text-sm border border-gray-300 text-black'>
                    Học vấn
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 text-center font-bold text-sm w-16 border border-gray-300 text-black'></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {ketQua.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className='text-center text-gray-500 py-8 border border-gray-200'>
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  ketQua.map((gv, i) => (
                    <TableRow
                      key={gv.id}
                      className={`border border-gray-200 hover:bg-gray-50 cursor-pointer ${
                        selectedRowId === gv.id ? 'bg-orange-100' : ''
                      }`}
                      onClick={() => setSelectedRowId(gv.id)}
                    >
                      <TableCell className='text-center border border-gray-200'>{soThuTuBatDau + i + 1}</TableCell>
                      <TableCell className='text-center border border-gray-200'>{gv.maGiangVien}</TableCell>
                      <TooltipTableCell text={gv.tenGiangVien} index={i} />
                      <TooltipTableCell text={gv.email ?? ''} index={i} />
                      <TooltipTableCell text={gv.tenChuyenMon ?? ''} index={i} />
                      <TableCell className='text-center border border-gray-200'>{gv.tenHocVan}</TableCell>
                      <TableCell className='text-center border border-gray-200'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 hover:bg-red-50 hover:text-red-600 transition-colors'
                          onClick={(e) => openDeleteModal(e, gv.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className='mt-2'>
              <FooterNguoiDung
                soLuongMoiTrang={soLuong}
                soTrangHienTai={soTrang}
                tongSoLuong={tongSoLuong}
                tuKhoa={searchQuery}
              />
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border p-3 w-full shadow-sm h-full relative'>
          <GiangVienForm selectRowId={selectedRowId} setSelectRowId={setSelectedRowId} onSuccess={handleFormSuccess} />
        </div>
      </div>

      <DeleteModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleConfirmDelete}
        title='Xác nhận xóa'
        description='Bạn có chắc chắn muốn xóa giảng viên này không?'
      />
    </div>
  )
}
