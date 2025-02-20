use axum::{
    extract::{WebSocketUpgrade, State},
    response::IntoResponse,
};
use axum::extract::ws::{Message, WebSocket};
use crate::store::AppState;
use tokio::time::{interval, Duration};

#[derive(Debug, Clone, serde::Serialize)]
pub struct WsResponse {
    pub ranking: crate::data_store::BrokerRanking,
    pub cotacoes: Vec<crate::data_store::Cotacao>,
}

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, state))
}

async fn handle_socket(mut socket: WebSocket, state: AppState) {
    let mut ticker = interval(Duration::from_secs(1));
    loop {
        ticker.tick().await;

        let ranking = {
            let ranking_guard = state.ranking.read().await;
            ranking_guard.clone()
        };
        let cotacoes = {
            let cotacoes_guard = state.cotacoes.read().await;
            cotacoes_guard.clone()
        };

        let payload = WsResponse { ranking, cotacoes };

        let payload_json = serde_json::to_string(&payload).unwrap();
        if let Err(e) = socket.send(Message::Text(payload_json)).await {
            eprintln!("Erro ao enviar via WS: {:?}", e);
            break;
        }
    }
}
