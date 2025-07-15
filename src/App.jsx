import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Monitor, Palette, Users, Globe, Star, Code, Layers, Sparkles, Mail, MessageCircle, Phone, Sun, Moon, Eye, Home } from 'lucide-react'
import './App.css'
import { Sheet, SheetContent } from '@/components/ui/sheet.jsx'
import { db } from './firebase'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'
// حذف استيراد firebase auth
// إضافة Toast بسيط
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])
  return (
    <div style={{position:'fixed',top:32,right:32,background:'#fff',color:'#222',padding:'1rem 2rem',borderRadius:12,boxShadow:'0 2px 16px #0002',zIndex:9999,fontWeight:'bold',minWidth:220,display:'flex',alignItems:'center',gap:12}}>
      <span style={{flex:1}}>{message}</span>
      <button onClick={onClose} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:'#888'}} aria-label="إغلاق الإشعار">×</button>
    </div>
  )
}

// نصوص الترجمة
const translations = {
  ar: {
    viewWork: 'شاهد أعمالي',
    contactMe: 'تواصل معي',
    noProjects: 'لا توجد أعمال حالياً، ترقب الجديد قريباً!',
    recentWork: 'أحدث الأعمال',
    services: 'الخدمات المتاحة',
    features: 'ما الذي يميز عملي؟',
    sendMessage: 'أرسل رسالة',
    yourName: 'اسمك',
    yourEmail: 'بريدك الإلكتروني',
    yourMessage: 'عن ماذا مشروعك؟',
    send: 'إرسال',
    email: 'البريد الإلكتروني',
    discord: 'ديسكورد',
    whatsapp: 'واتساب',
    copyLink: 'نسخ الرابط',
    visit: 'زيارة العمل',
    lang: 'English',
    homeDesc: 'أصمم وأوفر مواقع افتراضية مخصصة فقط لعرض الخدمات أو العروض أو القوائم، بدون أنظمة طلبات أو تسجيل دخول.',
    scroll: 'مرر للأسفل',
    whoAmI: 'من أنا؟',
    whoAmIDesc: 'أنا Nexus، متخصص في تصميم وتوفير مواقع عرض افتراضية — مواقع مخصصة فقط لعرض الخدمات أو العروض أو القوائم، بدون أنظمة طلبات أو تسجيل دخول. الفكرة الأساسية هي توفير صفحة هبوط أنيقة وسريعة تعكس هوية مشروعك أو خدمتك بشكل مباشر وبسيط.',
    idealFor: 'هذا النوع من المواقع مثالي لمشاريع وخدمات متنوعة',
    specialDesc: 'رغم أني جديد في عالم البيع، لدي خبرة عملية في التصميم والتنظيم وفهم تجربة المستخدم (UX) تميز عملي عن غيري',
    customDesign: 'تصميم مخصص',
    support: 'دعم متواصل',
    fastDelivery: 'تسليم سريع',
    proQuality: 'جودة احترافية',
    testimonials: 'آراء العملاء',
    contactTitle: 'دعنا نعمل معًا',
    contactDesc: 'إذا كنت بحاجة لواجهة موقع تعرض مشروعك أو عروضك بشكل أنيق وبدون إضافات غير ضرورية — أنا هنا لمساعدتك',
    sendSuccess: 'تم إرسال رسالتك بنجاح! سأرد عليك قريبًا.',
    sendError: 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.',
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'البريد الإلكتروني غير صحيح',
    shareWhatsapp: 'مشاركة على واتساب',
    shareTwitter: 'مشاركة على تويتر',
    share: 'مشاركة',
    rating: 'تقييم العمل',
    leaveComment: 'اترك تعليقك',
    submit: 'إرسال',
    comments: 'التعليقات',
    noComments: 'لا توجد تعليقات بعد',
    addComment: 'أضف تعليقًا',
    loading: 'جاري التحميل...',
    copied: 'تم نسخ الرابط!',
    dark: 'الوضع الليلي',
    light: 'الوضع النهاري',
    switchLang: 'تبديل اللغة',
    switchTheme: 'تبديل الوضع',
    shareLink: 'مشاركة الرابط',
    close: 'إغلاق',
    error: 'خطأ',
    success: 'نجاح',
    requiredField: 'حقل مطلوب',
    // ... أضف أي نص ثابت آخر هنا ...
  },
  en: {
    viewWork: 'View My Work',
    contactMe: 'Contact Me',
    noProjects: 'No projects yet, stay tuned!',
    recentWork: 'Recent Work',
    services: 'Available Services',
    features: 'What Makes My Work Special?',
    sendMessage: 'Send a Message',
    yourName: 'Your Name',
    yourEmail: 'Your Email',
    yourMessage: 'Tell me about your project...',
    send: 'Send',
    email: 'Email',
    discord: 'Discord',
    whatsapp: 'WhatsApp',
    copyLink: 'Copy Link',
    visit: 'Visit',
    lang: 'العربية',
    homeDesc: 'I design and provide virtual websites dedicated only to showcasing services, offers, or menus, without ordering systems or login registration.',
    scroll: 'Scroll Down',
    whoAmI: 'Who Am I?',
    whoAmIDesc: 'I am Nexus, specialized in designing and providing Front-End Showcase Sites — virtual websites dedicated only to showcasing services, offers, or menus, without ordering systems or login registration. The basic idea is to provide an elegant, fast Landing Page that reflects your project or service identity in a direct and simple way.',
    idealFor: 'This type of website is ideal for various types of projects and services',
    specialDesc: 'Although I am new to the sales world, I have practical experience in design, organization, and understanding User Experience (UX) that distinguishes my work from others',
    customDesign: 'Custom Design',
    support: '24/7 Support',
    fastDelivery: 'Fast Delivery',
    proQuality: 'Pro Quality',
    testimonials: 'Testimonials',
    contactTitle: 'Let\'s Work Together',
    contactDesc: 'If you need a website interface that showcases your project or offers elegantly, without unnecessary additions — I\'m here to help you',
    sendSuccess: 'Your message was sent successfully! I will reply soon.',
    sendError: 'An error occurred while sending. Please try again.',
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    shareWhatsapp: 'Share on WhatsApp',
    shareTwitter: 'Share on Twitter',
    share: 'Share',
    rating: 'Rate this work',
    leaveComment: 'Leave your comment',
    submit: 'Submit',
    comments: 'Comments',
    noComments: 'No comments yet',
    addComment: 'Add a comment',
    loading: 'Loading...',
    copied: 'Link copied!',
    dark: 'Dark Mode',
    light: 'Light Mode',
    switchLang: 'Switch Language',
    switchTheme: 'Switch Theme',
    shareLink: 'Share Link',
    close: 'Close',
    error: 'Error',
    success: 'Success',
    requiredField: 'Required field',
    // ... add any other static text here ...
  }
}

