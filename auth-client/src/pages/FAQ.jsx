import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqSections = [
    {
      category: "Pedidos y Compras",
      icon: "fas fa-shopping-cart",
      color: "from-blue-500 to-cyan-500",
      questions: [
        {
          q: "¿Cómo puedo hacer un pedido?",
          a: "Para realizar un pedido, selecciona el producto, elige la cantidad y haz clic en 'Agregar al carrito'. Luego, sigue el proceso de pago."
        },
        {
          q: "¿Puedo modificar o cancelar mi pedido?",
          a: "Puedes modificar o cancelar tu pedido antes de que sea enviado. Contáctanos lo antes posible para ayudarte."
        },
        {
          q: "¿Qué métodos de pago aceptan?",
          a: "Aceptamos tarjetas de crédito, débito y pagos por transferencia bancaria."
        }
      ]
    },
    {
      category: "Envíos",
      icon: "fas fa-truck",
      color: "from-green-500 to-teal-500",
      questions: [
        {
          q: "¿Cuánto tarda el envío?",
          a: "El envío estándar tarda de 3 a 5 días hábiles. El envío exprés tarda de 1 a 2 días hábiles."
        },
        {
          q: "¿Puedo rastrear mi pedido?",
          a: "Sí, recibirás un correo con el número de seguimiento una vez que tu pedido sea enviado."
        },
        {
          q: "¿Realizan envíos internacionales?",
          a: "Actualmente solo realizamos envíos dentro de El Salvador."
        }
      ]
    },
    {
      category: "Devoluciones y Reembolsos",
      icon: "fas fa-undo",
      color: "from-purple-500 to-pink-500",
      questions: [
        {
          q: "¿Puedo devolver un producto?",
          a: "Sí, tienes 30 días para solicitar una devolución si el producto está en condiciones originales."
        },
        {
          q: "¿Cómo solicito un reembolso?",
          a: "Contáctanos con tu número de pedido y motivo de devolución. Procesaremos el reembolso en 5–7 días hábiles."
        },
        {
          q: "¿Qué productos no tienen devolución?",
          a: "Productos en oferta o personalizados no aplican para devoluciones."
        }
      ]
    },
    {
      category: "Soporte y Contacto",
      icon: "fas fa-headset",
      color: "from-orange-500 to-red-500",
      questions: [
        {
          q: "¿Cómo puedo contactar al soporte?",
          a: "Escríbenos a soporte@tiendaecommerce.com o llama al +503 1234-5678."
        },
        {
          q: "¿Tienen atención presencial?",
          a: "Sí, puedes visitarnos en nuestra tienda física en San Salvador."
        }
      ]
    }
  ];

  const toggleQuestion = (sectionIndex, questionIndex) => {
    const index = `${sectionIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <motion.main
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-4xl mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <i className="fas fa-question-circle text-3xl text-white"></i>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Preguntas Frecuentes
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqSections.map((section, sectionIndex) => (
              <motion.section
                key={sectionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + sectionIndex * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-indigo-100 shadow-md"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <i className={`${section.icon} text-white text-xl`}></i>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">{section.category}</h2>
                </div>

                <div className="space-y-3">
                  {section.questions.map((item, questionIndex) => {
                    const index = `${sectionIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;

                    return (
                      <motion.div
                        key={questionIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + sectionIndex * 0.1 + questionIndex * 0.05 }}
                        className="bg-white rounded-xl border border-indigo-100 overflow-hidden hover:border-indigo-300 transition-all duration-300"
                      >
                        <button
                          onClick={() => toggleQuestion(sectionIndex, questionIndex)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-indigo-50 transition-colors duration-300 group"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              isOpen 
                                ? `bg-gradient-to-br ${section.color}` 
                                : 'bg-gray-100 group-hover:bg-indigo-100'
                            }`}>
                              <i className={`fas fa-question text-sm ${isOpen ? 'text-white' : 'text-gray-600 group-hover:text-indigo-600'}`}></i>
                            </div>
                            <span className={`font-semibold transition-colors duration-300 ${
                              isOpen ? 'text-indigo-700' : 'text-gray-800 group-hover:text-indigo-700'
                            }`}>
                              {item.q}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0 ml-4"
                          >
                            <i className={`fas fa-chevron-down ${isOpen ? 'text-indigo-600' : 'text-gray-400'}`}></i>
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-2">
                                <div className={`pl-11 pr-4 py-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border-l-4 border-indigo-400`}>
                                  <p className="text-gray-700 leading-relaxed">{item.a}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Help CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-10 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center border-l-4 border-green-500"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <i className="fas fa-life-ring text-white text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-3">¿No encontraste tu respuesta?</h3>
            <p className="text-gray-700 mb-6">Nuestro equipo de soporte está listo para ayudarte</p>
            <motion.a
              href="mailto:soporte@tiendaecommerce.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <i className="fas fa-envelope"></i>
              <span>Contáctanos</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.main>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}