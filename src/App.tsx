import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, ChevronRight, X, Trash2, Utensils, Facebook, MapPin, Loader2, Gift, Star, Sparkles, Home, MessageSquare, Check, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSheetData, submitSheetData, SheetDish, SheetCategory } from './services/googleSheets';
import { STATIC_CATEGORIES, STATIC_DISHES } from './data/menu';

// ==========================================
// 📋 CONFIGURACIÓN DE LA PLANTILLA DEL MENÚ
// ==========================================
const RESTAURANTE_NAME = "Astoria Pollos Brass";
const RESTAURANTE_SLOGAN = "Cada visita es una celebración de sabor";
const WHATSAPP_NUMBER = "51997070929"; // Número de WhatsApp de Astoria
const FACEBOOK_URL = "";
const MAPS_URL = "https://maps.google.com/?q=Astoria+Pollos+Brass";
const LOGO_FOOTER_PATH = "/logo.png"; // Ruta del logo en public/
const LOGO_HEADER_PATH = "/logo.png"; // Ruta del logo en cabecera
const MARQUEE_TEXT = "🔥 EL AUTÉNTICO SABOR A LA BRASA • POLLOS, COMBOS Y SALCHIPAPAS • ¡HAZ TU PEDIDO YA! 🍗🍟 ";
const COPY_CUMPLEANOS = "¡Celebra tu día con el mejor pollo a la brasa! 🍗 Regístrate aquí y recibe una porción de papas extra de regalo. 🎁";

// Mapa de imágenes locales para platos en Puerto Maldonado
const LOCAL_IMAGE_MAP: Record<string, string> = {
  "1/8 Pollo a la brasa": "/octavo pollo.png",
  "1/8 a la brasa + Pepsi": "/octavo pollo.png",
  "1/4 de Pollo a la brasa": "/cuarto de pollo.png",
  "1/4 a la brasa + Pepsi": "/cuarto de pollo.png",
  "1/2 Pollo a la brasa": "/medio pollo.png",
  "1/2 pollo a la brasa + Pepsi": "/medio pollo.png",
  "1 Pollo entero": "/1 pollo.png",
  "1 Pollo Oferta": "/1 pollo.png",
  "1 Pollo Fresh": "/1 pollo.png"
};
// ==========================================

interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
}

interface Category {
  id: string;
  nombre: string;
  items: Dish[];
}

interface CartItem {
  nombre: string;
  precio: string;
  cantidad: number;
  opcion?: string;
}

