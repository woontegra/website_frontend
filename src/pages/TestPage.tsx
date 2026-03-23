import { useState, useEffect } from 'react'

export function TestPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    fetch('http://localhost:4000/api/services')
      .then(res => res.json())
      .then(json => {
        console.log('API Response:', json)
        setData(json)
      })
      .catch(err => {
        console.error('API Error:', err)
        setError(err.message)
      })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      {data && (
        <div>
          <p className="text-green-600 mb-4">✅ API Connected!</p>
          <p className="mb-2">Services count: {data.data?.length || 0}</p>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
