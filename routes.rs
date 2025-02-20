use axum::{Json, extract::State};
use crate::store::AppState;
use crate::data_store::{BrokerRanking, Cotacao};

#[derive(Debug, Clone, serde::Serialize)]
pub struct ApiResponse {
    pub ranking: BrokerRanking,
    pub cotacoes: Vec<Cotacao>,
}

pub async fn get_ranking(State(state): State<AppState>) -> Json<BrokerRanking> {
    let ranking_guard = state.ranking.read().await;
    Json(ranking_guard.clone())
}

pub async fn get_data(State(state): State<AppState>) -> Json<ApiResponse> {
    let ranking = {
        let ranking_guard = state.ranking.read().await;
        ranking_guard.clone()
    };
    let cotacoes = {
        let cotacoes_guard = state.cotacoes.read().await;
        cotacoes_guard.clone()
    };
    Json(ApiResponse { ranking, cotacoes })
}