function useScrollFadeIn() {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight - 60) {
        el.classList.add('visible')
      } else {
        el.classList.remove('visible')
      }
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return ref
}

function App() {
  const [isVisible, setIsVisible] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [successToast, setSuccessToast] = useState(false)
  // بنية الأعمال (جاهزة للإضافة)
  const [projects] = useState([
    // مثال: { title: 'موقع متجر إلكتروني', description: 'تصميم متجر عصري متكامل', image: 'url', link: '#' }
  ])

  // الوضع الليلي/النهاري
  const [theme, setTheme] = useState(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const services = [
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Digital Services Teams",
      description: "Professional websites to showcase your digital services elegantly and organized"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Servers & Gaming",
      description: "Custom interfaces for Discord servers and various gaming platforms"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Stores & Accounts",
      description: "Display account packages and products in an attractive way"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Design Projects",
      description: "Professional portfolio that highlights your creativity and designs"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Restaurants & Stores",
      description: "Restaurant-like websites to display menus and offers"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Any Other Project",
      description: "Custom solutions for any type of project that needs clean visual display"
    }
  ]

  const features = [
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Minimalist Design",
      description: "Focuses on core content and presents it with complete clarity"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Professional Layout",
      description: "Makes visitors understand your service at first glance"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Efficient project execution without complications"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Attention to Detail",
      description: "In every element on the page, because first impression is the most important"
    }
  ]

  const [lang, setLang] = useState('ar')
  const t = translations[lang]

  // أمثلة تطبيق المؤثرات:
  const servicesRef = useScrollFadeIn()
  const featuresRef = useScrollFadeIn()
  const portfolioRef = useScrollFadeIn()
  const contactRef = useScrollFadeIn()

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [newName, setNewName] = useState('')
  const [newStars, setNewStars] = useState(5)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [loadingComments, setLoadingComments] = useState(true)
  const [user, setUser] = useState(null)
  const adminEmail = 'fares24dec@gmail.com'
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true')
  const secretCode = '123456'

  const nameInputRef = useRef(null)

  // عند إضافة تعليق، إذا كان النص يساوي الرقم السري، فعّل وضع المشرف
  async function handleAddComment(e) {
    e.preventDefault()
    if (!newName.trim() || !newComment.trim()) return
    if (newComment.trim() === secretCode) {
      localStorage.setItem('isAdmin', 'true')
      setIsAdmin(true)
      setNewComment('')
      setNewName('')
      setNewStars(5)
      setShowCommentInput(false)
      if (nameInputRef.current) nameInputRef.current.focus()
      return
    }
    await addDoc(collection(db, 'comments'), {
      name: newName.trim(),
      text: newComment.trim(),
      stars: newStars,
      createdAt: serverTimestamp(),
    })
    setNewName('')
    setNewComment('')
    setNewStars(5)
    setShowCommentInput(false)
    setSuccessToast(true)
    if (nameInputRef.current) nameInputRef.current.focus()
    setTimeout(() => setSuccessToast(false), 2000)
  }

  // زر لإلغاء وضع المشرف
  function handleLogoutAdmin() {
    localStorage.removeItem('isAdmin')
    setIsAdmin(false)
  }

  // جلب التعليقات من Firestore
  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoadingComments(false)
    })
    return unsub
  }, [])

  async function handleDeleteComment(id) {
    await deleteDoc(doc(db, 'comments', id))
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4">
          {/* هيدر خاص للجوال */}
          <div className="header-mobile md:hidden flex items-center justify-between gap-2 py-2">
            <div className="logo flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-white">Nexus</span>
            </div>
            <div className="actions flex items-center gap-2">
              <button
                className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                aria-label="تبديل اللغة"
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              >
                {t.lang}
              </button>
              <button
                className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                aria-label={theme === 'dark' ? 'تبديل إلى النهاري' : 'تبديل إلى الليلي'}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
              </button>
              <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors" onClick={() => setMobileMenuOpen(true)} aria-label="فتح القائمة الجانبية" tabIndex={0}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          {/* هيدر الديسكتوب */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-white">Nexus</span>
            </div>
            {/* زر تبديل اللغة */}
            <button
              className="mx-2 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              aria-label="تبديل اللغة"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            >
              {t.lang}
            </button>
            {/* زر تبديل الوضع */}
            <button
              className="mx-2 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              aria-label={theme === 'dark' ? 'تبديل إلى النهاري' : 'تبديل إلى الليلي'}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
            </button>
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-white/80 hover:text-white transition-colors">Home</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
              <a href="#services" className="text-white/80 hover:text-white transition-colors">Services</a>
              <a href="#portfolio" className="text-white/80 hover:text-white transition-colors">Portfolio</a>
              <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
            </div>
            {/* CTA Button */}
            <div className="hidden md:block">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                Get Started
              </button>
            </div>
            {/* زر إلغاء وضع المشرف إذا كنت مشرف */}
            {isAdmin && (
              <button onClick={handleLogoutAdmin} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">خروج المشرف</button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="bg-white/90 backdrop-blur-md p-0 w-64 z-50">
          <nav className="flex flex-col gap-4 p-6">
            <a href="#home" className="text-gray-900 text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" className="text-gray-900 text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#services" className="text-gray-900 text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#portfolio" className="text-gray-900 text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Portfolio</a>
            <a href="#contact" className="text-gray-900 text-lg font-medium hover:text-blue-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 animated-gradient-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 opacity-60"></div>
        <div className="absolute inset-0 opacity-30">
          {(() => {
            // تقليل عدد الدوائر على الجوال
            const isMobile = window.innerWidth <= 600;
            const circles = isMobile ? 12 : 50;
            return [...Array(circles)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))
          })()}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-purple-900/20"></div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center">
        <div className={`container mx-auto px-4 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center max-w-4xl mx-auto">
            
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent mb-8 leading-tight animate-pulse">
              Nexus
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              {t.homeDesc}
            </p>

            {/* Call to Action Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
                onClick={() => {
                  if (projects.length === 0) setShowToast(true)
                  else {
                    const portfolioSection = document.getElementById('portfolio')
                    if (portfolioSection) portfolioSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                <Eye className="w-5 h-5" />
                {t.viewWork}
              </button>
              <button
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm flex items-center gap-2 justify-center"
                onClick={() => {
                  const contactSection = document.getElementById('contact')
                  if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <Mail className="w-5 h-5" />
                {t.contactMe}
              </button>
            </div>
            {showToast && <Toast message={t.noProjects} onClose={() => setShowToast(false)} />}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t.whoAmI}</h2>
            <p className="text-lg text-white/80 leading-relaxed">
              {t.whoAmIDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 scroll-fade-in" ref={servicesRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t.services}</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {t.idealFor}
            </p>
          </div>
          {/* تحسين الشبكة للخدمات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/10 backdrop-blur-sm border-white/20 text-white relative overflow-hidden">
                {/* Number Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-blue-200 transition-colors duration-300">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed text-white/70 group-hover:text-white/90 transition-colors duration-300">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm scroll-fade-in" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t.features}</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              {t.specialDesc}
            </p>
          </div>
          {/* تحسين الشبكة للإحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-300 mb-2">100%</div>
              <div className="text-white/70">{t.customDesign}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-300 mb-2">24/7</div>
              <div className="text-white/70">{t.support}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-indigo-300 mb-2">{t.fastDelivery}</div>
              <div className="text-white/70">{t.fastDelivery}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-300 mb-2">{t.proQuality}</div>
              <div className="text-white/70">{t.proQuality}</div>
            </div>
          </div>
          {/* تحسين الشبكة للميزات */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="text-center group p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20">
                <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-200 transition-colors">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          {/* قسم التعليقات */}
          <div className="mt-16 max-w-2xl mx-auto bg-white/10 rounded-xl p-6 border border-white/20 comments-box">
            {successToast && <Toast message="تم إرسال التعليق بنجاح" onClose={() => setSuccessToast(false)} />}
            <h3 className="text-xl font-bold mb-4 text-white">{t.comments}</h3>
            {loadingComments ? (
              <div className="text-white/60 text-center mb-4">{t.loading}</div>
            ) : comments.length === 0 ? (
              <div className="text-white/60 text-center mb-4">{t.noComments}</div>
            ) : (
              <ul className="space-y-3 mb-4">
                {comments.map((c, i) => (
                  <li key={c.id || i} className="bg-white/20 rounded-lg px-4 py-3 text-white/90 flex flex-col gap-1 relative">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-blue-200">{c.name}</span>
                      <span className="text-xs text-white/60">{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : ''}</span>
                      {/* زر الحذف يظهر فقط إذا كنت مشرف */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 18, marginLeft: 8 }}
                          title="حذف التعليق"
                          aria-label="حذف التعليق"
                        >🗑️</button>
                      )}
                    </div>
                    <div className="mb-1">{c.text}</div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <span key={n} style={{color: n <= (c.stars||0) ? '#facc15' : '#fff8'}}>&#9733;</span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* نموذج إضافة تعليق */}
            <form onSubmit={handleAddComment} className="flex flex-col gap-2 mt-2">
              <input
                type="text"
                className="rounded-lg px-3 py-2 bg-white/20 text-white placeholder-white/50 focus:outline-none"
                placeholder={t.yourName}
                value={newName}
                onChange={e => setNewName(e.target.value)}
                maxLength={40}
                required
                ref={nameInputRef}
              />
              <textarea
                className="rounded-lg px-3 py-2 bg-white/20 text-white placeholder-white/50 focus:outline-none"
                placeholder={t.leaveComment}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                maxLength={300}
                required
              />
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white/80">{t.rating}:</span>
                {[1,2,3,4,5].map(n => (
                  <button type="button" key={n} onClick={() => setNewStars(n)} style={{color: n <= newStars ? '#facc15' : '#fff8', fontSize: 22, cursor: 'pointer', background: 'none', border: 'none', padding: 0}} aria-label={n + ' stars'}>&#9733;</button>
                ))}
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">{t.submit}</button>
            </form>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-white/5 backdrop-blur-sm scroll-fade-in" ref={portfolioRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t.recentWork}</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Here are some examples of the showcase websites I've created for different types of projects
            </p>
          </div>
          {/* عرض الأعمال إذا وجدت */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-500 shadow-lg hover:shadow-2xl">
                  {project.image && (
                    <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover rounded-t-2xl" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-white/70 text-sm mb-4">{project.description}</p>
                    <div className="flex items-center gap-2">
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-blue-500/80 text-white rounded-lg text-xs hover:bg-blue-600 transition">{t.visit}</a>
                      )}
                      <button
                        className="px-3 py-1 bg-gray-700/80 text-white rounded-lg text-xs hover:bg-gray-900 transition"
                        onClick={() => {
                          navigator.clipboard.writeText(project.link || window.location.href)
                          setShowToast(true)
                        }}
                        aria-label="نسخ رابط العمل"
                      >{t.copyLink}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/70 text-lg py-12">{t.noProjects}</div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 scroll-fade-in" ref={contactRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                {t.contactTitle}
              </h2>
              <p className="text-lg text-white/80 mb-12 max-w-3xl mx-auto">
                {t.contactDesc}
              </p>
            </div>
            {/* تحسين الشبكة لقسم التواصل */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">{t.sendMessage}</h3>
                <form className="space-y-6" action="https://formspree.io/f/mpwlzdey" method="POST">
                  <div>
                    <input 
                      type="text" 
                      placeholder={t.yourName} 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      autoComplete="name"
                      inputMode="text"
                      required
                      name="name"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder={t.yourEmail} 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors"
                      autoComplete="email"
                      inputMode="email"
                      required
                      name="email"
                    />
                  </div>
                  <div>
                    <textarea 
                      rows="5" 
                      placeholder={t.yourMessage} 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-colors resize-none"
                      autoComplete="off"
                      inputMode="text"
                      required
                      name="message"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  >
                    {t.send}
                  </button>
                </form>
              </div>
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Email</h3>
                      <p className="text-white/70 break-all">fares24dec@gmail.com</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t.discord}</h3>
                      <p className="text-white/70">1v0e</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{t.whatsapp}</h3>
                      <p className="text-white/70">+35699333559</p>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-2">Quick Response</h4>
                  <p className="text-white/80 text-sm">I typically respond within 24 hours. Let's discuss your project!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white/5 backdrop-blur-sm border-t border-white/20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold text-white">Nexus</span>
          </div>
          <p className="text-white/70">
            Front-End Showcase Sites • Professional Showcase Website Design
          </p>
        </div>
      </footer>
      {/* Bottom Navigation للجوال */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-white/30 flex md:hidden justify-around items-center py-2" style={{boxShadow:'0 -2px 16px #0001'}}>
        <a href="#home" className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600 transition"><Home className="w-6 h-6 mb-1" />الرئيسية</a>
        <a href="#about" className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600 transition"><Users className="w-6 h-6 mb-1" />من أنا</a>
        <a href="#services" className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600 transition"><Star className="w-6 h-6 mb-1" />الخدمات</a>
        <a href="#portfolio" className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600 transition"><Layers className="w-6 h-6 mb-1" />الأعمال</a>
        <a href="#contact" className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600 transition"><Mail className="w-6 h-6 mb-1" />تواصل</a>
      </nav>
    </div>
  )
}

export default App


