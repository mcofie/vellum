import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { personalDetails, assets, beneficiaries, executors } = body

  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 size in points
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  // Title
  page.drawText('LAST WILL AND TESTAMENT', {
    x: 150,
    y: height - 100,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  })

  // Content
  let y = height - 160
  const drawLine = (text: string, isBold = false) => {
    page.drawText(text, {
      x: 50,
      y,
      size: 12,
      font: isBold ? boldFont : font,
    })
    y -= 25
  }

  drawLine(`I, ${personalDetails?.fullName || '[NAME]'}, of ${personalDetails?.address || '[ADDRESS]'},`, true)
  drawLine('holding Ghana Card ID ' + (personalDetails?.ghanaCardId || '[ID]'))
  drawLine('being of sound mind and memory, do hereby make, publish and declare this to be my Last Will and Testament.', false)
  
  y -= 20
  drawLine('1. REVOCATION', true)
  drawLine('I hereby revoke all former Wills and Codicils made by me.')

  y -= 20
  drawLine('2. EXECUTORS', true)
  executors?.forEach((exec: any, i: number) => {
    drawLine(`${i + 1}. I appoint ${exec.fullName} of ${exec.address} as Executor of this my Will.`)
  })

  // Assets & Beneficiaries
  y -= 20
  drawLine('3. DISPOSITION OF PROPERTY', true)
  assets?.forEach((asset: any) => {
    drawLine(`My interest in ${asset.type} located at ${asset.location} to be given to...`)
  })

  // Customary Succession Note
  if (body.customarySuccession?.hasFamilyLand) {
    y -= 20
    drawLine('4. CUSTOMARY PROPERTY STATEMENT', true)
    drawLine('Regarding family-owned assets: ' + body.customarySuccession.details)
  }

  // Footer for signature
  y = 120
  drawLine('__________________________', true)
  drawLine('TESTATOR SIGNATURE', false)
  drawLine('Date: ' + new Date().toLocaleDateString())

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()

  // Set headers to download the PDF
  setHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="Will-Ghana.pdf"',
  })

  return pdfBytes
})
