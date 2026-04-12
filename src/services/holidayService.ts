export interface HolidayPeriod {
  id: string
  startDate: string
  endDate: string
  name: { language: string; text: string }[]
}

let holidayCache: HolidayPeriod[] = []
let lastFetchYear: number | null = null

export const getSchoolHolidays = async (year: number): Promise<HolidayPeriod[]> => {
  // Simple cache to avoid redundant hits in same session
  if (lastFetchYear === year && holidayCache.length > 0) {
    return holidayCache
  }

  try {
    const start = `${year}-01-01`
    const end = `${year + 1}-12-31`
    
    // Fetch both School and Public Holidays in parallel
    const baseUrl = 'https://openholidaysapi.org'
    const query = `countryIsoCode=BE&languageIsoCode=NL&validFrom=${start}&validTo=${end}`
    
    const [schoolRes, publicRes] = await Promise.all([
      fetch(`${baseUrl}/SchoolHolidays?${query}`),
      fetch(`${baseUrl}/PublicHolidays?${query}`)
    ])
    
    if (!schoolRes.ok || !publicRes.ok) throw new Error('Failed to fetch holidays')
    
    const schoolData = await schoolRes.json()
    const publicData = await publicRes.json()
    
    // Combine and Filter
    // 1. Flanders school holidays (BE-NL group)
    const flandersSchool = schoolData.filter((h: any) => 
      h.groups && h.groups.some((g: any) => g.code === 'BE-NL' || g.shortName === 'NL')
    )
    
    // 2. Nationwide public holidays or Flanders specific (July 11)
    const relevantPublic = publicData.filter((h: any) => 
      h.nationwide === true || 
      (h.groups && h.groups.some((g: any) => g.code === 'BE-NL')) ||
      (h.subdivisions && h.subdivisions.some((s: any) => s.code === 'BE-VLG'))
    )
    
    const combined = [...flandersSchool, ...relevantPublic]
    
    holidayCache = combined
    lastFetchYear = year
    return combined
  } catch (error) {
    console.error('Holiday fetch error:', error)
    return []
  }
}

export const isDateInHoliday = (date: Date, holidays: HolidayPeriod[]): boolean => {
  const dStr = formatDateLocal(date)
  return holidays.some(h => dStr >= h.startDate && dStr <= h.endDate)
}

export const formatDateLocal = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const isWeekendPriceDay = (date: Date, holidays: HolidayPeriod[]): boolean => {
  const day = date.getDay()
  // 5 = Friday, 6 = Saturday, 0 = Sunday
  const isWeekendDay = day === 5 || day === 6 || day === 0
  if (isWeekendDay) return true
  
  const dStr = formatDateLocal(date)
  
  // Grandpa Logic: Also check if tomorrow is a holiday
  const tomorrow = new Date(date)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const nextStr = formatDateLocal(tomorrow)
  
  return holidays.some(h => {
    const isTodayHoliday = dStr >= h.startDate && dStr <= h.endDate
    const isTomorrowHoliday = nextStr >= h.startDate && nextStr <= h.endDate
    return isTodayHoliday || isTomorrowHoliday
  })
}
