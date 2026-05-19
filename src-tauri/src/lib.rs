mod commands;
mod db;
mod models;

#[tauri::command]
fn ping() -> String {
    "pong dari Rust".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            ping,
            commands::account::create_account,
            commands::account::delete_account,
            commands::account::get_accounts,
            commands::account::update_account,
            commands::email::create_email,
            commands::email::delete_email,
            commands::email::get_emails,
            commands::email::update_email,
            commands::health::init_database
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
