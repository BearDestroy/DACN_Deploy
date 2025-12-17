// BaiHoc.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { IBaiHocResponse, IKhoaHocChiTiet } from '@/apis/khoahoc'
import { TongQuanTab } from './TongQuanTab'
import { HoiDapTab } from './HoiDapTab'
import { GhiChuTab } from './GhiChuTab'
import { GiaiDapAITab } from './HoiDapAI'
import { BaiTapTab } from './BaiTapTab'

interface BaiHocProps {
  baiHoc: IBaiHocResponse | null
  khoaHoc: IKhoaHocChiTiet | null
  thoiGianHienTai: number
  tuaVideo: (time: number) => void
}

export function BaiHocTab({ baiHoc, khoaHoc, thoiGianHienTai, tuaVideo }: BaiHocProps) {
  return (
    <div className='p-4 md:p-8 bg-orange-50 min-h-[50vh]'>
      <Tabs defaultValue='overview' className='w-full'>
        <TabsList className=' text-gray-800  mb-6 rounded-md overflow-hidden'>
          <TabsTrigger
            value='overview'
            className='data-[state=active]:bg-[#FF5722] data-[state=active]:text-white data-[state=inactive]:bg-orange-100 data-[state=inactive]:text-gray-800'
          >
            Tổng quan
          </TabsTrigger>
          <TabsTrigger
            value='notes'
            className='data-[state=active]:bg-[#FF5722] data-[state=active]:text-white data-[state=inactive]:bg-orange-100 data-[state=inactive]:text-gray-800'
          >
            Ghi chú
          </TabsTrigger>
          <TabsTrigger
            value='qa'
            className='data-[state=active]:bg-[#FF5722] data-[state=active]:text-white data-[state=inactive]:bg-orange-100 data-[state=inactive]:text-gray-800'
          >
            Hỏi đáp
          </TabsTrigger>
          <TabsTrigger
            value='ai'
            className='data-[state=active]:bg-[#FF5722] data-[state=active]:text-white data-[state=inactive]:bg-orange-100 data-[state=inactive]:text-gray-800'
          >
            Giải đáp bằng AI
          </TabsTrigger>
          <TabsTrigger
            value='exercise'
            className='data-[state=active]:bg-[#FF5722] data-[state=active]:text-white data-[state=inactive]:bg-orange-100 data-[state=inactive]:text-gray-800'
          >
            Bài tập
          </TabsTrigger>
        </TabsList>

        <TabsContent value='overview'>
          <TongQuanTab khoaHoc={khoaHoc} />
        </TabsContent>

        <TabsContent value='notes'>
          <GhiChuTab tuaVideo={tuaVideo} idBaiHoc={baiHoc?.idBaiHoc ?? 0} thoiGianHienTai={thoiGianHienTai} />
        </TabsContent>

        <TabsContent value='qa'>
          <HoiDapTab idBaiHoc={baiHoc?.idBaiHoc ?? 0} />
        </TabsContent>

        <TabsContent value='ai'>
          <GiaiDapAITab idBaiHoc={baiHoc?.idBaiHoc ?? 0} />
        </TabsContent>

        <TabsContent value='exercise'>
          <BaiTapTab idBaiHoc={baiHoc?.idBaiHoc ?? 0} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
