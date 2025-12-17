import { useSearchParams } from 'react-router-dom'
import { BookOpen, Heart } from 'lucide-react'
import { useHoctap } from '@/hooks/useHocTap'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LoTrinhHocCardDashboard } from '@/components/LoTrinhHocCardDashbroad'
import { CourseCardDashboard } from '@/components/CourseCardDashbroad'
import { ButtonCustom } from '@/components/common/ButtonCustom'

export function KhoaHocCuaToi() {
  const { khoaHocDaGhiDanh, loTrinhHocDaGhiDanh } = useHoctap()
  const [searchParams] = useSearchParams()
  const tabMacDinh = searchParams.get('tab') === 'khoaHoc' ? 'khoaHoc' : 'loTrinhHoc'

  const dsKhoaHocDaGhiDanh = khoaHocDaGhiDanh || []

  return (
    <div className='bg-white min-h-screen py-12'>
      <div className='max-w-[1340px] mx-auto px-6'>
        <h1 className='text-[32px] font-bold text-[#1C1D1F] mb-8'>Khóa học của tôi</h1>

        <Tabs defaultValue={tabMacDinh} className='w-full'>
          <TabsList className='mb-8 bg-white border-b border-[#D1D7E0] rounded-none h-auto p-0 w-full justify-start'>
            <TabsTrigger
              value='loTrinhHoc'
              className='border-b-2 border-transparent data-[state=active]:border-[#FF5722] data-[state=active]:bg-transparent rounded-none px-4 py-3 text-[14px] font-bold text-[#6A6C70] data-[state=active]:text-[#FF5722] transition-colors'
            >
              Danh sách lộ trình học ({loTrinhHocDaGhiDanh?.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value='khoaHoc'
              className='border-b-2 border-transparent data-[state=active]:border-[#FF5722] data-[state=active]:bg-transparent rounded-none px-4 py-3 text-[14px] font-bold text-[#6A6C70] data-[state=active]:text-[#FF5722] transition-colors'
            >
              Tất cả khóa học ({dsKhoaHocDaGhiDanh.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='loTrinhHoc'>
            {loTrinhHocDaGhiDanh && loTrinhHocDaGhiDanh.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {loTrinhHocDaGhiDanh.map((loTrinhHoc) => (
                  <LoTrinhHocCardDashboard key={loTrinhHoc.idLoTrinhHoc} loTrinh={loTrinhHoc} />
                ))}
              </div>
            ) : (
              <div className='bg-[#F7F9FA] rounded p-12 text-center'>
                <Heart className='h-16 w-16 text-[#D1D7E0] mx-auto mb-4' />
                <h2 className='text-[24px] font-bold text-[#1C1D1F] mb-4'>Danh sách đang trống</h2>
                <p className='text-[16px] text-[#6A6C70] mb-6'>Khám phá và lưu lại những lộ trình bạn quan tâm.</p>
                <ButtonCustom size='lg' href='/lo-trinh-hoc/search'>
                  Khám phá lộ trình
                </ButtonCustom>
              </div>
            )}
          </TabsContent>

          <TabsContent value='khoaHoc'>
            {dsKhoaHocDaGhiDanh.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {dsKhoaHocDaGhiDanh.map((khoaHoc) => {
                  return <CourseCardDashboard key={khoaHoc.idKhoaHoc} course={khoaHoc} />
                })}
              </div>
            ) : (
              <div className='bg-[#F7F9FA] rounded p-12 text-center'>
                <BookOpen className='h-16 w-16 text-[#D1D7E0] mx-auto mb-4' />
                <h2 className='text-[24px] font-bold text-[#1C1D1F] mb-4'>
                  Bắt đầu học từ hàng nghìn khóa học ngay hôm nay
                </h2>
                <p className='text-[16px] text-[#6A6C70] mb-6'>Khi bạn đăng ký khóa học, chúng sẽ xuất hiện tại đây.</p>
                <ButtonCustom size='lg' href='/khoa-hoc/search'>
                  Khám phá khóa học
                </ButtonCustom>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
