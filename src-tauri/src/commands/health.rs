use tauri::AppHandle;

use crate::{db, models::DatabaseHealth};

#[tauri::command]
pub async fn init_database(app: AppHandle) -> Result<DatabaseHealth, String> {
    let database_path = db::init_database(&app).await?;

    Ok(DatabaseHealth {
        message: "database initialized".to_string(),
        path: database_path.display().to_string(),
    })
}
