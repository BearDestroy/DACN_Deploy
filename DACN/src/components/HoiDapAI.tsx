import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMutation } from '@tanstack/react-query'
import { HoiDapAI } from '@/apis/khoahoc'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ITinNhan {
  id: string
  vaiTro: 'user' | 'ai'
  noiDung: string
  thoiGian: Date
}

const TIN_NHAN_MAC_DINH: ITinNhan = {
  id: '1',
  vaiTro: 'ai',
  noiDung: 'Chào bạn! Tôi là trợ lý AI của khóa học. Bạn có thắc mắc gì về bài học này không?',
  thoiGian: new Date()
}

export function GiaiDapAITab({ idBaiHoc }: { idBaiHoc: number }) {
  const KHOA_LUU_TRU = `lich_su_chat_bai_${idBaiHoc}`

  const taiLichSuChat = (): ITinNhan[] => {
    if (typeof window === 'undefined') return [TIN_NHAN_MAC_DINH]
    const duLieuDaLuu = localStorage.getItem(KHOA_LUU_TRU)
    if (duLieuDaLuu) {
      try {
        const duLieuPhanTich = JSON.parse(duLieuDaLuu)
        return duLieuPhanTich.map((tin: ITinNhan) => ({
          ...tin,
          thoiGian: new Date(tin.thoiGian)
        }))
      } catch {
        return [TIN_NHAN_MAC_DINH]
      }
    }
    return [TIN_NHAN_MAC_DINH]
  }

  const [danhSachTinNhan, setDanhSachTinNhan] = useState<ITinNhan[]>(taiLichSuChat)
  const [noiDungNhap, setNoiDungNhap] = useState('')
  const cuoiDanhSachRef = useRef<HTMLDivElement>(null)

  const { mutate: guiCauHoi, isPending: dangXuLy } = useMutation({
    mutationFn: (message: string) => HoiDapAI(message, idBaiHoc),
    onSuccess: (response) => {
      if (response && response.data) {
        const noiDungTraLoi = response.data.answer
        const tinNhanAI: ITinNhan = {
          id: Date.now().toString(),
          vaiTro: 'ai',
          noiDung: noiDungTraLoi ?? '',
          thoiGian: new Date()
        }
        setDanhSachTinNhan((cu) => [...cu, tinNhanAI])
      } else {
        const tinNhanLoi: ITinNhan = {
          id: Date.now().toString(),
          vaiTro: 'ai',
          noiDung: response.message || 'Có lỗi xảy ra, vui lòng thử lại.',
          thoiGian: new Date()
        }
        setDanhSachTinNhan((cu) => [...cu, tinNhanLoi])
      }
    },
    onError: (error) => {
      console.error('Lỗi AI:', error)
      const tinNhanLoi: ITinNhan = {
        id: Date.now().toString(),
        vaiTro: 'ai',
        noiDung: 'Xin lỗi, hệ thống đang bận hoặc gặp lỗi kết nối mạng.',
        thoiGian: new Date()
      }
      setDanhSachTinNhan((cu) => [...cu, tinNhanLoi])
    }
  })

  useEffect(() => {
    const load = async () => {
      const data = await taiLichSuChat()
      setDanhSachTinNhan(data)
    }

    load()
  }, [idBaiHoc])

  useEffect(() => {
    cuoiDanhSachRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [danhSachTinNhan])

  useEffect(() => {
    if (danhSachTinNhan.length > 0) {
      localStorage.setItem(KHOA_LUU_TRU, JSON.stringify(danhSachTinNhan))
    }
  }, [danhSachTinNhan, KHOA_LUU_TRU])

  const guiTinNhan = () => {
    if (!noiDungNhap.trim()) return
    const tinNhanNguoiDung: ITinNhan = {
      id: Date.now().toString(),
      vaiTro: 'user',
      noiDung: noiDungNhap,
      thoiGian: new Date()
    }
    setDanhSachTinNhan((cu) => [...cu, tinNhanNguoiDung])
    setNoiDungNhap('')
    guiCauHoi(tinNhanNguoiDung.noiDung)
  }

  const lamMoiHoiThoai = () => {
    localStorage.removeItem(KHOA_LUU_TRU)
    setDanhSachTinNhan([TIN_NHAN_MAC_DINH])
  }

  return (
    <div className='max-w-4xl mx-auto h-[600px] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden'>
      {/* Header */}
      <div className='p-4 border-b border-slate-100 bg-orange-50/50 flex items-center gap-3'>
        <div className='bg-orange-100 p-2 rounded-full'>
          <Sparkles className='w-5 h-5 text-orange-600' />
        </div>
        <div>
          <h3 className='font-semibold text-slate-800'>Trợ lý AI Học Tập</h3>
          <p className='text-xs text-slate-500'>Hỗ trợ giải đáp 24/7 dựa trên nội dung bài học</p>
        </div>
      </div>

      {/* Khu vực Chat */}
      <ScrollArea className='flex-1 p-4 bg-slate-50'>
        <div className='space-y-4'>
          {danhSachTinNhan.map((tin) => (
            <div key={tin.id} className={`flex gap-3 ${tin.vaiTro === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  tin.vaiTro === 'user' ? 'bg-orange-600' : 'bg-blue-600'
                }`}
              >
                {tin.vaiTro === 'user' ? (
                  <User className='w-4 h-4 text-white' />
                ) : (
                  <Bot className='w-4 h-4 text-white' />
                )}
              </div>

              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm overflow-hidden ${
                  tin.vaiTro === 'user'
                    ? 'bg-orange-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                }`}
              >
                {tin.vaiTro === 'ai' ? (
                  // --- KHỐI HIỂN THỊ MARKDOWN ---
                  // 'prose': Kích hoạt typography plugin
                  // 'prose-sm': Chữ nhỏ gọn
                  // 'max-w-none': Để nội dung bung hết chiều rộng thẻ cha
                  <div
                    className='prose prose-sm max-w-none text-slate-700 
                    prose-headings:font-bold prose-headings:text-slate-800 
                    prose-p:my-1.5 prose-headings:my-2 
                    prose-ul:my-1 prose-ul:list-disc prose-ul:pl-4
                    prose-ol:my-1 prose-ol:list-decimal prose-ol:pl-4
                    prose-li:my-0.5
                    prose-hr:my-3 prose-hr:border-slate-200
                    prose-strong:font-bold prose-strong:text-slate-900'
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ children, ...props }) {
                          return (
                            <code
                              className='bg-slate-100 px-1.5 py-0.5 rounded text-orange-600 font-mono text-xs border border-slate-200'
                              {...props}
                            >
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {/* Thay thế \\n thành \n thực sự để xuống dòng đúng */}
                      {tin.noiDung.replace(/\\n/g, '\n')}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <span className='whitespace-pre-wrap'>{tin.noiDung}</span>
                )}

                <div
                  className={`text-[10px] mt-1 opacity-70 ${
                    tin.vaiTro === 'user' ? 'text-orange-100 text-right' : 'text-slate-400'
                  }`}
                >
                  {tin.thoiGian instanceof Date && !isNaN(tin.thoiGian.getTime())
                    ? tin.thoiGian.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </div>
              </div>
            </div>
          ))}

          {dangXuLy && (
            <div className='flex gap-3'>
              <div className='w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center'>
                <Bot className='w-4 h-4 text-white' />
              </div>
              <div className='bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-1'>
                <span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                <span
                  className='w-2 h-2 bg-slate-400 rounded-full animate-bounce'
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className='w-2 h-2 bg-slate-400 rounded-full animate-bounce'
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          )}
          <div ref={cuoiDanhSachRef} />
        </div>
      </ScrollArea>

      <div className='p-4 bg-white border-t border-slate-100'>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='icon'
            className='text-slate-400 hover:text-orange-600'
            onClick={lamMoiHoiThoai}
            title='Làm mới cuộc trò chuyện'
            disabled={dangXuLy}
          >
            <RotateCcw className='w-5 h-5' />
          </Button>
          <Input
            value={noiDungNhap}
            onChange={(e) => setNoiDungNhap(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && guiTinNhan()}
            placeholder='Nhập câu hỏi của bạn về bài học...'
            className='flex-1 focus-visible:ring-orange-500'
            disabled={dangXuLy}
          />
          <Button
            onClick={guiTinNhan}
            disabled={dangXuLy || !noiDungNhap.trim()}
            className='bg-orange-600 hover:bg-orange-700 text-white'
          >
            <Send className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