const normalizePrecio = (precioVal: any): string => {
  if (!precioVal) return '0';
  const matched = String(precioVal).match(/[\d.]+/g);
  return matched ? matched.join('') : '0';
};

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // States for Birthday Form
  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [isSubmittingBirthday, setIsSubmittingBirthday] = useState(false);
  const [birthdaySuccess, setBirthdaySuccess] = useState(false);
  const [birthdayData, setBirthdayData] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: '',
    distrito: '',
    correo: ''
  });

  // States for Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewData, setReviewData] = useState({
    estrellasMozo: 0,
    estrellasComida: 0,
    comentario: ''
  });

  // States for Delivery Form
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    nombre: '',
    sector: '',
    direccion: '',
    referencia: '',
    metodoPago: '',
    lat: null as number | null,
    lng: null as number | null,
    isLocating: false,
    locationSuccess: false,
    locationError: null as string | null
  });

  // States for Options Selector Modal
  const [optionsModal, setOptionsModal] = useState<{
    dish: Dish;
    showRice: boolean;
    showDrink: boolean;
    showCremas: boolean;
    selectedRice: string;
    selectedDrink: string;
    selectedCremas: string[];
    drinkOptions: string[];
    drinkTitle: string;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        let cats = await fetchSheetData<SheetCategory>('Categorías');
        let dishes = await fetchSheetData<SheetDish>('Platos');

        // Robust Fallback: Si no hay datos de Sheets, usar datos locales estáticos
        if (!cats || cats.length === 0) {
          cats = STATIC_CATEGORIES;
        }
        if (!dishes || dishes.length === 0) {
          dishes = STATIC_DISHES;
        }

        const formattedCategories: Category[] = cats.map(c => ({
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'),
          nombre: c.nombre,
          items: dishes
            .filter(d => d.categoría === c.nombre)
            .map(d => ({
              nombre: d['nombre del plato'],
              descripcion: d.descripción,
              precio: normalizePrecio(d['precio del plato'] || (d as any).precio),
              imagen: d['imagen URL'] || (d as any)['URL de imagen'] || LOCAL_IMAGE_MAP[d['nombre del plato']] || null
            }))
        }));

        setCategories(formattedCategories);
        if (formattedCategories.length > 0) {
          setActiveCategory(formattedCategories[0].id);
        }
      } catch (error) {
        console.error("Error loading data from Google Sheets, using static fallback:", error);
        
        // Cargar fallback en caso de excepción de red
        const formattedCategories: Category[] = STATIC_CATEGORIES.map(c => ({
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'),
          nombre: c.nombre,
          items: STATIC_DISHES
            .filter(d => d.categoría === c.nombre)
            .map(d => ({
              nombre: d['nombre del plato'],
              descripcion: d.descripción,
              precio: normalizePrecio((d as any).precio || (d as any)['precio del plato']),
              imagen: (d as any)['URL de imagen'] || (d as any)['imagen URL'] || LOCAL_IMAGE_MAP[d['nombre del plato']] || null
            }))
        }));
        
        setCategories(formattedCategories);
        if (formattedCategories.length > 0) {
          setActiveCategory(formattedCategories[0].id);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.cantidad, 0), [cart]);

  const getDishModalConfig = (dishName: string, categoryName: string) => {
    const nameLower = dishName.toLowerCase();
    const catLower = categoryName.toLowerCase();

    // Check if category is a food category (not Bebidas Heladas, not Complementos)
    const isFoodCategory = catLower.includes('brasa') || catLower.includes('combo') || catLower.includes('especial');
    
    // Check if it's a dish that has the rice option (Salchipapa and Salchipolleros)
    const showRice = nameLower.includes('salchipapa') || nameLower.includes('salchipollero');
    
    // Check if it's a dish that has a drink option
    let showDrink = false;
    let drinkOptions: string[] = [];
    let drinkTitle = '';

    if (nameLower.includes('refresco natural') || nameLower.includes('pollo fresh')) {
      showDrink = true;
      drinkOptions = ['Maíz morado', 'Maracuyá', 'Copoazú'];
      drinkTitle = 'Elige el sabor de tu refresco';
    } else if (nameLower.includes('pollo oferta')) {
      showDrink = true;
      drinkOptions = ['Coca-Cola', 'Inca Kola'];
      drinkTitle = 'Elige tu bebida';
    }

    // Cremas show for all food dishes
    const showCremas = isFoodCategory;

    if (showRice || showDrink || showCremas) {
      return {
        showRice,
        showDrink,
        showCremas,
        drinkOptions,
        drinkTitle
      };
    }
    return null;
  };

  const addToCart = (dish: Dish, option?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.nombre === dish.nombre && i.precio === dish.precio && i.opcion === option);
      if (existing) {
        return prev.map(i =>
          (i.nombre === dish.nombre && i.precio === dish.precio && i.opcion === option)
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { nombre: dish.nombre, precio: dish.precio, cantidad: 1, opcion: option }];
    });
  };

  const handleAddToCartClick = (dish: Dish, categoryName: string) => {
    const config = getDishModalConfig(dish.nombre, categoryName);
    if (config) {
      setOptionsModal({
        dish,
        showRice: config.showRice,
        showDrink: config.showDrink,
        showCremas: config.showCremas,
        selectedRice: 'Arroz Blanco',
        selectedDrink: config.drinkOptions.length > 0 ? config.drinkOptions[0] : '',
        selectedCremas: [],
        drinkOptions: config.drinkOptions,
        drinkTitle: config.drinkTitle
      });
    } else {
      addToCart(dish);
    }
  };

  const updateQuantity = (nombre: string, precio: string, delta: number, option?: string) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.nombre === nombre && i.precio === precio && i.opcion === option) {
            const newQty = i.cantidad + delta;
            return newQty > 0 ? { ...i, cantidad: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const num = parseFloat(item.precio) || 0;
      return acc + num * item.cantidad;
    }, 0);
  };

  const sendToWhatsApp = () => {
    const total = calculateTotal();
    let message = `*🔥 ¡Hola Astoria Pollos Brass! Deseo realizar un pedido:*\n`;
    message += `_Cada visita es una celebración de sabor_\n\n`;

    message += `*👤 DATOS DE ENTREGA:*\n`;
    message += `• *Nombre:* ${deliveryData.nombre}\n`;
    message += `• *Sector/Barrio:* ${deliveryData.sector}\n`;
    message += `• *Dirección:* ${deliveryData.direccion}\n`;
    if (deliveryData.referencia) {
      message += `• *Referencia:* ${deliveryData.referencia}\n`;
    }
    if (deliveryData.lat && deliveryData.lng) {
      message += `• *Ubicación GPS:* https://maps.google.com/?q=${deliveryData.lat},${deliveryData.lng}\n`;
    }
    message += `• *Método de Pago:* ${deliveryData.metodoPago}\n`;
    message += `\n`;

    message += `*🛒 DETALLE DE LA COMPRA:*\n`;
    
    cart.forEach(item => {
      const optionText = item.opcion ? ` [${item.opcion}]` : '';
      message += `• *${item.cantidad}x* ${item.nombre}${optionText} _(S/.${item.precio})_\n`;
    });
    
    message += `\n*💵 TOTAL A PAGAR:* *S/.${total.toFixed(2)}*\n\n`;
    message += `*¡Por favor confírmenme la recepción del pedido para acordar la entrega! 🍗🍟🥤*`;
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setDeliveryData(prev => ({
        ...prev,
        locationError: 'Tu navegador no soporta geolocalización.'
      }));
      return;
    }

    setDeliveryData(prev => ({
      ...prev,
      isLocating: true,
      locationError: null,
      locationSuccess: false
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDeliveryData(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          isLocating: false,
          locationSuccess: true,
          locationError: null
        }));
      },
      (error) => {
        let msg = 'No se pudo obtener la ubicación GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permiso GPS denegado. Ingresa tu dirección manualmente.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Señal GPS no disponible actualmente.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Tiempo agotado al obtener el GPS.';
        }
        setDeliveryData(prev => ({
          ...prev,
          isLocating: false,
          locationSuccess: false,
          locationError: msg
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDeliveryModal(false);
    sendToWhatsApp();
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBirthdaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBirthday(true);
    const success = await submitSheetData('Fidelización', {
      timestamp: new Date().toLocaleString('es-PE'),
      nombre: birthdayData.nombre,
      telefono: birthdayData.telefono,
      fechaNacimiento: birthdayData.fechaNacimiento,
      distrito: birthdayData.distrito,
      correo: birthdayData.correo || 'No indicado'
    });
    
    setIsSubmittingBirthday(false);
    if (success) {
      setBirthdaySuccess(true);
      setTimeout(() => {
        setShowBirthdayForm(false);
        setBirthdaySuccess(false);
        setBirthdayData({ nombre: '', telefono: '', fechaNacimiento: '', distrito: '', correo: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tus datos. Por favor, inténtalo de nuevo.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewData.estrellasMozo === 0 || reviewData.estrellasComida === 0) {
      alert("Por favor califica ambas opciones con estrellas.");
      return;
    }

    setIsSubmittingReview(true);
    const success = await submitSheetData('Reseñas', {
      timestamp: new Date().toLocaleString('es-PE'),
      estrellasMozo: reviewData.estrellasMozo,
      estrellasComida: reviewData.estrellasComida,
      comentario: reviewData.comentario || 'Sin comentarios'
    });
    
    setIsSubmittingReview(false);
    if (success) {
      setReviewSuccess(true);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccess(false);
        setReviewData({ estrellasMozo: 0, estrellasComida: 0, comentario: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tu reseña. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-light text-dark">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-slogan text-primary font-bold tracking-widest uppercase text-[10px]">Cargando las mejores brasas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-light text-dark min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col font-sans border-x border-gray-100 pb-20">
      
      {/* CABECERA (LOGO + BRANDING) */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-50 px-5 py-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-3">
          {LOGO_HEADER_PATH && (
            <img 
              src={LOGO_HEADER_PATH} 
              alt="Astoria Logo" 
              className="w-12 h-12 object-cover rounded-full border-2 border-primary shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="flex flex-col items-start">
            <h1 className="font-title text-[24px] text-primary leading-none tracking-wide">{RESTAURANTE_NAME}</h1>
            <span className="font-sans text-[8px] text-secondary font-black tracking-wider uppercase mt-1.5">{RESTAURANTE_SLOGAN}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* BOTÓN DEL CARRITO */}
          <motion.div
            onClick={() => cartCount > 0 ? setShowSummary(true) : alert("Tu carrito está vacío")}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-primary/20 transition-colors"
          >
            <ShoppingBag size={20} className="text-primary" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4.5 bg-secondary text-dark rounded-full text-[9px] font-black flex items-center justify-center px-1 border border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </motion.div>
        </div>
      </header>

      {/* MARQUEE TEXT */}
      <div className="w-full bg-primary py-2 overflow-hidden flex items-center shadow-inner">
        <div className="animate-marquee flex gap-6 text-white font-title font-normal text-[12px] tracking-wider uppercase whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="flex items-center gap-2">
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </div>

      {/* REGISTRO DE CUMPLEAÑOS */}
      <div className="px-5 pt-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: ["0px 0px 0px 0px rgba(230,0,0,0.3)", "0px 0px 20px 8px rgba(230,0,0,0)", "0px 0px 0px 0px rgba(230,0,0,0)"] 
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => setShowBirthdayForm(true)}
          className="w-full bg-gradient-to-r from-primary to-orange-600 text-white py-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-title text-xs uppercase tracking-wider relative overflow-hidden group shadow-md shadow-primary/10 border border-red-500/10"
        >
          <div className="absolute inset-0 shimmer opacity-25 mix-blend-overlay"></div>
          <Gift size={18} className="animate-bounce shrink-0 text-secondary" />
          <span className="text-[11px] leading-tight">¡Regístrate por tu cumpleaños y recibe un regalo! 🎁</span>
        </motion.button>
      </div>

      {/* BANNER PROMOCIONAL PERSONALIZADO (IMAGEN DEL BANNER) */}
      <div className="px-5 pt-4 pb-3">
        <div className="w-full rounded-[2rem] overflow-hidden shadow-md border border-gray-100/50">
          <img 
            src="/banner.png" 
            alt="Banner Promocional" 
            className="w-full h-auto block"
            onError={(e) => {
              const wrapper = (e.target as HTMLElement).closest('.px-5');
              if (wrapper) (wrapper as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* NAVEGACIÓN DE CATEGORÍAS */}
      <div id="menu-section" className="px-5 py-3 sticky top-[72px] bg-white/95 backdrop-blur-md z-40 overflow-x-auto no-scrollbar border-b border-gray-100">
        <div className="flex gap-2 w-max py-0.5">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`px-4.5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-200 border
                ${activeCategory === cat.id
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                  : 'bg-white text-dark/70 border-gray-200 hover:border-primary/40 hover:text-primary'
                }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* PLATOS */}
      <main className="flex-1 overflow-y-auto pb-24 px-5 mt-4">
        {categories.map(cat => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-28">
            <div className="mb-5 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Utensils className="text-primary wave-icon" size={20} />
                <h3 className="font-title text-primary text-[24px] leading-none tracking-wide category-underline">
                  {cat.nombre}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {cat.items.map((dish, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-[2.2rem] overflow-hidden flex flex-col shadow-sm border border-gray-100 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
                >
                  {/* IMAGEN DEL PLATO O PLACEHOLDER */}
                  <div className="aspect-square relative overflow-hidden bg-gray-50 border-b border-gray-100 flex items-center justify-center">
                    {dish.imagen ? (
                      <img 
                        src={dish.imagen} 
                        alt={dish.nombre}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedImage(dish.imagen)}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <Utensils className="text-gray-300 mb-2" size={24} />
                        <span className="text-gray-400 text-[9px] uppercase tracking-wider font-black font-description">Acá va la imagen</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4.5 flex flex-col flex-1">
                    <h4 className="font-bold text-dark text-[13.5px] leading-snug mb-1 min-h-[38px] line-clamp-2">
                      {dish.nombre}
                    </h4>
                    {dish.descripcion && (
                      <p className="text-[10px] text-dark/50 leading-snug mb-3 font-description font-light">
                        {dish.descripcion}
                      </p>
                    )}
                    <div className="flex-1"></div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="font-title text-primary text-[16px] whitespace-nowrap">
                        S/.{dish.precio}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleAddToCartClick(dish, cat.nombre)}
                        className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-200 shrink-0"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {/* MAPA INTERACTIVO (MAPA X) */}
        <section id="contact-section" className="mt-8 mb-4 border border-gray-100 bg-white rounded-[2rem] p-5 shadow-sm scroll-mt-28">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-primary animate-bounce" size={20} />
            <h3 className="font-title text-primary text-[20px] leading-none">Nuestra Ubicación</h3>
          </div>
          
          <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex flex-col items-center justify-center p-4 text-center">
            {/* Styled Map Background Grid using SVG for Light Theme */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-dark" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Simulated streets/roads */}
                <path d="M 0 50 Q 150 80 400 50" fill="none" stroke="currentColor" strokeWidth="4.5" className="text-dark/45" />
                <path d="M 120 0 L 120 200" fill="none" stroke="currentColor" strokeWidth="4.5" className="text-dark/45" />
                <path d="M 280 0 L 280 200" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-dark/25" />
              </svg>
            </div>
            
            {/* Pulsing Red Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <MapPin size={18} className="text-white" />
              </div>
              <div className="w-4 h-1.5 bg-dark/15 rounded-full blur-[2px] mt-1"></div>
            </div>

            <div className="relative z-10 mt-3">
              <p className="font-bold text-xs text-dark">Astoria Pollos Brass</p>
              <p className="text-[10px] text-dark/50 font-description mt-0.5">Lima, Perú (Acá va tu dirección exacta)</p>
            </div>
          </div>

          <motion.a
            whileTap={{ scale: 0.95 }}
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-gray-50 hover:bg-gray-100 text-dark py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-gray-200 transition-colors"
          >
            <MapPin size={14} className="text-primary animate-bounce" />
            Abrir en Google Maps
          </motion.a>
        </section>

        {/* RESEÑAS BUTTON */}
        <section className="mt-8 mb-4 border border-gray-100 bg-white rounded-[2rem] p-6 text-center shadow-sm">
          <h3 className="font-title text-primary text-[22px] leading-tight mb-1">¿Cómo estuvo todo?</h3>
          <p className="text-[11px] text-dark/50 mb-4 font-description">Ayúdanos a mejorar calificando tu experiencia con nosotros</p>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReviewForm(true)}
            className="bg-primary text-white px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 flex items-center justify-center gap-2 mx-auto w-full"
          >
            <Star size={16} className="fill-white" />
            Calificar Experiencia
          </motion.button>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 pt-8 pb-10 border-t border-gray-100 flex flex-col items-center justify-center bg-white rounded-t-[2.5rem] -mx-5 px-5">
          <p className="font-title text-2xl text-primary mb-4">{RESTAURANTE_NAME}</p>
          {LOGO_FOOTER_PATH && (
            <img 
              src={LOGO_FOOTER_PATH} 
              alt={RESTAURANTE_NAME} 
              className="w-28 h-28 object-contain mb-6 rounded-3xl shadow-sm border border-gray-100" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <p className="text-[10px] text-dark/40 font-bold uppercase tracking-widest">© 2026 Todos los derechos reservados.</p>
        </footer>

        {/* CREADO POR / HECHO POR TYMA (TEMA CLARO A JUEGO) */}
        <div className="bg-gray-50 -mx-5 px-5 py-8 flex flex-col items-center justify-center border-t border-gray-100">
          <p className="text-[9px] font-black tracking-[0.25em] uppercase mb-2 text-dark/30">Digital Menu Experience</p>
          <motion.a 
            href="https://tymasolutions.lat/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-bold text-sm tracking-tight group cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-dark/80 group-hover:text-primary transition-colors duration-200 font-sans">Hecho por Tyma </span>
            <span className="text-primary group-hover:text-dark transition-colors duration-200 font-sans">Solutions</span>
          </motion.a>
        </div>
      </main>

      {/* FLOAT BAR DE PEDIDO EN CURSO (SOLO SE MUESTRA SI EL CARRITO TIENE ITEMS Y EL RESUMEN NO ESTÁ ABIERTO) */}
      <AnimatePresence>
        {cartCount > 0 && !showSummary && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-18 w-full max-w-md p-5 z-40"
          >
            <div className="glass rounded-[2rem] p-4 flex items-center justify-between border border-white/80 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="shimmer absolute inset-0 opacity-20"></div>
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-dark/40 uppercase tracking-widest">Tu Pedido</p>
                  <p className="font-title text-dark text-base leading-none mt-1">{cartCount} Artículos</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummary(true)}
                className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-primary/20 font-bold text-xs uppercase tracking-wider transition-all duration-200"
              >
                Ver Pedido
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BARRA DE NAVEGACIÓN NATIVA INFERIOR (CARTA) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-gray-100 py-2.5 px-6 flex justify-between items-center z-50 shadow-[0_-4px_20px_0_rgba(0,0,0,0.04)]">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-dark/60 hover:text-primary transition-colors cursor-pointer"
        >
          <Home size={18} />
          <span className="text-[9px] font-bold">Inicio</span>
        </button>
        
        <button 
          onClick={() => {
            const el = document.getElementById('menu-section');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="flex flex-col items-center gap-1 text-dark/60 hover:text-primary transition-colors cursor-pointer"
        >
          <Utensils size={18} />
          <span className="text-[9px] font-bold">Menú</span>
        </button>
        
        <button 
          onClick={() => cartCount > 0 ? setShowSummary(true) : alert("Tu carrito está vacío. ¡Añade algunos platos!")}
          className="flex flex-col items-center gap-1 text-dark/60 hover:text-primary transition-colors relative cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 bg-primary text-white rounded-full text-[8px] font-black flex items-center justify-center px-1 border border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold">Pedidos</span>
        </button>
        
        <button 
          onClick={() => {
            const el = document.getElementById('contact-section');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="flex flex-col items-center gap-1 text-dark/60 hover:text-primary transition-colors cursor-pointer"
        >
          <MessageSquare size={18} />
          <span className="text-[9px] font-bold">Contacto</span>
        </button>
      </div>

      {/* MODAL RESUMEN COMPRA */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 lg:p-0"
            onClick={() => setShowSummary(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white text-dark w-full max-w-md rounded-t-[3rem] p-6 max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-title text-2xl text-primary flex items-center gap-2">
                  <ShoppingBag size={24} /> Mi Pedido
                </h2>
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-dark/40" />
                </button>
              </div>

              <div className="space-y-3 mb-8">
                {cart.map(item => (
                  <div
                    key={`${item.nombre}-${item.precio}-${item.opcion || ''}`}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-2.5xl border border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-dark text-sm truncate">{item.nombre}</h4>
                      {item.opcion && (
                        <p className="text-[10px] text-secondary font-black tracking-wide uppercase mt-0.5">
                          ✓ {item.opcion}
                        </p>
                      )}
                      <p className="text-xs text-primary font-black mt-0.5">S/.{item.precio}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-2xl border border-gray-150">
                      <button onClick={() => updateQuantity(item.nombre, item.precio, -1, item.opcion)} className="text-dark/40 hover:text-primary transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="font-title text-sm w-4 text-center leading-none mt-0.5">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.nombre, item.precio, 1, item.opcion)} className="text-primary hover:text-primary/80 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => updateQuantity(item.nombre, item.precio, -item.cantidad, item.opcion)}
                      className="text-primary/40 hover:text-primary ml-1 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-title text-xl text-dark">Total a pagar</h3>
                  <h3 className="font-title text-2xl text-primary">S/.{calculateTotal().toFixed(2)}</h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSummary(false);
                  setShowDeliveryModal(true);
                }}
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-4 rounded-2.5xl flex items-center justify-center gap-2 shadow-xl shadow-green-500/10 font-bold text-xs uppercase tracking-wider hover:scale-[1.01] transition-all duration-200"
              >
                Enviar Pedido a WhatsApp
                <ChevronRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AMPLIA FOTO MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Plato ampliado"
              className="max-w-full max-h-[85vh] object-contain rounded-3xl shadow-2xl border border-white/5"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORMULARIO CUMPLEAÑOS */}
      <AnimatePresence>
        {showBirthdayForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowBirthdayForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white text-dark w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowBirthdayForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-dark/40" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange-500 rounded-3xl flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
                  <Gift size={26} className="text-secondary animate-pulse" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-1">¡Tu Cumpleaños!</h2>
                <p className="text-[10px] font-description text-dark/50 px-4 leading-normal mt-1">{COPY_CUMPLEANOS}</p>
              </div>

              {birthdaySuccess ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-center text-xs font-bold border border-green-200 animate-bounce">
                  🎉 ¡Muchas gracias! Recibirás tu regalo sorpresa.
                </div>
              ) : (
                <form onSubmit={handleBirthdaySubmit} className="space-y-3">
                  <div>
                    <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Nombre Completo</label>
                    <input required type="text" value={birthdayData.nombre} onChange={e => setBirthdayData({...birthdayData, nombre: e.target.value})} className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Teléfono</label>
                    <input required type="tel" minLength={9} maxLength={11} pattern="[0-9]*" value={birthdayData.telefono} onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setBirthdayData({...birthdayData, telefono: val});
                    }} className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors" placeholder="Ej. 987654321" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Fecha de Nacimiento</label>
                    <input required type="date" value={birthdayData.fechaNacimiento} onChange={e => setBirthdayData({...birthdayData, fechaNacimiento: e.target.value})} className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark/60 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Distrito</label>
                    <input required type="text" value={birthdayData.distrito} onChange={e => setBirthdayData({...birthdayData, distrito: e.target.value})} className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors" placeholder="Ej. La Joya" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Correo Electrónico (Opcional)</label>
                    <input type="email" value={birthdayData.correo} onChange={e => setBirthdayData({...birthdayData, correo: e.target.value})} className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors" placeholder="correo@ejemplo.com" />
                  </div>
                  
                  <button disabled={isSubmittingBirthday} type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 mt-3 disabled:opacity-70 flex justify-center items-center">
                    {isSubmittingBirthday ? <Loader2 size={16} className="animate-spin" /> : "Guardar mis datos 🎁"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORMULARIO RESEÑAS */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white text-dark w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowReviewForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-dark/40" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-amber-500 rounded-3xl flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
                  <Star size={26} className="text-white fill-white" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-1">¡Califícanos!</h2>
                <p className="text-[10px] font-description text-dark/50 px-3">Tu opinión es fundamental para mantener el auténtico sabor al carbón.</p>
              </div>

              {reviewSuccess ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-center text-xs font-bold border border-green-200 animate-bounce">
                  ✨ ¡Gracias por tu reseña! Tu opinión es valiosa.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  
                  <div className="bg-gray-50 p-4 rounded-2.5xl border border-gray-100 flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-dark/50 mb-2">Atención del Mozo</p>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasMozo: star})}
                          className="p-0.5 transition-transform hover:scale-115"
                        >
                          <Star size={26} className={reviewData.estrellasMozo >= star ? "text-secondary fill-secondary" : "text-dark/15"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2.5xl border border-gray-100 flex flex-col items-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-dark/50 mb-2">Calidad de la Comida</p>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasComida: star})}
                          className="p-0.5 transition-transform hover:scale-115"
                        >
                          <Star size={26} className={reviewData.estrellasComida >= star ? "text-secondary fill-secondary" : "text-dark/15"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Comentario (Opcional)</label>
                    <textarea 
                      rows={3} 
                      value={reviewData.comentario} 
                      onChange={e => setReviewData({...reviewData, comentario: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors resize-none mt-1" 
                      placeholder="Cuéntanos más sobre tu experiencia..." 
                    />
                  </div>
                  
                  <button disabled={isSubmittingReview} type="submit" className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 mt-2 disabled:opacity-70 flex justify-center items-center">
                    {isSubmittingReview ? <Loader2 size={16} className="animate-spin" /> : "Enviar Reseña ✨"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORMULARIO DIRECCIÓN DE ENTREGA */}
      <AnimatePresence>
        {showDeliveryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDeliveryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white text-dark w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <X size={16} className="text-dark/40" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange-500 rounded-3xl flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
                  <MapPin size={26} className="text-white animate-pulse" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-1">Datos de Entrega</h2>
                <p className="text-[10px] font-description text-dark/50 px-4 leading-normal mt-1">
                  Ingresa los detalles para que llevemos tu pedido calientito y a la dirección exacta en Puerto Maldonado.
                </p>
              </div>

              <form onSubmit={handleDeliverySubmit} className="space-y-3">
                <div>
                  <label className="text-[9px] font-black text-dark/40 uppercase ml-1">¿Quién recibe? (Nombre)</label>
                  <input
                    required
                    type="text"
                    value={deliveryData.nombre}
                    onChange={e => setDeliveryData({...deliveryData, nombre: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Sector / Barrio</label>
                  <select
                    required
                    value={deliveryData.sector}
                    onChange={e => setDeliveryData({...deliveryData, sector: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors"
                  >
                    <option value="">Selecciona tu sector</option>
                    <option value="Centro / Cercado">Centro / Cercado</option>
                    <option value="La Joya">La Joya</option>
                    <option value="El Triunfo">El Triunfo (Las Piedras)</option>
                    <option value="Pueblo Viejo">Pueblo Viejo</option>
                    <option value="Bellavista">Bellavista</option>
                    <option value="Los Olivos">Los Olivos</option>
                    <option value="Alto Tambopata">Alto Tambopata</option>
                    <option value="Chorrillos">Chorrillos</option>
                    <option value="Rompeolas">Rompeolas</option>
                    <option value="Fonavi">Fonavi</option>
                    <option value="Faustino Maldonado">Faustino Maldonado</option>
                    <option value="Bello Horizonte">Bello Horizonte</option>
                    <option value="Otro (Especificar en dirección)">Otro (Especificar en dirección)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Dirección Exacta</label>
                  <input
                    required
                    type="text"
                    value={deliveryData.direccion}
                    onChange={e => setDeliveryData({...deliveryData, direccion: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors"
                    placeholder="Ej. Jr. Lambayeque 450, dpto 3"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Referencia de Entrega</label>
                  <input
                    required
                    type="text"
                    value={deliveryData.referencia}
                    onChange={e => setDeliveryData({...deliveryData, referencia: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors"
                    placeholder="Ej. Portón negro frente al parque Grau"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-dark/40 uppercase ml-1">Método de Pago</label>
                  <select
                    required
                    value={deliveryData.metodoPago}
                    onChange={e => setDeliveryData({...deliveryData, metodoPago: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/50 text-dark transition-colors"
                  >
                    <option value="">Selecciona tu método de pago</option>
                    <option value="Yape / Plin">Yape / Plin</option>
                    <option value="Tarjeta">Tarjeta</option>
                    <option value="Efectivo">Efectivo</option>
                  </select>
                </div>

                {/* SECCIÓN GEOLOCALIZACIÓN GPS (OPCIONAL) */}
                <div className="pt-2">
                  {deliveryData.locationSuccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-700 text-[11px] font-bold">
                        <Check size={16} className="text-green-600 shrink-0" />
                        <span>📍 GPS Vinculado con éxito</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        className="text-[10px] text-green-700 hover:text-green-800 underline font-semibold transition-colors"
                      >
                        Actualizar
                      </button>
                    </div>
                  ) : deliveryData.locationError ? (
                    <div className="space-y-1.5">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-[10px] font-description leading-snug">
                        ⚠️ {deliveryData.locationError}
                      </div>
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        className="w-full bg-gray-50 hover:bg-gray-100 text-dark/80 text-xs py-2 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 font-bold"
                      >
                        <Compass size={14} className="animate-pulse" />
                        Intentar vincular GPS otra vez
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={deliveryData.isLocating}
                      onClick={handleGetLocation}
                      className="w-full bg-gray-50 hover:bg-gray-100 text-dark/80 text-xs py-2.5 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 font-bold disabled:opacity-70"
                    >
                      {deliveryData.isLocating ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-primary" />
                          Obteniendo coordenadas GPS...
                        </>
                      ) : (
                        <>
                          <Compass size={14} className="text-primary" />
                          Vincular mi GPS (Opcional)
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-[8px] text-dark/40 font-description text-center mt-1">
                    Compartir tu GPS ayuda al motorizado a llegar sin llamadas ni demoras.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-green-500/20 mt-4 flex justify-center items-center gap-2 transition-all animate-pulse hover:animate-none"
                >
                  Confirmar y Enviar a WhatsApp 🍗
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL SELECCIÓN DE OPCIONES (ACOMPAÑAMIENTOS/SABORES/BEBIDAS) */}
      <AnimatePresence>
        {optionsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[75] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOptionsModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white text-dark w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative border border-gray-100"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setOptionsModal(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={16} className="text-dark/40" />
              </button>

              <div className="flex flex-col items-center text-center mb-4 mt-2">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange-500 rounded-3xl flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
                  <Sparkles size={26} className="text-white animate-pulse" />
                </div>
                <h2 className="font-title text-xl text-dark leading-snug">{optionsModal.dish.nombre}</h2>
                <p className="text-[9px] font-sans text-dark/40 font-black tracking-wider uppercase mt-1">Personaliza tu pedido</p>
              </div>

              <div className="space-y-4 max-h-[42vh] overflow-y-auto pr-1 mb-6 scrollbar-thin">
                {/* 1. Rice Selector */}
                {optionsModal.showRice && (
                  <div>
                    <h3 className="text-[10px] font-black text-primary tracking-wider uppercase mb-2 ml-1">
                      Elige tu acompañamiento
                    </h3>
                    <div className="space-y-2">
                      {['Arroz Blanco', 'Arroz Chaufa'].map(rice => {
                        const isSelected = optionsModal.selectedRice === rice;
                        return (
                          <div
                            key={rice}
                            onClick={() => setOptionsModal({ ...optionsModal, selectedRice: rice })}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all
                              ${isSelected 
                                ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                                : 'border-gray-150 bg-gray-50 text-dark/80 hover:border-gray-200'
                              }`}
                          >
                            <span className="font-bold text-xs">{rice}</span>
                            <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all
                              ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}`}
                            >
                              {isSelected && <Check size={10} className="text-white font-bold" strokeWidth={4} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Drink Selector */}
                {optionsModal.showDrink && (
                  <div>
                    <h3 className="text-[10px] font-black text-primary tracking-wider uppercase mb-2 ml-1">
                      {optionsModal.drinkTitle}
                    </h3>
                    <div className="space-y-2">
                      {optionsModal.drinkOptions.map(drink => {
                        const isSelected = optionsModal.selectedDrink === drink;
                        return (
                          <div
                            key={drink}
                            onClick={() => setOptionsModal({ ...optionsModal, selectedDrink: drink })}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all
                              ${isSelected 
                                ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                                : 'border-gray-150 bg-gray-50 text-dark/80 hover:border-gray-200'
                              }`}
                          >
                            <span className="font-bold text-xs">{drink}</span>
                            <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all
                              ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}`}
                            >
                              {isSelected && <Check size={10} className="text-white font-bold" strokeWidth={4} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Cremas Selector */}
                {optionsModal.showCremas && (
                  <div>
                    <h3 className="text-[10px] font-black text-primary tracking-wider uppercase mb-2 ml-1">
                      ¿Qué cremas deseas agregar?
                    </h3>
                    <div className="space-y-2">
                      {['Mayonesa', 'Ketchup', 'Ají'].map(crema => {
                        const isSelected = optionsModal.selectedCremas.includes(crema);
                        const handleToggle = () => {
                          const current = optionsModal.selectedCremas;
                          const next = current.includes(crema)
                            ? current.filter(c => c !== crema)
                            : [...current, crema];
                          setOptionsModal({ ...optionsModal, selectedCremas: next });
                        };
                        return (
                          <div
                            key={crema}
                            onClick={handleToggle}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all
                              ${isSelected 
                                ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                                : 'border-gray-150 bg-gray-50 text-dark/80 hover:border-gray-200'
                              }`}
                          >
                            <span className="font-bold text-xs">{crema}</span>
                            <div className={`w-4.5 h-4.5 rounded-lg border-2 flex items-center justify-center transition-all
                              ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 bg-white'}`}
                            >
                              {isSelected && <Check size={10} className="text-white font-bold" strokeWidth={4} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const parts: string[] = [];
                  if (optionsModal.showRice) {
                    parts.push(optionsModal.selectedRice);
                  }
                  if (optionsModal.showDrink) {
                    parts.push(optionsModal.selectedDrink);
                  }
                  if (optionsModal.showCremas) {
                    const selectedCremas = optionsModal.selectedCremas;
                    const cremasText = selectedCremas.length > 0
                      ? `Cremas: ${selectedCremas.join(', ')}`
                      : 'Sin cremas';
                    parts.push(cremasText);
                  }
                  addToCart(optionsModal.dish, parts.join(' | '));
                  setOptionsModal(null);
                }}
                className="w-full bg-primary hover:bg-primary/95 text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 flex justify-center items-center gap-2 transition-all cursor-pointer"
              >
                Confirmar y Agregar (S/.{optionsModal.dish.precio})
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
