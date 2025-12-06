import { NextResponse } from 'next/server';
import { generateImage } from '@/services/image';
import path from 'path';
import { promises as fs } from 'fs';


export async function POST(
  request: Request
) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    let total = formData.get('total') as string;
    const msg = formData.get('msg') as string | null;

    // Validación simple
    if (!name || !total) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios: nombre y total' }, 
        { status: 400 }
      );
    }

    try {
      const numberValue = parseFloat(total.replace(',', '.'));

      if (!isNaN(numberValue)) {
        total = new Intl.NumberFormat('es-AR', {
          minimumFractionDigits: 0, // If round number, no decimals
          maximumFractionDigits: 2, // Max 2 decimals
        }).format(numberValue);
      }
    } catch (e) {
      console.log("Error formateando numero", e);
    }

    const baseUrl = new URL(request.url).origin; 
    const imageUrl = `${baseUrl}/images/gift-card-base.png`;
    
    const imageRes = await fetch(imageUrl);
    
    if (!imageRes.ok) {
        console.error(`Error fetching image: ${imageRes.status} ${imageRes.statusText}`);
        throw new Error("No se pudo cargar la imagen base");
    }

    const arrayBuffer = await imageRes.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    
    // 3. Llamar al servicio con el buffer que acabamos de leer
    const finalImage = await generateImage(imageBuffer, {
      name,
      total,
      msg: msg || '' 
    });

    return new NextResponse(finalImage as any, {
      headers: { 
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="giftcard-${name}.png"`
      },
    });
  } catch (error) {
    console.error("Error en API GiftCard:", error);
    return NextResponse.json({ error: 'Error generando la tarjeta' }, { status: 500 });
  }
}
