import sharp from 'sharp';

export interface GiftCard {
  name: string,
  total: string,
  msg?: string
}

export async function generateImage(
  baseImageBuffer: Buffer, 
  fontBuffer: Buffer,
  textos: GiftCard
): Promise<Buffer> {
  try {
    const metadata = await sharp(baseImageBuffer).metadata();
    const width = metadata.width ?? 1000; // Default values just in case
    const height = metadata.height ?? 1000;

    const fontBase64 = fontBuffer.toString('base64');

    const today = new Date();
    const dateStr = today.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, ' - ');

    // Slice text into two lines
    const limit = 50 // Max char
    let msg = textos.msg

    let lines = [];

    if (msg && msg.length > limit) {
        const textoRecortado = msg.substring(0, limit);        
        let puntoCorte = textoRecortado.lastIndexOf(' ');
        if (puntoCorte === -1) puntoCorte = limit;
        
        const linea1 = msg.substring(0, puntoCorte);
        const linea2 = msg.substring(puntoCorte + 1);
        
        lines = [linea1, linea2];
    } else {
      lines = [msg];
    }

    // Create SVG
    let innerContent;

    if (lines.length === 1) {
        innerContent = lines[0];
    } else {
        innerContent = `
            <tspan x="800" dy="-0.6em">${lines[0]}</tspan>
            <tspan x="800" dy="1.2em">${lines[1]}</tspan>
        `;
    }
    const svgTemplate = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
           @font-face {
            font-family: 'CustomFont';
            src: url('data:font/ttf;base64,${fontBase64}') format('truetype');
            font-weight: bold;
            font-style: normal;
          }
          .data {
            fill: black;          
            font-family: 'CustomFont';
            font-weight: bold;
            font-size: 45px;
          }
          .msg {
            fill: white;          
            font-family: 'CustomFont';
            font-size: 40px;
            font-weight: 600;
          }
        </style>
        
        <text x="875" y="630" class="data" text-anchor="middle">
          $${textos.total}
        </text>

        <text x="790" y="735" class="data" text-anchor="middle">
          ${dateStr}
        </text>

        <text x="880" y="835" class="data" text-anchor="middle">
          ${textos.name}
        </text>

         <text x="800" y="940" class="msg" text-anchor="middle">
          ${innerContent}
        </text>
      </svg>
    `;

    // Put SVG over base iamge
    const finalBuffer = await sharp(baseImageBuffer)
      .composite([
        { input: Buffer.from(svgTemplate), top: 0, left: 0 },
      ])
      .png() // PNG Output
      .toBuffer();

    return finalBuffer;

  } catch (error) {
    console.error("Error generando imagen:", error);
    throw new Error("Falló el procesamiento");
  }
}