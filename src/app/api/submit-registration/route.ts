import { NextRequest, NextResponse } from 'next/server'
import { createWDARegistration, getWDAEventDetail, ensureCoffeePartyExists } from '@/lib/supabase-wda'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 基本驗證
    if (!body.eventCode || !body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: '請填寫必要資料' },
        { status: 400 }
      )
    }

    // 確保 Coffee Party 活動存在
    if (body.eventCode === 'coffee-party') {
      await ensureCoffeePartyExists()
    }

    // 取得活動詳情
    const eventDetail = await getWDAEventDetail(body.eventCode === 'coffee-party' ? 'COFFEE-2025-0726' : body.eventCode)
    
    if (!eventDetail) {
      return NextResponse.json(
        { success: false, message: '找不到指定的活動' },
        { status: 404 }
      )
    }

    // 建立報名記錄
    const registrationId = await createWDARegistration({
      eventId: eventDetail.id,
      participantName: body.name,
      participantEmail: body.email,
      participantPhone: body.phone,
      ticketType: body.paymentType || 'early_bird',
      paymentMethod: 'transfer',
      customFields: {
        instagram_id: body.instagramId,
        payment_type: body.paymentType,
        form_source: 'website'
      },
      notes: body.notes
    })

    return NextResponse.json({
      success: true,
      message: '報名成功！請依照活動頁面的指示完成轉帳付款。',
      registrationId
    })

  } catch (error: unknown) {
    console.error('報名處理錯誤:', error)
    
    // 處理特定錯誤
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('活動已額滿')) {
      return NextResponse.json(
        { success: false, message: '很抱歉，活動已額滿！' },
        { status: 400 }
      )
    }
    
    if (errorMessage.includes('活動不存在')) {
      return NextResponse.json(
        { success: false, message: '找不到指定的活動' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: false, message: '系統錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}