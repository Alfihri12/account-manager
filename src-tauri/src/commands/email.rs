use tauri::AppHandle;

use crate::{db, models::EmailItem};

#[derive(sqlx::FromRow)]
struct EmailRow {
    id: i64,
    label: String,
    address: String,
    provider: String,
    purpose: String,
    two_factor: bool,
    account_count: i64,
    recovery: String,
    status: String,
    created_at: String,
    updated_at: String,
}

#[tauri::command]
pub async fn get_emails(app: AppHandle) -> Result<Vec<EmailItem>, String> {
    let pool = db::initialized_pool(&app).await?;
    let rows = sqlx::query_as::<_, EmailRow>(
        r#"
        SELECT
            emails.id,
            emails.label,
            emails.address,
            emails.provider,
            emails.purpose,
            emails.two_factor,
            COUNT(accounts.id) AS account_count,
            emails.recovery,
            emails.status,
            emails.created_at,
            emails.updated_at
        FROM emails
        LEFT JOIN accounts ON accounts.linked_email_id = emails.id
        GROUP BY
            emails.id,
            emails.label,
            emails.address,
            emails.provider,
            emails.purpose,
            emails.two_factor,
            emails.recovery,
            emails.status,
            emails.created_at,
            emails.updated_at
        ORDER BY emails.created_at DESC, emails.id DESC
        "#,
    )
    .fetch_all(&pool)
    .await
    .map_err(|error| error.to_string())?;

    Ok(rows
        .into_iter()
        .map(|row| EmailItem {
            id: row.id,
            label: row.label,
            address: row.address,
            provider: row.provider,
            purpose: row.purpose,
            two_factor: row.two_factor,
            account_count: row.account_count,
            recovery: row.recovery,
            status: row.status,
            created_at: row.created_at,
            updated_at: row.updated_at,
        })
        .collect())
}
