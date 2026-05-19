use tauri::AppHandle;

use crate::{
    db,
    models::{AccountItem, CreateAccountInput, DeleteResult, UpdateAccountInput},
};

#[derive(sqlx::FromRow)]
struct AccountRow {
    id: i64,
    name: String,
    category: String,
    platform: String,
    username: String,
    user_id: Option<String>,
    login_method: String,
    linked_email_id: i64,
    password_location: String,
    two_factor: bool,
    status: String,
    tags: String,
    notes: String,
    created_at: String,
    updated_at: String,
}

impl TryFrom<AccountRow> for AccountItem {
    type Error = String;

    fn try_from(row: AccountRow) -> Result<Self, Self::Error> {
        let tags = serde_json::from_str::<Vec<String>>(&row.tags)
            .map_err(|error| format!("invalid tags JSON for account {}: {}", row.id, error))?;

        Ok(Self {
            id: row.id,
            name: row.name,
            category: row.category,
            platform: row.platform,
            username: row.username,
            user_id: row.user_id,
            login_method: row.login_method,
            linked_email_id: row.linked_email_id,
            password_location: row.password_location,
            two_factor: row.two_factor,
            status: row.status,
            tags,
            notes: row.notes,
            created_at: row.created_at,
            updated_at: row.updated_at,
        })
    }
}

#[tauri::command]
pub async fn get_accounts(app: AppHandle) -> Result<Vec<AccountItem>, String> {
    let pool = db::initialized_pool(&app).await?;
    let rows = select_accounts(&pool).await?;

    rows.into_iter().map(AccountItem::try_from).collect()
}

