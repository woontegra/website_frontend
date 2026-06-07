# Woontegra statik görseller

Bu klasördeki dosyalar Vercel deploy ile birlikte `https://woontegra.com/images/...` altında servis edilir.

**Önemli:** Dosyalar Git'e commit edilmezse production'da 404 olur ve sayfalarda "Görsel hazırlanıyor" placeholder görünür.

Admin panelinden yüklenen CMS görselleri Cloudinary'ye (backend `CLOUDINARY_*` env) gider.
`/uploads/...` yolları Railway geçici diskindedir — redeploy sonrası kaybolabilir.
