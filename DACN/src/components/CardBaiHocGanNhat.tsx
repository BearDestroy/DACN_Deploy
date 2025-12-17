import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Clock } from 'lucide-react'
import type { BaiHocGanNhatHinhAnh } from '@/@types/KhoaHoc'

interface Props {
  baiHoc: BaiHocGanNhatHinhAnh
}

export function CardBaiHocGanNhat({ baiHoc }: Props) {
  const [tienDo, setTienDo] = useState(0)

  useEffect(() => {
    const phanTramTienDo = baiHoc.lanCuoiXem ?? 0
    const boHenGio = setTimeout(() => setTienDo(phanTramTienDo), 100)

    return () => clearTimeout(boHenGio)
  }, [baiHoc.lanCuoiXem])

  const coHinhAnh = !!baiHoc.hinhAnh
  const hinhAnh = '1.55.203.158:5154' + baiHoc.hinhAnh
  const tenKhoaHoc = baiHoc.tenKhoaHoc
  const idKhoaHoc = baiHoc.idKhoaHoc
  const idBaiHoc = baiHoc.id

  const duongDanLienKet = idKhoaHoc && idBaiHoc ? `/hoc-tap/${idKhoaHoc}/${idBaiHoc}` : `/hoc-tap/${idKhoaHoc}`

  return (
    <Link
      to={duongDanLienKet}
      className='group/card relative flex flex-row min-w-[350px] md:min-w-[400px] h-40 cursor-pointer rounded-lg bg-slate-900 border border-slate-800 overflow-hidden hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5'
    >
      <div className='relative w-32 h-full shrink-0 overflow-hidden bg-slate-800'>
        {coHinhAnh ? (
          <img
            src={hinhAnh}
            alt={tenKhoaHoc}
            className='h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110'
          />
        ) : (
          <div className='h-full w-full bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center'>
            <Play className='w-8 h-8 text-slate-700/50' />
          </div>
        )}

        <div className='absolute inset-0 bg-black/30 group-hover/card:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover/card:opacity-100 duration-300'>
          <div className='h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center shadow-lg transform scale-0 group-hover/card:scale-100 transition-transform duration-300'>
            <Play className='w-3 h-3 text-white fill-white ml-0.5' />
          </div>
        </div>
      </div>

      <div className='flex-1 p-3 flex flex-col justify-between min-w-0'>
        <div>
          {tenKhoaHoc && (
            <p className='text-[10px] text-orange-400 font-medium line-clamp-1 mb-0.5 uppercase tracking-wide'>
              {tenKhoaHoc}
            </p>
          )}
          <h3 className='text-xs font-bold text-slate-100 leading-snug line-clamp-2 group-hover/card:text-orange-300 transition-colors'>
            {baiHoc.tenBaiHoc}
          </h3>
        </div>

        <div className='space-y-1.5'>
          <div className='flex items-center justify-between text-[10px] text-slate-400'>
            <div className='flex items-center gap-1 group-hover/card:text-orange-400 transition-colors'>
              <Clock className='w-3 h-3' />
              <span>Tiếp tục</span>
            </div>
            <span className='font-mono'>{tienDo.toFixed(1)}%</span>
          </div>

          <div className='h-2 w-full bg-slate-800 rounded-full overflow-hidden'>
            <div
              className='h-full bg-linear-to-br from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out'
              style={{ width: `${tienDo.toFixed(1)}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
