use std::path::PathBuf;

use sqlx::{
    sqlite::{SqliteConnectOptions, SqlitePoolOptions},
    SqlitePool,
};
use tauri::{AppHandle, Manager};

const DATABASE_FILE: &str = "account-manager.sqlite";

fn database_path(app: &AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    std::fs::create_dir_all(&app_data_dir).map_err(|error| error.to_string())?;

    Ok(app_data_dir.join(DATABASE_FILE))
}

pub async fn connect_database(app: &AppHandle) -> Result<SqlitePool, String> {
    let database_path = database_path(app)?;
    let options = SqliteConnectOptions::new()
        .filename(&database_path)
        .create_if_missing(true);

    let pool = SqlitePoolOptions::new()
        .max_connections(1)
        .connect_with(options)
        .await
        .map_err(|error| error.to_string())?;

    sqlx::query("PRAGMA foreign_keys = ON;")
        .execute(&pool)
        .await
        .map_err(|error| error.to_string())?;

    Ok(pool)
}

pub async fn init_database(app: &AppHandle) -> Result<PathBuf, String> {
    let database_path = database_path(app)?;
    let pool = connect_database(app).await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            label TEXT NOT NULL,
            address TEXT NOT NULL UNIQUE,
            provider TEXT NOT NULL,
            purpose TEXT NOT NULL,
            two_factor INTEGER NOT NULL DEFAULT 0,
            account_count INTEGER NOT NULL DEFAULT 0,
            recovery TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT 'audit',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        "#,
    )
    .execute(&pool)
    .await
    .map_err(|error| error.to_string())?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            platform TEXT NOT NULL,
            username TEXT NOT NULL,
            user_id TEXT,
            login_method TEXT NOT NULL,
            linked_email_id INTEGER NOT NULL,
            password_location TEXT NOT NULL,
            two_factor INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            tags TEXT NOT NULL DEFAULT '[]',
            notes TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (linked_email_id) REFERENCES emails(id) ON DELETE RESTRICT
        );
        "#,
    )
    .execute(&pool)
    .await
    .map_err(|error| error.to_string())?;

    Ok(database_path)
}

pub async fn initialized_pool(app: &AppHandle) -> Result<SqlitePool, String> {
    init_database(app).await?;
    connect_database(app).await
}
