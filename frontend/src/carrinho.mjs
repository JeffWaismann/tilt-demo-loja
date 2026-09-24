// Dominio do frontend da Loja: formatacao e soma do carrinho. Sem dependencias -- o build e o
// teste rodam com o Node da imagem, e o que o pipeline prova e a coreografia, nao o framework.
export function formataCentavos(centavos) {
  const reais = Math.floor(centavos / 100);
  const cents = String(centavos % 100).padStart(2, "0");
  return `R$ ${reais.toLocaleString("pt-BR")},${cents}`;
}

export function somaCarrinho(itens) {
  return itens.reduce((acc, { precoCentavos, qtd }) => acc + precoCentavos * qtd, 0);
}

export function paginaProdutos(produtos) {
  const cards = produtos
    .map((p) => `
      <article class="product-card" data-sku="${p.sku}">
        <div class="product-image">
          <div class="discount-badge">20% OFF</div>
          ${p.imagem ? 
            `<img src="${p.imagem}" alt="${p.nome}" style="width: 100%; height: 100%; object-fit: cover; aspect-ratio: 3/4;" />` : 
            `<svg viewBox="0 0 200 266" xmlns="http://www.w3.org/2000/svg">
              <rect width="200" height="266" fill="#f3f4f6"/>
              <text x="100" y="133" font-family="sans-serif" font-size="20" fill="#9ca3af" text-anchor="middle" alignment-baseline="middle">Sem Foto</text>
            </svg>`
          }
        </div>
        <div class="product-info">
          <h3 class="product-name">${p.nome}</h3>
          <p class="product-price">
            <span class="old-price">${formataCentavos(Math.round(p.preco_centavos / 0.8))}</span>
            ${formataCentavos(p.preco_centavos)}
          </p>
          <button class="buy-button">Comprar</button>
        </div>
      </article>
    `)
    .join("\n");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boutique Elegance | Moda Feminina</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #d6336c;
      --primary-hover: #a61e4d;
      --bg: #f8f9fa;
      --text: #212529;
      --text-muted: #6c757d;
      --card-bg: #ffffff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Montserrat', sans-serif; background-color: var(--bg); color: var(--text); line-height: 1.6; }
    
    /* Header */
    header { background-color: var(--card-bg); box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
    .header-content { max-width: 1200px; margin: 0 auto; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
    .logo { font-size: 1.5rem; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; }
    .logo img { height: 40px; margin-right: 12px; border-radius: 50%; object-fit: cover; }
    nav ul { list-style: none; display: flex; gap: 2rem; }
    nav a { text-decoration: none; color: var(--text); font-weight: 400; transition: color 0.3s; }
    nav a:hover { color: var(--primary); }
    
    /* Hero */
    .hero { background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('assets/hero_banner_notext.jpg') center/cover no-repeat; text-align: center; padding: 8rem 2rem; }
    .hero h1 { font-size: 3.5rem; font-weight: 400; margin-bottom: 1rem; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
    .hero p { font-size: 1.2rem; color: #eee; max-width: 600px; margin: 0 auto 2rem auto; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
    
    /* Grid de Produtos */
    .store-section { max-width: 1200px; margin: 4rem auto; padding: 0 1rem; }
    .section-title { text-align: center; font-size: 2rem; margin-bottom: 3rem; font-weight: 400; }
    .product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
    
    /* Produto Card */
    .product-card { background: var(--card-bg); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.04); transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; }
    .product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .product-image { width: 100%; display: block; position: relative; }
    .discount-badge { position: absolute; top: 12px; right: 12px; background-color: var(--primary); color: white; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.8rem; z-index: 10; letter-spacing: 0.5px; }
    .product-image svg { width: 100%; height: auto; display: block; }
    .product-info { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; }
    .product-name { font-size: 1rem; font-weight: 400; margin-bottom: 0.5rem; color: #444; }
    .product-price { font-size: 1.25rem; font-weight: 600; color: var(--primary); margin-bottom: 1.5rem; display: flex; align-items: baseline; gap: 8px; }
    .old-price { text-decoration: line-through; color: var(--text-muted); font-size: 0.9rem; font-weight: 400; }
    .buy-button { background-color: var(--primary); color: white; border: none; padding: 0.75rem; border-radius: 4px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background-color 0.3s; width: 100%; text-transform: uppercase; letter-spacing: 1px; }
    .buy-button:hover { background-color: var(--primary-hover); }

    /* Responsividade */
    @media (max-width: 992px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 768px) { .product-grid { grid-template-columns: repeat(2, 1fr); } .hero h1 { font-size: 2.2rem; } }
    @media (max-width: 480px) { .product-grid { grid-template-columns: 1fr; } .header-content { flex-direction: column; gap: 1rem; } nav ul { flex-wrap: wrap; justify-content: center; } }
  </style>
</head>
<body>
  <header>
    <div class="header-content">
      <div class="logo"><img src="assets/logo_boutique.jpg" alt="Logo"> Boutique Elegance</div>
      <nav>
        <ul>
          <li><a href="#">Início</a></li>
          <li><a href="#">Novidades</a></li>
          <li><a href="#">Roupas</a></li>
          <li><a href="#">Contato</a></li>
        </ul>
      </nav>
    </div>
  </header>
  
  <section class="hero">
    <h1>Coleção Outono/Inverno</h1>
    <p>Descubra as últimas tendências em moda feminina. Peças exclusivas com conforto e elegância para o seu dia a dia.</p>
  </section>

  <main class="store-section">
    <h2 class="section-title">Destaques da Temporada</h2>
    <div class="product-grid">
${cards}
    </div>
  </main>
</body>
</html>`;
}
