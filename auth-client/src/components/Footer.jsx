import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const footerSections = [
    {
      title: "Tienda",
      links: [
        { to: "/products", label: "Todos los productos" },
        { to: "/featured", label: "Destacados" },
        { to: "/new-arrivals", label: "Novedades" },
        { to: "/sale", label: "En oferta" },
        { to: "/gift-cards", label: "Tarjetas de regalo" }
      ]
    },
    {
      title: "Atención al Cliente",
      links: [
        { to: "/contact", label: "Contáctanos" },
        { to: "/faq", label: "Preguntas frecuentes" },
        { to: "/shipping-policy", label: "Política de envíos" },
        { to: "/returns", label: "Devoluciones y reembolsos" },
        { to: "/track-order", label: "Rastrear pedido" }
      ]
    },
    {
      title: "Acerca de",
      links: [
        { to: "/about", label: "Nuestra historia" },
        { to: "/careers", label: "Empleos" },
        { to: "/terms", label: "Términos y condiciones" },
        { to: "/privacy", label: "Política de privacidad" },
        { to: "/blog", label: "Blog" }
      ]
    }
  ];

  const socialLinks = [
    { icon: "fab fa-facebook-f", href: "#", color: "hover:text-blue-500" },
    { icon: "fab fa-twitter", href: "#", color: "hover:text-sky-400" },
    { icon: "fab fa-instagram", href: "#", color: "hover:text-pink-500" },
    { icon: "fab fa-pinterest", href: "#", color: "hover:text-red-500" }
  ];

  return (
    <motion.footer
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-bolt text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold">
                Tienda<span className="text-indigo-400">Ecommerce</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Plataforma de comercio electrónico premium que ofrece los mejores productos a precios competitivos.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-colors ${social.color}`}
                  aria-label={`Social link ${index}`}
                >
                  <i className={social.icon}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + sectionIndex * 0.1 }}
            >
              <h4 className="text-lg font-bold mb-6 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2"
                    >
                      <i className="fas fa-chevron-right text-xs"></i>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Tienda Ecommerce. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <Link to="/terms" className="hover:text-indigo-400 transition-colors">
                Términos
              </Link>
              <Link to="/privacy" className="hover:text-indigo-400 transition-colors">
                Privacidad
              </Link>
              <Link to="/cookies" className="hover:text-indigo-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}