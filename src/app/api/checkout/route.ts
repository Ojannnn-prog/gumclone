import { NextResponse } from 'next/server';
import { Xendit } from 'xendit-node';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, totalAmount, customerEmail } = body;

    // Validasi data keranjang
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Pastikan Secret Key sudah terkonfigurasi
    if (!process.env.XENDIT_SECRET_KEY) {
      console.error("XENDIT_SECRET_KEY is missing from environment variables.");
      return NextResponse.json({ error: 'Payment gateway configuration error.' }, { status: 500 });
    }

    // Inisialisasi Xendit Client
    const xenditClient = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY,
    });

    const externalId = `invoice-${Date.now()}`;

    // Menyiapkan URL kembali
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Membuat request Invoice ke Xendit
    const invoiceData = {
      externalId: externalId,
      amount: totalAmount,
      payerEmail: customerEmail || 'guest@example.com',
      description: 'Payment for Gumclone Order',
      successRedirectUrl: `${baseUrl}/success`,
      failureRedirectUrl: baseUrl,
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const invoice = await xenditClient.Invoice.createInvoice({
      data: invoiceData
    });

    // Mengembalikan invoiceUrl ke client
    return NextResponse.json({ invoice_url: invoice.invoiceUrl });

  } catch (error: any) {
    console.error('Xendit Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
