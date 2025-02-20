use std::sync::Arc;
use tokio::sync::RwLock;
use crate::data_store::{BrokerRanking, Cotacao};

#[derive(Clone)]
pub struct AppState {
    pub ranking: Arc<RwLock<BrokerRanking>>,
    pub cotacoes: Arc<RwLock<Vec<Cotacao>>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            ranking: Arc::new(RwLock::new(BrokerRanking::default())),
            cotacoes: Arc::new(RwLock::new(Vec::new())),
        }
    }
}
