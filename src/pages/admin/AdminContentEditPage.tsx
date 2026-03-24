import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { HomeSections } from '../../components/admin/HomeSections'
import { PageSections } from '../../components/admin/PageSections'
import { getApiUrl } from '../../config/api'
import { 
  defaultAboutData,
  defaultContactData,
  defaultSoftwareDevData, 
  defaultWebDesignData, 
  defaultEcommerceData, 
  defaultSaasData, 
  defaultTrademarkData,
  defaultConsultingData,
  defaultSolutionsData, 
  defaultBlogData, 
  defaultFAQData 
} from '../../data/allPagesData'

interface PageContentData {
  [key: string]: string
}

const PAGE_CONFIGS = {
  home: {
    title: 'Ana Sayfa',
    fields: [
      { key: 'heroTag', label: 'Hero Etiket', type: 'text' },
      { key: 'heroTitle', label: 'Hero Başlık', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      { key: 'heroButton1Text', label: 'Hero Buton 1', type: 'text' },
      { key: 'heroButton2Text', label: 'Hero Buton 2', type: 'text' },
      
      { key: 'introParagraph1', label: 'Giriş Paragraf 1', type: 'textarea' },
      { key: 'introParagraph2', label: 'Giriş Paragraf 2 (Vurgulu)', type: 'textarea' },
      
      { key: 'servicesTitle', label: 'Hizmetler Bölüm Başlık', type: 'text' },
      { key: 'servicesSubtitle', label: 'Hizmetler Bölüm Alt Başlık', type: 'text' },
      { key: 'service1Title', label: 'Hizmet 1 - Yazılım Geliştirme Başlık', type: 'text' },
      { key: 'service1Desc', label: 'Hizmet 1 - Yazılım Geliştirme Açıklama', type: 'textarea' },
      { key: 'service2Title', label: 'Hizmet 2 - Web Tasarım Başlık', type: 'text' },
      { key: 'service2Desc', label: 'Hizmet 2 - Web Tasarım Açıklama', type: 'textarea' },
      { key: 'service3Title', label: 'Hizmet 3 - E-Ticaret Başlık', type: 'text' },
      { key: 'service3Desc', label: 'Hizmet 3 - E-Ticaret Açıklama', type: 'textarea' },
      { key: 'service4Title', label: 'Hizmet 4 - SaaS Başlık', type: 'text' },
      { key: 'service4Desc', label: 'Hizmet 4 - SaaS Açıklama', type: 'textarea' },
      { key: 'service5Title', label: 'Hizmet 5 - Marka & Patent Başlık', type: 'text' },
      { key: 'service5Desc', label: 'Hizmet 5 - Marka & Patent Açıklama', type: 'textarea' },
      { key: 'service6Title', label: 'Hizmet 6 - Danışmanlık Başlık', type: 'text' },
      { key: 'service6Desc', label: 'Hizmet 6 - Danışmanlık Açıklama', type: 'textarea' },
      
      { key: 'brandsTitle', label: 'Markalar Bölüm Başlık', type: 'text' },
      { key: 'brandsSubtitle', label: 'Markalar Bölüm Alt Başlık', type: 'text' },
      { key: 'brand1Name', label: 'Marka 1 - Bilirkişi İsim', type: 'text' },
      { key: 'brand1Desc', label: 'Marka 1 - Bilirkişi Açıklama', type: 'textarea' },
      { key: 'brand2Name', label: 'Marka 2 - Optimoon İsim', type: 'text' },
      { key: 'brand2Desc', label: 'Marka 2 - Optimoon Açıklama', type: 'textarea' },
      { key: 'brand3Name', label: 'Marka 3 - Datça Tropikal İsim', type: 'text' },
      { key: 'brand3Desc', label: 'Marka 3 - Datça Tropikal Açıklama', type: 'textarea' },
      { key: 'brand4Name', label: 'Marka 4 - Mercan Danışmanlık İsim', type: 'text' },
      { key: 'brand4Desc', label: 'Marka 4 - Mercan Danışmanlık Açıklama', type: 'textarea' },
      
      { key: 'whyTitle', label: 'Neden Woontegra Bölüm Başlık', type: 'text' },
      { key: 'whySubtitle', label: 'Neden Woontegra Bölüm Alt Başlık', type: 'text' },
      { key: 'why1Title', label: 'Neden 1 - Gerçek Ürün Deneyimi Başlık', type: 'text' },
      { key: 'why1Desc', label: 'Neden 1 - Gerçek Ürün Deneyimi Açıklama', type: 'textarea' },
      { key: 'why2Title', label: 'Neden 2 - Uçtan Uca Sistem Başlık', type: 'text' },
      { key: 'why2Desc', label: 'Neden 2 - Uçtan Uca Sistem Açıklama', type: 'textarea' },
      { key: 'why3Title', label: 'Neden 3 - Performans Başlık', type: 'text' },
      { key: 'why3Desc', label: 'Neden 3 - Performans Açıklama', type: 'textarea' },
      { key: 'why4Title', label: 'Neden 4 - Modern Teknoloji Başlık', type: 'text' },
      { key: 'why4Desc', label: 'Neden 4 - Modern Teknoloji Açıklama', type: 'textarea' },
      { key: 'why5Title', label: 'Neden 5 - Aktif Markalar Başlık', type: 'text' },
      { key: 'why5Desc', label: 'Neden 5 - Aktif Markalar Açıklama', type: 'textarea' },
      { key: 'why6Title', label: 'Neden 6 - Sürekli Gelişim Başlık', type: 'text' },
      { key: 'why6Desc', label: 'Neden 6 - Sürekli Gelişim Açıklama', type: 'textarea' },
      
      { key: 'processTitle', label: 'Süreç Bölüm Başlık', type: 'text' },
      { key: 'processSubtitle', label: 'Süreç Bölüm Alt Başlık', type: 'text' },
      { key: 'process1Title', label: 'Süreç 1 - Analiz Başlık', type: 'text' },
      { key: 'process1Desc', label: 'Süreç 1 - Analiz Açıklama', type: 'textarea' },
      { key: 'process2Title', label: 'Süreç 2 - Planlama Başlık', type: 'text' },
      { key: 'process2Desc', label: 'Süreç 2 - Planlama Açıklama', type: 'textarea' },
      { key: 'process3Title', label: 'Süreç 3 - Geliştirme Başlık', type: 'text' },
      { key: 'process3Desc', label: 'Süreç 3 - Geliştirme Açıklama', type: 'textarea' },
      { key: 'process4Title', label: 'Süreç 4 - Yayın Başlık', type: 'text' },
      { key: 'process4Desc', label: 'Süreç 4 - Yayın Açıklama', type: 'textarea' },
      
      { key: 'ctaTitle', label: 'CTA Başlık', type: 'textarea' },
      { key: 'ctaSubtitle', label: 'CTA Alt Başlık', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Buton', type: 'text' },
    ],
  },
  about: {
    title: 'Hakkımızda',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlık', type: 'text' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      
      { key: 'whatIsTitle', label: 'Woontegra Nedir Başlık', type: 'text' },
      { key: 'whatIsParagraph1', label: 'Woontegra Nedir - Paragraf 1', type: 'textarea' },
      { key: 'whatIsParagraph2', label: 'Woontegra Nedir - Paragraf 2', type: 'textarea' },
      { key: 'whatIsParagraph3', label: 'Woontegra Nedir - Paragraf 3', type: 'textarea' },
      { key: 'whatIsParagraph4', label: 'Woontegra Nedir - Paragraf 4', type: 'textarea' },
      { key: 'whatIsParagraph5', label: 'Woontegra Nedir - Paragraf 5 (Vurgulu)', type: 'textarea' },
      
      { key: 'storyTitle', label: 'Hikaye Başlık', type: 'text' },
      { key: 'storyParagraph1', label: 'Hikaye - Paragraf 1', type: 'textarea' },
      { key: 'storyParagraph2', label: 'Hikaye - Paragraf 2', type: 'textarea' },
      { key: 'storyParagraph3', label: 'Hikaye - Paragraf 3', type: 'textarea' },
      { key: 'storyParagraph4', label: 'Hikaye - Paragraf 4', type: 'textarea' },
      { key: 'storyParagraph5', label: 'Hikaye - Paragraf 5 (Vurgulu)', type: 'textarea' },
      
      { key: 'differenceTitle', label: 'Bizi Farklı Yapan Ne Başlık', type: 'text' },
      { key: 'diff1Title', label: 'Fark 1 - Sadece Hizmet Değil, Ürün Başlık', type: 'text' },
      { key: 'diff1Desc', label: 'Fark 1 - Açıklama', type: 'textarea' },
      { key: 'diff2Title', label: 'Fark 2 - Gerçek Deneyim Başlık', type: 'text' },
      { key: 'diff2Desc', label: 'Fark 2 - Açıklama', type: 'textarea' },
      { key: 'diff3Title', label: 'Fark 3 - Tek Yapı Başlık', type: 'text' },
      { key: 'diff3Desc', label: 'Fark 3 - Açıklama', type: 'textarea' },
      
      { key: 'brandsIntro1', label: 'Markalar Giriş Paragraf 1', type: 'textarea' },
      { key: 'brandsIntro2', label: 'Markalar Giriş Paragraf 2', type: 'textarea' },
      { key: 'brandsTitle', label: 'Markalar Bölüm Başlık', type: 'text' },
      
      { key: 'brand1Name', label: 'Marka 1 - Bilirkişi İsim', type: 'text' },
      { key: 'brand1Desc1', label: 'Marka 1 - Açıklama 1', type: 'textarea' },
      { key: 'brand1Desc2', label: 'Marka 1 - Kullanım Alanı', type: 'textarea' },
      { key: 'brand1Desc3', label: 'Marka 1 - Hedef Kullanıcı', type: 'textarea' },
      
      { key: 'brand2Name', label: 'Marka 2 - Optimoon İsim', type: 'text' },
      { key: 'brand2Desc1', label: 'Marka 2 - Açıklama 1', type: 'textarea' },
      { key: 'brand2Desc2', label: 'Marka 2 - Kullanım Alanı', type: 'textarea' },
      { key: 'brand2Desc3', label: 'Marka 2 - Hedef Kullanıcı', type: 'textarea' },
      
      { key: 'brand3Name', label: 'Marka 3 - Datça Tropikal İsim', type: 'text' },
      { key: 'brand3Desc1', label: 'Marka 3 - Açıklama 1', type: 'textarea' },
      { key: 'brand3Desc2', label: 'Marka 3 - Kullanım Alanı', type: 'textarea' },
      { key: 'brand3Desc3', label: 'Marka 3 - Hedef Kullanıcı', type: 'textarea' },
      
      { key: 'brand4Name', label: 'Marka 4 - Mercan Danışmanlık İsim', type: 'text' },
      { key: 'brand4Desc1', label: 'Marka 4 - Açıklama 1', type: 'textarea' },
      { key: 'brand4Desc2', label: 'Marka 4 - Kullanım Alanı', type: 'textarea' },
      { key: 'brand4Desc3', label: 'Marka 4 - Hedef Kullanıcı', type: 'textarea' },
    ],
  },
  contact: {
    title: 'İletişim',
    fields: [
      { key: 'heroTitle', label: 'Sayfa Başlık', type: 'text' },
      { key: 'heroSubtitle', label: 'Sayfa Alt Başlık', type: 'textarea' },
      { key: 'emailLabel', label: 'E-posta Kutu Başlık', type: 'text' },
      { key: 'email', label: 'E-posta Adresi', type: 'text' },
      { key: 'phoneLabel', label: 'Telefon Kutu Başlık', type: 'text' },
      { key: 'phone', label: 'Telefon Numarası', type: 'text' },
      { key: 'addressLabel', label: 'Adres Kutu Başlık', type: 'text' },
      { key: 'address', label: 'Adres', type: 'textarea' },
      { key: 'formTitle', label: 'Form Başlık', type: 'text' },
    ],
  },
  // Service pages removed - now using section-based system
  /*
  'software-development': {
    title: '→ Yazılım Geliştirme',
    category: 'Hizmetler',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlık', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      { key: 'heroButton1Text', label: 'Hero Buton 1', type: 'text' },
      { key: 'heroButton2Text', label: 'Hero Buton 2', type: 'text' },
      { key: 'problemTitle', label: 'Sorun Başlık', type: 'textarea' },
      { key: 'problemIntro', label: 'Sorun Giriş', type: 'text' },
      { key: 'problem1', label: 'Sorun 1', type: 'text' },
      { key: 'problem2', label: 'Sorun 2', type: 'text' },
      { key: 'problem3', label: 'Sorun 3', type: 'text' },
      { key: 'problemConclusion', label: 'Sorun Sonuç', type: 'text' },
      { key: 'solutionTitle', label: 'Çözüm Başlık', type: 'text' },
      { key: 'solutionIntro', label: 'Çözüm Giriş', type: 'textarea' },
      { key: 'solutionBenefit', label: 'Çözüm Fayda Başlık', type: 'text' },
      { key: 'benefit1', label: 'Fayda 1', type: 'text' },
      { key: 'benefit2', label: 'Fayda 2', type: 'text' },
      { key: 'benefit3', label: 'Fayda 3', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Başlık', type: 'textarea' },
      { key: 'ctaSubtitle', label: 'CTA Alt Başlık', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Buton', type: 'text' },
    ],
  },
  'web-design': {
    title: '→ Web Tasarım',
    category: 'Hizmetler',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlık', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      { key: 'heroButton1Text', label: 'Hero Buton 1', type: 'text' },
      { key: 'heroButton2Text', label: 'Hero Buton 2', type: 'text' },
      { key: 'problemTitle', label: 'Sorun Başlık', type: 'textarea' },
      { key: 'problemIntro', label: 'Sorun Giriş', type: 'text' },
      { key: 'problem1', label: 'Sorun 1', type: 'text' },
      { key: 'problem2', label: 'Sorun 2', type: 'text' },
      { key: 'problem3', label: 'Sorun 3', type: 'text' },
      { key: 'problem4', label: 'Sorun 4', type: 'text' },
      { key: 'problemConclusion', label: 'Sorun Sonuç', type: 'text' },
      { key: 'solutionTitle', label: 'Çözüm Başlık', type: 'text' },
      { key: 'solutionIntro', label: 'Çözüm Giriş', type: 'textarea' },
      { key: 'solutionBenefit', label: 'Çözüm Fayda Başlık', type: 'text' },
      { key: 'benefit1', label: 'Fayda 1', type: 'text' },
      { key: 'benefit2', label: 'Fayda 2', type: 'text' },
      { key: 'benefit3', label: 'Fayda 3', type: 'text' },
      { key: 'benefit4', label: 'Fayda 4', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Başlık', type: 'textarea' },
      { key: 'ctaSubtitle', label: 'CTA Alt Başlık', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Buton', type: 'text' },
    ],
  },
  ecommerce: {
    title: '→ E-Ticaret',
    category: 'Hizmetler',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlık', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      { key: 'heroButton1Text', label: 'Hero Buton 1', type: 'text' },
      { key: 'heroButton2Text', label: 'Hero Buton 2', type: 'text' },
      { key: 'problemTitle', label: 'Sorun Başlık', type: 'textarea' },
      { key: 'problemIntro', label: 'Sorun Giriş', type: 'text' },
      { key: 'problem1', label: 'Sorun 1', type: 'text' },
      { key: 'problem2', label: 'Sorun 2', type: 'text' },
      { key: 'problem3', label: 'Sorun 3', type: 'text' },
      { key: 'problem4', label: 'Sorun 4', type: 'text' },
      { key: 'problemConclusion', label: 'Sorun Sonuç', type: 'text' },
      { key: 'solutionTitle', label: 'Çözüm Başlık', type: 'text' },
      { key: 'solutionIntro', label: 'Çözüm Giriş', type: 'textarea' },
      { key: 'solutionBenefit', label: 'Çözüm Fayda Başlık', type: 'text' },
      { key: 'benefit1', label: 'Fayda 1', type: 'text' },
      { key: 'benefit2', label: 'Fayda 2', type: 'text' },
      { key: 'benefit3', label: 'Fayda 3', type: 'text' },
      { key: 'benefit4', label: 'Fayda 4', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Başlık', type: 'textarea' },
      { key: 'ctaSubtitle', label: 'CTA Alt Başlık', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Buton', type: 'text' },
    ],
  },
  saas: {
    title: '→ SaaS Ürün Geliştirme',
    category: 'Hizmetler',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlık', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      { key: 'heroButton1Text', label: 'Hero Buton 1', type: 'text' },
      { key: 'heroButton2Text', label: 'Hero Buton 2', type: 'text' },
      
      { key: 'problemTitle', label: 'Sorun Bölüm Başlık', type: 'textarea' },
      { key: 'problemIntro', label: 'Sorun Giriş Metni', type: 'text' },
      { key: 'problem1', label: 'Sorun 1', type: 'text' },
      { key: 'problem2', label: 'Sorun 2', type: 'text' },
      { key: 'problem3', label: 'Sorun 3', type: 'text' },
      { key: 'problem4', label: 'Sorun 4', type: 'text' },
      { key: 'problemConclusion', label: 'Sorun Sonuç Metni', type: 'text' },
      
      { key: 'solutionTitle', label: 'Çözüm Bölüm Başlık', type: 'text' },
      { key: 'solutionIntro', label: 'Çözüm Giriş Metni', type: 'textarea' },
      { key: 'solution1', label: 'Çözüm 1 - Ürün planlama', type: 'text' },
      { key: 'solution2', label: 'Çözüm 2 - Sistem mimarisi', type: 'text' },
      { key: 'solution3', label: 'Çözüm 3 - Geliştirme', type: 'text' },
      { key: 'solution4', label: 'Çözüm 4 - Yayına alma', type: 'text' },
      { key: 'solutionConclusion', label: 'Çözüm Sonuç Metni', type: 'text' },
      
      { key: 'systemsTitle', label: 'Sistemler Bölüm Başlık', type: 'text' },
      { key: 'system1Title', label: 'Sistem 1 - Üyelik Sistemleri Başlık', type: 'text' },
      { key: 'system1Desc', label: 'Sistem 1 - Açıklama', type: 'text' },
      { key: 'system2Title', label: 'Sistem 2 - Yönetim Panelleri Başlık', type: 'text' },
      { key: 'system2Desc', label: 'Sistem 2 - Açıklama', type: 'text' },
      { key: 'system3Title', label: 'Sistem 3 - Çok Kullanıcılı Sistemler Başlık', type: 'text' },
      { key: 'system3Desc', label: 'Sistem 3 - Açıklama', type: 'text' },
      { key: 'system4Title', label: 'Sistem 4 - Abonelik Altyapıları Başlık', type: 'text' },
      { key: 'system4Desc', label: 'Sistem 4 - Açıklama', type: 'text' },
      { key: 'system5Title', label: 'Sistem 5 - API Tabanlı Sistemler Başlık', type: 'text' },
      { key: 'system5Desc', label: 'Sistem 5 - Açıklama', type: 'text' },
      { key: 'system6Title', label: 'Sistem 6 - Dashboard & Analiz Başlık', type: 'text' },
      { key: 'system6Desc', label: 'Sistem 6 - Açıklama', type: 'text' },
      
      { key: 'techTitle', label: 'Teknik Yapı Bölüm Başlık', type: 'text' },
      { key: 'tech1Title', label: 'Teknik 1 - Multi-tenant yapı Başlık', type: 'text' },
      { key: 'tech1Desc', label: 'Teknik 1 - Açıklama', type: 'text' },
      { key: 'tech2Title', label: 'Teknik 2 - Güvenli veri yönetimi Başlık', type: 'text' },
      { key: 'tech2Desc', label: 'Teknik 2 - Açıklama', type: 'text' },
      { key: 'tech3Title', label: 'Teknik 3 - Hızlı ve ölçeklenebilir Başlık', type: 'text' },
      { key: 'tech3Desc', label: 'Teknik 3 - Açıklama', type: 'text' },
      { key: 'tech4Title', label: 'Teknik 4 - Modern frontend Başlık', type: 'text' },
      { key: 'tech4Desc', label: 'Teknik 4 - Açıklama', type: 'text' },
      { key: 'tech5Title', label: 'Teknik 5 - API-first yaklaşım Başlık', type: 'text' },
      { key: 'tech5Desc', label: 'Teknik 5 - Açıklama', type: 'text' },
      
      { key: 'whyTitle', label: 'Neden Woontegra Bölüm Başlık', type: 'text' },
      { key: 'why1', label: 'Neden 1', type: 'text' },
      { key: 'why2', label: 'Neden 2', type: 'text' },
      { key: 'why3', label: 'Neden 3', type: 'text' },
      { key: 'why4', label: 'Neden 4', type: 'text' },
      
      { key: 'ctaTitle', label: 'CTA Başlık', type: 'textarea' },
      { key: 'ctaSubtitle', label: 'CTA Alt Başlık', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Buton', type: 'text' },
    ],
  },
  'trademark-patent': {
    title: '→ Marka & Patent',
    category: 'Hizmetler',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlık', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      { key: 'heroButton1Text', label: 'Hero Buton 1', type: 'text' },
      { key: 'heroButton2Text', label: 'Hero Buton 2', type: 'text' },
      { key: 'introText', label: 'Giriş Metni', type: 'textarea' },
      { key: 'servicesTitle', label: 'Hizmetler Başlık', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Başlık', type: 'textarea' },
      { key: 'ctaSubtitle', label: 'CTA Alt Başlık', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Buton', type: 'text' },
    ],
  },
  'game-development': {
    title: '→ Oyun Geliştirme',
    category: 'Hizmetler',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlık', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      { key: 'heroButton1Text', label: 'Hero Buton 1', type: 'text' },
      { key: 'heroButton2Text', label: 'Hero Buton 2', type: 'text' },
      { key: 'introText', label: 'Giriş Metni', type: 'textarea' },
      { key: 'featuresTitle', label: 'Özellikler Başlık', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Başlık', type: 'textarea' },
      { key: 'ctaSubtitle', label: 'CTA Alt Başlık', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Buton', type: 'text' },
    ],
  },
  'digital-consulting': {
    title: '→ Dijital Danışmanlık',
    category: 'Hizmetler',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlık', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      { key: 'heroButton1Text', label: 'Hero Buton 1', type: 'text' },
      { key: 'heroButton2Text', label: 'Hero Buton 2', type: 'text' },
      { key: 'introText', label: 'Giriş Metni', type: 'textarea' },
      { key: 'servicesTitle', label: 'Hizmetler Başlık', type: 'text' },
      { key: 'ctaTitle', label: 'CTA Başlık', type: 'textarea' },
      { key: 'ctaSubtitle', label: 'CTA Alt Başlık', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Buton', type: 'text' },
    ],
  },
  solutions: {
    title: 'Çözümler',
    fields: [
      { key: 'heroTitle', label: 'Hero Başlık', type: 'textarea' },
      { key: 'heroSubtitle', label: 'Hero Alt Başlık', type: 'textarea' },
      { key: 'introParagraph1', label: 'Giriş Paragraf 1', type: 'textarea' },
      { key: 'introParagraph2', label: 'Giriş Paragraf 2', type: 'textarea' },
      
      { key: 'bilirkisiTitle', label: 'Bilirkişi Başlık', type: 'textarea' },
      { key: 'bilirkisiDesc1', label: 'Bilirkişi Açıklama 1', type: 'textarea' },
      { key: 'bilirkisiDesc2', label: 'Bilirkişi Açıklama 2', type: 'textarea' },
      { key: 'bilirkisiDesc3', label: 'Bilirkişi Açıklama 3 (Vurgulu)', type: 'textarea' },
      { key: 'bilirkisiButtonText', label: 'Bilirkişi Buton', type: 'text' },
      
      { key: 'optimoonTitle', label: 'Optimoon Başlık', type: 'textarea' },
      { key: 'optimoonDesc1', label: 'Optimoon Açıklama 1', type: 'textarea' },
      { key: 'optimoonDesc2', label: 'Optimoon Açıklama 2 (Vurgulu)', type: 'textarea' },
      { key: 'optimoonButtonText', label: 'Optimoon Buton', type: 'text' },
      
      { key: 'datcaTitle', label: 'Datça Tropikal Başlık', type: 'textarea' },
      { key: 'datcaDesc1', label: 'Datça Açıklama 1', type: 'textarea' },
      { key: 'datcaDesc2', label: 'Datça Açıklama 2 (Vurgulu)', type: 'textarea' },
      { key: 'datcaButtonText', label: 'Datça Buton', type: 'text' },
      
      { key: 'mercanTitle', label: 'Mercan Danışmanlık Başlık', type: 'textarea' },
      { key: 'mercanDesc1', label: 'Mercan Açıklama 1', type: 'textarea' },
      { key: 'mercanDesc2', label: 'Mercan Açıklama 2 (Vurgulu)', type: 'textarea' },
      { key: 'mercanButtonText', label: 'Mercan Buton', type: 'text' },
      
      { key: 'ctaTitle', label: 'CTA Başlık', type: 'textarea' },
      { key: 'ctaSubtitle', label: 'CTA Alt Başlık', type: 'textarea' },
      { key: 'ctaButtonText', label: 'CTA Buton', type: 'text' },
    ],
  },
  */
  // Section-based pages (no fields, handled by PageSections component)
  'software-dev': { title: '→ Yazılım Geliştirme', category: 'Hizmetler', fields: [] },
  'web-design': { title: '→ Web Tasarım', category: 'Hizmetler', fields: [] },
  ecommerce: { title: '→ E-Ticaret', category: 'Hizmetler', fields: [] },
  saas: { title: '→ SaaS Ürün', category: 'Hizmetler', fields: [] },
  trademark: { title: '→ Marka & Patent', category: 'Hizmetler', fields: [] },
  consulting: { title: '→ Dijital Danışmanlık', category: 'Hizmetler', fields: [] },
  solutions: { title: 'Çözümler', fields: [] },
  blog: { title: 'Blog', fields: [] },
  faq: { title: 'SSS', fields: [] },
}

export function AdminContentEditPage() {
  const [selectedPage, setSelectedPage] = useState<keyof typeof PAGE_CONFIGS>('home')
  const [content, setContent] = useState<PageContentData>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [selectedPage])

  const loadContent = async () => {
    setLoading(true)
    try {
      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/api/page-content/${selectedPage}`)
      const data = await response.json()
      if (data.success && data.data) {
        setContent(data.data)
      } else {
        setContent({})
      }
    } catch (error) {
      console.error('İçerik yüklenemedi:', error)
      setContent({})
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const apiUrl = getApiUrl()
      const response = await fetch(`${apiUrl}/api/page-content/${selectedPage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('woontegra_token')}`,
        },
        body: JSON.stringify({ content }),
      })

      const data = await response.json()
      if (data.success) {
        setMessage('✓ Kaydedildi')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Hata: ' + data.message)
      }
    } catch (error) {
      setMessage('Bağlantı hatası')
    } finally {
      setSaving(false)
    }
  }

  const config = PAGE_CONFIGS[selectedPage]

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      {/* SIDEBAR - PAGE LIST */}
      <div className="w-56 bg-white rounded-lg shadow-sm border border-gray-200 p-3 overflow-y-auto">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Sayfalar</h2>
        <div className="space-y-0.5">
          {Object.entries(PAGE_CONFIGS).map(([key, config]) => {
            const isServiceCategory = 'category' in config && config.category === 'Hizmetler'
            
            return (
              <button
                key={key}
                onClick={() => setSelectedPage(key as keyof typeof PAGE_CONFIGS)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                  selectedPage === key
                    ? 'bg-green-600 text-white font-medium'
                    : 'hover:bg-slate-50 text-slate-700'
                } ${isServiceCategory ? 'pl-6 text-xs' : ''}`}
              >
                {config.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h1 className="page-title">{PAGE_CONFIGS[selectedPage].title}</h1>
          {!['home', 'about', 'contact', 'software-dev', 'web-design', 'ecommerce', 'saas', 'trademark', 'game-dev', 'consulting', 'solutions', 'blog', 'faq'].includes(selectedPage) && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="button flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          )}
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.includes('✓') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {message}
          </div>
        )}

        {/* CONTENT FORM */}
        {selectedPage === 'home' ? (
          <HomeSections />
        ) : selectedPage === 'about' ? (
          <PageSections pageSlug="about" defaultData={defaultAboutData} storageKey="woontegra_about_page" />
        ) : selectedPage === 'contact' ? (
          <PageSections pageSlug="contact" defaultData={defaultContactData} storageKey="woontegra_contact_page" />
        ) : selectedPage === 'software-dev' ? (
          <PageSections pageSlug="software-dev" defaultData={defaultSoftwareDevData} storageKey="woontegra_software_dev_page" />
        ) : selectedPage === 'web-design' ? (
          <PageSections pageSlug="web-design" defaultData={defaultWebDesignData} storageKey="woontegra_web_design_page" />
        ) : selectedPage === 'ecommerce' ? (
          <PageSections pageSlug="ecommerce" defaultData={defaultEcommerceData} storageKey="woontegra_ecommerce_page" />
        ) : selectedPage === 'saas' ? (
          <PageSections pageSlug="saas" defaultData={defaultSaasData} storageKey="woontegra_saas_page" />
        ) : selectedPage === 'trademark' ? (
          <PageSections pageSlug="trademark" defaultData={defaultTrademarkData} storageKey="woontegra_trademark_page" />
        ) : selectedPage === 'consulting' ? (
          <PageSections pageSlug="consulting" defaultData={defaultConsultingData} storageKey="woontegra_consulting_page" />
        ) : selectedPage === 'solutions' ? (
          <PageSections pageSlug="solutions" defaultData={defaultSolutionsData} storageKey="woontegra_solutions_page" />
        ) : selectedPage === 'blog' ? (
          <PageSections pageSlug="blog" defaultData={defaultBlogData} storageKey="woontegra_blog_page" />
        ) : selectedPage === 'faq' ? (
          <PageSections pageSlug="faq" defaultData={defaultFAQData} storageKey="woontegra_faq_page" />
        ) : loading ? (
          <div className="card p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto mb-3"></div>
            <p className="text-sm text-slate-600">Yüklüyor...</p>
          </div>
        ) : (
          // OLD: Keep existing form for other pages
          <div className="card">
            <div className="compact-space-y">
            {config.fields.map((field) => (
              <div key={field.key}>
                <label className="label">
                  {field.label}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={content[field.key] || ''}
                    onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                    rows={3}
                    className="textarea w-full"
                    placeholder={`${field.label} girin...`}
                  />
                ) : (
                  <input
                    type="text"
                    value={content[field.key] || ''}
                    onChange={(e) => setContent({ ...content, [field.key]: e.target.value })}
                    className="input w-full"
                    placeholder={`${field.label} girin...`}
                  />
                )}
              </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-blue-900 mb-2">Nasıl Kullanılır?</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Soldan düzenlemek istediğiniz sayfayı seçin</li>
                <li>2. Alanları doldurun veya değiştirin</li>
                <li>3. "Kaydet" butonuna tıklayın</li>
                <li>4. Değişiklikler anında sitede görünür</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
