import { mkdirSync, writeFileSync, cpSync } from "node:fs";
import { paginaProdutos } from "./src/carrinho.mjs";

mkdirSync("dist", { recursive: true });
cpSync("src/assets", "dist/assets", { recursive: true });

const produtos = [
  { sku: "VES-01", nome: "Vestido Floral Verão", preco_centavos: 15990, imagem: "assets/vestido_floral.jpg" },
  { sku: "BLU-02", nome: "Blusa de Seda Básica", preco_centavos: 8990, imagem: "assets/blusa_seda.jpg" },
  { sku: "CAL-03", nome: "Calça Pantalona Linho", preco_centavos: 18990, imagem: "assets/calca_pantalona.jpg" },
  { sku: "SAI-04", nome: "Saia Midi Plissada", preco_centavos: 12900, imagem: "assets/saia_midi.jpg" },
  { sku: "CAM-05", nome: "Camiseta Algodão Org.", preco_centavos: 5990, imagem: "assets/camiseta_algodao.jpg" },
  { sku: "MAC-06", nome: "Macacão Pantacourt", preco_centavos: 21990, imagem: "assets/macacao.jpg" },
  { sku: "JAQ-07", nome: "Jaqueta Jeans Over", preco_centavos: 24990, imagem: "assets/jaqueta_jeans.jpg" },
  { sku: "SHO-08", nome: "Short Alfaiataria", preco_centavos: 9990, imagem: "assets/short_alfaiataria.jpg" },
  { sku: "VES-09", nome: "Vestido Longo Festa", preco_centavos: 35990, imagem: "assets/vestido_festa.jpg" },
  { sku: "BLU-10", nome: "Blusa Tricot Inverno", preco_centavos: 11990, imagem: "assets/blusa_tricot.jpg" },
  { sku: "CON-11", nome: "Conjunto Moletom", preco_centavos: 17990, imagem: "assets/conjunto_moletom.jpg" },
  { sku: "TOP-12", nome: "Top Cropped Renda", preco_centavos: 4990, imagem: "assets/blusa_seda.jpg" },
];
const produtosComDesconto = produtos.map(p => ({ 
  ...p, 
  preco_original: p.preco_centavos,
  preco_centavos: Math.round(p.preco_centavos * 0.8),
  desconto_percentual: 20
}));
writeFileSync("dist/index.html", paginaProdutos(produtosComDesconto));
console.log("dist/index.html gerado");

