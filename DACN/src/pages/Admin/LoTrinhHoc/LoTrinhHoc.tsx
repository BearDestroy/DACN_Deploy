import { useState } from 'react'
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
import { layTatCaMucDich } from '@/apis/mucdich'
import { layTatCaNgheNghiep } from '@/apis/nghenghiep'
import { layTatCaTrinhDo } from '@/apis/trinhdo'

import { createURLLoTrinh } from '@/utils/function'
import { SelectCustomAPI } from '@/components/Select/SelectCustomAPI'

import type { NgheNghiep } from '@/@types/NgheNghiep.type'
import type { MucDich } from '@/@types/MucDich.type'
import type { TrinhDo } from '@/@types/TrinhDo.type'
import FooterTableLoTrinh from '@/components/SoLuongHienThi/SoLuongHienThiLoTrinh'
import LoTrinhHocForm from '@/components/Form/LoTrinhHocForm'
import { CustomRadioGroupLoTrinhHoc } from '@/components/CustomRadioInput/CustomRadioLoTrinhHoc'
import { layDSLoTrinhHoc, layTatCaKhoaHoc, xoaLoTrinhHoc } from '@/apis/loTrinhHoc'
import type { QLLoTrinhHocResponse } from '@/@types/LoTrinhHoc'
export function QuanLyLoTrinhHoc() {
  const navigate = useNavigate()
  const queryString = useQueryString()
  const location = useLocation()

  const loTrinhFilter: LoTrinhFilter = {
    tuKhoa: queryString.tuKhoa ? String(queryString.tuKhoa) : undefined,
    soTrang: queryString.soTrang ? Number(queryString.soTrang) : 1,
    soLuong: queryString.soLuong ? Number(queryString.soLuong) : 10,
    trangThai: queryString.trangThai ? Number(queryString.trangThai) : 0,
    idTrinhDo: queryString.idTrinhDo ? Number(queryString.idTrinhDo) : undefined,
    idMucDich: queryString.idMucDich ? Number(queryString.idMucDich) : undefined,
    idNgheNghiep: queryString.idNgheNghiep ? Number(queryString.idNgheNghiep) : undefined
  }

  const [searchQuery, setSearchQuery] = useState(loTrinhFilter.tuKhoa || '')

  const [selectedTrinhDo, setSelectedTrinhDo] = useState<TrinhDo | null>(null)
  const [selectedNgheNghiep, setSelectedNgheNghiep] = useState<NgheNghiep | null>(null)
  const [selectedMucDich, setSelectedMucDich] = useState<MucDich | null>(null)

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<number | null>(null)

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['dsLoTrinhs', loTrinhFilter],
    queryFn: () => layDSLoTrinhHoc(loTrinhFilter)
  })

  const { data: khoaHocs = [] } = useQuery({
    queryKey: ['khoaHocs'],
    queryFn: async () => {
      const res = await layTatCaKhoaHoc()
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
  const { data: trinhDos = [], isLoading: loadingTrinhDo } = useQuery({
    queryKey: ['trinhDos'],
    queryFn: async () => {
      const res = await layTatCaTrinhDo()
      return res.data || []
    }
  })

  const executeSearch = (overrides: Partial<LoTrinhFilter>) => {
    const params: LoTrinhFilter = {
      ...loTrinhFilter,
      soTrang: 1,
      tuKhoa: searchQuery.trim() !== '' ? searchQuery : undefined,
      idTrinhDo: selectedTrinhDo?.id,
      idNgheNghiep: selectedNgheNghiep?.id,
      idMucDich: selectedMucDich?.id,
      ...overrides
    }
    navigate(createURLLoTrinh(location.pathname, params))
  }

  const handleTrinhDoChange = (val: TrinhDo | null) => {
    setSelectedTrinhDo(val)
    executeSearch({ idTrinhDo: val?.id })
  }

  const handleNgheNghiepChange = (val: NgheNghiep | null) => {
    setSelectedNgheNghiep(val)
    executeSearch({ idNgheNghiep: val?.id })
  }

  const handleMucDichChange = (val: MucDich | null) => {
    setSelectedMucDich(val)
    executeSearch({ idMucDich: val?.id })
  }

  // Lấy kết quả từ API response
  const ketQua = data?.data?.ketQua || []
  const tongSoLuong = data?.data?.tongSoLuong || 0
  const soThuTuBatDau = (loTrinhFilter.soTrang! - 1) * loTrinhFilter.soLuong!

  const handleSearch = () => {
    executeSearch({})
  }

  const handleClear = () => {
    setSearchQuery('')
    setSelectedTrinhDo(null)
    setSelectedNgheNghiep(null)
    setSelectedMucDich(null)
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
    mutationFn: ({ id }: { id: number }) => xoaLoTrinhHoc(id),
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
    <div className='relative min-h-screen w-full bg-gray-50 p-3 flex flex-col'>
      {(isLoading || isDeleting) && <Loading />}
      <div className='flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 w-full '>
        <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-3 w-full shadow-sm flex flex-col h-full'>
          <div className='space-y-2'>
            <div className='flex flex-col md:flex-row gap-4 w-full'>
              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium mb-0.5 text-gray-700'>Trình độ</label>
                <SelectCustomAPI<TrinhDo>
                  items={trinhDos}
                  selected={selectedTrinhDo}
                  setSelected={handleTrinhDoChange}
                  loading={loadingTrinhDo}
                  labelField='tenTrinhDo'
                  placeholder='Chọn trình độ'
                  khoaHocFilter={loTrinhFilter}
                />
              </div>
              <div className='flex-1 flex flex-col'>
                <label className='text-sm font-medium mb-0.5 text-gray-700'>Nghề nghiệp</label>
                <SelectCustomAPI<NgheNghiep>
                  items={ngheNghieps}
                  selected={selectedNgheNghiep}
                  setSelected={handleNgheNghiepChange}
                  loading={loadingNgheNghiep}
                  labelField='tenNgheNghiep'
                  placeholder='Chọn nghề nghiệp'
                  khoaHocFilter={loTrinhFilter}
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
                  khoaHocFilter={loTrinhFilter}
                />
              </div>
            </div>

            {/* Hàng bộ lọc 2: Trạng thái và Tìm kiếm */}
            <div className='flex flex-col md:flex-row gap-2 items-end justify-between'>
              <div className='flex flex-col mb-1'>
                <label className='text-sm font-medium mb-2 text-gray-700'>Trạng thái</label>
                <CustomRadioGroupLoTrinhHoc
                  options={[
                    { value: '0', label: 'Hoạt động' },
                    { value: '1', label: 'Ngừng' }
                  ]}
                  loTrinhFilter={loTrinhFilter}
                />
              </div>

              <div className='flex-1 flex gap-2 w-full md:w-auto'>
                <div className='flex-1'>
                  <label className='text-sm font-medium mb-0.5 text-gray-700'>Từ khóa</label>
                  <Input
                    placeholder='Mã lộ trình, tên lộ trình...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className='w-full bg-white shadow-sm'
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className='bg-orange-500 hover:bg-orange-600 text-white self-end w-9 h-9 p-0'
                >
                  <Search className='h-5 w-5' />
                </Button>
                <Button onClick={handleClear} className='bg-gray-200 hover:bg-gray-300 text-black self-end w-9 h-9 p-0'>
                  <X className='h-5 w-5' />
                </Button>
              </div>
            </div>
          </div>
          <div className='flex-1 rounded-lg flex flex-col mt-3 overflow-auto max-h-[500px]'>
            <Table className='min-w-full bg-white border-collapse table-fixed'>
              <TableHeader>
                <TableRow>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black w-[8%]'>
                    #
                  </TableHead>

                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black w-[20%]'>
                    Mã lộ trình
                  </TableHead>

                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black w-[30%]'>
                    Tên lộ trình
                  </TableHead>

                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black w-[15%]'>
                    SL đăng ký
                  </TableHead>

                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black w-[15%]'>
                    SL khóa học
                  </TableHead>

                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-sm text-black w-[9%]'></TableHead>
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
                  ketQua.map((item: QLLoTrinhHocResponse, i: number) => (
                    <TableRow
                      key={item.id}
                      className={`border-b hover:bg-gray-50 cursor-pointer ${
                        selectedRowId === item.id ? 'bg-orange-100' : ''
                      }`}
                      onClick={() => setSelectedRowId(item.id)}
                    >
                      {/* Các ô bên dưới sẽ tự động theo width của Header, chỉ cần thêm 'truncate' nếu muốn cắt chữ dài */}
                      <TableCell className='text-center border text-sm py-1 border-gray-200 border-b truncate'>
                        {soThuTuBatDau + i + 1}
                      </TableCell>

                      <TooltipTableCell text={item.maLoTrinhHoc ?? ''} index={i} className='text-sm py-2' />

                      {/* Component TooltipTableCell thường đã xử lý text dài, nhưng bạn có thể thêm class w-full nếu cần */}
                      <TooltipTableCell text={item.tenLoTrinhHoc ?? ''} index={i} className='text-sm py-2' />

                      <TableCell className='text-right border text-sm py-1 border-gray-200 border-b truncate'>
                        {item.soLuongDangKy}
                      </TableCell>

                      <TableCell className='text-right border text-sm py-1 border-gray-200 border-b truncate'>
                        {item.soLuongKhoaHoc}
                      </TableCell>

                      <TableCell className='text-center py-1 border-gray-200 border'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='hover:bg-red-50 hover:text-red-600 transition-colors'
                          onClick={(e) => openDeleteModal(e, item.id)}
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

          <FooterTableLoTrinh tongSoLuong={tongSoLuong} loTrinhFilter={loTrinhFilter} />
        </div>

        <div className='lg:col-span-2 bg-white rounded-lg border p-2 w-full shadow-sm h-full relative'>
          <LoTrinhHocForm
            selectRowId={selectedRowId}
            setSelectRowId={setSelectedRowId}
            onSuccess={handleFormSuccess}
            mucDich={mucDiches}
            ngheNghiep={ngheNghieps}
            trinhDo={trinhDos}
            loadingMucDich={loadingMucDich}
            loadingNgheNghiep={loadingNgheNghiep}
            loadingTrinhDo={loadingTrinhDo}
            khoaHocs={khoaHocs}
          />
        </div>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onConfirm={handleConfirmDelete}
        title='Xác nhận xóa lộ trình'
        description='Bạn có chắc chắn muốn xóa lộ trình này không?'
      />
    </div>
  )
}
