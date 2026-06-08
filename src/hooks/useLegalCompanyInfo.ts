import { useEffect, useState } from 'react'
import { fetchLegalCompanyInfo } from '../api/legalCompanyInfo'
import { defaultLegalCompanyInfo, type LegalCompanyInfo } from '../data/legalCompanyInfo'

export function useLegalCompanyInfo(): LegalCompanyInfo {
  const [info, setInfo] = useState<LegalCompanyInfo>(defaultLegalCompanyInfo)

  useEffect(() => {
    void fetchLegalCompanyInfo().then(setInfo)
  }, [])

  return info
}