#[tauri::command]
pub async fn create_account(
    app: AppHandle,
    input: CreateAccountInput,
) -> Result<AccountItem, String> {
    validate_create_account(&input)?;

    let pool = db::initialized_pool(&app).await?;
    let linked_email_exists =
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM emails WHERE id = ?")
            .bind(input.linked_email_id)
            .fetch_one(&pool)
            .await
            .map_err(|error| error.to_string())?
            > 0;

    if !linked_email_exists {
        return Err("linked_email_id tidak ditemukan di emails".to_string());
    }

    let tags = serde_json::to_string(&input.tags).map_err(|error| error.to_string())?;
    let now = chrono::Utc::now().to_rfc3339();
    let result = sqlx::query(
        r#"
        INSERT INTO accounts (
            name,
            category,
            platform,
            username,
            user_id,
            login_method,
            linked_email_id,
            password_location,
            two_factor,
            status,
            tags,
            notes,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(input.name.trim())
    .bind(input.category.trim())
    .bind(input.platform.trim())
    .bind(input.username.trim())
    .bind(input.user_id.as_deref().map(str::trim))
    .bind(input.login_method.trim())
    .bind(input.linked_email_id)
    .bind(input.password_location.trim())
    .bind(input.two_factor)
    .bind(input.status.trim())
    .bind(tags)
    .bind(input.notes.trim())
    .bind(&now)
    .bind(&now)
    .execute(&pool)
    .await
    .map_err(|error| error.to_string())?;

    let account_id = result.last_insert_rowid();
    let account = select_account_by_id(&pool, account_id).await?;

    account.try_into()
}

#[tauri::command]
pub async fn update_account(
    app: AppHandle,
    id: i64,
    input: UpdateAccountInput,
) -> Result<AccountItem, String> {
    validate_update_account(&input)?;

    let pool = db::initialized_pool(&app).await?;
    ensure_account_exists(&pool, id).await?;
    ensure_linked_email_exists(&pool, input.linked_email_id).await?;

    let tags = serde_json::to_string(&input.tags).map_err(|error| error.to_string())?;
    let now = chrono::Utc::now().to_rfc3339();
    sqlx::query(
        r#"
        UPDATE accounts
        SET
            name = ?,
            category = ?,
            platform = ?,
            username = ?,
            user_id = ?,
            login_method = ?,
            linked_email_id = ?,
            password_location = ?,
            two_factor = ?,
            status = ?,
            tags = ?,
            notes = ?,
            updated_at = ?
        WHERE id = ?
        "#,
    )
    .bind(input.name.trim())
    .bind(input.category.trim())
    .bind(input.platform.trim())
    .bind(input.username.trim())
    .bind(input.user_id.as_deref().map(str::trim))
    .bind(input.login_method.trim())
    .bind(input.linked_email_id)
    .bind(input.password_location.trim())
    .bind(input.two_factor)
    .bind(input.status.trim())
    .bind(tags)
    .bind(input.notes.trim())
    .bind(&now)
    .bind(id)
    .execute(&pool)
    .await
    .map_err(|error| error.to_string())?;

    let account = select_account_by_id(&pool, id).await?;

    account.try_into()
}

#[tauri::command]
pub async fn delete_account(app: AppHandle, id: i64) -> Result<DeleteResult, String> {
    let pool = db::initialized_pool(&app).await?;
    let result = sqlx::query("DELETE FROM accounts WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(|error| error.to_string())?;

    if result.rows_affected() == 0 {
        return Err("Akun tidak ditemukan".to_string());
    }

    Ok(DeleteResult {
        id,
        message: "Akun berhasil dihapus".to_string(),
    })
}

async fn select_accounts(pool: &sqlx::SqlitePool) -> Result<Vec<AccountRow>, String> {
    sqlx::query_as::<_, AccountRow>(
        r#"
        SELECT
            id,
            name,
            category,
            platform,
            username,
            user_id,
            login_method,
            linked_email_id,
            password_location,
            two_factor,
            status,
            tags,
            notes,
            created_at,
            updated_at
        FROM accounts
        ORDER BY created_at DESC, id DESC
        "#,
    )
    .fetch_all(pool)
    .await
    .map_err(|error| error.to_string())
}

async fn select_account_by_id(
    pool: &sqlx::SqlitePool,
    account_id: i64,
) -> Result<AccountRow, String> {
    sqlx::query_as::<_, AccountRow>(
        r#"
        SELECT
            id,
            name,
            category,
            platform,
            username,
            user_id,
            login_method,
            linked_email_id,
            password_location,
            two_factor,
            status,
            tags,
            notes,
            created_at,
            updated_at
        FROM accounts
        WHERE id = ?
        "#,
    )
    .bind(account_id)
    .fetch_one(pool)
    .await
    .map_err(|error| error.to_string())
}

async fn ensure_account_exists(pool: &sqlx::SqlitePool, account_id: i64) -> Result<(), String> {
    let exists = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM accounts WHERE id = ?")
        .bind(account_id)
        .fetch_one(pool)
        .await
        .map_err(|error| error.to_string())?
        > 0;

    if !exists {
        return Err("Akun tidak ditemukan".to_string());
    }

    Ok(())
}

async fn ensure_linked_email_exists(pool: &sqlx::SqlitePool, email_id: i64) -> Result<(), String> {
    let exists = sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM emails WHERE id = ?")
        .bind(email_id)
        .fetch_one(pool)
        .await
        .map_err(|error| error.to_string())?
        > 0;

    if !exists {
        return Err("linked_email_id tidak ditemukan di emails".to_string());
    }

    Ok(())
}

fn validate_create_account(input: &CreateAccountInput) -> Result<(), String> {
    if input.name.trim().is_empty() {
        return Err("name akun tidak boleh kosong".to_string());
    }

    if input.category.trim().is_empty() {
        return Err("category akun tidak boleh kosong".to_string());
    }

    if input.platform.trim().is_empty() {
        return Err("platform akun tidak boleh kosong".to_string());
    }

    if input.username.trim().is_empty() {
        return Err("username akun tidak boleh kosong".to_string());
    }

    Ok(())
}

fn validate_update_account(input: &UpdateAccountInput) -> Result<(), String> {
    if input.name.trim().is_empty() {
        return Err("name akun tidak boleh kosong".to_string());
    }

    if input.category.trim().is_empty() {
        return Err("category akun tidak boleh kosong".to_string());
    }

    if input.platform.trim().is_empty() {
        return Err("platform akun tidak boleh kosong".to_string());
    }

    if input.username.trim().is_empty() {
        return Err("username akun tidak boleh kosong".to_string());
    }

    if !matches!(
        input.status.trim(),
        "active" | "need_check" | "inactive" | "lost"
    ) {
        return Err("status akun harus active, need_check, inactive, atau lost".to_string());
    }

    Ok(())
}
