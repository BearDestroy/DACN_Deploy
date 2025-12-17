import { useRef, useEffect, useCallback } from 'react'
import {
  MediaPlayer,
  MediaProvider,
  Poster,
  type MediaPlayerInstance,
  type MediaTimeUpdateEvent
} from '@vidstack/react'
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
  type DefaultLayoutTranslations
} from '@vidstack/react/player/layouts/default'
import { Clock, PlayCircle, Loader2 } from 'lucide-react'

import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

import type { IBaiHocResponse } from '@/apis/khoahoc'

const DEFAULT_VIDEO = 'https://files.vidstack.io/sprite-fight/720p.mp4'
const DEFAULT_POSTER = 'https://files.vidstack.io/sprite-fight/poster.webp'

const VIETNAMESE_TRANSLATIONS: Partial<DefaultLayoutTranslations> = {
  Play: 'Phát',
  Pause: 'Tạm dừng',
  Mute: 'Tắt tiếng',
  Unmute: 'Bật tiếng',
  Settings: 'Cài đặt',
  Fullscreen: 'Toàn màn hình',
  'Exit Fullscreen': 'Thoát toàn màn hình',
  Speed: 'Tốc độ',
  Normal: 'Bình thường',
  Quality: 'Chất lượng',
  Loop: 'Lặp lại',
  Auto: 'Tự động',
  Off: 'Tắt',
  Captions: 'Phụ đề',
  'Enter PiP': 'Bật chế độ cửa sổ nổi',
  'Exit PiP': 'Tắt chế độ cửa sổ nổi',
  Seek: 'Tua',
  Volume: 'Âm lượng',
  'Closed-Captions On': 'Bật phụ đề',
  'Closed-Captions Off': 'Tắt phụ đề',
  Playback: 'Phát lại',
  Accessibility: 'Trợ năng',
  Audio: 'Âm thanh'
}

interface VideoPlayerProps {
  baiHoc: IBaiHocResponse | null
  onComplete?: () => void
  onTimeUpdate?: (currentTime: number) => void
  seekTime?: number | null
  onSeeked?: () => void
  hinhAnh?: string
}

export function VideoPlayer({ baiHoc, onComplete, onTimeUpdate, seekTime, onSeeked, hinhAnh }: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null)
  const videoSrc = baiHoc?.videoUrl || DEFAULT_VIDEO
  const title = baiHoc?.tenBaiHoc ?? 'Đang tải bài học...'
  const posterSrc = hinhAnh || DEFAULT_POSTER
  const lanCuoiHoc = baiHoc?.lanCuoiHoc
  const idBaiHoc = baiHoc?.idBaiHoc

  const handleCanPlay = useCallback(() => {
    const player = playerRef.current
    if (!player || !lanCuoiHoc) return

    const startTime = Number(lanCuoiHoc)
    if (startTime > 0 && player.currentTime < 1) {
      player.currentTime = startTime
    }
  }, [lanCuoiHoc, idBaiHoc])

  useEffect(() => {
    if (seekTime === null || seekTime === undefined) return

    const player = playerRef.current
    if (!player) return
    const performSeek = () => {
      if (player.duration > 0) {
        player.currentTime = Math.min(seekTime, Math.max(0, player.duration - 0.5))
        setTimeout(() => onSeeked?.(), 100)
      } else {
        requestAnimationFrame(performSeek)
      }
    }

    performSeek()
  }, [seekTime, onSeeked])

  // Event Handlers
  const handleTimeUpdate = (detail: MediaTimeUpdateEvent['detail']) => {
    onTimeUpdate?.(detail.currentTime)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='w-full aspect-video bg-slate-950 rounded-xl overflow-hidden shadow-2xl relative group ring-1 ring-white/10'>
        <MediaPlayer
          className='vidstack-theme-orange h-full w-full'
          key={baiHoc?.idBaiHoc}
          ref={playerRef}
          title={title}
          src={videoSrc}
          aspectRatio='16/9'
          load='eager'
          onTimeUpdate={handleTimeUpdate}
          onEnd={onComplete}
          onCanPlay={handleCanPlay}
        >
          <MediaProvider>
            <Poster className='vds-poster object-cover transition-opacity duration-300' src={posterSrc} alt={title} />
          </MediaProvider>

          <DefaultVideoLayout icons={defaultLayoutIcons} translations={VIETNAMESE_TRANSLATIONS} />
        </MediaPlayer>

        {!baiHoc && (
          <div className='absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50 pointer-events-none'>
            <div className='flex items-center gap-2 text-white/70'>
              <Loader2 className='h-5 w-5 animate-spin text-[#FF5722]' />
              <span className='text-sm font-medium'>Đang tải video...</span>
            </div>
          </div>
        )}
      </div>

      {/* --- INFO SECTION --- */}
      <div className='px-1 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300'>
        {baiHoc ? (
          <>
            <h3 className='text-xl font-bold text-slate-900 dark:text-white flex items-start gap-2 leading-tight'>
              <PlayCircle className='w-6 h-6 text-[#FF5722] shrink-0 mt-0.5 fill-[#FF5722]/10' />
              <span className='truncate'>{baiHoc.tenBaiHoc}</span>
            </h3>

            <div className='flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 ml-8'>
              <div className='flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium'>
                <Clock className='w-4 h-4 text-[#FF5722]' />
                <span>Thời lượng: {baiHoc.thoiLuongBaiHoc} phút</span>
              </div>
            </div>
          </>
        ) : (
          /* Skeleton Loading */
          <div className='space-y-2 animate-pulse'>
            <div className='h-7 bg-slate-200 dark:bg-slate-700 rounded w-3/4' />
            <div className='h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/3 ml-8' />
          </div>
        )}
      </div>
    </div>
  )
}
