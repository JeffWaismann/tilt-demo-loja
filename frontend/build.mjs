import { mkdirSync, writeFileSync, cpSync } from "node:fs";
import { paginaProdutos } from "./src/carrinho.mjs";

mkdirSync("dist", { recursive: true });
cpSync("src/assets", "dist/assets", { recursive: true });

const produtos = [
  { sku: "VES-01", nome: "Vestido Floral Verão", preco_centavos: 15990, imagem: "assets/vestido_floral.jpg" },
  { sku: "BLU-02", nome: "Blusa de Seda Básica", preco_centavos: 8990, imagem: "assets/blusa_seda.jpg" },
  { sku: "CAL-03", nome: "Calça Pantalona Linho", preco_centavos: 18990, imagem: "assets/calca_pantalona.jpg" },
  { sku: "SAI-04", nome: "Saia Midi Plissada", preco_centavos: 12900 },
  { sku: "CAM-05", nome: "Camiseta Algodão Org.", preco_centavos: 5990 },
  { sku: "MAC-06", nome: "Macacão Pantacourt", preco_centavos: 21990 },
  { sku: "JAQ-07", nome: "Jaqueta Jeans Over", preco_centavos: 24990 },
  { sku: "SHO-08", nome: "Short Alfaiataria", preco_centavos: 9990 },
  { sku: "VES-09", nome: "Vestido Longo Festa", preco_centavos: 35990, imagem: "assets/vestido_floral.jpg" },
  { sku: "BLU-10", nome: "Blusa Tricot Inverno", preco_centavos: 11990, imagem: "assets/blusa_seda.jpg" },
  { sku: "CON-11", nome: "Conjunto Moletom", preco_centavos: 17990 },
  { sku: "TOP-12", nome: "Top Cropped Renda", preco_centavos: 4990 },
];
writeFileSync("dist/index.html", paginaProdutos(produtos));
console.log("dist/index.html gerado");

