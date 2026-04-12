import { jsPDF } from 'jspdf'
import { supabase } from '../lib/supabase'
import type { BookingRequest } from './bookingService'

/**
 * Format date for the contract (DD-MM-YYYY)
 */
const formatDateContract = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}-${m}-${y}`
}

/**
 * Generate a PDF contract and return it as a Blob
 */
export const generateContractPDF = (request: BookingRequest, template: string): Blob => {
  const doc = new jsPDF()

  // Replacement logic
  let content = template
    .replace(/\{guest_name\}/gi, request.guest_name)
    .replace(/\{start_date\}/gi, formatDateContract(request.start_date))
    .replace(/\{end_date\}/gi, formatDateContract(request.end_date))
    .replace(/\{total_price\}/gi, request.total_price.toString())

  // --- PDF Styling ---
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('HUURCONTRACT', 105, 20, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(50, 50, 50)

  // Multiline support for the content
  const splitText = doc.splitTextToSize(content, 170)
  doc.text(splitText, 20, 40)

  // Footer / Signature placeholders
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.text('_______________________', 20, pageHeight - 40)
  doc.text('Datum: ' + new Date().toLocaleDateString('nl-NL'), 20, pageHeight - 15)


  // Return as Blob for storage upload
  return doc.output('blob')
}

/**
 * Upload a contract PDF to Supabase Storage and return the public URL
 */
export const uploadContractPDF = async (bookingId: string, pdfBlob: Blob): Promise<string | null> => {
  const fileName = `contract_${bookingId}_${Date.now()}.pdf`
  const filePath = `${fileName}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('contracts')
    .upload(filePath, pdfBlob, {
      cacheControl: '3600',
      upsert: true
    })

  if (uploadError) {
    console.error('FAILED TO UPLOAD PDF TO SUPABASE:', uploadError.message, uploadError)
    return null
  }

  console.log('PDF Uploaded Successfully:', uploadData)

  // Get public URL
  const { data } = supabase.storage
    .from('contracts')
    .getPublicUrl(filePath)

  if (!data || !data.publicUrl) {
    console.error('FAILED TO GET PUBLIC URL FOR PDF')
    return null
  }

  return data.publicUrl
}
