import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Pastikan ini webhook untuk status tagihan yang sudah DIBAYAR (PAID)
    if (payload.status === 'PAID') {
      const externalId = payload.external_id;
      const payerEmail = payload.payer_email;

      console.log(`[XENDIT WEBHOOK] Invoice ${externalId} is PAID by ${payerEmail}`);

      // Inisialisasi Resend Client
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is missing from environment variables.");
      }
      
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Desain HTML bergaya Neo-Brutalism
      const htmlContent = `
        <div style="font-family: sans-serif; background-color: #f4f4f0; padding: 40px; color: #111;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 4px solid #111; box-shadow: 8px 8px 0px 0px #111; padding: 30px;">
            <h1 style="text-transform: uppercase; font-weight: 900; margin-top: 0; font-size: 32px;">Payment Successful! 🚀</h1>
            <p style="font-size: 18px; font-weight: bold; border-left: 4px solid #111; padding-left: 15px; margin: 20px 0;">
              Terima kasih atas pembelian Anda di Gumclone.
            </p>
            <p style="font-size: 16px; font-weight: bold;">
              Berikut adalah tautan Google Drive untuk mengunduh produk digital Anda:
            </p>
            
            <div style="margin: 30px 0;">
              <a href="https://drive.google.com/drive/folders/1SdWDYI95zBhMJU839HOCRyHYpXLz1MP3" style="display: block; background-color: #fcd34d; color: #111; text-decoration: none; padding: 15px; border: 3px solid #111; font-weight: 900; text-transform: uppercase; margin-bottom: 15px; text-align: center;">
                ⬇️ Akses Paket Ebook 99+ Judul
              </a>
              <a href="https://drive.google.com/drive/folders/1M8sG9TincMuvXZLiIIRQOTRXJt4CtyVN" style="display: block; background-color: #6ee7b7; color: #111; text-decoration: none; padding: 15px; border: 3px solid #111; font-weight: 900; text-transform: uppercase; text-align: center;">
                ⬇️ Akses Paket Editing Lengkap
              </a>
            </div>
            
            <p style="font-size: 14px; font-weight: bold; margin-bottom: 0;">
              Jika ada kendala, silakan balas email ini.<br/>
              <strong>- Tim Gumclone</strong>
            </p>
          </div>
        </div>
      `;

      try {
        // Eksekusi pengiriman email
        const { data, error } = await resend.emails.send({
          from: 'Gumclone <onboarding@resend.dev>',
          to: [payerEmail], // Kirim ke email pembeli (dari Xendit payload)
          subject: 'Pesanan Anda Berhasil - Gumclone',
          html: htmlContent,
        });

        if (error) {
          console.error('[RESEND ERROR]', error);
          return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        console.log('[RESEND SUCCESS] Email sent:', data);
      } catch (emailError) {
        console.error('[RESEND EXCEPTION]', emailError);
        return NextResponse.json({ error: 'Email sending exception' }, { status: 500 });
      }

      return NextResponse.json({ message: 'Webhook processed and email sent successfully' });
    }

    return NextResponse.json({ message: 'Webhook received but ignored (not PAID status)' });
  } catch (error: any) {
    console.error('[XENDIT WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
