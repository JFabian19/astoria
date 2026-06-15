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
    "precio del plato": "10",
    "imagen URL": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/8 Salchipollero",
    "descripción": "1/8 de pollo a la brasa + abundante hot dog + papas fritas + ensalada fresca.",
    "precio del plato": "16",
    "imagen URL": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/8 Pollo a la brasa",
    "descripción": "1/8 de pollo a la brasa + papas fritas + ensalada fresca.",
    "precio del plato": "14",
    "imagen URL": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/4 Salchipollero",
    "descripción": "1/4 de pollo a la brasa + abundante hot dog + papas fritas + ensalada fresca.",
    "precio del plato": "26",
    "imagen URL": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/4 de Pollo a la brasa",
    "descripción": "1/4 de pollo + papas fritas + ensalada fresca.",
    "precio del plato": "24",
    "imagen URL": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1/2 Pollo a la brasa",
    "descripción": "1/2 pollo a la brasa + papas fritas + ensalada fresca.",
    "precio del plato": "45",
    "imagen URL": ""
  },
  {
    "categoría": "A la Brasa y Especiales",
    "nombre del plato": "1 Pollo entero",
    "descripción": "1 pollo entero a la brasa + 2 porciones de papas fritas + ensalada fresca.",
    "precio del plato": "85",
    "imagen URL": ""
  },

  // 2. Combos Astoria
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1/8 a la brasa + Pepsi",
    "descripción": "1/8 de pollo a la brasa + papas fritas + ensalada + Pepsi de 355ml.",
    "precio del plato": "15",
    "imagen URL": ""
  },
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1/4 a la brasa + Pepsi",
    "descripción": "1/4 de pollo a la brasa + papas fritas + ensalada + Pepsi de 600ml.",
    "precio del plato": "26",
    "imagen URL": ""
  },
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1/2 pollo a la brasa + Pepsi",
    "descripción": "1/2 pollo a la brasa + papas fritas + ensalada + Pepsi de 1 litro.",
    "precio del plato": "49",
    "imagen URL": ""
  },
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1 Pollo Oferta",
    "descripción": "1 Pollo entero a la brasa + 2 porciones de papas fritas + ensalada fresca + Inka Cola o Coca Cola de 2.25 litros.",
    "precio del plato": "95",
    "imagen URL": ""
  },
  {
    "categoría": "Combos Astoria",
    "nombre del plato": "1 Pollo Fresh",
    "descripción": "1 pollo entero a la brasa + 2 porciones de papas fritas + ensalada + 1 litro de refresco natural (Maracuyá, Maíz morado, Copoazú).",
    "precio del plato": "92",
    "imagen URL": ""
  },

  // 3. Bebidas Heladas
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1/2 Litro de Refresco Natural",
    "descripción": "Sabores a elegir: Maíz morado, Maracuyá, Copoazú.",
    "precio del plato": "3",
    "imagen URL": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1 Litro de Refresco Natural",
    "descripción": "Sabores a elegir: Maíz morado, Maracuyá, Copoazú.",
    "precio del plato": "8",
    "imagen URL": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "Mini Pepsi",
    "descripción": "Pepsi de 355ml.",
    "precio del plato": "2",
    "imagen URL": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1/2 Litro Pepsi",
    "descripción": "Pepsi de 600 ml.",
    "precio del plato": "4",
    "imagen URL": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1 Litro Pepsi",
    "descripción": "Botella de 1 litro.",
    "precio del plato": "6",
    "imagen URL": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1/2 Litro Inca Kola",
    "descripción": "Botella de 1/2 litro.",
    "precio del plato": "4",
    "imagen URL": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "1/2 Litro Coca Cola",
    "descripción": "Botella de 1/2 litro.",
    "precio del plato": "4",
    "imagen URL": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "2.25 Litros Inca Kola",
    "descripción": "Botella familiar de 2.25 litros.",
    "precio del plato": "12",
    "imagen URL": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "2.25 Litros Coca Cola",
    "descripción": "Botella familiar de 2.25 litros.",
    "precio del plato": "12",
    "imagen URL": ""
  },
  {
    "categoría": "Bebidas Heladas",
    "nombre del plato": "Agua Mineral sin gas",
    "descripción": "Botella personal de agua.",
    "precio del plato": "3",
    "imagen URL": ""
  },

  // 4. Complementos
  {
    "categoría": "Complementos",
    "nombre del plato": "1/2 Porción de Papas Fritas",
    "descripción": "Media porción de papas fritas crocantes.",
    "precio del plato": "6",
    "imagen URL": ""
  },
  {
    "categoría": "Complementos",
    "nombre del plato": "1 Porción de Papas Fritas",
    "descripción": "Porción completa de papas fritas crocantes.",
    "precio del plato": "10",
    "imagen URL": ""
  },
  {
    "categoría": "Complementos",
    "nombre del plato": "1/2 Porción de Ensalada",
    "descripción": "Media porción de ensalada fresca de la casa.",
    "precio del plato": "6",
    "imagen URL": ""
  },
  {
    "categoría": "Complementos",
    "nombre del plato": "1 Porción de Ensalada",
    "descripción": "Porción completa de ensalada fresca de la casa.",
    "precio del plato": "10",
    "imagen URL": ""
  }
];
