//! API da Loja de exemplo (S-0260). `--auto-teste` roda os testes de dominio e sai com codigo:
//! e o que a etapa `teste-backend` do pipeline executa dentro da imagem construida.
use axum::{routing::get, Json, Router};
use serde::Serialize;

#[derive(Serialize, Clone)]
struct Produto {
    sku: String,
    nome: String,
    preco_centavos: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    preco_original: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    desconto_percentual: Option<u32>,
}

fn catalogo() -> Vec<Produto> {
    let desconto = std::env::var("LOJA_DESCONTO").ok().and_then(|v| v.parse::<u32>().ok()).unwrap_or(0);

    vec![
        Produto { sku: "CAM-01".into(), nome: "Camiseta".into(), preco_centavos: 5990, preco_original: None, desconto_percentual: None },
        Produto { sku: "CAN-02".into(), nome: "Caneca".into(), preco_centavos: 3450, preco_original: None, desconto_percentual: None },
        Produto { sku: "BON-03".into(), nome: "Bone".into(), preco_centavos: 7900, preco_original: None, desconto_percentual: None },
        Produto { sku: "MOC-04".into(), nome: "Mochila".into(), preco_centavos: 12900, preco_original: None, desconto_percentual: None },
    ].into_iter().map(|mut p| {
        if desconto > 0 {
            p.preco_original = Some(p.preco_centavos);
            p.desconto_percentual = Some(desconto);
            p.preco_centavos = (p.preco_centavos as f32 * (1.0 - (desconto as f32 / 100.0))) as u32;
        }
        p
    }).collect()
}

/// Total de um carrinho, em centavos. Inteiro de proposito: dinheiro nao e float.
fn total(itens: &[(String, u32)]) -> u32 {
    let cat = catalogo();
    itens
        .iter()
        .map(|(sku, qtd)| cat.iter().find(|p| &p.sku == sku).map(|p| p.preco_centavos * qtd).unwrap_or(0))
        .sum()
}

async fn health() -> &'static str {
    "ok"
}

async fn produtos() -> Json<Vec<Produto>> {
    Json(catalogo())
}

fn auto_teste() -> i32 {
    let mut falhas = 0;
    let desconto = std::env::var("LOJA_DESCONTO").ok().and_then(|v| v.parse::<u32>().ok()).unwrap_or(0);
    let desc_factor = 1.0 - (desconto as f32 / 100.0);
    let apply_desc = |v: u32| (v as f32 * desc_factor) as u32;

    let casos: Vec<(&str, Vec<(String, u32)>, u32)> = vec![
        ("carrinho vazio", vec![], 0),
        ("uma camiseta", vec![("CAM-01".into(), 1)], apply_desc(5990)),
        ("duas canecas e um bone", vec![("CAN-02".into(), 2), ("BON-03".into(), 1)], apply_desc(3450)*2 + apply_desc(7900)),
        ("sku inexistente vale zero", vec![("XXX-99".into(), 3)], 0),
        ("uma mochila", vec![("MOC-04".into(), 1)], apply_desc(12900)),
    ];
    for (nome, itens, esperado) in casos {
        let obtido = total(&itens);
        if obtido == esperado {
            println!("ok   {nome}: {obtido}");
        } else {
            println!("FALHA {nome}: esperado {esperado}, obtido {obtido}");
            falhas += 1;
        }
    }
    if catalogo().len() != 4 {
        println!("FALHA catalogo: esperava 4 produtos");
        falhas += 1;
    }
    falhas
}

#[tokio::main]
async fn main() {
    if std::env::args().any(|a| a == "--auto-teste") {
        let falhas = auto_teste();
        println!("{} falha(s)", falhas);
        std::process::exit(if falhas == 0 { 0 } else { 1 });
    }
    let app = Router::new().route("/health", get(health)).route("/produtos", get(produtos));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.expect("porta 8080");
    println!("loja-api em :8080");
    axum::serve(listener, app).await.expect("servidor");
}
