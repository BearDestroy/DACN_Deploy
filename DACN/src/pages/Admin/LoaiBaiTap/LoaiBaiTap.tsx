import { useState } from 'react'
import { Trash2, Search } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table'
import { Badge } from 'src/components/ui/badge'
import TooltipTableCell from '@/components/TooltipCell'
import { layDSLoaiBaiTap, xoaLoaiBaiTap } from '@/apis/loaibaitap'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useQueryString } from '@/hooks/use-query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import LoaiBaiTapForm from '@/components/Form/LoaiBaiTapForm'
import type { loaiBaiTapFormData } from '@/validations/loaibaitap.schema'
import { createURLDM, formatDate } from '@/utils/function'
import { DeleteModal } from '@/components/Modal/ModalDelete'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import Loading from '@/components/Loading'
import type { LoaiBaiTap } from '@/@types/LoaiBaiTap.type'
import { CustomRadioGroup } from '@/components/CustomRadioInput'
import { FooterTable } from '@/components/SoLuongHienThi'

export function QuanLyLoaiBaiTap() {
  const navigate = useNavigate()
  const queryString = useQueryString()
  const soTrang = Number(queryString.soTrang || 1)
  const soLuong = Number(queryString.soLuong || 10)
  const trangThai = queryString.trangThai || '0'
  const tuKhoa = queryString.tuKhoa || ''
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['dsLoaiBaiTap', soTrang, soLuong, trangThai, tuKhoa],
    queryFn: () => layDSLoaiBaiTap(soTrang, soLuong, trangThai, tuKhoa)
  })
  const location = useLocation()
  const ketQua = data?.data?.ketQua || []
  const tongSoLuong = data?.data?.tongSoLuong || 0
  const soThuTuBatDau = (soTrang - 1) * soLuong

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    const url = createURLDM(location.pathname, 1, soLuong, trangThai, searchQuery)
    navigate(url)
  }

  const [editingLoaiBaiTap, setEditingLoaiBaiTap] = useState<loaiBaiTapFormData | undefined>(undefined)
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const handleSetEditingLoaiBaiTap = (data: LoaiBaiTap) => {
    setEditingLoaiBaiTap({
      tenLoaiBaiTap: data.tenLoaiBaiTap,
      maLoaiBaiTap: data.maLoaiBaiTap,
      trangThai: data.trangThai
    })
  }

  const handleFormSuccess = () => {
    setSelectedRowId(null)
    setEditingLoaiBaiTap(undefined)
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
    mutationFn: ({ id }: { id: number }) => xoaLoaiBaiTap(id),
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
    <div className='relative min-h-screen w-full bg-gray-50 p-4 flex flex-col'>
      {(isLoading || isDeleting) && <Loading />}
      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full'>
        <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 w-full shadow-sm flex flex-col'>
          <div className='space-y-3'>
            <div className='flex gap-2'>
              <Input
                placeholder='Tìm kiếm theo mã hoặc tên loại bài tập...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className='flex-1 bg-white text-black border border-gray-300 text-sm font-medium rounded-md px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors duration-200'
              />
              <Button
                onClick={handleSearch}
                className='bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium flex items-center gap-2
                 border border-transparent hover:border-orange-400 transition-colors duration-200'
              >
                <Search className='h-4 w-4' /> Tìm kiếm
              </Button>
            </div>
          </div>

          <CustomRadioGroup
            options={[
              { value: '0', label: 'Tất cả' },
              { value: '1', label: 'Hoạt động' },
              { value: '2', label: 'Không hoạt động' }
            ]}
            value={String(trangThai)}
            soTrangHienTai={soTrang}
            soLuongMoiTrang={soLuong}
            tuKhoa={searchQuery}
          />

          <div className='flex-1 rounded-lg flex flex-col mb-3 mt-3 overflow-auto max-h-[550px]'>
            <Table className='min-w-full bg-white border-collapse'>
              <TableHeader>
                <TableRow>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-base text-black'>
                    #
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-base text-black'>
                    Mã loại bài tập
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-base text-black'>
                    Tên loại bài tập
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-base text-black'>
                    Thời gian tạo
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-base text-black'>
                    Trạng thái
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-base text-black'>
                    Thao tác
                  </TableHead>
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
                        handleSetEditingLoaiBaiTap(s)
                        setSelectedRowId(s.id)
                      }}
                    >
                      <TableCell className='text-center border text-base py-0.5 border-gray-200 border-b '>
                        {soThuTuBatDau + i + 1}
                      </TableCell>
                      <TableCell className='text-center border text-base py-0.5 border-gray-200 border-b '>
                        {s.maLoaiBaiTap}
                      </TableCell>
                      <TooltipTableCell text={s.tenLoaiBaiTap} index={i} className='text-base py-3' />
                      <TableCell className='text-center border text-base py-0.5 border-gray-200 border-b '>
                        {formatDate(s.thoiGianTao)}
                      </TableCell>
                      <TableCell className='text-center border text-base py-0.5 border-gray-200 border-b '>
                        <Badge
                          className={
                            s.trangThai ? 'bg-green-100 text-green-700 text-sm' : 'bg-gray-200 text-gray-700 text-sm'
                          }
                        >
                          {s.trangThai ? 'Hoạt động' : 'Không hoạt động'}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-center py-0.5 border-gray-200 border '>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='hover:bg-red-50 hover:text-red-600 transition-colors'
                          onClick={(e) => openDeleteModal(e, s.id)}
                        >
                          <Trash2 className='h-5 w-5' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <FooterTable
            soTrangHienTai={soTrang}
            soLuongMoiTrang={soLuong}
            tongSoLuong={tongSoLuong}
            trangThai={trangThai}
            tuKhoa={searchQuery}
          />
        </div>

        <div className='bg-white rounded-lg border p-6 w-full shadow-sm'>
          <LoaiBaiTapForm
            defaultValues={editingLoaiBaiTap}
            editingId={selectedRowId}
            setSelectRowId={setSelectedRowId}
            onSuccess={handleFormSuccess}
          ></LoaiBaiTapForm>
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
