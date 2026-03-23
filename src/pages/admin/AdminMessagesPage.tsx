import { useState, useEffect } from 'react'
import { contactMessagesApi, type ContactMessage } from '../../api/contact-messages'
import { Trash2, Mail, MailOpen, Calendar, User, Building2, Phone } from 'lucide-react'

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await contactMessagesApi.getAll()
      setMessages(data)
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await contactMessagesApi.markAsRead(id)
      loadMessages()
    } catch (error) {
      console.error('Mesaj güncellenemedi:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return
    try {
      await contactMessagesApi.delete(id)
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      loadMessages()
    } catch (error) {
      console.error('Mesaj silinemedi:', error)
    }
  }

  const handleSelectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)
    if (!message.read) {
      await handleMarkAsRead(message.id)
    }
  }

  const unreadCount = messages.filter(m => !m.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">İletişim Mesajları</h1>
          <p className="text-gray-400 text-sm mt-1">
            Toplam {messages.length} mesaj {unreadCount > 0 && `(${unreadCount} okunmamış)`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => handleSelectMessage(message)}
              className={`bg-gray-800 rounded-lg p-4 border cursor-pointer transition-all ${
                selectedMessage?.id === message.id
                  ? 'border-blue-500 bg-gray-750'
                  : message.read
                  ? 'border-gray-700 hover:border-gray-600'
                  : 'border-blue-500/30 bg-blue-500/5 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {message.read ? (
                    <MailOpen className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-blue-400" />
                  )}
                  <h3 className="font-semibold text-white text-sm">{message.name}</h3>
                </div>
              </div>
              <p className="text-gray-400 text-xs mb-2">{message.email}</p>
              <p className="text-gray-300 text-sm line-clamp-2">{message.message}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {new Date(message.createdAt).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              Henüz mesaj yok.
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                      <p className="text-gray-400 text-sm">{selectedMessage.email}</p>
                    </div>
                  </div>

                  {selectedMessage.company && (
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">{selectedMessage.company}</span>
                    </div>
                  )}

                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{selectedMessage.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedMessage.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">MESAJ</h3>
                <div className="bg-gray-900 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Mesaj detaylarını görmek için sol taraftan bir mesaj seçin</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
