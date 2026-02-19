/**
 * Translations file for Publipack application
 * 
 * This file contains all user-facing text strings in both English and Spanish.
 * Format: { en: "English text", es: "Spanish text" }
 * 
 * Each key includes a comment indicating where it's used.
 */

export const translations = {
  // ============================================
  // MAIN SCREEN (src/components/main-screen.tsx)
  // ============================================
  mainScreen: {
    title: { en: "READY TO WIN?", es: "¿LISTO PARA GANAR?" },
    subtitle: { en: "Spin the wheel and win rewards from our sponsors", es: "Gira la rueda y gana recompensas de nuestros patrocinadores" },
    subtitleBold: { en: "win rewards", es: "gana recompensas" },
    spinNowButton: { en: "SPIN NOW", es: "GIRAR AHORA" },
    countdownMessage: { en: "Or wait for the countdown", es: "O espera la cuenta regresiva" },
    cooldownMessage: { en: "Come back tomorrow for another spin", es: "Vuelve mañana para otra oportunidad" },
  },

  // ============================================
  // SLOT MACHINE / SPINNING SCREEN (src/shared/ui/slot-machine.tsx)
  // ============================================
  slotMachine: {
    title: { en: "Spinning", es: "Girando" },
  },

  // ============================================
  // YOU WON SCREEN (src/shared/ui/you-won.tsx)
  // ============================================
  youWon: {
    title: { en: "YOU WON!", es: "¡GANASTE!" },
    congratulations: { en: "Congratulations - You've", es: "Felicitaciones - Has" },
    congratulationsBold: { en: "won {name} {reward}", es: "ganado {name} {reward}" }, // {name} and {reward} are placeholders
  },

  // ============================================
  // DIDN'T WIN SCREEN (src/shared/ui/didnt-win.tsx)
  // ============================================
  didntWin: {
    title: { en: "Didn't Win", es: "No Ganaste" },
    message: { en: "Try again for another chance to win!", es: "¡Intenta de nuevo para otra oportunidad de ganar!" },
    spinAgainButton: { en: "SPIN AGAIN", es: "GIRAR DE NUEVO" },
  },

  // ============================================
  // YOU LOST SCREEN (src/shared/ui/you-lost.tsx)
  // ============================================
  youLost: {
    title: { en: "Try again tomorrow!", es: "¡Intenta de nuevo mañana!" },
    message: { en: "Better luck next time. Come back tomorrow for another spin", es: "Mejor suerte la próxima vez. Vuelve mañana para otra oportunidad" },
    playAgainButton: { en: "Play Again 24h", es: "Jugar de Nuevo 24h" },
  },

  // ============================================
  // CLAIM REWARD SCREEN (src/shared/ui/claim-reward.tsx)
  // ============================================
  claimReward: {
    title: { en: "Claim your Reward", es: "Reclama tu Recompensa" },
    titleBold: { en: "Reward", es: "Recompensa" },
    subtitle: { en: "Fill in your details to receive your voucher", es: "Completa tus datos para recibir tu cupón" },
    rewardLabel: { en: "Your Reward", es: "Tu premio" },
    
    // Form fields
    fullNamePlaceholder: { en: "Full name", es: "Nombre completo" },
    phonePlaceholder: { en: "Phone Number", es: "Número de teléfono" },
    emailPlaceholder: { en: "Email Address", es: "Correo electrónico" },
    
    // Form buttons
    getVoucherButton: { en: "Get My Voucher", es: "Obtener Mi Cupón" },
    submittingButton: { en: "Submitting...", es: "Enviando..." },
    
    // Email content (sent to user)
    emailSubject: { en: "🎉 You've Won a Prize from Publipacks!", es: "🎉 ¡Has Ganado un Premio de Publipacks!" },
    emailGreeting: { en: "Hi {fullName},", es: "Hola {fullName}," }, // {fullName} is placeholder
    emailThankYou: { en: "Thank you for playing with publipacks.com! The safest platform to win amazing awards near you!", es: "¡Gracias por jugar con publipacks.com! ¡La plataforma más segura para ganar increíbles premios cerca de ti!" },
    emailCongratulations: { en: "👉 Congratulations — you've won a prize!", es: "👉 ¡Felicitaciones — has ganado un premio!" },
    emailPrizeInfo: { en: "{sponsorName}: {reward}", es: "{sponsorName}: {reward}" }, // {sponsorName} and {reward} are placeholders
    emailEnjoy: { en: "Enjoy free prizes and exclusive discounts all around the world.", es: "Disfruta de premios gratis y descuentos exclusivos en todo el mundo." },
    emailSignUp: { en: "Sign up to receive free offers directly to your email, — click here to join: https://app.publipacks.com", es: "Regístrate para recibir ofertas gratis directamente en tu correo, — haz clic aquí para unirte: https://app.publipacks.com" },
    emailKeepPlaying: { en: "Keep playing, keep winning, and keep discovering amazing rewards!", es: "¡Sigue jugando, sigue ganando y sigue descubriendo increíbles recompensas!" },
    emailCheers: { en: "Cheers,", es: "Saludos," },
    emailTeam: { en: "The app.publipacks.com Team", es: "El Equipo de app.publipacks.com" },
    emailWebsite: { en: "app.publipacks.com", es: "app.publipacks.com" },
    emailCopyright: { en: "©️ 2025 Publicpacks.com. All rights reserved.", es: "©️ 2025 Publicpacks.com. Todos los derechos reservados." },
    emailFooter: { en: "Terms & Conditions | Privacy Policy | Data Protection Policy", es: "Términos y Condiciones | Política de Privacidad | Política de Protección de Datos" },
  },

  // ============================================
  // CLAIM SUCCESS SCREEN (src/shared/ui/claim-success.tsx)
  // ============================================
  claimSuccess: {
    title: { en: "Congratulations!", es: "¡Felicitaciones!" },
    emailMessage: { en: "Your prize has been sent to {email}", es: "Tu premio ha sido enviado a {email}" }, // {email} is placeholder
    checkInbox: { en: "Check your inbox", es: "Revisa tu bandeja de entrada" },
    rewardSaved: { en: "Your reward is also saved in My Rewards", es: "Tu recompensa también está guardada en Mis Recompensas" },
    downloadRewardButton: { en: "Download Reward", es: "Descargar Recompensa" },
    playAgainButton: { en: "Play Again", es: "Jugar de Nuevo" },
  },

  // ============================================
  // WIN BUTTONS COMPONENT (src/shared/ui/win-buttons.tsx)
  // ============================================
  winButtons: {
    claimMyPrize: { en: "CLAIM MY PRIZE", es: "RECLAMAR MI PREMIO" },
    spinAgain: { en: "SPIN AGAIN", es: "GIRAR DE NUEVO" },
    playAgain24h: { en: "Play Again 24h", es: "Jugar de Nuevo 24h" },
  },

  // ============================================
  // ACTIVITY NOTIFICATIONS (src/shared/ui/activity-notification.tsx)
  // ============================================
  activityNotification: {
    justWon: { en: "{name} just WON! {prize}", es: "{name} ¡acaba de GANAR! {prize}" }, // {name} and {prize} are placeholders
    justWonTop: { en: "{name} JUST WON", es: "{name} ¡ACABA DE GANAR!" }, // Top line for ChainBlockTop banner
  },

  // ============================================
  // FORM VALIDATION MESSAGES (src/shared/ui/claim-reward.tsx)
  // ============================================
  validation: {
    fullNameRequired: { en: "Full name is required", es: "El nombre completo es obligatorio" },
    fullNameMinLength: { en: "Full name must be at least 2 characters", es: "El nombre completo debe tener al menos 2 caracteres" },
    fullNameMaxLength: { en: "Full name must be less than 80 characters", es: "El nombre completo debe tener menos de 80 caracteres" },
    fullNameInvalidChars: { en: "Full name can only contain letters, spaces, hyphens, and apostrophes", es: "El nombre completo solo puede contener letras, espacios, guiones y apóstrofes" },
    phoneRequired: { en: "Phone number is required", es: "El número de teléfono es obligatorio" },
    phoneInvalidChars: { en: "Phone number contains invalid characters", es: "El número de teléfono contiene caracteres inválidos" },
    phoneMinDigits: { en: "Phone number must contain at least 10 digits", es: "El número de teléfono debe contener al menos 10 dígitos" },
    emailRequired: { en: "Email is required", es: "El correo electrónico es obligatorio" },
    emailInvalid: { en: "Please enter a valid email address", es: "Por favor ingresa una dirección de correo electrónico válida" },
  },

  // ============================================
  // SPONSOR REWARDS (src/shared/lib/constants.ts)
  // ============================================
  rewards: {
    preply: { en: "50% discount", es: "Un 50% de descuento" },
    lego: { en: "Free LEGO Games!", es: "Juegos Gratis de LEGO!" },
    adidas: { en: "Up to -60%", es: "Hasta -60%" },
    thenorthface: { en: "Up to -50%", es: "Hasta -50%" },
    flylevel: { en: "161€ To New York!", es: "161€ To New York!" },
    workaway: { en: "Free sailing in the Caribbean!", es: "Navegar gratis en el Caribe!" },
    elcorteingles: { en: "Travel discounts! -40%", es: "Descuentos en viajes! -40%" },
    thefarm: { en: "Free bottle of Cava", es: "Free bottle of Cava" },
  },

  // ============================================
  // ACTIVITY NOTIFICATION PRIZES (src/hooks/legacy/use-activity-notifications.ts)
  // ============================================
  activityPrizes: {
    preply50Discount: { en: "Preply 50% discount", es: "Preply Un 50% de descuento" },
    legoFreeGames: { en: "Lego Free LEGO Games!", es: "Lego Juegos Gratis de LEGO!" },
    adidasUpTo60: { en: "Adidas Up to -60%", es: "Adidas Hasta -60%" },
    thenorthfaceUpTo50: { en: "The North Face Up to -50%", es: "The North Face Hasta -50%" },
    flylevel161ToNY: { en: "FlyLevel 161€ To New York!", es: "FlyLevel 161€ To New York!" },
    workawayFreeSailing: { en: "Workaway Free sailing in the Caribbean!", es: "Workaway Navegar gratis en el Caribe!" },
    elcorteinglesTravel40: { en: "El Corte Inglés Travel discounts! -40%", es: "El Corte Inglés Descuentos en viajes! -40%" },
    thefarmFreeCava: { en: "The Farm Free bottle of Cava", es: "The Farm Botella de cava gratis" },
  },
} as const;

// Supported languages
export type Language = 'en' | 'es';

// Type for translation keys
export type TranslationKey = keyof typeof translations;

// Helper function to get nested translation
export function getTranslation(path: string, lang: Language = 'en'): string {
  const keys = path.split('.');
  let value: any = translations;
  
  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) {
      console.warn(`Translation not found for path: ${path}`);
      return path;
    }
  }
  
  // If value is an object with en/es, get the language version
  if (typeof value === 'object' && value !== null && ('en' in value || 'es' in value)) {
    return value[lang] || value.en || path;
  }
  
  return typeof value === 'string' ? value : path;
}

// Helper function to replace placeholders in translations
export function translate(key: string, lang: Language = 'en', replacements?: Record<string, string>): string {
  let text = getTranslation(key, lang);
  
  if (replacements) {
    Object.entries(replacements).forEach(([placeholder, value]) => {
      text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
    });
  }
  
  return text;
}
