use tauri::AppHandle;

use crate::{
    db,
    models::{CreateEmailInput, DeleteResult, EmailItem, UpdateEmailInput},
};

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

impl From<EmailRow> for EmailItem {
    fn from(row: EmailRow) -> Self {
        Self {
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
        }
    }
}

#[tauri::command]
pub async fn get_emails(app: AppHandle) -> Result<Vec<EmailItem>, String> {
    let pool = db::initialized_pool(&app).await?;
    let rows = select_emails(&pool).await?;

    Ok(rows.into_iter().map(EmailItem::from).collect())
}

#[tauri::command]
pub async fn create_email(app: AppHandle, input: CreateEmailInput) -> Result<EmailItem, String> {
    validate_create_email(&input)?;

    let pool = db::initialized_pool(&app).await?;
    let now = chrono::Utc::now().to_rfc3339();
    let result = sqlx::query(
        r#"
        INSERT INTO emails (
            label,
            address,
            provider,
            purpose,
            two_factor,
            recovery,
            status,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(input.label.trim())
    .bind(input.address.trim())
    .bind(input.provider.trim())
    .bind(input.purpose.trim())
    .bind(input.two_factor)
    .bind(input.recovery.trim())
    .bind(input.status.trim())
    .bind(&now)
    .bind(&now)
    .execute(&pool)
    .await
    .map_err(|error| error.to_string())?;

    let email_id = result.last_insert_rowid();
    let email = select_email_by_id(&pool, email_id).await?;

    Ok(email.into())
}

#[tauri::command]
pub async fn update_email(
    app: AppHandle,
    id: i64,
    input: UpdateEmailInput,
) -> Result<EmailItem, String> {
    validate_update_email(&input)?;

    let pool = db::initialized_pool(&app).await?;
    ensure_email_exists(&pool, id).await?;

    let now = chrono::Utc::now().to_rfc3339();
    sqlx::query(
        r#"
        UPDATE emails
        SET
            label = ?,
            address = ?,
            provider = ?,
            purpose = ?,
            two_factor = ?,
            recovery = ?,
            status = ?,
            updated_at = ?
        WHERE id = ?
        "#,
    )
    .bind(input.label.trim())
    .bind(input.address.trim())
    .bind(input.provider.trim())
    .bind(input.purpose.trim())
    .bind(input.two_factor)
    .bind(input.recovery.trim())
    .bind(input.status.trim())
    .bind(&now)
    .bind(id)
    .execute(&pool)
    .await
    .map_err(|error| error.to_string())?;

    let email = select_email_by_id(&pool, id).await?;

    Ok(email.into())
}

#[tauri::command]
pub async fn delete_email(app: AppHandle, id: i64) -> Result<DeleteResult, String> {
    let pool = db::initialized_pool(&app).await?;
    let result = sqlx::query("DELETE FROM emails WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(map_delete_email_error)?;

    if result.rows_affected() == 0 {
        return Err("Email tidak ditemukan".to_string());
    }

    Ok(DeleteResult {
        id,
        message: "Email berhasil dihapus".to_string(),
    })
}

async fn select_emails(pool: &sqlx::SqlitePool) -> Result<Vec<EmailRow>, String> {
    sqlx::query_as::<_, EmailRow>(
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
    .fetch_all(pool)
    .await
    .map_err(|error| error.to_string())
}

async fn select_email_by_id(pool: &sqlx::SqlitePool, email_id: i64) -> Result<EmailRow, String> {
    sqlx::query_as::<_, EmailRow>(
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
        WHERE emails.id = ?
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
        "#,
    )
    .bind(email_id)
    .fetch_one(pool)
    .await
    .map_err(|error| error.to_string())
}

async fn ensure_email_exists(pool: &sqlx::SqlitePool, email_id: i64) -> Result<(), String> {
    let exists = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM emails WHERE id = ?")
        .bind(email_id)
        .fetch_one(pool)
        .await
        .map_err(|error| error.to_string())?
        > 0;

    if !exists {
        return Err("Email tidak ditemukan".to_string());
    }

    Ok(())
}

fn map_delete_email_error(error: sqlx::Error) -> String {
    match &error {
        sqlx::Error::Database(database_error)
            if database_error.code().as_deref() == Some("787")
                || database_error
                    .message()
                    .contains("FOREIGN KEY constraint failed") =>
        {
            "Email masih digunakan oleh akun lain".to_string()
        }
        _ => error.to_string(),
    }
}

fn validate_create_email(input: &CreateEmailInput) -> Result<(), String> {
    if input.label.trim().is_empty() {
        return Err("label email tidak boleh kosong".to_string());
    }

    if input.address.trim().is_empty() {
        return Err("address email tidak boleh kosong".to_string());
    }

    if input.provider.trim().is_empty() {
        return Err("provider email tidak boleh kosong".to_string());
    }

    Ok(())
}

fn validate_update_email(input: &UpdateEmailInput) -> Result<(), String> {
    if input.label.trim().is_empty() {
        return Err("label email tidak boleh kosong".to_string());
    }

    if input.address.trim().is_empty() {
        return Err("address email tidak boleh kosong".to_string());
    }

    if input.provider.trim().is_empty() {
        return Err("provider email tidak boleh kosong".to_string());
    }

    if !matches!(input.status.trim(), "safe" | "audit") {
        return Err("status email harus safe atau audit".to_string());
    }

    Ok(())
}
