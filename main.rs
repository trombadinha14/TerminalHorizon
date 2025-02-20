mod data_store;
mod store;
mod rtd_connection;
mod ws_handler;
mod routes;

use axum::{Router, routing::get};
use std::time::Duration;
use tokio::time::sleep;
use store::AppState;
use routes::{get_ranking, get_data};
use ws_handler::ws_handler;
use rtd_connection::{fetch_broker_ranking_rtd, fetch_cotacoes_rtd};

#[tokio::main]
async fn main() {
    // Cria o estado global com ranking e cotações
    let state = AppState::new();
    let state_for_task = state.clone();

    // Task em background para atualizar ranking e cotações a cada 2 segundos
    tokio::spawn(async move {
        loop {
            // Atualiza o ranking
            match fetch_broker_ranking_rtd() {
                Ok(ranking) => {
                    let mut ranking_guard = state_for_task.ranking.write().await;
                    *ranking_guard = ranking;
                    println!("✅ RTD Ranking atualizado com sucesso!");
                }
                Err(e) => {
                    eprintln!("❌ Erro ao conectar ao RTD (ranking): {:?}", e);
                }
            }

            // Atualiza as cotações
            match fetch_cotacoes_rtd() {
                Ok(cotacoes) => {
                    let mut cotacoes_guard = state_for_task.cotacoes.write().await;
                    *cotacoes_guard = cotacoes;
                    println!("✅ RTD Cotações atualizadas com sucesso!");
                }
                Err(e) => {
                    eprintln!("❌ Erro ao conectar ao RTD (cotações): {:?}", e);
                }
            }

            sleep(Duration::from_secs(2)).await;
        }
    });

    // Configuração do router com as rotas HTTP e WebSocket
    let app = Router::new()
        .route("/api/ranking", get(get_ranking))
        .route("/api/data", get(get_data))
        .route("/ws", get(ws_handler))
        .with_state(state);

    let addr = "127.0.0.1:4000".parse().unwrap();
    println!("Servidor rodando em http://{}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}
