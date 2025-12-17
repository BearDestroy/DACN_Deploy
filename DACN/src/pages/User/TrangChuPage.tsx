import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Briefcase, Loader2 } from 'lucide-react'

import { ButtonCustom } from '@/components/common/ButtonCustom'
import { SectionHeader } from '@/components/common/SectionHeader'
import { CategoryCard } from '@/components/common/CategoryCard'
import { NgheNghiepMucDichModal } from '@/components/NgheNghiepMucDich'
import { BaiHocGanNhatCollection } from '@/components/CardBaiHocGanNhatCollection'

import { useNguoiDung } from '@/hooks/useNguoiDung'
import { useHoctap } from '@/hooks/useHocTap'
import { showErrorToast } from '@/utils/toast'
import { layGoiY } from '@/apis/khoahoc'

import type { BaiHocGanNhatHinhAnh, IGoiYResponseFull } from '@/@types/KhoaHoc'
import type { DanhMuc } from '@/@types/DanhMuc.type'
import { LoTrinhHocCollection } from '@/components/LoTrinhHocCollection'
import { KhoaHocCollection } from '@/components/KhoaHocCollection'

interface IProps {
  danhMuc?: DanhMuc[] | []
}

export function HomePage({ danhMuc }: IProps) {
  const { currentUser } = useNguoiDung()
  const { khoaHocDaGhiDanh } = useHoctap()
  const [baiHocList, setBaiHocList] = useState<BaiHocGanNhatHinhAnh[] | []>([])

  const [openCareerModal, setOpenCareerModal] = useState(false)
  const collectionRef = useRef<HTMLDivElement>(null)

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (!khoaHocDaGhiDanh || khoaHocDaGhiDanh.length === 0) return

    const allBaiHoc: BaiHocGanNhatHinhAnh[] = khoaHocDaGhiDanh.flatMap((kh) =>
      (kh.baiHocGanNhat ?? []).map((bai) => ({
        ...bai,
        idBaiHoc: bai.id,
        tenBaiHoc: bai.tenBaiHoc ?? '',
        lanCuoiXem: bai.lanCuoiXem,
        hinhAnh: kh.hinhDaiDien ?? '',
        tenKhoaHoc: kh.tenKhoaHoc ?? '',
        idKhoaHoc: kh.idKhoaHoc
      }))
    )

    const sortedTop10: BaiHocGanNhatHinhAnh[] = allBaiHoc
      .sort((a, b) => (b.lanCuoiXem ?? 0) - (a.lanCuoiXem ?? 0))
      .slice(0, 10)

    setTimeout(() => {
      setBaiHocList(sortedTop10)
    })
  }, [khoaHocDaGhiDanh])

  const {
    data: responseData,
    isLoading,
    isError,
    refetch: refetchGoiY
  } = useQuery<IGoiYResponseFull>({
    queryKey: ['goi-y-full'],
    queryFn: async () => {
      const res = await layGoiY()
      if (res.statusCode === 200 && res.data) {
        return res.data
      } else {
        const msg = res.message || 'Dữ liệu gợi ý không hợp lệ'
        showErrorToast({ message: msg })
        return { khoaHoc: [], loTrinhHoc: [] }
      }
    }
  })

  const listGoiYKhoaHoc = responseData?.khoaHoc || []
  const listGoiYLoTrinh = responseData?.loTrinhHoc || []

  const maxIterations = Math.max(listGoiYKhoaHoc.length, listGoiYLoTrinh.length)

  return (
    <div className='bg-white'>
      <NgheNghiepMucDichModal
        open={openCareerModal}
        onOpenChange={setOpenCareerModal}
        onSuccess={() => refetchGoiY()}
      />

      <div className='bg-[#F7F9FA] border-b border-[#D1D7E0]'>
        <div className='max-w-[1340px] mx-auto px-6 py-8'>
          <div className='grid md:grid-cols-2 gap-8 items-center'>
            <div>
              {currentUser && (
                <div
                  className='bg-white border border-orange-100 rounded-lg p-5 mb-6 shadow-sm hover:border-orange-300 hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden'
                  onClick={() => setOpenCareerModal(true)}
                >
                  <div className='absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 z-0 transition-transform group-hover:scale-110' />

                  <div className='relative z-10 flex justify-between items-start'>
                    <div>
                      <p className='text-[15px] font-medium text-slate-800 mb-1'>
                        Xin chào <span className='font-bold text-orange-700'>{currentUser.hoTen}</span>!
                      </p>
                      <p className='text-sm text-slate-500 leading-relaxed max-w-[320px]'>
                        Bạn muốn trở thành ai trong tương lai? <br />
                        <span className='text-orange-600 font-medium'>Thiết lập mục tiêu</span> để nhận lộ trình học tập
                        chuẩn xác nhất.
                      </p>
                    </div>

                    <div className='p-2.5 bg-white border border-orange-100 rounded-full text-orange-600 shadow-sm group-hover:bg-orange-600 group-hover:text-white group-hover:border-orange-600 transition-all duration-300'>
                      <Pencil className='w-4 h-4' />
                    </div>
                  </div>

                  <div className='relative z-10 mt-4 pt-3 border-t border-slate-100 flex items-center gap-2'>
                    <span className='text-orange-600 font-bold text-[13px] uppercase tracking-wide group-hover:underline'>
                      Chọn nghề nghiệp & Mục tiêu
                    </span>
                    <Briefcase className='w-3.5 h-3.5 text-orange-400' />
                  </div>
                </div>
              )}

              <p className='text-[19px] text-[#1C1D1F] mb-6'>
                Học bất kỳ chủ đề nào, bất cứ lúc nào. Khám phá hàng nghìn khóa học.
              </p>

              <ButtonCustom variant='secondary' size='lg' onClick={scrollToCollection}>
                Bắt đầu ngay
              </ButtonCustom>
            </div>

            <div className='hidden md:block'>
              <img
                src='https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop'
                alt='Learning'
                className='rounded w-full shadow-lg'
              />
            </div>
          </div>
        </div>
      </div>

      {baiHocList.length > 0 && (
        <BaiHocGanNhatCollection
          title='Bài học gần đây'
          subtitle='Tiếp tục học từ nơi bạn đã dừng lại'
          baiHocList={baiHocList}
        />
      )}

      <div ref={collectionRef} className='py-4 min-h-[300px] space-y-8'>
        {isLoading && (
          <div className='flex justify-center py-20'>
            <Loader2 className='w-12 h-12 text-orange-600 animate-spin' />
          </div>
        )}

        {isError && (
          <div className='text-center py-10'>
            <p className='text-slate-500 mb-2'>Không thể tải gợi ý khóa học</p>
            <ButtonCustom variant='outline' onClick={() => refetchGoiY()}>
              Thử lại
            </ButtonCustom>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {[...Array(maxIterations)].map((_, index) => {
              const goiYLoTrinh = listGoiYLoTrinh[index]
              const goiYKhoaHoc = listGoiYKhoaHoc[index]

              if (!goiYLoTrinh && !goiYKhoaHoc) return null

              return (
                <div key={goiYLoTrinh?.url ?? goiYKhoaHoc?.url ?? index} className='flex flex-col'>
                  {goiYLoTrinh && <LoTrinhHocCollection goiY={goiYLoTrinh} columns={4} />}

                  {goiYKhoaHoc && (
                    <KhoaHocCollection
                      goiY={goiYKhoaHoc}
                      columns={4}
                      showButton
                      buttonHref={goiYKhoaHoc.url ? `/search?q=${goiYKhoaHoc.tieuDe}` : '/search'}
                    />
                  )}
                </div>
              )
            })}

            {maxIterations === 0 && (
              <div className='text-center py-12'>
                <p className='text-slate-500 italic'>Chưa có gợi ý phù hợp cho bạn lúc này.</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className='bg-[#F7F9FA] py-12 mt-8'>
        <div className='max-w-[1340px] mx-auto px-6'>
          <SectionHeader title='Danh mục hàng đầu' />
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {(danhMuc || []).map((d) => (
              <CategoryCard key={d.id} id={d.id} name={d.tenDanhMuc} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
