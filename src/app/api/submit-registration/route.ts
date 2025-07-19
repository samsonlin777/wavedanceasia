import { NextRequest, NextResponse } from 'next/server'

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

    // 這裡暫時先回傳成功，等 RPC 函數建立完成後再整合
    console.log('收到報名資料:', body)
    
    // TODO: 當小克建立完 RPC 函數後，在這裡整合
    // const { data, error } = await supabaseWDA.rpc('wavedanceasia_create_registration', {
    //   p_event_code: body.eventCode,
    //   p_participant_name: body.name,
    //   p_participant_email: body.email,
    //   p_participant_phone: body.phone,
    //   p_instagram_id: body.instagramId,
    //   p_payment_type: body.paymentType,
    //   p_notes: body.notes
    // })
    
    // if (error) {
    //   throw error
    // }

    return NextResponse.json({
      success: true,
      message: '報名成功！我們會盡快與您聯繫確認。'
    })

  } catch (error) {
    console.error('報名處理錯誤:', error)
    return NextResponse.json(
      { success: false, message: '系統錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}