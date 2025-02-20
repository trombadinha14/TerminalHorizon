use std::net::TcpStream;
use std::io::{Write, Read};
use std::time::Duration;
use crate::data_store::{Broker, BrokerRanking, Cotacao};

/// Retorna o Ranking de Corretoras para "WDOFUT".
pub fn fetch_broker_ranking_rtd() -> std::io::Result<BrokerRanking> {
    const HOST: &str = "127.0.0.1";
    const PORT: u16 = 12002;
    
    let endereco = format!("{}:{}", HOST, PORT);
    let mut stream = TcpStream::connect(&endereco)?;
    stream.set_read_timeout(Some(Duration::from_secs(1)))?;

    let ativo = "WDOFUT";
    let mut compradores = Vec::new();
    let mut vendedores = Vec::new();

    for posicao in 1..=5 {
        for tipo in [1, 2].iter() {
            let mensagem_corretora = format!("BRKS$S|{}|{}|{}|7|Cor#", ativo, posicao, tipo);
            stream.write_all(mensagem_corretora.as_bytes())?;
            let resposta_corretora = receber_resposta(&mut stream)?;

            let mensagem_quantidade = format!("BRKS$S|{}|{}|{}|7|Qtd#", ativo, posicao, tipo);
            stream.write_all(mensagem_quantidade.as_bytes())?;
            let resposta_quantidade = receber_resposta(&mut stream)?;

            let quantidade = resposta_quantidade
                .split(';')
                .last()
                .unwrap_or("0")
                .replace("#", "")
                .trim()
                .to_string();

            let corretora_bruta = resposta_corretora
                .split(';')
                .last()
                .unwrap_or("")
                .replace("#", "")
                .trim()
                .to_string();

            let corretora = if corretora_bruta.contains("|") {
                corretora_bruta.split("|").last().unwrap_or("").trim().to_string()
            } else if corretora_bruta.contains("-") {
                let partes: Vec<&str> = corretora_bruta.split("-").collect();
                if partes.len() > 1 {
                    partes[1].trim().to_string()
                } else {
                    corretora_bruta
                }
            } else {
                corretora_bruta
            };

            let qtd_i64 = quantidade.parse::<i64>().unwrap_or(0);

            if *tipo == 1 {
                compradores.push(Broker {
                    name: corretora.clone(),
                    volume: qtd_i64,
                });
            } else {
                vendedores.push(Broker {
                    name: corretora.clone(),
                    volume: qtd_i64,
                });
            }
        }
    }

    Ok(BrokerRanking {
        buyers: compradores,
        sellers: vendedores,
    })
}

/// Lê a resposta do RTD.
fn receber_resposta(stream: &mut TcpStream) -> std::io::Result<String> {
    let mut buffer = [0; 32768];
    let bytes_lidos = stream.read(&mut buffer)?;
    let resposta = String::from_utf8_lossy(&buffer[..bytes_lidos]).to_string();
    Ok(resposta.trim().to_string())
}

