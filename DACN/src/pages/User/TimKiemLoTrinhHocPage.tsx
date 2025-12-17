import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Filter, X, Search, BookOpen } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination'

import { layLoTrinhSearch, type LoTrinhSearchParams } from '@/apis/loTrinhHoc'
import type { LoTrinhHoc } from '@/@types/LoTrinhHoc'
import { LoTrinhHocCard } from '@/components/LoTrinhHocCard'

const BRAND_BG = 'bg-[#FF5722] hover:bg-[#E64A19] text-white border-transparent'
const BRAND_TEXT = 'text-[#FF5722]'
const BG_PAGE = 'bg-[#F7F9FA]'

const getVisiblePages = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

function CourseCardSkeleton() {
  return (
    <div className='flex flex-col space-y-3'>
      <Skeleton className='h-[180px] w-full rounded-xl' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[90%]' />
        <Skeleton className='h-4 w-[70%]' />
        <div className='flex items-center justify-between pt-2'>
          <Skeleton className='h-4 w-[30%]' />
          <Skeleton className='h-8 w-[20%]' />
        </div>
      </div>
    </div>
  )
}

export function TrangTimKiemLoTrinhHoc() {
  const [thamSoTimKiem, setThamSoTimKiem] = useSearchParams()

  const tuKhoa = thamSoTimKiem.get('tuKhoa') || ''
  const danhMuc = thamSoTimKiem.get('idDanhMuc') || ''
  const trangHienTai = Number(thamSoTimKiem.get('soTrang')) || 1
  const kichThuocTrang = Number(thamSoTimKiem.get('soLuong')) || 12
  const trinhDoUrl = thamSoTimKiem.get('trinhDo') || 'tat-ca'

  const [sapXep, setSapXep] = useState('pho-bien')
  const [trinhDoLoc, setTrinhDoLoc] = useState(trinhDoUrl)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setTrinhDoLoc(trinhDoUrl)
  }, [trinhDoUrl])

  const thamSoApi: LoTrinhSearchParams = {
    tuKhoa: tuKhoa || undefined,
    idDanhMuc: danhMuc ? Number(danhMuc) : undefined,
    sapXepTheo: (() => {
      switch (sapXep) {
        case 'danh-gia-cao':
          return 2
        case 'moi-nhat':
          return 3
        default:
          return 1
      }
    })(),
    idTrinhDo: trinhDoLoc !== 'tat-ca' ? Number(trinhDoLoc) : undefined,
    soTrang: trangHienTai,
    soLuong: kichThuocTrang
  }

  const { data, isLoading } = useQuery({
    queryKey: ['loTrinhTimKiem', tuKhoa, danhMuc, trangHienTai, kichThuocTrang, sapXep, trinhDoLoc],
    queryFn: () => layLoTrinhSearch(thamSoApi),
    placeholderData: (previousData) => previousData
  })

  const danhSachKhoaHoc = data?.data?.ketQua || []
  const tongSoKetQua = data?.data?.tongSoLuong || danhSachKhoaHoc.length
  const tongSoTrang = Math.ceil(tongSoKetQua / kichThuocTrang) || 1

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > tongSoTrang) return
    thamSoTimKiem.set('soTrang', String(newPage))
    setThamSoTimKiem(thamSoTimKiem)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearFilter = () => {
    setTrinhDoLoc('tat-ca')
    setSapXep('pho-bien')
    const newParams = new URLSearchParams()
    if (tuKhoa) newParams.set('tuKhoa', tuKhoa)
    if (danhMuc) newParams.set('idDanhMuc', danhMuc)
    setThamSoTimKiem(newParams)
  }

  const isFiltering = trinhDoLoc !== 'tat-ca' || sapXep !== 'pho-bien'
  const visiblePages = getVisiblePages(trangHienTai, tongSoTrang)

  return (
    <div className={`${BG_PAGE} min-h-screen pb-20 font-sans text-[#2d2f31]`}>
      {/* --- HEADER --- */}
      <div className='bg-white border-b border-gray-200 shadow-sm'>
        <div className='max-w-[1340px] mx-auto px-6 py-10'>
          <div className='flex flex-col gap-3'>
            {danhMuc && (
              <span className='text-xs font-bold uppercase tracking-wider text-gray-500'>Danh mục: {danhMuc}</span>
            )}

            <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-[#2d2f31]'>
              {tuKhoa ? (
                <span className='flex items-center gap-3'>
                  <Search className={`w-8 h-8 ${BRAND_TEXT}`} />
                  Kết quả cho "{tuKhoa}"
                </span>
              ) : danhMuc ? (
                'Khóa học theo danh mục'
              ) : (
                'Tất cả lộ trình học'
              )}
            </h1>
            <p className='text-gray-600 text-lg'>
              Tìm thấy <span className='font-bold text-black'>{tongSoKetQua}</span> lộ trình học phù hợp.
            </p>
          </div>
        </div>
      </div>

      <div className='max-w-[1340px] mx-auto px-6 py-8'>
        <div className='sticky top-0 z-20 bg-[#F7F9FA]/95 backdrop-blur-md py-4 mb-8 border-b border-transparent transition-all'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='flex items-center gap-2 bg-white py-2 px-3 rounded-lg border border-gray-300 shadow-sm'>
                <Filter className='h-4 w-4 text-gray-500' />
                <span className='text-sm font-bold text-gray-700'>Bộ lọc:</span>
              </div>

              <Select
                value={trinhDoLoc}
                onValueChange={(v) => {
                  setTrinhDoLoc(v)
                  thamSoTimKiem.set('trinhDo', v)
                  thamSoTimKiem.set('soTrang', '1')
                  setThamSoTimKiem(thamSoTimKiem)
                }}
              >
                <SelectTrigger className='w-40 bg-white border-gray-300 focus:ring-[#FF5722] rounded-none font-bold'>
                  <SelectValue placeholder='Trình độ' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='tat-ca'>Tất cả trình độ</SelectItem>
                  <SelectItem value='2'>Mới bắt đầu</SelectItem>
                  <SelectItem value='3'>Trung cấp</SelectItem>
                  <SelectItem value='4'>Nâng cao</SelectItem>
                  <SelectItem value='5'>Chuyên gia</SelectItem>
                </SelectContent>
              </Select>

              {isFiltering && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleClearFilter}
                  className='text-black hover:text-[#FF5722] hover:bg-orange-50 h-10 px-3 font-medium'
                >
                  <X className='h-4 w-4 mr-1.5' /> Xóa bộ lọc
                </Button>
              )}
            </div>

            {/* Right: Sort */}
            <div className='flex items-center gap-3'>
              <span className='text-sm text-gray-500 font-bold hidden md:inline-block'>Sắp xếp:</span>
              <Select
                value={sapXep}
                onValueChange={(v) => {
                  setSapXep(v)
                  handlePageChange(1)
                }}
              >
                <SelectTrigger className='w-[180px] bg-white border-gray-300 rounded-none font-bold'>
                  <SelectValue placeholder='Sắp xếp' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='pho-bien'>Phổ biến nhất</SelectItem>
                  <SelectItem value='danh-gia-cao'>Đánh giá cao nhất</SelectItem>
                  <SelectItem value='moi-nhat'>Mới nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className='min-h-[500px]'>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.from({ length: kichThuocTrang }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : danhSachKhoaHoc.length > 0 ? (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4'>
                {danhSachKhoaHoc.map((loTrinh: LoTrinhHoc) => (
                  <LoTrinhHocCard key={loTrinh.idLoTrinhHoc} loTrinh={loTrinh} />
                ))}
              </div>

              <Separator className='my-12 bg-gray-200' />

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(trangHienTai - 1)}
                      aria-disabled={trangHienTai === 1}
                      className={`flex items-center justify-center border border-gray-300 ${
                        trangHienTai === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'
                      }`}
                    >
                      Trước
                    </PaginationPrevious>
                  </PaginationItem>

                  {visiblePages.map((page, index) => (
                    <PaginationItem key={index}>
                      {page === '...' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={trangHienTai === page}
                          onClick={() => handlePageChange(Number(page))}
                          className={`cursor-pointer w-10 h-10 border border-transparent ${
                            trangHienTai === page ? BRAND_BG : 'hover:bg-gray-200 hover:border-gray-300 text-[#2d2f31]'
                          }`}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(trangHienTai + 1)}
                      aria-disabled={trangHienTai >= tongSoTrang}
                      className={`flex items-center justify-center border border-gray-300 ${
                        trangHienTai >= tongSoTrang
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer hover:bg-gray-100'
                      }`}
                    >
                      Tiếp
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center py-24 bg-white rounded-sm border border-gray-200 shadow-sm'>
              <div className='bg-gray-100 p-6 rounded-full mb-6'>
                <BookOpen className='h-12 w-12 text-gray-400' />
              </div>
              <h3 className='text-2xl font-bold text-[#2d2f31] mb-3'>Không tìm thấy lộ trình học nào</h3>
              <p className='text-gray-600 mb-8 text-center max-w-md leading-relaxed'>
                Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp. <br />
                Hãy thử thay đổi từ khóa hoặc xóa bớt bộ lọc.
              </p>
              <Button onClick={handleClearFilter} className={`${BRAND_BG} font-bold px-8 h-12`}>
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
