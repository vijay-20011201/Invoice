import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const generatePDF = async (elementId, filename = 'invoice.pdf') => {
  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = imgWidth / imgHeight
  const imgPdfWidth = pdfWidth
  const imgPdfHeight = pdfWidth / ratio

  let heightLeft = imgPdfHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgPdfWidth, imgPdfHeight)
  heightLeft -= pdfHeight

  while (heightLeft > 0) {
    position = heightLeft - imgPdfHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgPdfWidth, imgPdfHeight)
    heightLeft -= pdfHeight
  }

  pdf.save(filename)
}
