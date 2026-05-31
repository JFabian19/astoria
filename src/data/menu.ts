import { SheetCategory, SheetDish } from '../services/googleSheets';

export const STATIC_CATEGORIES: SheetCategory[] = [
  { nombre: "A la Brasa y Especiales" },
  { nombre: "Combos Astoria" },
  { nombre: "Bebidas Heladas" },
  { nombre: "Complementos" }
];

export const STATIC_DISHES: SheetDish[] = [
  // 1. A la Brasa y Especiales
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "Salchipapa",
    "descripción": "Abundante hot dog + crocantes papas fritas. (*Arroz chaufa, arroz turco o aguadito de cortesía hasta agotar producto).",
    "precio": "S/.10",
    "URL de imagen": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/8 Salchipollero",
    "descripción": "1/8 de pollo a la brasa + abundante hot dog + papas fritas + ensalada fresca.",
    "precio": "S/.16",
    "URL de imagen": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/8 Pollo a la brasa",
    "descripción": "1/8 de pollo a la brasa + papas fritas + ensalada fresca.",
    "precio": "S/.14",
    "URL de imagen": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/4 Salchipollero",
    "descripción": "1/4 de pollo a la brasa + abundante hot dog + papas fritas + ensalada fresca.",
    "precio": "S/.26",
    "URL de imagen": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/4 de Pollo a la brasa",
    "descripción": "1/4 de pollo + papas fritas + ensalada fresca.",
    "precio": "S/.24",
    "URL de imagen": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/2 Pollo a la brasa",
    "descripción": "1/2 pollo a la brasa + papas fritas + ensalada fresca.",
    "precio": "S/.45",
    "URL de imagen": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1 Pollo entero",
    "descripción": "1 pollo entero a la brasa + 2 porciones de papas fritas + ensalada fresca.",
    "precio": "S/.85",
    "URL de imagen": ""
  },

  // 2. Combos Astoria
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1/8 a la brasa + Pepsi",
    "descripción": "1/8 de pollo a la brasa + papas fritas + ensalada + Pepsi de 355ml.",
    "precio": "S/.15",
    "URL de imagen": ""
  },
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1/4 a la brasa + Pepsi",
    "descripción": "1/4 de pollo a la brasa + papas fritas + ensalada + Pepsi de 600ml.",
    "precio": "S/.26",
    "URL de imagen": ""
  },
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1/2 pollo a la brasa + Pepsi",
    "descripción": "1/2 pollo a la brasa + papas fritas + ensalada + Pepsi de 1 litro.",
    "precio": "S/.49",
    "URL de imagen": ""
  },
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1 Pollo Oferta",
    "descripción": "1 Pollo entero a la brasa + 2 porciones de papas fritas + ensalada fresca + Inka Cola o Coca Cola de 2.25 litros.",
    "precio": "S/.95",
    "URL de imagen": ""
  },
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1 Pollo Fresh",
    "descripción": "1 pollo entero a la brasa + 2 porciones de papas fritas + ensalada + 1 litro de refresco natural (Maracuyá, Maíz morado, Copoazú).",
    "precio": "S/.92",
    "URL de imagen": ""
  },

  // 3. Bebidas Heladas
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1/2 Litro de Refresco Natural",
    "descripción": "Sabores a elegir: Maíz morado, Maracuyá, Copoazú.",
    "precio": "S/.3",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1 Litro de Refresco Natural",
    "descripción": "Sabores a elegir: Maíz morado, Maracuyá, Copoazú.",
    "precio": "S/.8",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "Mini Pepsi",
    "descripción": "Pepsi de 355ml.",
    "precio": "S/.2",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1/2 Litro Pepsi",
    "descripción": "Pepsi de 600 ml.",
    "precio": "S/.4",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1 Litro Pepsi",
    "descripción": "Botella de 1 litro.",
    "precio": "S/.6",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1/2 Litro Inca Kola",
    "descripción": "Botella de 1/2 litro.",
    "precio": "S/.4",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1/2 Litro Coca Cola",
    "descripción": "Botella de 1/2 litro.",
    "precio": "S/.4",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "2.25 Litros Inca Kola",
    "descripción": "Botella familiar de 2.25 litros.",
    "precio": "S/.12",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "2.25 Litros Coca Cola",
    "descripción": "Botella familiar de 2.25 litros.",
    "precio": "S/.12",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "Agua Mineral sin gas",
    "descripción": "Botella personal de agua.",
    "precio": "S/.3",
    "URL de imagen": ""
  },

  // 4. Complementos
  {
    "categoría": "Complementos",
    "nombre del plato": "1/2 Porción de Papas Fritas",
    "descripción": "Media porción de papas fritas crocantes.",
    "precio": "S/.6",
    "URL de imagen": ""
  },
  {
    "categoría": "Complementos",
    "nombre del plato": "1 Porción de Papas Fritas",
    "descripción": "Porción completa de papas fritas crocantes.",
    "precio": "S/.10",
    "URL de imagen": ""
  },
  {
    "categoría": "Complementos",
    "nombre del plato": "1/2 Porción de Ensalada",
    "descripción": "Media porción de ensalada fresca de la casa.",
    "precio": "S/.6",
    "URL de imagen": ""
  },
  {
    "categoría": "Complementos",
    "nombre del plato": "1 Porción de Ensalada",
    "descripción": "Porción completa de ensalada fresca de la casa.",
    "precio": "S/.10",
    "URL de imagen": ""
  }
];
