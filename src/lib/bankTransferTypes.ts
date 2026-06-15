/** Backend `getBankTransferCustomerInfo` ile uyumlu */
export type BankTransferInfoDto = {
  bankName: string
  accountHolder: string
  iban: string
  ibanCompact: string
  branchName?: string | null
  accountNumber?: string | null
  instructions?: string | null
  paymentReference: string
  orderTotal: number
  currency: string
  amountFormatted: string
}

export function formatIbanDisplay(iban: string): string {
  const compact = iban.replace(/\s+/g, '').toUpperCase()
  if (!compact) return iban
  return compact.replace(/(.{4})/g, '$1 ').trim()
}
