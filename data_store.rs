use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Broker {
    pub name: String,
    pub volume: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BrokerRanking {
    pub buyers: Vec<Broker>,
    pub sellers: Vec<Broker>,
}

impl Default for BrokerRanking {
    fn default() -> Self {
        Self {
            buyers: Vec::new(),
            sellers: Vec::new(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Cotacao {
    pub ativo: String,
    pub ultima: f64,                
    pub variacao: f64,              
    pub variacao_pct: f64,          
    pub abertura: f64,              
    pub maxima: f64,                
    pub minima: f64,                
    pub fechamento: f64,            
    pub volume: f64,                
    pub data: String,               
    pub hora: String,               
    pub estado: String,             
    pub vencimento: String,         
    pub dias_ate_vencimento: i32,   
    pub dias_uteis_ate_vencimento: i32,
    pub fim_do_leilao: String,      
    pub gap: f64,                   
    pub saldo_agr: f64,             
    pub saldo_agr_d: f64,           
    pub saldo_agr_nd: f64,          
    pub saldo_neg_agr: f64,         
    pub ind_sald: f64,              
    pub ptax_p1: f64,               
    pub ptax_p2: f64,               
    pub ptax_p3: f64,               
    pub ptax_p4: f64,               
    pub ptax_oficial: f64,          
    pub ptax_fut_p1: f64,           
    pub ptax_fut_p2: f64,           
    pub ptax_fut_p3: f64,           
    pub ptax_fut_p4: f64,           
    pub ptax_fut_oficial: f64,      
    pub ibov: f64,
}
