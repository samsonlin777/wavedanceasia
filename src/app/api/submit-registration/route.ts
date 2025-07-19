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

    // 建立報名記錄 (使用 v2 版本，自動同步客戶資料)
    const result = await createWDARegistration({
      eventId: eventDetail.id,
      participantName: body.name,
      participantEmail: body.email,
      participantPhone: body.phone,
      instagramHandle: body.instagramId,
      ticketType: body.paymentType || 'early_bird',
      paymentMethod: body.paymentType === 'onsite' ? 'cash' : 'transfer',
      participantCount: body.participantCount || 1,
      transferAmount: body.transferAmount,
      transferLastFive: body.transferLastFive,
      customFields: {
        payment_type: body.paymentType,
        form_source: 'website',
        subscribe_newsletter: body.subscribeNewsletter || false
      },
      notes: body.notes
    })

    // 發送 webhook 通知到 n8n
    try {
      const webhookData = {
        // 報名基本資料
        registration_id: result.registration_id,
        customer_id: result.customer_id,
        event_code: body.eventCode,
        event_title: '浪花舞 Coffee Party 派對',
        
        // 參與者資料
        participant_name: body.name,
        participant_email: body.email,
        participant_phone: body.phone,
        instagram_handle: body.instagramId,
        participant_count: body.participantCount || 1,
        
        // 付款資料
        payment_type: body.paymentType,
        payment_method: body.paymentType === 'onsite' ? 'cash' : 'transfer',
        payment_amount: result.payment_amount,
        transfer_amount: body.transferAmount,
        transfer_last_five: body.transferLastFive,
        
        // 其他資料
        notes: body.notes,
        form_source: 'website',
        registration_time: new Date().toISOString(),
        subscribe_newsletter: body.subscribeNewsletter || false
      }

      const webhookResponse = await fetch('https://n8n-samson-lin-u44764.vm.elestio.app/webhook/wda-event-regist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      })

      if (!webhookResponse.ok) {
        console.error('Webhook 發送失敗:', webhookResponse.status, webhookResponse.statusText)
      } else {
        console.log('Webhook 發送成功')
      }
    } catch (webhookError) {
      console.error('Webhook 發送錯誤:', webhookError)
      // 不影響主要報名流程，只記錄錯誤
    }

    return NextResponse.json({
      success: true,
      message: '報名成功！請依照活動頁面的指示完成轉帳付款。',
      registrationId: result.registration_id,
      customerId: result.customer_id,
      paymentAmount: result.payment_amount
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