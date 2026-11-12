# My Trade Dash

**Diário de operações para day trade (mini-índice e mini-dólar).**
Você lança operações, movimentações financeiras e notas do dia, e o app calcula resultado, indicadores, gráficos, relatórios e DARF.

🌐 Produção: [mytradedash.com.br](https://mytradedash.com.br)

## Funcionalidades

- **Operações (WIN / WDO):** registro, edição e histórico de trades, com setups personalizáveis.
- **Visão geral:** indicadores de desempenho, comparação entre o mês atual e o anterior, e calendário mensal de resultados.
- **Curva de capital:** evolução patrimonial com Chart.js.
- **Movimentação financeira:** depósitos e saques, com histórico e gráfico mensal.
- **Notas do dia e DARF:** apuração mensal do IR de day trade (20% sobre o ganho líquido, com compensação de prejuízos e abatimento do IRRF de 1%), alertas de vencimento e marcação de DARF paga.
- **Exportação e backup:** CSV, XLSX, PDF e JSON; importação de backup.
- **Conta:** login por e-mail e senha, troca de senha, aceite de termos e privacidade, exclusão da conta e dos dados.
- **Administração:** acesso por convite, gestão de usuários, histórico de auditoria e notas de versão.
- **Tema claro/escuro/automático** e onboarding de primeiros passos.
- **PWA:** instalável no celular e funciona offline para o app (os dados sempre vêm da rede).

## Tecnologias

O app é um site estático, sem etapa de build:

| Item | Uso |
| --- | --- |
| `index.html` | Todo o app (HTML, CSS e JavaScript) em um único arquivo |
| [Tailwind CSS](https://tailwindcss.com) 3.4 (CDN) | Estilos |
| [Chart.js](https://www.chartjs.org) 4.4 (CDN) | Gráficos |
| [Supabase](https://supabase.com) (`supabase-js` 2) | Autenticação e banco de dados Postgres |
| `sw.js` + `manifest.json` | Service worker e manifesto do PWA |

## Estrutura

```
.
├── index.html               # aplicação completa
├── sw.js                    # service worker (rede primeiro, cache só offline)
├── manifest.json            # manifesto do PWA
├── CNAME                    # domínio do GitHub Pages
└── *.png / favicon.ico      # ícones e favicons
```

## Banco de dados (Supabase)

Tabelas usadas pelo app:

- `trades`, `cashflow`, `profiles`
- `tb_setups`, `tb_day_notes`, `tb_darf_paid`
- `tb_usuarios`, `tb_admins`, `tb_convites`, `tb_aceites`, `tb_exclusoes`, `tb_audit_log`
- `tb_release_notes`, `tb_release_reads`, `tb_alert_reads`

E a função RPC `mtd_excluir_dados` (exclusão dos dados do usuário).

A URL do projeto e a chave **publicável** do Supabase ficam em `index.html` (`SUPABASE_URL` e `SUPABASE_KEY`). Essa chave é pública por design: o acesso aos dados depende das políticas de RLS no banco, que precisam estar ativas em todas as tabelas.

## Rodando localmente

Basta servir a pasta com qualquer servidor estático (o service worker exige `http://localhost` ou HTTPS):

```bash
python3 -m http.server 8080
```

Depois abra <http://localhost:8080>.

## Deploy

O site é publicado pelo **GitHub Pages** a partir da branch principal, no domínio definido em `CNAME` (`mytradedash.com.br`).

Ao publicar mudanças, aumente a versão do cache em `sw.js` (`const CACHE = 'mytradedash-vN'`) para que os usuários recebam os arquivos novos sem resíduo do cache antigo.
