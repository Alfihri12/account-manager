use tauri::AppHandle;

use crate::{db, models::AccountItem};

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

#[tauri::command]
pub async fn get_accounts(app: AppHandle) -> Result<Vec<AccountItem>, String> {
    let pool = db::initialized_pool(&app).await?;
    let rows = sqlx::query_as::<_, AccountRow>(
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
    .fetch_all(&pool)
    .await
    .map_err(|error| error.to_string())?;

    rows.into_iter()
        .map(|row| {
            let tags = serde_json::from_str::<Vec<String>>(&row.tags)
                .map_err(|error| format!("invalid tags JSON for account {}: {}", row.id, error))?;

            Ok(AccountItem {
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
        })
        .collect()
}