/// Conecta ao RTD e retorna os dados completos de cotação para um ativo.
pub fn fetch_cotacao_rtd(ativo: &str) -> std::io::Result<Option<Cotacao>> {
    const HOST: &str = "127.0.0.1";
    const PORT: u16 = 12002;

    let endereco = format!("{}:{}", HOST, PORT);
    let mut stream = TcpStream::connect(&endereco)?;
    stream.set_read_timeout(Some(Duration::from_secs(2)))?;
    
    // Envia o comando de cotação
    let mensagem = format!("COT$S|{}#", ativo);
    stream.write_all(mensagem.as_bytes())?;
    
    let resposta = receber_resposta(&mut stream)?;
    if !resposta.starts_with("COT!") {
        eprintln!("Resposta inesperada para {}: {}", ativo, resposta);
        return Ok(None);
    }
    
    let valores: Vec<&str> = resposta.split("|").collect();
    if valores.len() < 89 {
        eprintln!("Resposta incompleta para {}: {}", ativo, resposta);
        return Ok(None);
    }
    
    let ultima         = formatar_valor(valores[1]);
    let variacao       = formatar_valor(valores[2]);
    let abertura       = formatar_valor(valores[7]);
    let maxima         = formatar_valor(valores[8]);
    let minima         = formatar_valor(valores[9]);
    let fechamento     = formatar_valor(valores[10]);
    let volume         = formatar_valor(valores[11]);
    let variacao_pct   = formatar_valor(valores[23]);

    if [ultima, variacao, abertura, maxima, minima, fechamento, volume, variacao_pct]
        .iter().any(|&x| x.is_none()) {
        eprintln!("Erro ao processar dados numéricos do ativo {}", ativo);
        return Ok(None);
    }
    
    let ultima         = ultima.unwrap();
    let variacao       = variacao.unwrap();
    let abertura       = abertura.unwrap();
    let maxima         = maxima.unwrap();
    let minima         = minima.unwrap();
    let fechamento     = fechamento.unwrap();
    let volume         = volume.unwrap();
    let variacao_pct   = variacao_pct.unwrap();
    
    let data                   = valores[25].trim().to_string();
    let hora                   = valores[12].trim().to_string();
    let estado                 = valores[18].trim().to_string();
    let vencimento             = valores[19].trim().to_string();
    let dias_ate_vencimento    = formatar_valor(valores[21]).unwrap_or(0.0) as i32;
    let dias_uteis_ate_vencimento = formatar_valor(valores[22]).unwrap_or(0.0) as i32;
    let fim_do_leilao          = valores[41].trim().to_string();
    let gap                    = abertura - fechamento;
    
    let saldo_agr       = formatar_valor(valores[52]).unwrap_or(0.0);
    let saldo_agr_d     = formatar_valor(valores[53]).unwrap_or(0.0);
    let saldo_agr_nd    = formatar_valor(valores[54]).unwrap_or(0.0);
    let ind_sald        = formatar_valor(valores[62]).unwrap_or(0.0);
    let saldo_neg_agr   = formatar_valor(valores[69]).unwrap_or(0.0);
    let ptax_p1         = formatar_valor(valores[78]).unwrap_or(0.0);
    let ptax_p2         = formatar_valor(valores[79]).unwrap_or(0.0);
    let ptax_p3         = formatar_valor(valores[80]).unwrap_or(0.0);
    let ptax_p4         = formatar_valor(valores[81]).unwrap_or(0.0);
    let ptax_oficial    = formatar_valor(valores[82]).unwrap_or(0.0);
    let ptax_fut_p1     = formatar_valor(valores[83]).unwrap_or(0.0);
    let ptax_fut_p2     = formatar_valor(valores[84]).unwrap_or(0.0);
    let ptax_fut_p3     = formatar_valor(valores[85]).unwrap_or(0.0);
    let ptax_fut_p4     = formatar_valor(valores[86]).unwrap_or(0.0);
    let ptax_fut_oficial= formatar_valor(valores[87]).unwrap_or(0.0);
    let ibov            = formatar_valor(valores[88]).unwrap_or(0.0);
    
    let cotacao = Cotacao {
        ativo: ativo.to_string(),
        ultima,
        variacao,
        variacao_pct,
        abertura,
        maxima,
        minima,
        fechamento,
        volume,
        data,
        hora,
        estado,
        vencimento,
        dias_ate_vencimento,
        dias_uteis_ate_vencimento,
        fim_do_leilao,
        gap,
        saldo_agr,
        saldo_agr_d,
        saldo_agr_nd,
        saldo_neg_agr,
        ind_sald,
        ptax_p1,
        ptax_p2,
        ptax_p3,
        ptax_p4,
        ptax_oficial,
        ptax_fut_p1,
        ptax_fut_p2,
        ptax_fut_p3,
        ptax_fut_p4,
        ptax_fut_oficial,
        ibov,
    };
    
    Ok(Some(cotacao))
}

/// Converte string numérica do formato BR ("5.780,00") para f64
fn formatar_valor(valor: &str) -> Option<f64> {
    let normalized = valor.replace(".", "").replace(",", ".");
    normalized.parse::<f64>().ok()
}

/// Busca as cotações de uma lista extensa de ativos (Futuros + Carteira B3)
pub fn fetch_cotacoes_rtd() -> std::io::Result<Vec<Cotacao>> {
    let ativos = vec![
        // FUTUROS
        "WDOFUT", "DOLFUT", "WINFUT", "INDFUT",
        "DI1F26", "DI1F27", "DI1F28", "DI1F29", "DI1F30", "DI1F31", "DI1F32",
        "DI1F33", "DI1F34", "DI1F35", "DI1F36",

        // CARTEIRA B3
        "ALOS3", "ABEV3", "ASAI3", "AURE3", "AMOB3", "AZUL4", "AZZA3", "B3SA3", "BBSE3",
        "BBDC3", "BBDC4", "BRAP4", "BBAS3", "BRKM5", "BRAV3", "BRFS3", "BPAC11", "CXSE3",
        "CRFB3", "CCRO3", "CMIG4", "COGN3", "CPLE6", "CSAN3", "CPFE3", "CMIN3", "CVCB3",
        "CYRE3", "ELET3", "ELET6", "EMBR3", "ENGI11", "ENEV3", "EGIE3", "EQTL3", "FLRY3",
        "GGBR4", "GOAU4", "NTCO3", "HAPV3", "HYPE3", "IGTI11", "IRBR3", "ISAE4", "ITSA4",
        "ITUB4", "JBSS3", "KLBN11", "RENT3", "LREN3", "LWSA3", "MGLU3", "POMO4", "MRFG3",
        "BEEF3", "MRVE3", "MULT3", "PCAR3", "PETR3", "PETR4", "RECV3", "PRIO3", "PETZ3",
        "PSSA3", "RADL3", "RAIZ4", "RDOR3", "RAIL3", "SBSP3", "SANB11", "STBP3", "SMTO3",
        "CSNA3", "SLCE3", "SUZB3", "TAEE11", "VIVT3", "TIMS3", "TOTS3", "UGPA3", "USIM5",
        "VALE3", "VAMO3", "VBBR3", "VIVA3", "WEGE3", "YDUQ3",
    ];

    let mut cotacoes = Vec::new();
    for ativo in ativos {
        match fetch_cotacao_rtd(ativo)? {
            Some(cotacao) => cotacoes.push(cotacao),
            None => eprintln!("Não foi possível obter dados para o ativo {}", ativo),
        }
    }
    Ok(cotacoes)
}
