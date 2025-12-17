import { useEffect, useState } from 'react'
import { Trash2, Search, ChevronsUpDownIcon, Check } from 'lucide-react'
import { Button } from 'src/components/ui/button'
import { Input } from 'src/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table'
import { Badge } from 'src/components/ui/badge'
import { FooterTableChuDe } from '@/components/SoLuongHienThi'
import TooltipTableCell from '@/components/TooltipCell'
import { layDSChuDe, xoaChuDe } from '@/apis/chude'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useQueryString } from '@/hooks/use-query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import ChuDeForm from '@/components/Form/ChuDeForm'
import type { chuDeFormData } from '@/validations/chude.schema'
import { createURLChuDe, formatDate } from '@/utils/function'
import { DeleteModal } from '@/components/Modal/ModalDelete'
import { showErrorToast, showSuccessToast } from '@/utils/toast'
import Loading from '@/components/Loading'
import type { ChuDe } from '@/@types/ChuDe.type'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { layTatCaTheLoai } from '@/apis/theloai'
import type { TheLoai } from '@/@types/TheLoai.type'
import { CustomRadioGroupChuDe } from '@/components/CustomRadioInput/CustomRadioInputChuDe'

export function QuanLyChuDe() {
  const navigate = useNavigate()
  const queryString = useQueryString()
  const soTrang = Number(queryString.soTrang || 1)
  const soLuong = Number(queryString.soLuong || 10)
  const trangThai = queryString.trangThai || '0'
  const tuKhoa = queryString.tuKhoa || ''
  const idTheLoai = queryString.idTheLoai || ''
  const { data, refetch, isLoading } = useQuery({
    queryKey: ['dsChuDes', soTrang, soLuong, trangThai, tuKhoa, idTheLoai],
    queryFn: () => layDSChuDe(soTrang, soLuong, trangThai, tuKhoa, idTheLoai)
  })

  const location = useLocation()
  const ketQua = data?.data?.ketQua || []
  const tongSoLuong = data?.data?.tongSoLuong || 0
  const soThuTuBatDau = (soTrang - 1) * soLuong

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    const url = createURLChuDe(location.pathname, 1, soLuong, trangThai, searchQuery, idTheLoai)
    navigate(url)
  }

  const [editingChuDe, setEditingChuDe] = useState<chuDeFormData | undefined>(undefined)
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const handleSetEditingChuDe = (data: ChuDe) => {
    setEditingChuDe({
      tenChuDe: data.tenChuDe,
      maChuDe: data.maChuDe,
      trangThai: data.trangThai,
      idTheLoai: data.idTheLoai
    })
  }

  const handleFormSuccess = () => {
    setSelectedRowId(null)
    setEditingChuDe(undefined)
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
    mutationFn: ({ id }: { id: number }) => xoaChuDe(id),
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
  const [selectedTheLoai, setSelectedTheLoai] = useState<TheLoai | null>(null)
  const {
    data: theloais = [],
    isLoading: loadingDM,
    isError
  } = useQuery({
    queryKey: ['theloais'],
    queryFn: async () => {
      const res = await layTatCaTheLoai()
      return res.data || []
    }
  })

  useEffect(() => {
    if (isError) {
      showErrorToast({ message: 'Lỗi khi tải thể loại' })
    }
  }, [isError])

  return (
    <div className='relative min-h-screen w-full bg-gray-50 p-4 flex flex-col'>
      {(isLoading || isDeleting) && <Loading />}
      <div className='flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full'>
        <div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 w-full shadow-sm flex flex-col'>
          <div className='space-y-3'>
            <div className='flex gap-2 items-stretch'>
              <div className='flex-5'>
                <Input
                  placeholder='Tìm kiếm theo mã hoặc tên thể loại...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className='w-full bg-white text-black border border-gray-300 text-sm font-medium rounded-md px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors duration-200'
                />
              </div>

              <div className='flex-1'>
                <Button
                  onClick={handleSearch}
                  className='w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium flex items-center justify-center gap-2
          border border-transparent transition-colors duration-200 px-3'
                >
                  <Search className='h-4 w-4' /> Tìm kiếm
                </Button>
              </div>

              <div className='flex-1'>
                <Button
                  onClick={() => {
                    navigate(location.pathname)
                    setSelectedTheLoai(null)
                  }}
                  className='w-full bg-gray-200 hover:bg-gray-300 text-black text-sm font-medium flex items-center justify-center
          rounded-md transition-colors duration-200 px-3'
                >
                  Xóa trắng
                </Button>
              </div>
            </div>
          </div>

          <div className='flex flex-col md:flex-row gap-4 items-center'>
            <div className='flex-4 flex items-center'>
              <CustomRadioGroupChuDe
                options={[
                  { value: '0', label: 'Tất cả' },
                  { value: '1', label: 'Hoạt động' },
                  { value: '2', label: 'Không hoạt động' }
                ]}
                value={String(trangThai)}
                soTrangHienTai={soTrang}
                soLuongMoiTrang={soLuong}
                tuKhoa={searchQuery}
                idTheLoai={idTheLoai}
              />
            </div>

            <div className='flex-2 flex justify-end'>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-60 justify-between mt-2 rounded-md border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500'
                    disabled={loadingDM}
                  >
                    {loadingDM ? 'Đang tải...' : selectedTheLoai ? selectedTheLoai.tenTheLoai : 'Chọn thể loại'}
                    <ChevronsUpDownIcon className='opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-40 p-0'>
                  <Command>
                    <CommandInput placeholder='Tìm thể loại...' className='h-9' />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy thể loại.</CommandEmpty>
                      <CommandGroup>
                        {theloais.map((tl) => (
                          <CommandItem
                            key={tl.id}
                            value={tl.id.toString()}
                            onSelect={() => {
                              setSelectedTheLoai(tl)
                              setOpen(false)
                              const url = createURLChuDe(location.pathname, 1, soLuong, trangThai, searchQuery, tl.id)
                              navigate(url)
                            }}
                            className={`cursor-pointer ${
                              selectedTheLoai?.id === tl.id ? 'bg-orange-50 text-orange-600' : 'hover:bg-orange-50'
                            }`}
                          >
                            {tl.tenTheLoai}
                            <Check
                              className={`ml-auto text-orange-500 ${
                                selectedTheLoai?.id === tl.id ? 'opacity-100' : 'opacity-0'
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

          <div className='flex-1 rounded-lg flex flex-col mb-3 mt-3 overflow-auto max-h-[550px]'>
            <Table className='min-w-full bg-white border-collapse'>
              <TableHeader>
                <TableRow>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-base text-black'>
                    #
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-base text-black'>
                    Mã thể loại
                  </TableHead>
                  <TableHead className='sticky top-0 bg-gray-200 z-20 text-center font-bold border border-gray-300 text-base text-black'>
                    Tên thể loại
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
                        handleSetEditingChuDe(s)
                        setSelectedRowId(s.id)
                      }}
                    >
                      <TableCell className='text-center border text-base py-0.5 border-gray-200 border-b '>
                        {soThuTuBatDau + i + 1}
                      </TableCell>
                      <TableCell className='text-center border text-base py-0.5 border-gray-200 border-b '>
                        {s.maChuDe}
                      </TableCell>
                      <TooltipTableCell text={s.tenChuDe} index={i} className='text-base py-3' />
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

          <FooterTableChuDe
            soTrangHienTai={soTrang}
            soLuongMoiTrang={soLuong}
            tongSoLuong={tongSoLuong}
            trangThai={trangThai}
            tuKhoa={searchQuery}
            idTheLoai={idTheLoai}
          />
        </div>

        <div className='bg-white rounded-lg border p-6 w-full shadow-sm'>
          <ChuDeForm
            defaultValues={editingChuDe}
            editingId={selectedRowId}
            setSelectRowId={setSelectedRowId}
            onSuccess={handleFormSuccess}
          ></ChuDeForm>
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
